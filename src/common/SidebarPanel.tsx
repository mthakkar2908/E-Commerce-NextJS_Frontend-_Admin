"use client";

import Link from "next/link";
import {
  Sun,
  Moon,
  ArrowLeftToLine,
  ArrowRightToLine,
  LayoutDashboard,
  UserRoundCheck,
  FileText,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import routes from "./routes";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setTheme } from "../redux/slices/themeSlice";
import { useEffect, useState } from "react";
import { logoutThunk } from "../redux/slices/authSlice";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const SidebarPanel = ({ collapsed, setCollapsed }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === "dark";
  const [active, setActive] = useState(localStorage.getItem("activeState"));

  const handleLogout = async () => {
    await dispatch(logoutThunk());
  };

  useEffect(() => {
    if (active) {
      localStorage.setItem("activeState", active);
    }
  }, [active]);

  return (
    <div
      className={`w-full h-screen transition-all duration-300 ease-in-out ${
        isDark ? "bg-gray-800" : "bg-gray-400"
      } ${isDark ? "text-white" : "text-black"} 
      flex flex-col pt-8 border-r ${
        isDark ? "border-gray-700" : "border-gray-200"
      } ${collapsed ? "items-center" : "items-start px-4"}`}
    >
      <div className="flex flex-col w-full">
        {!collapsed && <h1 className="text-xl font-bold mb-4">Admin Panel</h1>}

        <div
          className={`flex ${
            collapsed ? "justify-center mb-6" : "justify-end w-full mb-6"
          }`}
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="cursor-pointer transition-transform duration-300"
          >
            {!collapsed ? (
              <ArrowLeftToLine size={22} />
            ) : (
              <ArrowRightToLine size={22} />
            )}
          </button>
        </div>

        <nav className="flex flex-col gap-4 w-full">
          <Link
            href={routes.dashboard}
            onClick={() => setActive("dashboard")}
            className={`px-6 py-3 rounded-lg transition ${
              active === "dashboard"
                ? isDark
                  ? "bg-gray-700 text-blue-400"
                  : "bg-blue-100 text-blue-600"
                : ""
            }
${
  isDark
    ? "hover:bg-gray-700 hover:text-blue-400"
    : "hover:bg-blue-100 hover:text-blue-600"
}`}
          >
            {collapsed ? <LayoutDashboard size={22} /> : "Dashboard"}
          </Link>

          <Link
            href={routes.subscribe}
            onClick={() => setActive("subscribe")}
            className={`px-6 py-3 rounded-lg transition ${active === "subscribe" ? (isDark ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-700") : ""}  ${
              isDark
                ? "hover:bg-gray-700 hover:text-blue-400"
                : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {collapsed ? <UserRoundCheck size={22} /> : "Subscribe List"}
          </Link>

          <Link
            href={routes.privacy}
            onClick={() => setActive("privacy")}
            className={`px-6 py-3 rounded-lg transition ${active === "privacy" ? (isDark ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-700") : ""} ${
              isDark
                ? "hover:bg-gray-700 hover:text-blue-400"
                : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {collapsed ? <ShieldCheck size={22} /> : "Privacy Policy"}
          </Link>

          <Link
            href={routes.terms}
            onClick={() => setActive("terms")}
            className={`px-6 py-3 rounded-lg transition ${active === "terms" ? (isDark ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-700") : ""} ${
              isDark
                ? "hover:bg-gray-700 hover:text-blue-400"
                : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {collapsed ? <FileText size={22} /> : "Terms & Conditions"}
          </Link>
        </nav>
      </div>

      <div
        className={`mt-auto w-full pb-6 flex justify-center gap-2 ${collapsed && "flex flex-col"} `}
      >
        <button
          onClick={() => {
            const newTheme = theme === "light" ? "dark" : "light";
            dispatch(setTheme(newTheme));
            localStorage.setItem("theme", newTheme);
          }}
          className={`flex items-center gap-2 px-8 py-2 rounded-lg transition cursor-pointer ${
            isDark
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-white hover:bg-gray-100"
          }`}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? (
            <>
              <Sun size={20} />
              {!collapsed && <span>Light</span>}
            </>
          ) : (
            <>
              <Moon size={20} />
              {!collapsed && <span>Dark</span>}
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-8 rounded-lg transition duration-200"
        >
          {collapsed ? <LogOut size={20} /> : "Logout"}
        </button>
      </div>
    </div>
  );
};

export default SidebarPanel;
