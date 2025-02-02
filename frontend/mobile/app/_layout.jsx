import { Stack } from "expo-router";
import useZeroconf from "../hooks/useZeroconf";
import ServerContext from "../contexts/serverContext";
import ThemeContext from "../contexts/themeContext";
import useTheme from "../hooks/useTheme";
import { Div, H2 } from "../components/elements";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { ActivityIndicator, View } from "react-native";
import Toast from "react-native-toast-message";

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
        <Div>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              gap: 40,
              alignItems: "center",
            }}
          >
            <H2 center>Searching for server...</H2>
            <ActivityIndicator size={"large"} color={theme.color || "blue"} />
          </View>
        </Div>
      </ThemeContext.Provider>
    );
  }

  return (
    <>
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

      {/* Render the Toast component in your app's entry file, as the LAST CHILD in the View hierarchy */}
      <Toast />
    </>
  );
};
