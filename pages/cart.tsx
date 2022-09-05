import { useContext, useEffect, useState } from "react";
import { CartContext, CartProvider } from "../provider/CartProvider";
import * as React from "react";
import { styled } from "@mui/material";
import { useRouter } from "next/router";

const Cart = () => {
  const cart = useContext(CartContext);
  // カートフラグ
  const [cartFlag, setCartFlag] = useState<boolean>(false);
  // コンポーネント切り替えフラグ
  const [showCartFlag, setShowCartFlag] = useState<boolean>(false);
  // 消費税
  const [tax, setTax] = useState<number>(0);
  // 合計金額
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    let subTotalPrice = 0;
    let tax = 0;
    let totalPrice = 0;
    for (let price of cart?.subTotalPrice) {
      subTotalPrice += price;
    }
    tax = subTotalPrice * 0.1;
    totalPrice = subTotalPrice + tax;
    setTax(tax);
    setTotalPrice(totalPrice);
  }, []);

  /**
   * カートから商品を削除する.
   * @param index - インデックス
   */
  const deleteItem = (index: number) => {
    cart?.orderItems.splice(index, 1);
    if (cartFlag === false) {
      setCartFlag(true);
    } else {
      setCartFlag(false);
    }
  };

  useEffect(() => {
    if (cart?.orderItems.length === 0) {
      setShowCartFlag(true);
    } else {
      setShowCartFlag(false);
    }
  }, [cartFlag]);

  /**
   * 商品一覧ページに戻る.
   */
  const onClickItemListPage = () => {
    router.push("/itemList");
  };

  return (
    <CartProvider>
      <PageTitle>ショッピングカート</PageTitle>
      {(() => {
        if (showCartFlag === true) {
          return <Message>カートには何も入っていません</Message>;
        } else {
          return (
            <div>
              <TablePosition>
                <ItemTable>
                  <thead>
                    <tr>
                      <Th>商品名</Th>
                      <Th>サイズ、価格（税抜）、数量</Th>
                      <Th>トッピング、価格（税抜）</Th>
                      <Th>小計</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart?.orderItems.map((item, index) => (
                      <tr key={item.id}>
                        <Td>
                          <ItemImage src={item.item.imagePath}></ItemImage>
                          <div>{item.item.name}</div>
                        </Td>
                        <Td>
                          <span>{item.size}</span>
                          {(() => {
                            if (item.size === "M") {
                              return (
                                <span>
                                  {item.item.priceM.toLocaleString()}円
                                </span>
                              );
                            } else {
                              return (
                                <span>
                                  {item.item.priceL.toLocaleString()}円
                                </span>
                              );
                            }
                          })()}
                          &nbsp;&nbsp;{item.quantity}個
                        </Td>
                        <Td>
                          <ul>
                            {item.orderToppingList.map((topping) => (
                              <li key={topping.id}>
                                {topping.topping.name}
                                {(() => {
                                  if (item.size === "M") {
                                    return (
                                      <span>{topping.topping.priceM}円</span>
                                    );
                                  } else {
                                    return (
                                      <span>{topping.topping.priceL}円</span>
                                    );
                                  }
                                })()}
                              </li>
                            ))}
                          </ul>
                        </Td>
                        <Td>{cart.subTotalPrice[index].toLocaleString()}</Td>
                        <Td>
                          <button onClick={() => deleteItem(index)}>
                            削除
                          </button>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </ItemTable>
              </TablePosition>
              <Price>消費税：{tax.toLocaleString()}円</Price>
              <Price>合計：{totalPrice.toLocaleString()}円</Price>
              <ButtonPosition>
                <Button onClick={onClickItemListPage}>商品一覧に戻る</Button>
              </ButtonPosition>
            </div>
          );
        }
      })()}
    </CartProvider>
  );
};

export default Cart;

const Button = styled("button")({
  backgroundColor: "#87ceeb",
  border: "none",
  width: "150px",
  height: "40px",
  boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px;",
  margin: "0 10px",
  transition: "all 0.4s",
  "&:hover": {
    cursor: "pointer",
    opacity: "0.7",
  },
});

const ButtonPosition = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginTop: "30px",
});

const ItemImage = styled("img")({
  width: "200px",
});

const ItemTable = styled("table")({
  border: "solid 1px",
  borderCollapse: "collapse",
});

const Message = styled("div")({
  textAlign: "center",
  marginTop: "40px",
});

const PageTitle = styled("h1")({
  textAlign: "center",
  marginTop: "60px",
});

const TablePosition = styled("div")({
  display: "flex",
  justifyContent: "center",
  marginBottom: "40px",
});

const Th = styled("th")({
  border: "solid 1px",
  padding: "10px",
});

const Td = styled("td")({
  border: "solid 1px",
  padding: "10px",
});

const Price = styled("div")({
  textAlign: "center",
  fontSize: "1.7em",
});
