"use client";
import React from "react";

type ThemeProviderContextType = {
  theme: "light" | "dark";
  toggle_theme: () => void;
};

export const ThemeContext = React.createContext<ThemeProviderContextType>({
  theme: "light",
  toggle_theme: () => {},
});

export const ThemeProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [theme, set_theme] = React.useState<"light" | "dark">("light");

  const toggle_theme = () =>
    set_theme((prev_them) => {
      if (prev_them === "light") {
        return "dark";
      }

      return "light";
    });

  React.useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle_theme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};
