import { useEffect } from "react";
import { useFetchItemList } from "../hooks/useFetchItemList";
import { styled } from "@mui/material";
import Head from "next/head";
import Link from "next/link";

const ItemList = () => {
  const { allItemList, getAllItemList } = useFetchItemList();

  useEffect(() => {
    getAllItemList();
  }, []);

  return (
    <div>
      <Head>
        <title>商品一覧</title>
      </Head>
      <Container>
        <ItemCards>
          {allItemList.map((item) => (
            <ItemCard key={item.id}>
              <Link href={`/itemDetail/${item.id}`}>
                <ItemImage src={item.imagePath} />
              </Link>
              <Link href={`/itemDetail/${item.id}`}>
                <ItemName>{item.name}</ItemName>
              </Link>
              <ItemPrice>
                M:&nbsp;{item.priceM.toLocaleString()}円&nbsp;&nbsp;L:&nbsp;
                {item.priceL.toLocaleString()}円
              </ItemPrice>
            </ItemCard>
          ))}
        </ItemCards>
      </Container>
    </div>
  );
};

export default ItemList;

const Container = styled("div")({
  display: "flex",
  justifyContent: "center",
});

const ItemCards = styled("div")({
  display: "flex",
  flexWrap: "wrap",
  width: "70%",
});

const ItemCard = styled("div")({
  margin: "30px 25px",
  width: "250px",
});

const ItemImage = styled("img")({
  width: "250px",
  height: "250px",
  objectFit: "cover",
  borderRadius: "10px",
  marginBottom: "10px",
  cursor: "pointer",
  transition: "all 0.4s",
  "&:hover": {
    boxShadow: "rgb(38, 57, 77) 0px 20px 30px -10px",
    opacity: "0.7",
  },
});

const ItemName = styled("div")({
  fontWeight: "bold",
  textAlign: "center",
  // 名前が長ければ改行
  overflowWrap: "break-word",
  marginBottom: "7px",
});

const ItemPrice = styled("div")({
  textAlign: "center",
});
