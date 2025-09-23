import { createContext } from "react";
import type { UseTheme } from "../types";

export const ThemeContext = createContext<UseTheme | undefined>(undefined);
