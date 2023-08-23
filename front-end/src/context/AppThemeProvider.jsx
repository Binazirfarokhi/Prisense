import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  mode: "light",
  setMode: () => {},
});

const AppThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(localStorage.getItem("theme") ?? "light");

  useEffect(() => {
    localStorage.setItem("theme", mode);
  }, [mode]);
  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default AppThemeProvider;
