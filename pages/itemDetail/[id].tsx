import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useContext,
} from "react";
import { useFetchItemList } from "../../hooks/useFetchItemList";
import { useRouter } from "next/router";
import { styled } from "@mui/material";
import { Topping } from "../../types/Topping";
import { CartContext } from "../../provider/CartProvider";
import type { OrderItem } from "../../types/OrderItem";
import type { OrderTopping } from "../../types/OrderTopping";

const ItemDetail = () => {
  const { getItemById, itemById, toppingList } = useFetchItemList();
  // urlのパラメータを取得(Next.js用のフック)
  const router = useRouter();

  // サイズ
  const [size, setSize] = useState<string>("M");
  // チェックされたトッピング
  const [checkedToppingList, setCheckedToppingList] = useState<Topping[]>([]);
  // 数量
  const [quantity, setQuantity] = useState<string>("1");
  // 合計金額
  const [subTotalPrice, setSubTotalPrice] = useState<number>(0);
  // ショッピングカート
  const cart = useContext(CartContext);

  useEffect(() => {
    (async () => {
      await getItemById(Number(router.query.id));
    })();
  }, [router]);

  useEffect(() => {
    // 商品のMサイズ価格を合計金額にセット
    setSubTotalPrice(Number(itemById?.priceM));
  }, [itemById]);

  /**
   * サイズを選択する.
   * @param e
   */
  const onChangeSize = (e: ChangeEvent<HTMLInputElement>) => {
    setSize(e.target.value);
  };

  /**
   * 商品の数量を選択.
   * @param e
   */
  const onChangeQuantity = (e: ChangeEvent<HTMLSelectElement>) => {
    setQuantity(e.target.value);
  };

  /**
   * トッピングを選択.
   * @param e
   */
  const onChangeTopping = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const newToppingList = [...checkedToppingList];
      if (e.target.checked === true) {
        for (let topping of toppingList) {
          if (topping.name === e.target.value) {
            newToppingList.push(topping);
          }
        }
      } else {
        for (let i = 0; i < newToppingList.length; i++) {
          if (newToppingList[i].name === e.target.value) {
            newToppingList.splice(i, 1);
          }
        }
      }
      setCheckedToppingList(newToppingList);
    },
    [toppingList, checkedToppingList]
  );

  /**
   * 商品一覧ページに戻る.
   */
  const onClickItemListPage = () => {
    router.push("/itemList");
  };

  /**
   * 合計金額を計算する.
   */
  const calcSubTotalPrice = useCallback(() => {
    let newSubTotalPrice = Number(itemById?.priceM);
    if (size === "M") {
      // newSubTotalPrice += Number(itemById?.priceM);
      newSubTotalPrice += checkedToppingList.length * 200;
    } else {
      newSubTotalPrice = Number(itemById?.priceL);
      newSubTotalPrice += checkedToppingList.length * 300;
    }
    newSubTotalPrice = newSubTotalPrice * Number(quantity);
    setSubTotalPrice(newSubTotalPrice);
  }, [size, itemById, subTotalPrice, checkedToppingList, quantity]);

  useEffect(() => {
    calcSubTotalPrice();
  }, [size, checkedToppingList, quantity]);

  const onClickInCart = useCallback(() => {
    let newOrderToppingList: Array<OrderTopping> = [];
    for (let topping of checkedToppingList) {
      let orderTopping: OrderTopping = {
        id: topping.id,
        toppingId: topping.id,
        orderItemId: -1,
        topping: topping,
      };
      newOrderToppingList.push(orderTopping);
    }

    if (itemById) {
      let orderItem: OrderItem = {
        id: Number(itemById?.id),
        itemId: Number(itemById?.id),
        orderId: -1,
        quantity: Number(quantity),
        size: size,
        item: itemById,
        orderToppingList: newOrderToppingList,
      };

      cart?.setOrderItems([...cart.orderItems, orderItem]);
      cart?.setSubTotalPrice([...cart.subTotalPrice, subTotalPrice]);
      // ショッピングカートページへ遷移
      router.push("/cart");
    }
  }, [subTotalPrice, itemById, checkedToppingList]);

  return (
    <div>
      <ItemBlock>
        <ItemImage src={itemById?.imagePath} />
        <div>
          <ItemName>{itemById?.name}</ItemName>
          <ItemDescription>{itemById?.description}</ItemDescription>
        </div>
      </ItemBlock>
      <SelectBlockFlex>
        <SelectBlock>
          <RadioSize>
            <div>
              <label htmlFor="size-m">
                <input
                  id="size-m"
                  name="size"
                  type="radio"
                  value="M"
                  checked={size === "M"}
                  onChange={onChangeSize}
                />
                M:&nbsp;{itemById?.priceM.toLocaleString()}円
              </label>
              <label htmlFor="size-l">
                <input
                  id="size-l"
                  name="size"
                  type="radio"
                  value="L"
                  checked={size === "L"}
                  onChange={onChangeSize}
                />
                L:&nbsp;{itemById?.priceL.toLocaleString()}円
              </label>
            </div>
          </RadioSize>
          <div>
            トッピング：&nbsp;1つにつき
            <span>&nbsp;Ｍ&nbsp;</span>&nbsp;&nbsp;200円(税抜)
            <span>&nbsp;Ｌ&nbsp;</span>&nbsp;300円(税抜)
          </div>
          <ToppingBlock>
            {toppingList.map((topping) => (
              <CheckboxTopping key={topping.id}>
                <input
                  type="checkbox"
                  value={topping.name}
                  onChange={onChangeTopping}
                />
                {topping.name}
              </CheckboxTopping>
            ))}
          </ToppingBlock>
          <QuantityBlock>
            <div>数量</div>
            <div>
              <select onChange={onChangeQuantity}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
          </QuantityBlock>
          <SubTotalPrice>
            合計金額：{subTotalPrice.toLocaleString()}円
          </SubTotalPrice>
        </SelectBlock>
      </SelectBlockFlex>
      <ButtonBlock>
        <div>
          <Button onClick={onClickItemListPage}>商品一覧に戻る</Button>
          <Button onClick={onClickInCart}>カートに入れる</Button>
        </div>
      </ButtonBlock>
    </div>
  );
};

export default ItemDetail;

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

const ButtonBlock = styled("div")({
  display: "flex",
  justifyContent: "center",
});

const CheckboxTopping = styled("span")({
  margin: "0 8px",
});

const ItemBlock = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginTop: "60px",
});

const ItemDescription = styled("div")({
  width: "400px",
});

const ItemImage = styled("img")({
  width: "300px",
  height: "300px",
  objectFit: "cover",
  borderRadius: "10px",
  marginBottom: "10px",
  marginRight: "40px",
});

const ItemName = styled("div")({
  fontWeight: "bold",
  fontSize: "35px",
  marginBottom: "35px",
  width: "400px",
});

const QuantityBlock = styled("div")({
  display: "flex",
  margin: "20px 0",
});

const RadioSize = styled("div")({
  margin: "15px 0",
});

const SelectBlock = styled("div")({
  width: "750px",
});

const SelectBlockFlex = styled("div")({
  display: "flex",
  justifyContent: "center",
});

const SubTotalPrice = styled("div")({
  fontSize: "1.5em",
  textAlign: "center",
  marginBottom: "20px",
});

const ToppingBlock = styled("div")({
  marginTop: "15px",
});
