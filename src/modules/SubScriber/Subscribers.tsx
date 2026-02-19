/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { getSubscriberData } from "@/src/redux/slices/postSlice";
import { GetAllSubscriberData } from "@/src/api/endpoints/interfaces";
import toast from "react-hot-toast";

interface Subscriber {
  name: string;
  email: string;
}

interface SubscribersProps {
  data: Subscriber[];
}

export function Subscribers({ data }: SubscribersProps) {
  const theme = useAppSelector((state) => state.theme.mode);
  const [subData, setSubData] = useState<GetAllSubscriberData[]>([]);
  const isDark = theme === "dark";
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchSubscribersData = async () => {
      try {
        const res = await dispatch(getSubscriberData()).unwrap();
        setSubData(res);
        console.log("Response Subscribe data", res);
      } catch (error) {
        toast.error((error as any) ?? "Failed to fetch Subscriber data");
      }
    };

    fetchSubscribersData();
  }, [dispatch]);

  return (
    <div className="p-8">
      <div className="max-w-4xl">
        <h1
          className={`text-3xl font-bold mb-4 ${
            isDark ? "text-blue-400" : "text-gray-800"
          }`}
        >
          Subscribe List
        </h1>

        <div
          className={`rounded-md border ${
            isDark ? "border-gray-700" : "border-gray-300"
          }`}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email Registered</TableHead>
                <TableHead>Registered By (Name)</TableHead>
                <TableHead>Registered By (Email)</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {subData.length > 0 ? (
                subData.map((subscriber, index) => (
                  <TableRow key={index}>
                    <TableCell>{subscriber.email}</TableCell>
                    <TableCell>{subscriber.userId.name}</TableCell>
                    <TableCell>{subscriber.userId.email}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center py-6">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
