"use client";

import { useEffect, useState } from "react";
import SidebarPanel from "@/src/common/SidebarPanel";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setTheme } from "@/src/redux/slices/themeSlice";
import { useRouter } from "next/navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      dispatch(setTheme(savedTheme as "light" | "dark"));
    }
  }, [dispatch]);

  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div
      className={`flex h-screen ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${collapsed ? "w-20" : "w-70"}`}
      >
        <SidebarPanel collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Content */}
      <div
        className={`flex-1 overflow-auto transition-all duration-300 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
