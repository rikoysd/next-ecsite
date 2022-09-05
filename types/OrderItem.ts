import { Item } from "./Item";
import type { OrderTopping } from "./OrderTopping";

export type OrderItem = {
  // id
  id: number;
  // 商品ID
  itemId: number;
  // 注文ID
  orderId: number;
  // 数量
  quantity: number;
  // サイズ
  size: string;
  // 商品
  item: Item;
  // 注文トッピングリスト
  orderToppingList: Array<OrderTopping>;
};
