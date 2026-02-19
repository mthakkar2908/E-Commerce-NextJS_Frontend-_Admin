import { Subscribers } from "@/src/modules/SubScriber/Subscribers";

interface Subscriber {
  name: string;
  email: string;
}

const data: Subscriber[] = [
  { name: "John", email: "john@gmail.com" },
  { name: "Rahul", email: "rahul@gmail.com" },
];

export default function SubscribesPage() {
  return <Subscribers data={data} />;
}
