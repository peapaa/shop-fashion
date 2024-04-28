import { useEffect, useState } from "react";
import { addToCart, getAllProducts, getProductsByCategory } from "../../Api";
import {
  Badge,
  Button,
  Card,
  List,
  Rate,
  Select,
  Skeleton,
  message,
} from "antd";
import Meta from "antd/es/card/Meta";
import { Typography } from "antd";
import { useParams } from "react-router-dom";

interface Product {
  brand: string;
  category: string;
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  rating: number;
  description: string;
}
const Products: React.FC = () => {
  const params = useParams();
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Product[]>([]);
  const [sortOrder, setSortOrder] = useState<string>("az");
  console.log(sortOrder);

  useEffect(() => {
    setLoading(true);
    (params?.categoryId
      ? getProductsByCategory(params.categoryId)
      : getAllProducts()
    ).then((res) => {
      setItems(res.products);
      setLoading(false);
    });
  }, [params]);
  console.log(items);

  const getSortItems = () => {
    const sortItem = [...items];
    sortItem.sort((a: Product, b: Product) => {
      const aLowerTitleCase = a.title.toLowerCase();
      const bLowerTitleCase = b.title.toLowerCase();

      if (sortOrder === "az") {
        return aLowerTitleCase > bLowerTitleCase
          ? 1
          : aLowerTitleCase === bLowerTitleCase
          ? 0
          : -1;
      } else if (sortOrder === "za") {
        return aLowerTitleCase < bLowerTitleCase
          ? 1
          : aLowerTitleCase === bLowerTitleCase
          ? 0
          : -1;
      } else if (sortOrder === "lowHigh") {
        return a.price > b.price ? 1 : a.price === b.price ? 0 : -1;
      } else if (sortOrder === "highLow") {
        return a.price < b.price ? 1 : a.price === b.price ? 0 : -1;
      }
      return 0;
    });
    return sortItem;
  };
  return (
    <div className="products">
      <div>
        <Typography.Text> View item short by: </Typography.Text>
        <Select
          onChange={(value) => {
            setSortOrder(value);
          }}
          defaultValue={"az"}
          options={[
            { label: "Alphabet a-z", value: "az" },
            { label: "Alphabet z-a", value: "za" },
            { label: "Price Low to High", value: "lowHigh" },
            { label: "Price High to Low", value: "highLow" },
          ]}
        ></Select>
      </div>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 3,
        }}
        renderItem={(product: Product, index: number) => {
          return (
            <Badge.Ribbon
              text={`${product.discountPercentage}%`}
              color="rgba(255, 77, 79, 1.2)"
              className="item-card-badge"
            >
              <Card
                className="item-card"
                title={product.title}
                key={index}
                loading={loading}
                cover={
                  loading ? (
                    <Skeleton.Image
                      active
                      style={{ width: 300, height: 150 }}
                    />
                  ) : (
                    <img
                      className="item-card-image"
                      src={product.thumbnail}
                      alt="image product"
                    />
                  )
                }
                actions={[
                  <Rate allowHalf disabled value={product.rating} />,
                  <AddToCart item={product} />,
                ]}
              >
                <Meta
                  style={{
                    padding: "10px 5px",
                    width: 250,
                    height: 110,
                  }}
                  title={
                    <span>
                      Price: ${product.price}{" "}
                      <Typography.Text type="danger">
                        <del>
                          $
                          {(
                            product.price +
                            (product.price * product.discountPercentage) / 100
                          ).toFixed(2)}
                        </del>
                      </Typography.Text>
                    </span>
                  }
                  description={
                    loading ? (
                      <Skeleton
                        active
                        style={{
                          position: "relative",
                          top: "60px",
                          width: "297px",
                          height: "150px",
                          marginBottom: "60px",
                        }}
                      />
                    ) : (
                      <Typography.Paragraph
                        ellipsis={{ rows: 2, expandable: true, symbol: "more" }}
                      >
                        {product.description}
                      </Typography.Paragraph>
                    )
                  }
                />
              </Card>
            </Badge.Ribbon>
          );
        }}
        dataSource={getSortItems()}
      ></List>
    </div>
  );
};

export default Products;

const AddToCart: React.FC<{ item: Product }> = ({ item }) => {
  console.log("item", item);
  const [loading, setLoading] = useState<boolean>(false);
  const handleClickAddToCart = () => {
    setLoading(true);
    addToCart(item.id).then((res) => {
      message.success(`${item.title} has been added to cart`);
      console.log("res call api", res);
      setLoading(false);
    });
  };
  return (
    <Button
      onClick={() => handleClickAddToCart()}
      type="link"
      loading={loading}
    >
      Add to cart
    </Button>
  );
};
