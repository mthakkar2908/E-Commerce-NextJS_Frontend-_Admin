/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Card } from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { fetchCounts } from "@/src/redux/slices/totalSlice";
import { useEffect, useState } from "react";
import UsersDialog from "./UsersDialog";
import ProductsDialog from "./ProductsDialog";
import PostsDialog from "./PostsDialog";
import { useRouter } from "next/navigation";
import ContactDialog from "./ContactDialog";
import toast from "react-hot-toast";
import routes from "@/src/common/routes";

const cards = [
  {
    title: "Users",
    description: "Total registered users",
    more: false,
  },
  {
    title: "Products",
    description: "Total Products",
    more: true,
  },
  {
    title: "Posts",
    description: "Total Posts",
    more: true,
  },
  {
    title: "Orders",
    description: "Total Orders",
    more: false,
  },
  {
    title: "Contact forms",
    description: "Total Contact Forms",
    more: true,
  },
  {
    title: "Categories",
    description: "Total Categories",
    more: false,
  },
];

const Dashboard = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === "dark";
  const [openViewForUsers, setOpenViewForUsers] = useState(false);
  const [openViewForProducts, setOpenViewForProducts] = useState(false);
  const [openViewForPosts, setOpenViewForPosts] = useState(false);
  const [openViewForContactForms, setOpenViewForContactForms] = useState(false);
  const [loadingFor, setLoadingFor] = useState<string | null>(null);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const {
    totalPosts,
    totalProducts,
    totalUsers,
    totalOrders,
    totalContactForms,
    totalCategoris,
    lastContactAdded,
    lastCategoriesAdded,
    lastOrderAdded,
    lastPostAdded,
    lastProductAdded,
    lastUserAdded,
  } = useAppSelector((state) => state.count);

  const getData = async () => {
    await dispatch(fetchCounts()).unwrap();
  };

  useEffect(() => {
    getData();
  }, [dispatch]);

  const handleView = async (name: string) => {
    if (name === "Users") {
      setOpenViewForUsers(true);
    }
    if (name === "Products") {
      setOpenViewForProducts(true);
    }
    if (name === "Posts") {
      setOpenViewForPosts(true);
    }
    if (name === "Orders") {
      router.push(routes.orders);
      localStorage.setItem("activeState", "orders");
    }
    if (name === "Contact forms") {
      setOpenViewForContactForms(true);
    }
    if (name === "Categories") {
      router.push(routes.category);
      localStorage.setItem("activeState", "category");
    }
  };

  const handleShowMore = async (title: string) => {
    try {
      setLoadingFor(title);

      if (title === "Products") {
        localStorage.setItem("activeState", "products");
        await router.push(routes.products);
      } else if (title === "Contact forms") {
        localStorage.setItem("activeState", "contacts");
        await router.push(routes.contacts);
      } else {
        localStorage.setItem("activeState", "posts");
        await router.push(routes.posts);
      }
    } catch (error) {
      toast.error("Failed to navigate");
    } finally {
      setLoadingFor(null);
    }
  };

  return (
    <div className="min-h-screen px-8 py-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1
            className={`text-4xl font-bold tracking-tight ${
              isDark
                ? "bg-linear-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
                : "text-gray-900"
            }`}
          >
            Dashboard Overview
          </h1>

          <p
            className={`mt-2 text-sm ${
              isDark ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Monitor system statistics and manage data efficiently
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-8">
          {cards.map((card, index) => (
            <Card
              key={index}
              className={`relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl group ${
                isDark
                  ? "bg-gray-800/70 border border-gray-700 backdrop-blur-lg"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition bg-linear-to-br from-cyan-500/10 to-indigo-500/10 pointer-events-none" />

              {/* Title */}
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{card.title}</h3>
                  <p className="text-sm opacity-70 mt-1">{card.description}</p>
                </div>
                <button
                  onClick={() => handleView(card.title)}
                  className="px-4 py-2 cursor-pointer rounded-lg text-sm font-medium bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
                >
                  {card.title === "Orders"
                    ? "Go to Orders"
                    : card.title === "Categories"
                      ? "Go to Categories"
                      : "View"}
                </button>
              </div>

              {/* Count */}
              <div className="mt-6">
                <p className="text-4xl font-bold tracking-tight">
                  {card.title === "Users"
                    ? totalUsers
                    : card.title === "Products"
                      ? totalProducts
                      : card.title === "Posts"
                        ? totalPosts
                        : card.title === "Orders"
                          ? totalOrders
                          : card.title === "Contact forms"
                            ? totalContactForms
                            : totalCategoris}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-8 flex justify-between items-center">
                {card.more && (
                  <button
                    onClick={() => handleShowMore(card.title)}
                    className="text-sm cursor-pointer font-medium text-cyan-500 hover:text-blue-500 transition"
                  >
                    {loadingFor === card.title
                      ? "Navigating..."
                      : "Show more →"}{" "}
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 flex gap-1 text-xs opacity-60">
                <p>Count Updated</p>
                {card.title === "Users"
                  ? lastUserAdded
                  : card.title === "Products"
                    ? lastProductAdded
                    : card.title === "Posts"
                      ? lastPostAdded
                      : card.title === "Orders"
                        ? lastOrderAdded
                        : card.title === "Contact forms"
                          ? lastContactAdded
                          : lastCategoriesAdded}
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Dialogs */}
      {openViewForUsers && (
        <UsersDialog
          open={openViewForUsers}
          setOpen={setOpenViewForUsers}
          onDeleteSuccess={getData}
        />
      )}

      {openViewForProducts && (
        <ProductsDialog
          open={openViewForProducts}
          setOpen={setOpenViewForProducts}
        />
      )}

      {openViewForPosts && (
        <PostsDialog
          open={openViewForPosts}
          setOpen={setOpenViewForPosts}
          onDeleteSuccess={getData}
        />
      )}

      {openViewForContactForms && (
        <ContactDialog
          open={openViewForContactForms}
          setOpen={setOpenViewForContactForms}
          onDeleteSuccess={getData}
        />
      )}
    </div>
  );
};

export default Dashboard;
