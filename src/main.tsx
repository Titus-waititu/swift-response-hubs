import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme before rendering
const initializeTheme = () => {
  const htmlElement = document.documentElement;
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const shouldBeDark = storedTheme ? storedTheme === "dark" : prefersDark;

  if (shouldBeDark) {
    htmlElement.classList.add("dark");
  } else {
    htmlElement.classList.remove("dark");
  }
};

initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
