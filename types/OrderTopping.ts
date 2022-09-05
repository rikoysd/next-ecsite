import { Topping } from "./Topping";

export type OrderTopping = {
  // id
  id: number;
  // トッピングID
  toppingId: number;
  // 注文商品ID
  orderItemId: number;
  // トッピング
  topping: Topping;
};
