import axios from "axios";
import { useCallback, useState } from "react";
import { Item } from "../types/Item";
import { Topping } from "../types/Topping";

export const useFetchItemList = () => {
  // 商品リスト
  const [allItemList, setAllItemList] = useState<Item[]>([]);
  // IDから取得した商品
  const [itemById, setItemById] = useState<Item | undefined>();
  // トッピングリスト
  const [toppingList, setToppingList] = useState<Topping[]>([]);

  // 商品一覧を取得
  const getAllItemList = useCallback(async () => {
    await axios
      .get("http://153.127.48.168:8080/ecsite-api/item/items/aloha")
      .then((response) => {
        setAllItemList(response.data.items);
      });
  }, []);

  // IDより商品を1件取得
  const getItemById = useCallback(async (id: number) => {
    await axios
      .get(`http://153.127.48.168:8080/ecsite-api/item/${id}`)
      .then((response) => {
        setItemById(response.data.item);
        setToppingList(response.data.item.toppingList);
      });
  }, []);

  return { allItemList, getAllItemList, getItemById, itemById, toppingList };
};
