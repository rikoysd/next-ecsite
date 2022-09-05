import { Topping } from "./Topping";

export type Item = {
  // id
  id: number;
  // タイプ
  type: string;
  // 名前
  name: string;
  // 説明
  description: string;
  // Mの価格
  priceM: number;
  // Lの価格
  priceL: number;
  // 画像パス
  imagePath: string;
  // 削除フラグ
  deleted: boolean;
  // トッピングリスト
  toppingList: Array<Topping>;
};
