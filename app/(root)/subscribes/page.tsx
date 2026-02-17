import { Subscribers } from "@/src/modules/SubScriber/Subscribers";
import { ColumnDef } from "@tanstack/react-table";

interface Subscriber {
  name: string;
  email: string;
}

const data: Subscriber[] = [
  { name: "John", email: "john@gmail.com" },
  { name: "Rahul", email: "rahul@gmail.com" }
];

const columns: ColumnDef<Subscriber>[] = [
  {
    accessorKey: "name",
    header: "Name"
  },
  {
    accessorKey: "email",
    header: "Email"
  }
];

export default function SubscribesPage() {
  return <Subscribers columns={columns} data={data} />;
}
