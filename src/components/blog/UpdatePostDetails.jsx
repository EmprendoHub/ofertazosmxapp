'use client';
import React, { useRef, useState, useContext } from 'react';
import { Bounce, toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { IoIosStar } from 'react-icons/io';
import Image from 'next/image';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import { calculatePercentage, cstDateTimeClient } from '@/backend/helpers';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import { FaImage, FaExchangeAlt } from 'react-icons/fa';
import MultiselectComponent from '../forms/MultiselectComponent';
import AuthContext from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const UpdatePostDetails = ({ post }) => {
  const imageRef = useRef(null);
  const router = useRouter();

  const available_categories = [
    'Moda',
    'Estilo',
    'Tendencias',
    'Esenciales',
    'Salud',
  ];

  const { updatePost } = useContext(AuthContext);
  const [inputImageFields, setInputImageFields] = useState(post?.images);

  const [title, setTitle] = useState(post?.title);
  const [summary, setSummary] = useState(post?.summary);
  const [content, setContent] = useState(post?.content);
  const [category, setCategory] = useState(post?.category);
  const [updatedAt, setUpdatedAt] = useState(cstDateTimeClient());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title === '') {
      toast.error(
        'Por favor complete el nombre del publicación para continuar.'
      );
      return;
    }

    if (content === '') {
      toast.error('Por favor agregue contenido para continuar.');
      return;
    }
    if (summary === '') {
      toast.error(
        'Por favor complete el resumen de la Publicación para continuar.'
      );
      return;
    }
    if (category === '') {
      toast.error(
        'Por favor agrega la categoría del publicación para continuar.'
      );
      return;
    }

    if (inputImageFields > 0) {
      inputImageFields.map((field) => {
        if (field.i_file === '') {
          toast.error(
            'Por favor agrega imágenes a la publicación para continuar.'
          );
          return;
        }
      });
    } else {
      if (inputImageFields[0].i_file === '') {
        toast.error(
          'Por favor agrega imágenes a la publicación para continuar.'
        );
        return;
      }
    }

    try {
      const formData = new FormData();
      formData.set('title', title);
      formData.set('content', content);
      formData.set('category', category);
      formData.set('summary', summary);
      // Convert arrays to JSON strings
      const imagesJson = JSON.stringify(inputImageFields);

      // Append JSON strings to FormData
      formData.set('images', imagesJson);
      formData.set('updatedAt', updatedAt);
      formData.set('_id', post?._id);

      try {
        const res = await updatePost(formData);
        if (res.ok) {
          toast.success('La publicación se actualizo exitosamente');
          router.refresh();
          return;
        }
      } catch (error) {
        toast.error(
          'Error actualizando Publicación. Por favor Intenta de nuevo.'
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryChange = async (e) => {
    setCategory(e);
    if (e === 'Calzado' && gender == 'Damas') {
      setSizeSelection(available_sizes_shoes_woman);
    } else {
      setSizeSelection(available_sizes_shoes_men);
    }

    if (
      e === 'Prendas' ||
      e === 'Bolsas' ||
      e === 'Accesorios' ||
      e === 'Belleza' ||
      e === 'Joyeria'
    ) {
      setSizeSelection(available_sizes_prendas);
    }
  };

  const handleGenderChange = async (e) => {
    setGender(e);
    if (category === 'Calzado' && e == 'Damas') {
      setSizeSelection(available_sizes_shoes_woman);
    } else {
      setSizeSelection(available_sizes_shoes_men);
    }

    if (
      category === 'Prendas' ||
      category === 'Bolsas' ||
      category === 'Accesorios' ||
      category === 'Belleza' ||
      category === 'Joyeria'
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
        i_file: '',
        i_filePreview: '/images/shopout_clothing_placeholder.webp',
      },
    ]);
  };

  const handleImageInputChange = (index, fieldName, event) => {
    const newInputImageFields = [...inputImageFields];
    if (fieldName === 'i_file') {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          newInputImageFields[index]['url'] = reader.result;
          setInputImageFields(newInputImageFields); // Update state after setting filePreview
        }
      };
      if (event.target.files?.[0]) {
        reader.readAsDataURL(event.target.files[0]);
        newInputImageFields[index][fieldName] = event.target.files[0];
        newInputImageFields[index]['i_file'] = event.target.files[0].name;
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
    <div className="container-class maxsm:py-8">
      <main className="bg-gray-100 flex  flex-col items-center justify-between">
        <div className="w-full mx-auto wrapper-class gap-5 bg-slate-100 text-black bg-opacity-80 rounded-lg">
          <div className="flex flex-row maxsm:flex-col-reverse items-start justify-start gap-x-5  maxmd:py-4 maxmd:px-5 maxsm:px-0">
            <div className="image-class w-1/2 maxsm:w-full flex flex-col items-end justify-end">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="p-2  max-h-[300px] relative"
              >
                <Image
                  ref={imageRef}
                  src={
                    post?.images[0]
                      ? post?.images[0].url
                      : '/images/shopout_clothing_placeholder.webp'
                  }
                  alt="post image"
                  className="rounded-lg object-cover ease-in-out duration-500"
                  width={800}
                  height={800}
                />
              </motion.div>
            </div>
            <div className="content-class w-1/2 maxsm:w-full h-full ">
              <div className="flex flex-col items-start justify-start pt-10 maxsm:pt-2 gap-y-10 w-[90%] maxmd:w-full p-5 pb-10">
                <motion.div
                  initial={{ x: 50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <p className="text-7xl font-semibold font-EB_Garamond">
                    {post?.title}
                  </p>

                  <div>
                    <p className="text-xs font-normal text-gray-600">
                      {post?.summary}
                    </p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6 }}
                  className=" font-bodyFont content-class"
                >
                  {post?.content ? post?.content : ''}
                </motion.div>
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7 }}
                  className="text-sm text-lightText flex flex-col"
                >
                  <span>
                    SKU: <span className=" font-bodyFont">{post?._id}</span>
                  </span>
                  <span>
                    Categoría:{' '}
                    <span className="t font-bodyFont">{post?.category}</span>
                  </span>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <main className="w-full pl-4">
        <section className=" p-6 ">
          <h1 className="text-xl maxmd:text-3xl font-semibold text-black mb-8">
            Actualizar Publicación
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-row flex-wrap items-start gap-5 justify-start "
          >
            <div className="gap-y-5 flex-col flex px-2 w-1/2">
              <div className="mb-4">
                <label className="block mb-1"> Titulo del Publicación</label>
                <input
                  type="text"
                  className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                  placeholder="Nombre de Publicación"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  name="title"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-1"> Contenido</label>
                <textarea
                  rows="2"
                  className="appearance-none border  bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                  placeholder="Contenido del Publicación"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  name="content"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block mb-1"> Resumen del Publicación</label>
                <input
                  type="text"
                  className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                  placeholder="Resumen del Publicación"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  name="summary"
                />
              </div>
            </div>

            <div className="flex-col flex justify-start px-2 gap-y-5">
              <div className="mb-4">
                <label className="block mb-1"> Categoría </label>
                <div className="relative">
                  <select
                    className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                    name="category"
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
                  <i className="absolute inset-y-0 right-0 p-2 text-gray-400">
                    <svg
                      width="22"
                      height="22"
                      className="fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M7 10l5 5 5-5H7z"></path>
                    </svg>
                  </i>
                </div>
              </div>
            </div>

            <div className=" gap-x-2 mt-5 ">
              <button
                type="button"
                className=" bg-fuchsia-900 text-white rounded-md p-4 mb-5 flex flex-row items-center"
                onClick={handleAddImageField}
              >
                Agregar Imagen <FaImage className="text-white ml-1" />
              </button>
              {inputImageFields.map((inputImageField, index) => (
                <div
                  key={index}
                  className="mb-4 p-4 border-gray-200 border shadow-md"
                >
                  <div className="flex flex-row items-center gap-4 mb-4">
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => handleImageDeleteField(index)}
                        className="text-red-500"
                      >
                        X
                      </button>
                    )}

                    <p className="font-bold flex flex-row items-center gap-1">
                      Imagen <FaImage /> #{index + 1}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="mb-4 px-5">
                      <div className="items-center justify-center">
                        <div className="w-40 h-40 relative space-x-3 my-2 ">
                          <FaExchangeAlt className="absolute z-20 text-3xl top-[50%] left-[50%] text-slate-200" />
                          <Image
                            className="rounded-md object-cover"
                            src={inputImageField?.url}
                            fill={true}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            alt="imagen de bono"
                          />
                          {/* overlay */}
                          <div className="min-h-[100%] absolute z-[1] min-w-[100%] top-0 left-0 bg-black bg-opacity-30" />

                          <input
                            className="form-control block w-40 overflow-hidden  text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none  cursor-pointer z-20 min-h-full top-0 absolute opacity-0"
                            type="file"
                            id="i_file"
                            name="i_file"
                            onChange={(e) =>
                              handleImageInputChange(index, 'i_file', e)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="my-2 px-4 py-2 text-center inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 w-full"
            >
              Actualizar Publicación
            </button>
          </form>
        </section>
      </main>
    </div>
  );
};

export default UpdatePostDetails;
