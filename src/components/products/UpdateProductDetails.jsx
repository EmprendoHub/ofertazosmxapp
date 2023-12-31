"use client";
import React, { useRef, useState, useContext } from "react";
import { Bounce, toast } from "react-toastify";
import { motion } from "framer-motion";
import { IoIosStar } from "react-icons/io";
import Image from "next/image";
import FormattedPrice from "@/backend/helpers/FormattedPrice";
import { calculatePercentage } from "@/backend/helpers";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { FaImage, FaExchangeAlt } from "react-icons/fa";
import MultiselectComponent from "../forms/MultiselectComponent";
import AuthContext from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const UpdateProductDetails = ({ product }) => {
  const imageRef = useRef(null);
  const router = useRouter();

  const starRating = (props) => {
    if (props) {
      let stars = props;
      if (stars == 0 || stars == 1 || stars == 1.5) {
        stars = 1;
      } else if (stars == 2 || stars == 2.5) {
        stars = 2;
      } else if (stars == 3 || stars == 3.5) {
        stars = 3;
      } else if (stars == 4 || stars == 4.5) {
        stars = 4;
      } else if (stars == 5) {
        stars = 5;
      }
    }

    const starArray = Array.from({ length: props }, (_, index) => (
      <span key={index} className='text-yellow-500'>
        <IoIosStar />
      </span>
    ));
    return <>{starArray}</>;
  };

  const available_categories = ["Bolsas", "Calzado", "Accesorios", "Prendas"];
  const available_genders = ["Damas", "Caballeros"];
  const available_colores = [
    "Negro",
    "Rojo",
    "Cafe",
    "Beige",
    "Blanco",
    "Azul",
    "Verde",
    "Amarillo",
    "Multicolor",
  ];
  const available_sizes_prendas = [
    { value: "CH", label: "CH" },
    { value: "M", label: "M" },
    { value: "G", label: "G" },
    { value: "XG", label: "XG" },
    { value: "XXG", label: "XXG" },
  ];
  const available_sizes_shoes_men = [
    { value: "26", label: "26" },
    { value: "26.5", label: "26.5" },
    { value: "27", label: "27" },
    { value: "27.5", label: "27.5" },
    { value: "28", label: "28" },
    { value: "28.5", label: "28.5" },
    { value: "29", label: "29" },
    { value: "29.5", label: "29.5" },
  ];

  const available_sizes_shoes_woman = [
    { value: "22", label: "22" },
    { value: "22.5", label: "22.5" },
    { value: "23", label: "23" },
    { value: "23.5", label: "23.5" },
    { value: "24", label: "24" },
    { value: "24.5", label: "24.5" },
    { value: "25", label: "25" },
    { value: "25.5", label: "25.5" },
    { value: "26", label: "26" },
    { value: "26.5", label: "26.5" },
    { value: "27", label: "27" },
    { value: "27.5", label: "27.5" },
    { value: "28", label: "28" },
    { value: "28.5", label: "28.5" },
  ];

  const { updateProduct } = useContext(AuthContext);
  const [inputImageFields, setInputImageFields] = useState(product?.images);

  const [title, setTitle] = useState(product?.title);
  const [brand, setBrand] = useState(product?.brand);
  const [description, setDescription] = useState(product?.description);
  const [category, setCategory] = useState(product?.category);
  const [sizes, setSizes] = useState(product?.sizes);
  const [gender, setGender] = useState(product?.gender);
  const [stock, setStock] = useState(product?.stock);
  const [cost, setCost] = useState(product?.cost);
  const [price, setPrice] = useState(product?.price);
  const [salePrice, setSalePrice] = useState(product?.sale_price);
  const [salePriceEndDate, setSalePriceEndDate] = useState(
    product?.sale_price_end_date
  );

  const [sizeSelection, setSizeSelection] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title === "") {
      toast.error("Por favor complete el nombre del producto para continuar.");
      return;
    }
    if (brand === "") {
      toast.error("Por favor complete la marca del producto para continuar.");
      return;
    }
    if (gender === "") {
      toast.error("Por favor agrega el genero del producto para continuar.");
      return;
    }
    if (description === "") {
      toast.error("Por favor agregue una description para continuar.");
      return;
    }
    if (sizes === "") {
      toast.error("Por favor agrega los tamaños del producto para continuar.");
      return;
    }

    if (category === "") {
      toast.error("Por favor agrega la categoría del producto para continuar.");
      return;
    }
    if (price <= 0) {
      toast.error("Por favor agrega el precio del producto para continuar.");
      return;
    }
    if (stock <= 0) {
      toast.error("Por favor agrega el costo por producto para continuar.");
      return;
    }
    if (cost <= 0) {
      toast.error("Por favor agrega el costo por producto para continuar.");
      return;
    }

    if (inputImageFields > 0) {
      inputImageFields.map((field) => {
        if (field.i_color === "") {
          toast.error("Por favor agrega nombre al bono(s) para continuar.");
          return;
        }

        if (field.i_file === "") {
          toast.error("Por favor agrega imágenes al bono(s) para continuar.");
          return;
        }
      });
    } else {
      if (inputImageFields[0].i_color === "") {
        toast.error("Por favor agrega nombre al bono(s) para continuar.");
        return;
      }

      if (inputImageFields[0].i_file === "") {
        toast.error("Por favor agrega imágenes al bono(s) para continuar.");
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.set("title", title);
      formData.set("description", description);
      formData.set("stock", stock);
      formData.set("category", category);
      formData.set("price", price);

      formData.set("brand", brand);
      formData.set("gender", gender);
      // Convert arrays to JSON strings
      const imagesJson = JSON.stringify(inputImageFields);
      const sizesJson = JSON.stringify(sizes);

      // Append JSON strings to FormData
      formData.set("cost", cost);
      formData.set("sizes", sizesJson);
      formData.set("images", imagesJson);
      formData.set("salePrice", salePrice);
      formData.set("salePriceEndDate", salePriceEndDate);
      formData.set("_id", product?._id);

      try {
        const res = await updateProduct(formData);
        if (res.ok) {
          toast.success("El producto se actualizo exitosamente");
          router.refresh();
          return;
        }
      } catch (error) {
        toast.error("Error actualizando Producto. Por favor Intenta de nuevo.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryChange = async (e) => {
    setCategory(e);
    if (e === "Calzado" && gender == "Damas") {
      setSizeSelection(available_sizes_shoes_woman);
    } else {
      setSizeSelection(available_sizes_shoes_men);
    }

    if (e === "Prendas" || e === "Bolsas" || e === "Accesorios") {
      setSizeSelection(available_sizes_prendas);
    }
  };

  const handleGenderChange = async (e) => {
    setGender(e);
    if (category === "Calzado" && e == "Damas") {
      setSizeSelection(available_sizes_shoes_woman);
    } else {
      setSizeSelection(available_sizes_shoes_men);
    }

    if (
      category === "Prendas" ||
      category === "Bolsas" ||
      category === "Accesorios"
    ) {
      setSizeSelection(available_sizes_prendas);
    }
  };

  function onChangeDate(date) {
    setSalePriceEndDate(date);
  }

  const handleAddSizeField = (selectedOption) => {
    setSizes(selectedOption);
  };

  const handleAddImageField = () => {
    setInputImageFields([
      ...inputImageFields,
      {
        i_color: "",
        i_file: "",
        i_filePreview: "/images/shopout_clothing_placeholder.webp",
      },
    ]);
  };

  const handleImageInputChange = (index, fieldName, event) => {
    const newInputImageFields = [...inputImageFields];
    if (fieldName === "i_file") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          newInputImageFields[index]["url"] = reader.result;
          setInputImageFields(newInputImageFields); // Update state after setting filePreview
        }
      };
      if (event.target.files?.[0]) {
        reader.readAsDataURL(event.target.files[0]);
        newInputImageFields[index][fieldName] = event.target.files[0];
        newInputImageFields[index]["i_file"] = event.target.files[0].name;
      }
    } else {
      newInputImageFields[index][fieldName] = event.target.value;
      setInputImageFields(newInputImageFields); // Update state for other fields
    }
  };

  const handleImageDeleteField = (index) => {
    const newInputFields = [...inputImageFields];
    newInputFields.splice(index, 1);
    setInputImageFields(newInputFields);
  };

  return (
    <div className='container-class maxsm:py-8'>
      <main className='bg-gray-100 flex  flex-col items-center justify-between'>
        <div className='w-full mx-auto wrapper-class gap-5 bg-slate-100 text-black bg-opacity-80 p-4 rounded-lg'>
          <div className='flex flex-row maxsm:flex-col-reverse items-start justify-start gap-x-5  maxmd:py-4 maxmd:px-5 maxsm:px-0'>
            <div className='image-class w-1/2 maxsm:w-full flex flex-col items-end justify-end'>
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className='p-2  max-h-[300px] relative'
              >
                <Image
                  ref={imageRef}
                  src={
                    product?.images[0]
                      ? product?.images[0].url
                      : "/images/shopout_clothing_placeholder.webp"
                  }
                  alt='product image'
                  className='rounded-lg object-cover ease-in-out duration-500'
                  width={800}
                  height={800}
                />
              </motion.div>
            </div>
            <div className='description-class w-1/2 maxsm:w-full h-full '>
              <div className='flex flex-col items-start justify-start pt-10 maxsm:pt-2 gap-y-10 w-[90%] maxmd:w-full p-5 pb-10'>
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className='text-7xl font-semibold font-EB_Garamond'>
                    {product?.title}
                  </p>
                  <div className='text-xl font-semibold'>
                    <div className='stars flex items-center gap-x-1'>
                      {starRating(product?.rating)}
                      <span className='font-medium text-xl'>
                        {product?.rating}
                      </span>
                    </div>
                  </div>
                  {product?.sale_price ? (
                    <div className='flex flex-row items-center justify-between'>
                      <div className='border-[1px] border-yellow-600 w-fit py-1 px-4 rounded-full text-xs text-black'>
                        <p>
                          {calculatePercentage(
                            product?.price,
                            product?.sale_price
                          )}
                          % menos
                        </p>
                      </div>
                      <div className='flex items-center gap-x-2'>
                        <p className='line-through text-sm text-gray-600 font-bodyFont'>
                          <FormattedPrice amount={product?.price} />
                        </p>
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <div>
                    <p className='font-semibold text-4xl text-black font-bodyFont'>
                      {product?.sale_price > 0 ? (
                        <FormattedPrice amount={product?.sale_price} />
                      ) : product?.price > 0 ? (
                        <FormattedPrice amount={product?.price} />
                      ) : (
                        ""
                      )}
                    </p>
                    <p className='text-xs font-normal text-gray-600'>
                      Apártalo con solo 30%:
                    </p>
                    <p className='text-xl text-black font-bodyFont'>
                      <FormattedPrice amount={product?.price * 0.3} />
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className=' font-bodyFont description-class'
                >
                  {product?.description ? product?.description : ""}
                </motion.div>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className='text-sm text-lightText flex flex-col'
                >
                  <span>
                    SKU: <span className=' font-bodyFont'>{product?._id}</span>
                  </span>
                  <span>
                    Existencias:{" "}
                    <span className=' font-bodyFont'>{product?.stock}</span>
                  </span>
                  <span>
                    Categoría:{" "}
                    <span className='t font-bodyFont'>{product?.category}</span>
                  </span>
                  <span>
                    Marca:{" "}
                    <span className='t font-bodyFont'>{product?.brand}</span>
                  </span>
                  <span>
                    Colores:{" "}
                    {product?.colors.map((color, index) => (
                      <span key={index} className='t font-bodyFont'>
                        {color?.value},
                      </span>
                    ))}
                  </span>
                  <span>
                    Tallas:{" "}
                    {product?.sizes.map((size, index) => (
                      <span key={index} className='t font-bodyFont'>
                        {size?.value},
                      </span>
                    ))}
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <main className='w-full pl-4'>
        <section className=' p-6 '>
          <h1 className='text-xl maxmd:text-3xl font-semibold text-black mb-8'>
            Actualizar Producto
          </h1>

          <form
            onSubmit={handleSubmit}
            className='flex flex-row flex-wrap items-start gap-5 justify-start '
          >
            <div className='gap-y-5 flex-col flex px-2 w-1/2'>
              <div className='mb-4'>
                <label className='block mb-1'> Titulo del Producto</label>
                <input
                  type='text'
                  className='appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Nombre de Producto'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  name='title'
                />
              </div>
              <div className='mb-4'>
                <label className='block mb-1'> Description Corta</label>
                <textarea
                  rows='2'
                  className='appearance-none border  bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Descripción del Producto'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name='description'
                ></textarea>
              </div>
              <div className='mb-4'>
                <label className='block mb-1'> Marca del Producto</label>
                <input
                  type='text'
                  className='appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full'
                  placeholder='Marca del Producto'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  name='brand'
                />
              </div>
              <div className='flex flex-row items-center gap-5'>
                <div className='mb-4'>
                  <label className='block mb-1'> Precio de Venta </label>
                  <div className='relative'>
                    <div className='col-span-2'>
                      <input
                        type='number'
                        className='appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3focus:outline-none focus:border-gray-400 w-full'
                        placeholder='0.00'
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        name='price'
                      />
                    </div>
                  </div>
                </div>
                <div className='mb-4'>
                  <label className='block mb-1'> Costo </label>
                  <div className='relative'>
                    <div className='col-span-2'>
                      <input
                        type='number'
                        className='appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3focus:outline-none focus:border-gray-400 w-full'
                        placeholder='0.00'
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        name='cost'
                      />
                    </div>
                  </div>
                </div>
                <div className='mb-4'>
                  <label className='block mb-1'> Existencias </label>
                  <div className='relative'>
                    <div className='col-span-2'>
                      <input
                        type='number'
                        className='appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full'
                        placeholder='1'
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        name='stock'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='flex-col flex justify-start px-2 gap-y-5'>
              <div className='mb-4'>
                <label className='block mb-1'> Género </label>
                <div className='relative'>
                  <select
                    className='block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full'
                    name='gender'
                    value={gender}
                    onChange={(e) => handleGenderChange(e.target.value)}
                  >
                    {available_genders.map((gender) => (
                      <option key={gender} value={gender}>
                        {gender}
                      </option>
                    ))}
                  </select>
                  <i className='absolute inset-y-0 right-0 p-2 text-gray-400'>
                    <svg
                      width='22'
                      height='22'
                      className='fill-current'
                      viewBox='0 0 20 20'
                    >
                      <path d='M7 10l5 5 5-5H7z'></path>
                    </svg>
                  </i>
                </div>
              </div>
              <div className='mb-4'>
                <label className='block mb-1'> Categoría </label>
                <div className='relative'>
                  <select
                    className='block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full'
                    name='category'
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {available_categories.map((category) => {
                      return (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      );
                    })}
                  </select>
                  <i className='absolute inset-y-0 right-0 p-2 text-gray-400'>
                    <svg
                      width='22'
                      height='22'
                      className='fill-current'
                      viewBox='0 0 20 20'
                    >
                      <path d='M7 10l5 5 5-5H7z'></path>
                    </svg>
                  </i>
                </div>
              </div>
              <div className='mb-4'>
                <label className='block mb-1'> Tallas </label>
                <div className='relative'>
                  <MultiselectComponent
                    values={sizes}
                    options={sizeSelection}
                    handleAddSizeField={handleAddSizeField}
                  />
                </div>
              </div>
              <div className='mb-4'>
                <label className='block mb-1'> Precio de Oferta </label>
                <div className='relative'>
                  <div className='col-span-2'>
                    <input
                      type='number'
                      className='appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3focus:outline-none focus:border-gray-400 w-full'
                      placeholder='0.00'
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      name='salePrice'
                    />
                  </div>
                </div>
              </div>
              <div className='mb-4'>
                <label className='block mb-1'> Finalización de Oferta </label>
                <div className='  cursor-pointer'>
                  <DateTimePicker
                    onChange={onChangeDate}
                    value={salePriceEndDate}
                    locale={"es-MX"}
                    minDate={new Date()}
                  />
                </div>
              </div>
            </div>

            <div className=' gap-x-2 mt-5 '>
              <button
                type='button'
                className=' bg-fuchsia-900 text-white rounded-md p-4 mb-5 flex flex-row items-center'
                onClick={handleAddImageField}
              >
                Agregar Imagen <FaImage className='text-white ml-1' />
              </button>
              {inputImageFields.map((inputImageField, index) => (
                <div
                  key={index}
                  className='mb-4 p-4 border-gray-200 border shadow-md'
                >
                  <div className='flex flex-row items-center gap-4 mb-4'>
                    {index > 0 && (
                      <button
                        type='button'
                        onClick={() => handleImageDeleteField(index)}
                        className='text-red-500'
                      >
                        X
                      </button>
                    )}

                    <p className='font-bold flex flex-row items-center gap-1'>
                      Imagen <FaImage /> #{index + 1}
                    </p>
                  </div>
                  <div className='flex flex-col items-center'>
                    <div className='mb-4 px-5'>
                      <div className='items-center justify-center'>
                        <div className='w-40 h-40 relative space-x-3 my-2 '>
                          <FaExchangeAlt className='absolute z-20 text-3xl top-[50%] left-[50%] text-slate-200' />
                          <Image
                            className='rounded-md object-cover'
                            src={inputImageField?.url}
                            fill={true}
                            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                            alt='imagen de bono'
                          />
                          {/* overlay */}
                          <div className='min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30' />

                          <input
                            className='form-control block w-40 overflow-hidden  text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  cursor-pointer z-20 min-h-full top-0 absolute opacity-0'
                            type='file'
                            id='i_file'
                            name='i_file'
                            onChange={(e) =>
                              handleImageInputChange(index, "i_file", e)
                            }
                          />
                        </div>
                        <span>Color Actual: {inputImageField?.color}</span>
                      </div>
                      <label className='block mb-1'> Color </label>
                      <div className='relative'>
                        <select
                          className='block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full cursor-pointer'
                          name='i_color-${index + 1}'
                          onChange={(e) =>
                            handleImageInputChange(index, "i_color", e)
                          }
                        >
                          {available_colores.map((color, index) => (
                            <option key={index} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                        <i className='absolute inset-y-0 right-0 p-2 text-gray-400'>
                          <svg
                            width='22'
                            height='22'
                            className='fill-current'
                            viewBox='0 0 20 20'
                          >
                            <path d='M7 10l5 5 5-5H7z'></path>
                          </svg>
                        </i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type='submit'
              className='my-2 px-4 py-2 text-center inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 w-full'
            >
              Actualizar Producto
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default UpdateProductDetails;
