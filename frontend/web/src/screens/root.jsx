import { useLayoutEffect } from "react";
import Navbar from "../components/navbar";
import { Outlet } from "react-router-dom";
export default function Root() {
  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.getElementById("root").classList.add("dark");
    }

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        console.log(event);
        // Dark
        if (event.matches) {
          document.getElementById("root").classList.add("dark");
        }
        // Light
        else {
          document.getElementById("root").classList.remove("dark");
        }
      });
  }, []);
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
