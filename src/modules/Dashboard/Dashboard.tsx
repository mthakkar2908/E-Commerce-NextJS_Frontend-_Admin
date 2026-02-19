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

const cards = [
  {
    title: "Users",
    description: "Total registered users",
    footer: "Updated today",
  },
  {
    title: "Products",
    description: "Total Products",
    footer: "Updated 1 hour ago",
  },
  {
    title: "Posts",
    description: "Total Posts",
    footer: "Updated 4 hour ago",
  },
];

const Dashboard = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === "dark";
  const [openViewForUsers, setOpenViewForUsers] = useState(false);
  const [openViewForProducts, setOpenViewForProducts] = useState(false);
  const [openViewForPosts, setOpenViewForPosts] = useState(false);

  const dispatch = useAppDispatch();
  const { totalPosts, totalProducts, totalUsers } = useAppSelector(
    (state) => state.count,
  );

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
              <Card key={index} className="w-75">
                <CardHeader>
                  <CardTitle>{card.title}</CardTitle>
                  <CardDescription>{card.description}</CardDescription>
                  <CardAction
                    onClick={() => handleView(card.title)}
                    className="cursor-pointer bg-gray-400 px-2 py-2 rounded-2xl hover:bg-gray-500"
                  >
                    View
                  </CardAction>
                </CardHeader>

                <CardContent>
                  <p>
                    {card.title === "Users"
                      ? totalUsers
                      : card.title === "Products"
                        ? totalProducts
                        : totalPosts}
                  </p>
                </CardContent>

                <CardFooter>
                  <p>{card.footer}</p>
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

      {setOpenViewForPosts && (
        <PostsDialog
          open={openViewForPosts}
          setOpen={setOpenViewForPosts}
          onDeleteSuccess={getData}
        />
      )}
    </div>
  );
};

export default Dashboard;
