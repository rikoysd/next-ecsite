import React, { createContext, Dispatch, FC, ReactNode, useState } from "react";
import type { OrderItem } from "../types/OrderItem";

type Props = {
  children: ReactNode;
};

type OrderType = {
  // 注文商品
  orderItems: Array<OrderItem>;
  setOrderItems: (orderItems: Array<OrderItem>) => void;
  // 小計
  subTotalPrice: Array<number>;
  setSubTotalPrice: (subTotalPrice: Array<number>) => void;
};

export const CartContext = createContext<OrderType | null>(null);

export const CartProvider: FC<Props> = (props) => {
  const { children } = props;

  // カート内の商品
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);

  // 小計
  const [subTotalPrice, setSubTotalPrice] = useState<number[]>([]);

  return (
    <CartContext.Provider
      value={{ orderItems, setOrderItems, subTotalPrice, setSubTotalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
};
