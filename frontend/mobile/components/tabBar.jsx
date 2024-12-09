import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ThemeContext from "../contexts/themeContext";
import { useContext } from "react";
export default function Tabs({ state, descriptors, navigation }) {
  const theme = useContext(ThemeContext)
  
  const routeToIcon = {
    "(index)": "home",
    search: "search",
    console: "terminal",
    downloads: "download",
    settings: "settings"
  }
  const Tab = ({ handlePress, iconName, focused }) => (
    <TouchableOpacity onPress={handlePress} style={styles.tab}>
      <Ionicons
        name={`${iconName}-${focused ? "sharp" : "outline"}`}
        size={32}
        color={focused ? theme.color : theme.colorDim}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.backgroundColor, borderColor: theme.colorDim}]}>
      {state.routes.map((route, index) => {
        const options = descriptors[route.key];
        // const label = options.tabBarLabel ?? options.title ?? route.name;
        const focused = state.index === index;

        const handlePress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Tab
            key={index}
            handlePress={handlePress}
            iconName={routeToIcon[route.name]}
            focused={focused}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    borderTopWidth: 1,

    // Set from ThemeContext
    // borderTopColor: "grey",
    // backgroundColor: "white",
  },
  tab: {
    alignItems: "center",
    padding: 10,
  },
});
