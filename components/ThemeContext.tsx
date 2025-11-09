// ThemeContext.tsx
import { buildTheme } from "@/constants/theme";
import React, {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = {
  theme: ReturnType<typeof buildTheme>;
  useDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sysColorScheme = useColorScheme();
  const [useDark, setUseDark] = useState(sysColorScheme === "dark");

  // Следим за изменением системной темы
  useEffect(() => {
    setUseDark(sysColorScheme === "dark");
  }, [sysColorScheme]);

  const theme = useMemo(() => buildTheme(useDark), [useDark]);
  const toggleTheme = () => setUseDark((s) => !s);

  return (
    <ThemeContext.Provider value={{ theme, useDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
};
