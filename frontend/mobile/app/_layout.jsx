import { Stack } from "expo-router";
import { View, Text } from "react-native";
import useZeroconf from "../hooks/useZeroconf";
import ServerContext from "../contexts/serverContext";
import ThemeContext from "../contexts/themeContext";
import useTheme from "../hooks/useTheme";
import { useEffect } from "react";
export default () => {
  const serverAddress = useZeroconf();
  const theme = useTheme();
  useEffect(() => {
    // theme.setDarkTheme()
  }, [])
  if (!serverAddress) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ fontSize: 30 }}>Looking For Server...</Text>
      </View>
    );
  }

  return (
    <ThemeContext.Provider value={theme}>
      <ServerContext.Provider value={serverAddress}>
        <Stack screenOptions={{ headerShown: false }} />
      </ServerContext.Provider>
    </ThemeContext.Provider>
  );
};
