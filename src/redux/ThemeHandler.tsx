"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "./store";

export default function ThemeHandler() {
  const mode = useSelector((state: RootState) => state.theme.mode);

  useEffect(() => {
    const el = document.documentElement;
    if (mode === "dark") el.classList.add("dark");
    else el.classList.remove("dark");
  }, [mode]);

  return null;
}
