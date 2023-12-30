import queryString from 'query-string';
import axios from 'axios';

export const getProducts = async (searchParams) => {
  const urlParams = {
    keyword: searchParams?.keyword,
    page: searchParams?.page,
    category: searchParams?.category,
    'rating[gte]': searchParams?.rating,
    'price[lte]': searchParams?.min,
    'price[gte]': searchParams?.max,
  };

  const searchQuery = queryString.stringify(urlParams);
  const { data } = await axios.get(
    `${process.env.NEXTAUTH_URL}/api/servicios?${searchQuery}`
  );
  if (!{ data }) {
    throw new Error('Failed to fetch products');
  }

  return data;
};

export const getOneProduct = async (_id) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/servicio?${_id}`;
  try {
    //const res = await fetch(URL)
    const res = await fetch(URL);

    const data = await res.json();
    return data.product;
  } catch (error) {
    console.log(error);
  }
};

export const getAllLocalProducts = async () => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/localservicios`);
  const data = await res.json();
  if (!{ data }) {
    throw new Error('Failed to fetch local products');
  }

  return data;
};

export const getAllJsonlProducts = async () => {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/localservicios`);
  const data = await res.json();
  if (!{ data }) {
    throw new Error('Failed to fetch local products');
  }

  return data;
};

export const getOneLocalProduct = async (_id) => {
  const URL = `${process.env.NEXTAUTH_URL}/api/localservicio?${_id}`;
  try {
    const res = await fetch(URL);
    const data = await res.json();
    return data.product;
  } catch (error) {
    console.log(error);
  }
};

export const getTrendingProducts = async () => {
  const res = await fetch(
    'https://fakestoreapiserver.reactbd.com/smarttrending'
  );
  if (!res.ok) {
    throw new Error('Faild to fetch products');
  }
  return res.json();
};

export const calculatePercentage = (oldPrice, price) => {
  return !!parseFloat(price) && !!parseFloat(oldPrice)
    ? (100 - (oldPrice / price) * 100).toFixed(0)
    : 0;
};

export const getSingleProudct = async (_id) => {
  const products = await getProducts();

  const item = products.find((product) => product._id === _id);
  return item;
};

export const getPriceQueryParams = (queryParams, key, value) => {
  const hasValueInParam = queryParams.has(key);

  if (value && hasValueInParam) {
    queryParams.set(key, value);
  } else if (value) {
    queryParams.append(key, value);
  } else if (hasValueInParam) {
    queryParams.delete(key);
  }
  return queryParams;
};
