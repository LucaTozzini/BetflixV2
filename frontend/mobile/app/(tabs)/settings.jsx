import { useContext } from "react";
import { ScrollView, View, Text } from "react-native";
import ThemeContext from "../../contexts/themeContext";
import { Button } from "../../components/buttons";
export default () => {
  const theme = useContext(ThemeContext);
  return (
    <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
      <ScrollView contentContainerStyle={{ padding: 10 }}>
        <Text style={{color: theme.color, fontSize: theme.h1Size,}}>Themes</Text>
        <View style={{ flexDirection: "row" }}>
          <Button text="Dark" handlePress={theme.setDarkTheme} />
          <Button text="Light" handlePress={theme.setLightTheme} />
        </View>
      </ScrollView>
    </View>
  );
};
