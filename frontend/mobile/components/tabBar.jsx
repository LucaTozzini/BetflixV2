import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ThemeContext from "../contexts/themeContext";
import { useContext } from "react";
export default function Tabs({ state, descriptors, navigation }) {
  const theme = useContext(ThemeContext);

  const routeToIcon = {
    "(index)": "home",
    search: "search",
    console: "terminal",
    downloads: "download",
    settings: "settings",
  };
  const Tab = ({ handlePress, label, iconName, focused }) => (
    <TouchableOpacity onPress={handlePress} style={styles.tab}>
      <Ionicons
        name={`${iconName}-${focused ? "sharp" : "outline"}`}
        size={23}
        color={focused ? theme.color : theme.colorDim}
      />
      <Text style={{ color: theme.color, fontSize: 9 }}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.tabsBackgroundColor,
          borderColor: theme.using === "dark" ? "rgb(82, 82, 82)" : "rgb(100, 100, 100)",
        },
      ]}
    >
      {state.routes.map((route, index) => {
        const options = descriptors[route.key];
        let label = options.tabBarLabel ?? options.title ?? route.name;
        if (label === "(index)") label = "home";
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
            label={label}
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
    borderTopWidth: .2,
    paddingHorizontal: 10,
  },
  tab: {
    alignItems: "center",
    padding: 10,
    flex: 1,
  },
});
