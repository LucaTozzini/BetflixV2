import { Stack } from "expo-router";
import useZeroconf from "../hooks/useZeroconf";
import ServerContext from "../contexts/serverContext";
import ThemeContext from "../contexts/themeContext";
import useTheme from "../hooks/useTheme";
import { Div, H2 } from "../components/elements";
import { StatusBar } from "expo-status-bar";

export default () => {
  const serverAddress = useZeroconf();
  const theme = useTheme();

  if (!serverAddress) {
    return (
      <ThemeContext.Provider value={theme}>
        <StatusBar
          style={theme.statusBarStyle}
          backgroundColor={theme.backgroundColor}
        />
        <Div pad>
          <H2>Scanning For Server...</H2>
        </Div>
      </ThemeContext.Provider>
    );
  }

  return (
    <ThemeContext.Provider value={theme}>
      <ServerContext.Provider value={serverAddress}>
        <StatusBar
          style={theme.statusBarStyle}
          backgroundColor={"transparent"}
          translucent
        />

        <Stack screenOptions={{ headerShown: false }} />
      </ServerContext.Provider>
    </ThemeContext.Provider>
  );
};
