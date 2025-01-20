import { Stack } from "expo-router";
import useZeroconf from "../hooks/useZeroconf";
import ServerContext from "../contexts/serverContext";
import ThemeContext from "../contexts/themeContext";
import useTheme from "../hooks/useTheme";
import { Div, H2 } from "../components/elements";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

export default () => {
  const serverAddress = useZeroconf();
  const theme = useTheme();

  if (!serverAddress) {
    return (
      <ThemeContext.Provider value={theme}>
        <StatusBar
          style={theme.statusBarStyle}
          backgroundColor={theme.backgroundColor}
          translucent={false}
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
        {/* GestureHandlerRootView and BottomSheetModalProvider needed for using BottomSheetModal in child views */}
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <StatusBar
              style={theme.statusBarStyle}
              backgroundColor={"transparent"}
              translucent
            />

            <Stack screenOptions={{ headerShown: false }} />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ServerContext.Provider>
    </ThemeContext.Provider>
  );
};
