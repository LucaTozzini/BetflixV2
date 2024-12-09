import { useState } from "react";

export default function useTheme() {

  const [color, setColor] = useState("black");
  const [colorDim, setColorDim] = useState("grey");
  const [backgroundColor, setBackgroundColor] = useState("white");
  const [highlightColor, setHighlightColor] = useState("lightblue");
  
  const [h1Size, setH1Size] = useState(20);
  const [h2Size, setH2Size] = useState(17);

  function setLightTheme(){
    setColor("black")
    setColorDim("grey")
    setBackgroundColor("white")
    setHighlightColor("lightblue")
  }

  function setDarkTheme(){
    setColor("white")
    setColorDim("grey")
    setBackgroundColor("rgb(20,20,20)")
    setHighlightColor("lightblue")
  }
  

  return {color, colorDim, h1Size, h2Size, backgroundColor, highlightColor, setLightTheme, setDarkTheme}
}
