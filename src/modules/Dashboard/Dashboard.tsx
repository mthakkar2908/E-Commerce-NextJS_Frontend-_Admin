/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { fetchCounts } from "@/src/redux/slices/totalSlice";
import { useEffect, useState } from "react";
import UsersDialog from "./UsersDialog";
import ProductsDialog from "./ProductsDialog";
import PostsDialog from "./PostsDialog";
import { useRouter } from "next/navigation";
import ContactDialog from "./ContactDialog";
import toast from "react-hot-toast";

const cards = [
  {
    title: "Users",
    description: "Total registered users",
    footer: "Updated today",
    more: false,
  },
  {
    title: "Products",
    description: "Total Products",
    footer: "Updated 1 hour ago",
    more: true,
  },
  {
    title: "Posts",
    description: "Total Posts",
    footer: "Updated 4 hour ago",
    more: false,
  },
  {
    title: "Orders",
    description: "Total Orders",
    footer: "Updated 2 hour ago",
    more: false,
  },
  {
    title: "Contact forms",
    description: "Total Contact Forms",
    footer: "Updated 10 hour ago",
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
  const [showMoreLoading, setShowMoreLoading] = useState(false);

  const router = useRouter();

  const dispatch = useAppDispatch();
  const {
    totalPosts,
    totalProducts,
    totalUsers,
    totalOrders,
    totalContactForms,
  } = useAppSelector((state) => state.count);

  const getData = async () => {
    try {
      await dispatch(fetchCounts()).unwrap();
    } catch (error) {
      console.error(error);
    }
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
      router.push("/orders");
      localStorage.setItem("activeState", "orders");
    }
    if (name === "Contact forms") {
      setOpenViewForContactForms(true);
    }
  };

  const handleShowMore = async () => {
    try {
      setShowMoreLoading(true);
      await router.push("/products");
      localStorage.setItem("activeState", "products");
    } catch (error) {
      toast.error((error as string) ?? "Failed to navigate");
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        <h1
          className={`text-3xl font-bold mb-4 ${
            isDark ? "text-blue-400" : "text-gray-800"
          }`}
        >
          Dashboard
        </h1>
        <div
          className={`rounded-lg shadow p-6 flex ${
            isDark ? "bg-gray-700 text-gray-100" : "bg-white text-gray-600"
          }`}
        >
          <div className="flex gap-3 flex-wrap">
            {cards.map((card, index) => (
              <Card key={index} className="w-95">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                  <CardAction
                    onClick={() => handleView(card.title)}
                    className="cursor-pointer bg-gray-400 px-2 py-2 rounded-2xl hover:bg-gray-500"
                  >
                    {card.title === "Orders" ? "Go to Orders" : "View"}
                  </CardAction>
                </CardHeader>

                <CardContent>
                  <p>
                    {card.title === "Users"
                      ? totalUsers
                      : card.title === "Products"
                        ? totalProducts
                        : card.title === "Posts"
                          ? totalPosts
                          : card.title === "Orders"
                            ? totalOrders
                            : totalContactForms}
                  </p>
                </CardContent>

                <CardFooter>
                  {card.more ? (
                    <div className="flex justify-between gap-12 -mr-3.75">
                      <p>{card.footer}</p>
                      <p
                        onClick={handleShowMore}
                        className="ml-10 cursor-pointer text-blue-400 underline hover:text-red-500"
                      >
                        {showMoreLoading ? "Navigating..." : "Show more..."}
                      </p>
                    </div>
                  ) : (
                    <p>{card.footer}</p>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>

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
          onDeleteSuccess={getData}
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
