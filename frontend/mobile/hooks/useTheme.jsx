import { useState } from "react";

export default function useTheme() {
  const [color, setColor] = useState("black");
  const [colorDim, setColorDim] = useState("grey");
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [highlightColor, setHighlightColor] = useState("lightblue");
  const [statusBarStyle, setStatusBarStyle] = useState("light");

  const [h1Size, setH1Size] = useState(20);
  const [h2Size, setH2Size] = useState(17);

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
    h1Size,
    h2Size,
    statusBarStyle,
    backgroundColor,
    highlightColor,
    setLightTheme,
    setDarkTheme,
  };
}
