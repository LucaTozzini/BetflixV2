import { Stack } from "expo-router";
import useZeroconf from "../hooks/useZeroconf";
import ServerContext from "../contexts/serverContext";
import ThemeContext from "../contexts/themeContext";
import useTheme from "../hooks/useTheme";
import { StatusBar } from "expo-status-bar";
import { Div, H2 } from "../components/elements";

export default () => {
  const serverAddress = useZeroconf();
  const theme = useTheme();

  if (!serverAddress) {
    return (
      <ThemeContext.Provider value={theme}>
        <StatusBar
          translucent={false}
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
          translucent={false}
          style={theme.statusBarStyle}
          backgroundColor={theme.backgroundColor}
        />
        <Stack screenOptions={{ headerShown: false }} />
      </ServerContext.Provider>
    </ThemeContext.Provider>
  );
};
