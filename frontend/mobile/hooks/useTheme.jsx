import { useEffect, useState } from "react";
import * as NavigationBar from "expo-navigation-bar";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useTheme() {
  const colorScheme = useColorScheme();
  const [using, setUsing] = useState();

  const [color, setColor] = useState();
  const [colorDim, setColorDim] = useState();
  const [accentColor, setAccentColor] = useState();
  const [statusBarStyle, setStatusBarStyle] = useState();
  const [backgroundColor, setBackgroundColor] = useState();
  const [tabsBackgroundColor, setTabsBackgroundColor] = useState();
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState();

  function setLightTheme() {
    setColor("black");
    setColorDim("rgb(146, 146, 146)");
    setAccentColor("skyblue");
    setStatusBarStyle("dark");
    setBackgroundColor("white");
    setTabsBackgroundColor("rgb(238, 238, 238)");
    setButtonBackgroundColor("rgba(180, 180, 180, 0.1)");
    NavigationBar.setBackgroundColorAsync("rgb(238, 238, 238)");
  }

  function setDarkTheme() {
    setColor("white");
    setColorDim("grey");
    setAccentColor("red");
    setStatusBarStyle("light");
    setBackgroundColor("rgb(19, 19, 19)");
    setTabsBackgroundColor("rgb(27, 27, 27)");
    setButtonBackgroundColor("rgba(58, 58, 58, 0.27)");
    NavigationBar.setBackgroundColorAsync("rgb(27, 27, 27)");
  }

  useEffect(() => {
    AsyncStorage.getItem("theme", (err, result) => {
      if (err) setUsing("system"); // default to system on error
      setUsing(result ?? "system");
    });
  }, []);

  useEffect(() => {
    if (!using) return;
    if (using === "light" || (using === "system" && colorScheme === "light")) {
      setLightTheme();
    } else {
      setDarkTheme();
    }
    AsyncStorage.setItem("theme", using);
  }, [using, colorScheme]);

  return {
    using,
    color,
    colorDim,
    buttonBackgroundColor,
    statusBarStyle,
    backgroundColor,
    accentColor,
    tabsBackgroundColor,
    setUsing,
  };
}
