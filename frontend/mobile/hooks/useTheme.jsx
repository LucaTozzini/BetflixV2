import { useState } from "react";

export default function useTheme() {
  const [color, setColor] = useState("black");
  const [colorDim, setColorDim] = useState("grey");
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState()
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [highlightColor, setHighlightColor] = useState("lightblue");
  const [statusBarStyle, setStatusBarStyle] = useState("light");
  const [tabsBackgroundColor, setTabsBackgroundColor] = useState("black")

  function setLightTheme() {
    setButtonBackgroundColor("rgba(180, 180, 180, 0.1)")
    setStatusBarStyle("dark");
    setColor("black");
    setColorDim("grey");
    setBackgroundColor("white");
    setHighlightColor("lightblue");
    setTabsBackgroundColor("rgb(221, 221, 221)")

  }

  function setDarkTheme() {
    setButtonBackgroundColor("rgba(100, 100, 100, 0.1)")
    setStatusBarStyle("light");
    setColor("white");
    setColorDim("grey");
    setBackgroundColor("rgb(19, 19, 19)");
    setHighlightColor("rgb(120,80,98)");
    setTabsBackgroundColor("rgb(27, 27, 27)")
  }

  return {
    color,
    colorDim,
    buttonBackgroundColor,
    statusBarStyle,
    backgroundColor,
    highlightColor,
    tabsBackgroundColor,
    setLightTheme,
    setDarkTheme,
  };
}
