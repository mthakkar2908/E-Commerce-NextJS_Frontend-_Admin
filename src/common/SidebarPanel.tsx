/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Package,
  ShoppingBag,
  Users,
  PenLine,
} from "lucide-react";
import routes from "./routes";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setTheme } from "../redux/slices/themeSlice";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { logoutThunk } from "../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useMediaQuery } from "react-responsive";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

const SidebarPanel = ({ collapsed, setCollapsed }: SidebarProps) => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state?.theme.mode);
  const isDark = theme === "dark";
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const user = useAppSelector((state) => state.auth.user);
  const userEmail = user?.email;
  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk(String(userEmail)));
      router.push(routes.login);
    } catch (error) {
      toast.error((error as any) ?? "Failed to Logged out.");
    }
  };

  const isMobile = useMediaQuery({ maxWidth: 600 });

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  useEffect(() => {
    if (active) {
      localStorage.setItem("activeState", active);
    }
  }, [active]);

  useEffect(() => {
    const stored =
      typeof window !== "undefined"
        ? localStorage.getItem("activeState")
        : null;
    if (stored) {
      setActive(stored);
      return;
    }

    if (!pathname) return;

    if (pathname.includes("/orders")) setActive("orders");
    else if (pathname.includes("/products")) setActive("products");
    else if (pathname.includes("/subscribe")) setActive("subscribe");
    else if (
      pathname.includes("/privacy-policy") ||
      pathname.includes("/privacy")
    )
      setActive("privacy");
    else if (
      pathname.includes("/terms-condition") ||
      pathname.includes("/terms")
    )
      setActive("terms");
    else if (
      pathname.includes("/contact-forms") ||
      pathname.includes("contact")
    )
      setActive("contacts");
    else if (pathname.includes("/posts")) setActive("posts");
    else setActive("dashboard");
  }, [pathname]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === "activeState") setActive(e.newValue);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <div
      className={`shrink-0 h-screen max-h-screen overflow-y-auto scrollbar overflow-x-hidden transition-all duration-300 ease-in-out ${
        isDark ? "bg-gray-800" : "bg-gray-400"
      } ${isDark ? "text-white" : "text-black"} flex flex-col pt-6 border-r ${
        isDark ? "border-gray-700" : "border-gray-200"
      } ${collapsed ? "items-center" : "items-start px-4"}`}
    >
      <div className="flex flex-col w-full mb-4">
        {!collapsed && (
          <h1
            onClick={() => {
              router.push(routes.dashboard);
              localStorage.setItem("activeState", "dashboard");
            }}
            className="text-xl font-bold mb-4 cursor-pointer"
          >
            Admin Panel
          </h1>
        )}

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

        <nav className="flex flex-col gap-3 w-full">
          <Link
            href={routes.dashboard}
            title={collapsed ? "Dashboard" : ""}
            onClick={() => setActive("dashboard")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition truncate ${
              active === "dashboard"
                ? isDark
                  ? "bg-gray-700 text-blue-400"
                  : "bg-blue-100 text-blue-600"
                : ""
            } ${isDark ? "hover:bg-gray-700 hover:text-blue-400" : "hover:bg-blue-100 hover:text-blue-600"}`}
          >
            {collapsed ? (
              <LayoutDashboard size={22} />
            ) : (
              <span className="truncate">Dashboard</span>
            )}
          </Link>

          <Link
            href={routes.subscribe}
            title={collapsed ? "Subscribe List" : ""}
            onClick={() => setActive("subscribe")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition truncate ${active === "subscribe" ? (isDark ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-700") : ""}  ${
              isDark
                ? "hover:bg-gray-700 hover:text-blue-400"
                : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {collapsed ? (
              <UserRoundCheck size={22} />
            ) : (
              <span className="truncate">Subscribe List</span>
            )}
          </Link>

          <Link
            href={routes.orders}
            title={collapsed ? "Orders" : ""}
            onClick={() => setActive("orders")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition truncate ${active === "orders" ? (isDark ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-700") : ""} ${
              isDark
                ? "hover:bg-gray-700 hover:text-blue-400"
                : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {collapsed ? (
              <Package size={22} />
            ) : (
              <span className="truncate">Orders</span>
            )}
          </Link>

          <Link
            href={routes.products}
            title={collapsed ? "Products" : ""}
            onClick={() => setActive("products")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition truncate ${active === "products" ? (isDark ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-700") : ""} ${
              isDark
                ? "hover:bg-gray-700 hover:text-blue-400"
                : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {collapsed ? (
              <ShoppingBag size={22} />
            ) : (
              <span className="truncate">Products</span>
            )}
          </Link>

          <Link
            href={routes.contacts}
            title={collapsed ? "Contacts" : ""}
            onClick={() => setActive("contacts")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition truncate ${active === "contacts" ? (isDark ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-700") : ""} ${
              isDark
                ? "hover:bg-gray-700 hover:text-blue-400"
                : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {collapsed ? (
              <Users size={22} />
            ) : (
              <span className="truncate">Contacts</span>
            )}
          </Link>

          <Link
            href={routes.posts}
            title={collapsed ? "Posts" : ""}
            onClick={() => setActive("posts")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition truncate ${active === "posts" ? (isDark ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-700") : ""} ${
              isDark
                ? "hover:bg-gray-700 hover:text-blue-400"
                : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {collapsed ? (
              <PenLine size={22} />
            ) : (
              <span className="truncate">Posts</span>
            )}
          </Link>

          <Link
            href={routes.privacy}
            title={collapsed ? "Privacy Policy" : ""}
            onClick={() => setActive("privacy")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition truncate ${active === "privacy" ? (isDark ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-700") : ""} ${
              isDark
                ? "hover:bg-gray-700 hover:text-blue-400"
                : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {collapsed ? (
              <ShieldCheck size={22} />
            ) : (
              <span className="truncate">Privacy Policy</span>
            )}
          </Link>

          <Link
            href={routes.terms}
            title={collapsed ? "Terms & Conditions" : ""}
            onClick={() => setActive("terms")}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition truncate ${active === "terms" ? (isDark ? "bg-gray-700 text-blue-400" : "bg-blue-100 text-blue-700") : ""} ${
              isDark
                ? "hover:bg-gray-700 hover:text-blue-400"
                : "hover:bg-blue-100 hover:text-blue-600"
            }`}
          >
            {collapsed ? (
              <FileText size={22} />
            ) : (
              <span className="truncate">Terms & Conditions</span>
            )}
          </Link>
        </nav>
      </div>

      <div
        className={`mt-auto w-full pb-6 flex justify-center gap-2 ${collapsed ? "flex flex-col items-center" : "flex-row items-center px-4"}`}
      >
        <button
          onClick={() => {
            const newTheme = theme === "light" ? "dark" : "light";
            dispatch(setTheme(newTheme));
            localStorage.setItem("theme", newTheme);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition cursor-pointer ${
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
