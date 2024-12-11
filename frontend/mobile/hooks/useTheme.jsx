import { useState } from "react";

export default function useTheme() {
  const [color, setColor] = useState("black");
  const [colorDim, setColorDim] = useState("grey");
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [highlightColor, setHighlightColor] = useState("lightblue");
  const [statusBarStyle, setStatusBarStyle] = useState("light");

  function setLightTheme() {
    setStatusBarStyle("dark");
    setColor("black");
    setColorDim("grey");
    setBackgroundColor("white");
    setHighlightColor("lightblue");
  }

  function setDarkTheme() {
    setStatusBarStyle("light");
    setColor("white");
    setColorDim("grey");
    setBackgroundColor("rgb(20,20,20)");
    setHighlightColor("rgb(120,80,98)");
  }

  return {
    color,
    colorDim,
    statusBarStyle,
    backgroundColor,
    highlightColor,
    setLightTheme,
    setDarkTheme,
  };
}
