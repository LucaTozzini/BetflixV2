import { useEffect, useState } from "react";
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function useTheme() {
  const [using, setUsing] = useState();
  const [color, setColor] = useState();
  const [colorDim, setColorDim] = useState();
  const [accentColor, setAccentColor] = useState();
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState();
  const [backgroundColor, setBackgroundColor] = useState();
  const [statusBarStyle, setStatusBarStyle] = useState();
  const [tabsBackgroundColor, setTabsBackgroundColor] = useState();

  async function initialize() {
    const value = await AsyncStorage.getItem("theme");
    if (!value || value === "light") {
      setLightTheme();
    } else {
      setDarkTheme();
    }
  }

  function setLightTheme() {
    setUsing("light");
    setButtonBackgroundColor("rgba(180, 180, 180, 0.1)");
    setStatusBarStyle("dark");
    setColor("black");
    setColorDim("rgb(146, 146, 146)");
    setAccentColor("skyblue");
    setBackgroundColor("white");
    setTabsBackgroundColor("rgb(238, 238, 238)");
    AsyncStorage.setItem("theme", "light");
  }

  function setDarkTheme() {
    setUsing("dark");
    setButtonBackgroundColor("rgba(58, 58, 58, 0.27)");
    setAccentColor("limegreen");
    setStatusBarStyle("light");
    setColor("white");
    setColorDim("grey");
    setBackgroundColor("rgb(19, 19, 19)");
    setTabsBackgroundColor("rgb(27, 27, 27)");
    AsyncStorage.setItem("theme", "dark");
  }

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (tabsBackgroundColor) {
      NavigationBar.setBackgroundColorAsync(tabsBackgroundColor);
    }
  }, [tabsBackgroundColor]);

  return {
    using,
    color,
    colorDim,
    buttonBackgroundColor,
    statusBarStyle,
    backgroundColor,
    accentColor,
    tabsBackgroundColor,
    setLightTheme,
    setDarkTheme,
  };
}
