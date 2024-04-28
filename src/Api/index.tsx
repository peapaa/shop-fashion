import axios from "axios";
export const getAllProducts = async () => {
  try {
    const response = await axios.get("https://dummyjson.com/products");
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getProductsByCategory = async (category: any) => {
  try {
    const response = await axios.get(
      `https://dummyjson.com/products/category/${category}`
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};

export const getCart = async () => {
  try {
    const response = await axios.get("https://dummyjson.com/carts/1");
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
export const addToCart = async (id: number) => {
  const postData = {
    id: id,
    quantity: 1,
  };
  try {
    const response = await axios.post(
      "https://dummyjson.com/carts/add",
      postData
    );
    return response.data;
  } catch (error) {
    console.error("Error:", error);
  }
};
