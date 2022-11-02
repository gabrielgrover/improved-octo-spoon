"use client";
import React from "react";

type ThemeProviderContextType = {
  theme: "light" | "dark";
  toggle_theme: () => void;
};

const VOID_LOG_THEME = "VOID_LOG_THEME";

export const ThemeContext = React.createContext<ThemeProviderContextType>({
  theme: "light",
  toggle_theme: () => {},
});

export const ThemeProvider: React.FC<React.PropsWithChildren> = (props) => {
  const [theme, set_theme] = React.useState<"light" | "dark">();

  const toggle_theme = () =>
    set_theme((prev_them) => {
      if (prev_them === "light") {
        window.localStorage.setItem(VOID_LOG_THEME, "dark");
        return "dark";
      }

      window.localStorage.setItem(VOID_LOG_THEME, "light");
      return "light";
    });

  React.useEffect(() => {
    document.body.dataset.theme = theme;
  }, [theme]);

  React.useEffect(() => {
    const cached_theme = window.localStorage.getItem(VOID_LOG_THEME);

    if (cached_theme) {
      set_theme(cached_theme as "light" | "dark");
    } else {
      set_theme("light");
    }
  }, []);

  if (!theme) {
    return null;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle_theme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};
