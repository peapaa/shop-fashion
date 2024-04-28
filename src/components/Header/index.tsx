import { HomeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import {
  Badge,
  Button,
  Drawer,
  Form,
  Input,
  InputNumber,
  Menu,
  MenuProps,
  Table,
  Typography,
  message,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCart } from "../../Api";
interface Products {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedPrice: number;
  thumbnail: string;
}

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: "group"
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

const items: MenuProps["items"] = [
  getItem(<HomeOutlined />, ""),
  getItem("Men", "men", null, [
    getItem("Men's Shirts", "mens-shirts", null),
    getItem("Men's Shoes", "mens-shoes", null),
    getItem("Men's Watches", "mens-watches", null),
  ]),
  getItem("Women", "women", null, [
    getItem("Women's Dresses", "womens-dresses", null),
    getItem("Women's Shoes", "womens-shoes", null),
    getItem("Women's Watches", "womens-watches", null),
    getItem("Women's Bags", "womens-bags", null),
    getItem("Women's Jewellery", "womens-jewellery", null),
  ]),
  getItem("Fragrances", "fragrances"),
];
const AppHeader: React.FC = () => {
  const navigate = useNavigate();
  const handleClickMenu = (item: MenuItem) => {
    if (item) {
      navigate(`/${item.key}`);
    }
  };
  return (
    <div className="app-header">
      <Menu items={items} mode="horizontal" onClick={handleClickMenu} />
      <Typography.Title style={{ margin: 0 }}>Shopee</Typography.Title>
      <AppCart />
    </div>
  );
};

export default AppHeader;

const AppCart: React.FC = () => {
  const [form] = Form.useForm();

  const [cartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);
  const [checkoutDrawerOpen, setCheckoutDrawerOpen] = useState<boolean>(false);
  const [cartItem, setCartItem] = useState<Products[]>([]);
  console.log("cartItem", cartItem);
  console.log("cartDrawerOpen", cartDrawerOpen);

  type FieldType = {
    fullname?: string;
    email?: string;
    address?: string;
  };

  useEffect(() => {
    getCart().then((res) => setCartItem(res.products));
  }, []);

  const onConfirmOder = (value: any) => {
    console.log(value);
    setCartDrawerOpen(false);
    setCheckoutDrawerOpen(false);
    form.resetFields();
    message.success("you are ordered successfully");
  };
  return (
    <div>
      <span onClick={() => setCartDrawerOpen(!cartDrawerOpen)}>
        <Badge count={2}>
          <ShoppingCartOutlined
            style={{ fontSize: 30, marginRight: 8, cursor: "pointer" }}
          />
        </Badge>
      </span>

      <Drawer
        open={cartDrawerOpen}
        onClose={() => setCartDrawerOpen(false)}
        title="Your Cart"
        width={500}
      >
        <Table
          pagination={false}
          columns={[
            {
              title: "Title",
              dataIndex: "title",
            },
            {
              title: "Price",
              dataIndex: "price",
              render: (value) => {
                return <span>${value}</span>;
              },
            },
            {
              title: "Quantity",
              dataIndex: "quantity",
              render: (value, record) => {
                return (
                  <InputNumber
                    min={0}
                    max={10}
                    defaultValue={value}
                    onChange={(value) => {
                      setCartItem((prev) =>
                        prev.map((cart) => {
                          if (cart.id === record.id) {
                            cart.total = cart.price * value;
                          }
                          return cart;
                        })
                      );
                    }}
                  />
                );
              },
            },
            {
              title: "Total",
              dataIndex: "total",
              render: (value) => {
                return <span>${value}</span>;
              },
            },
          ]}
          dataSource={cartItem}
          summary={(data) => {
            const total = data.reduce((total, item) => total + item.total, 0);
            return <span>Total: {total}</span>;
          }}
        ></Table>
        <Button type="primary" onClick={() => setCheckoutDrawerOpen(true)}>
          Check your cart
        </Button>
        <Drawer
          open={checkoutDrawerOpen}
          onClose={() => setCheckoutDrawerOpen(false)}
          title="Cofirm Order"
        >
          <Form
            name="basic"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ maxWidth: 600 }}
            initialValues={{ remember: false, username: "Thiendola" }}
            onFinish={onConfirmOder}
            autoComplete="off"
            form={form}
          >
            <Form.Item<FieldType>
              label="FullName"
              name="fullname"
              rules={[
                { required: true, message: "Please input your username!" },
                {
                  min: 4,
                  message: "Username must be at least 4 characters long!",
                },
                {
                  max: 12,
                  message: "Username cannot be longer than 12 characters!",
                },
                {
                  pattern: /^[A-Z][a-zA-Z0-9]*$/,
                  message:
                    "Username must start with an uppercase letter and contain only letters and numbers!",
                },
                {
                  pattern: /[0-9]/,
                  message: "Username must contain at least one number!",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>

            <Form.Item<FieldType>
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input your Email!",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>

            <Form.Item<FieldType>
              label="Address"
              name="address"
              rules={[
                {
                  required: true,
                  message: "Please input your Address!",
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Drawer>
      </Drawer>
    </div>
  );
};
