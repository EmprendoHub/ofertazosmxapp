'use client';
import React, { useState, useEffect, useContext } from 'react';
import Image from 'next/image';
import AuthContext from '@/context/AuthContext';
import { toast } from 'react-toastify';
import { FaImage } from 'react-icons/fa';

const NewPostComponent = () => {
  const { createPost } = useContext(AuthContext);

  const [inputImageFields, setInputImageFields] = useState([
    {
      i_file: '',
      i_filePreview: '/images/shopout_clothing_placeholder.webp',
    },
  ]);

  const available_categories = ['Moda', 'Estilo', 'Tendencias'];

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Moda');
  const [createdAt, setCreatedAt] = useState(new Date());

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title === '') {
      toast.error(
        'Por favor complete el nombre de la Publicación para continuar.'
      );
      return;
    }
    if (summary === '') {
      toast.error(
        'Por favor complete el resumen de la Publicación para continuar.'
      );
      return;
    }
    if (content === '') {
      toast.error('Por favor agregue una content para continuar.');
      return;
    }

    if (category === '') {
      toast.error(
        'Por favor agrega la categoría de la Publicación para continuar.'
      );
      return;
    }

    if (inputImageFields > 0) {
      inputImageFields.map((field) => {
        if (field.i_file === '') {
          toast.error('Por favor agrega imágenes al bono(s) para continuar.');
          return;
        }
      });
    } else {
      if (inputImageFields[0].i_file === '') {
        toast.error('Por favor agrega imágenes al bono(s) para continuar.');
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
      formData.set('createdAt', createdAt);
      try {
        const res = await createPost(formData);
        if (res.ok) {
          toast.success('La Publicación se creo exitosamente');
          setTitle('');
          setSummary('');
          setContent('');
          setCategory('Moda');
          setInputImageFields([
            {
              i_file: '',
              i_filePreview: '/images/shopout_clothing_placeholder.webp',
            },
          ]);
          setCreatedAt(new Date());

          return;
        }
      } catch (error) {
        toast.error('Error creando Publicación. Por favor Intenta de nuevo.');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCategoryChange = async (e) => {
    setCategory(e);
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
          newInputImageFields[index]['i_filePreview'] = reader.result;
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
    <main className="w-full pl-4 maxsm:pl-0">
      <section className="w-full ">
        <h1 className="text-xl maxmd:text-3xl font-semibold text-black mb-8">
          Crear Nueva Publicación
        </h1>

        <form
          onSubmit={handleSubmit}
          className="flex flex-row flex-wrap items-start gap-5 justify-start "
        >
          <div className="gap-y-5 flex-col flex px-2 w-1/2 maxsm:w-full">
            <div className="mb-4">
              <label className="block mb-1"> Titulo de la Publicación</label>
              <input
                type="text"
                className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                placeholder="Titulo de la Publicación"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name="title"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1"> Contenido </label>
              <textarea
                rows="10"
                className="appearance-none border  bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                placeholder="Contenido de la Publicación"
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
                  onChange={(e) => handleCategoryChange(e.target.value)}
                >
                  {available_categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
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

          <div className=" gap-x-2 mt-5 w-full">
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
                  <div className="mb-4 px-5 maxsm:px-0">
                    <div className="items-center justify-center">
                      <div className="w-40 h-40 relative space-x-3 mt-1 ">
                        <Image
                          className="rounded-md object-cover"
                          src={inputImageField.i_filePreview}
                          fill={true}
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          alt="imagen de bono"
                        />
                      </div>
                      <input
                        className="form-control block w-40 overflow-hidden px-2 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none mt-6 cursor-pointer"
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
            ))}
          </div>

          <button
            type="submit"
            className="my-2 px-4 py-2 text-center inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 w-full"
          >
            Guardar Publicación
          </button>
        </form>
      </section>
    </main>
  );
};

export default NewPostComponent;
