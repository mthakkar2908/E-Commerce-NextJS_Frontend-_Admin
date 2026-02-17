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
import { useAppSelector } from "@/src/redux/hooks";

const cards = [
  {
    title: "Users",
    description: "Total registered users",
    content: "1500",
    footer: "Updated today",
  },
  {
    title: "Products",
    description: "Total Products",
    content: "320",
    footer: "Updated 1 hour ago",
  },
  {
    title: "Posts",
    description: "Total Posts",
    content: "732",
    footer: "Updated 4 hour ago",
  },
];

const Dashboard = () => {
  const theme = useAppSelector((state) => state.theme.mode);
  const isDark = theme === "dark";

  const handleView = async (name: string) => {
    if (name === "Users") {
      console.log("Users View Click");
    }
    if (name === "Products") {
      console.log("Products View click");
    }
    if (name === "Posts") {
      console.log("Posts View click");
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
                    className="cursor-pointer"
                  >
                    View
                  </CardAction>
                </CardHeader>

                <CardContent>
                  <p>{card.content}</p>
                </CardContent>

                <CardFooter>
                  <p>{card.footer}</p>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
