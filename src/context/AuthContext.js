'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { NextResponse } from 'next/server';
import { createContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const [updated, setUpdated] = useState(null);

  const router = useRouter();

  const registerUser = async ({ name, email, password }) => {
    try {
      const { data } = await fetch(`/api/register`, {
        name,
        email,
        password,
      });

      if (data?.email) {
        router.push('/login');
      }

      if (data === 'User already exists') {
        setError(data);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const loadUser = async () => {
    try {
      setLoading(true);
      const url = '/api/auth/session?update';
      // Make the get request
      const data = await axios.get(url);
      //const data = await response.json();

      // Use the `data` as needed
      if (data?.data?.user) {
        setUser(data?.data?.user);
        router.refresh();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const clearErrors = () => {
    setError(null);
  };

  const updateProfile = async (formData) => {
    // Make the fetch request
    try {
      setLoading(true);
      const url = '/api/profile';
      const headers = {
        'X-Mysession-Key': JSON.stringify(user),
      };

      // Assuming `formData` is an instance of FormData
      const options = {
        method: 'POST',
        headers,
        body: formData,
      };
      const response = await fetch(url, options);
      const data = await response.json();

      // Use the `data` as needed

      if (data) {
        loadUser();
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteProfile = async (id) => {
    try {
      const { data } = await axios.delete(`/api/client?${id}`, {
        headers: {
          'X-Mysession-Key': JSON.stringify(user),
        },
      });
      if (data) {
        router.push('/admin/clientes');
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const createProduct = async (formData) => {
    // Make the fetch request
    try {
      // Create a new FormData object
      const formDataObject = new FormData();
      // Append each form field to the FormData object
      for (const [key, value] of formData.entries()) {
        formDataObject.append(key, value);
      }

      // Construct the payload in the desired format
      const payload = {
        title: formDataObject.get('title'),
        description: formDataObject.get('description'),
        category: formDataObject.get('category'),
        cost: formDataObject.get('cost'),
        price: parseInt(formDataObject.get('price'), 10), // Convert to integer
        sizes: formDataObject.get('sizes'),
        images: formDataObject.get('images'),
        brand: formDataObject.get('brand'),
        gender: formDataObject.get('gender'),
        salePrice: formDataObject.get('salePrice'),
        salePriceEndDate: formDataObject.get('salePriceEndDate'),
        stock: formDataObject.get('stock'),
        createdAt: formDataObject.get('createdAt'),
      };
      const response = await axios.post(
        `/api/product`,
        {
          payload,
        },
        {
          headers: {
            'X-Mysession-Key': JSON.stringify(user),
          },
        }
      );
      if (response) {
        setLoading(false);
        return NextResponse.json(
          {
            message: 'Se creo el Producto Exitosamente ',
          },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateProduct = async (formData) => {
    // Make the fetch request
    try {
      // Create a new FormData object
      const formDataObject = new FormData();
      // Append each form field to the FormData object
      for (const [key, value] of formData.entries()) {
        formDataObject.append(key, value);
      }

      // Construct the payload in the desired format
      const payload = {
        title: formDataObject.get('title'),
        description: formDataObject.get('description'),
        category: formDataObject.get('category'),
        cost: formDataObject.get('cost'),
        price: parseInt(formDataObject.get('price'), 10), // Convert to integer
        sizes: formDataObject.get('sizes'),
        images: formDataObject.get('images'),
        brand: formDataObject.get('brand'),
        gender: formDataObject.get('gender'),
        salePrice: formDataObject.get('salePrice'),
        salePriceEndDate: formDataObject.get('salePriceEndDate'),
        stock: formDataObject.get('stock'),
        _id: formDataObject.get('_id'),
      };

      const response = await axios.put(
        `/api/product`,
        {
          payload,
        },
        {
          headers: {
            'X-Mysession-Key': JSON.stringify(user),
          },
        }
      );
      if (response) {
        setLoading(false);
        return NextResponse.json(
          {
            message: 'Se creo el Producto Exitosamente ',
          },
          { status: 200 }
        );
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const { data } = await axios.delete(`/api/product?${id}`, {
        headers: {
          'X-Mysession-Key': JSON.stringify(user),
        },
      });
      if (data) {
        router.push('/admin/productos');
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const addNewAddress = async (address) => {
    try {
      const { data } = await axios.post(
        `/api/address`,
        {
          address,
        },
        {
          headers: {
            'X-Mysession-Key': JSON.stringify(user),
          },
        }
      );

      if (data) {
        router.push('/perfil');
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const updateAddress = async (address) => {
    try {
      const { data } = await axios.put(
        `/api/address`,
        {
          address,
        },
        {
          headers: {
            'X-Mysession-Key': JSON.stringify(user),
          },
        }
      );

      if (data) {
        setUpdated(true);
        router.replace(`/perfil/direccion/${id}`);
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const deleteAddress = async (id) => {
    try {
      const { data } = await axios.delete(`/api/address?${id}`, {
        headers: {
          'X-Mysession-Key': JSON.stringify(user),
        },
      });
      if (data) {
        router.push('/admin/productos');
      }
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const getAllAddresses = async () => {
    try {
      const { data } = await axios.get(`/api/addresses`);

      return data.addresses;
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };
  const getOneAddress = async (id) => {
    try {
      const { data } = await fetch(`/api/address`, {
        headers: {
          'X-Mysession-Key': JSON.stringify(user),
          'X-address-id': id,
        },
      });
      return data;
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`/api/products`);
      return data.products;
    } catch (error) {
      setError(error?.response?.data?.message);
    }
  };

  const saveOnCheckOut = async ({ amount, tax, totalAmountCalc, items }) => {};

  return (
    <AuthContext.Provider
      value={{
        user,
        error,
        loading,
        updated,
        setUser,
        registerUser,
        updateProfile,
        clearErrors,
        addNewAddress,
        getOneAddress,
        updateAddress,
        setUpdated,
        deleteAddress,
        deleteProfile,
        createProduct,
        updateProduct,
        getAllProducts,
        getAllAddresses,
        deleteProduct,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
