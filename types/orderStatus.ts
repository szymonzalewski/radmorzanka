export type OrderStatus =
  | "NEW"
  | "CONFIRMED"
  | "CANCELLED"
  | "IN_PREPARATION"
  | "READY"
  | "DELIVERED";

export interface Order {
  id: number;
  firstname: string;
  surname: string;
  orderDescription: string;
  status: OrderStatus;
  orderedProducts: {
    id: number;
    name: string;
    quantity: number;
    price: number;
  }[];
}
