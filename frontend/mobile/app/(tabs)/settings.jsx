import { useContext } from "react";
import ThemeContext from "../../contexts/themeContext";
import ServerContext from "../../contexts/serverContext";

import { View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Div, Scroll, P, H2, Button } from "../../components/elements";

export default () => {
  const theme = useContext(ThemeContext);
  const serverAddress = useContext(ServerContext);
  return (
    <Div>
      <Scroll pad gap={20}>
      
        <View style={{ gap: 7 }}>
          <H2>Set Theme</H2>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Button grow onPress={() => theme.setLightTheme()}>
              <Ionicons name="sunny-outline" color={theme.color} size={25} />
              <P>Light</P>
            </Button>
            <Button grow onPress={() => theme.setDarkTheme()}>
              <Ionicons name="moon-outline" color={theme.color} size={25} />
              <P>Dark</P>
            </Button>
          </View>
        </View>
        
        <View style={{ gap: 7 }}>
          <H2>Server Address</H2>
          <P>{serverAddress}</P>
        </View>
      
      </Scroll>
    </Div>
  );
};
