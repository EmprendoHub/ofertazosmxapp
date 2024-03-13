'use client';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import MultiselectComponent from '../forms/MultiselectComponent';
import { cstDateTimeClient } from '@/backend/helpers';
import { useDropzone } from 'react-dropzone';
import { FaWindowClose, FaArrowUp } from 'react-icons/fa';
import { addProduct } from '@/app/_actions';
import { useRouter } from 'next/navigation';
import {
  set_colors,
  sizes_prendas,
  sizes_shoes_men,
  sizes_shoes_woman,
  product_categories,
  genders,
  blog_categories,
} from '@/backend/data/productData';
import MultiselectColor from '../forms/MultiselectColor';
import MultiselectTagComponent from '../forms/MultiselectTagComponent';

const NewProduct = () => {
  const router = useRouter();
  const formRef = useRef();
  const [files, setFiles] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [title, setTitle] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Moda');
  const [sizes, setSizes] = useState([]);
  const [tags, setTags] = useState([]);
  const [colors, setColors] = useState([]);
  const [gender, setGender] = useState('Damas');
  const [featured, setFeatured] = useState('No');
  const [stock, setStock] = useState(1);
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);
  const [createdAt, setCreatedAt] = useState(
    cstDateTimeClient().toLocaleString()
  );
  const [salePrice, setSalePrice] = useState(0);
  const [salePriceEndDate, setSalePriceEndDate] = useState(
    cstDateTimeClient().toLocaleString()
  );
  const [sizeSelection, setSizeSelection] = useState(sizes_prendas);
  const [tagSelection, setTagSelection] = useState(blog_categories);
  const [colorSelection, setColorSelection] = useState(set_colors);
  const [validationError, setValidationError] = useState(null);

  // functions
  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    if (acceptedFiles?.length) {
      setFiles((previousFiles) => [
        // If allowing multiple files
        ...previousFiles,
        ...acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        ),
      ]);
    }

    if (rejectedFiles?.length) {
      setRejected((previousFiles) => [...previousFiles, ...rejectedFiles]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': [],
    },
    maxSize: 1024 * 1000,
    maxFiles: 3,
    onDrop,
  });

  useEffect(() => {
    // Revoke the data uris to avoid memory leaks
    return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const removeFile = (name) => {
    setFiles((files) => files.filter((file) => file.name !== name));
  };

  const removeAll = () => {
    setFiles([]);
    setRejected([]);
  };

  const removeRejected = (name) => {
    setRejected((files) => files.filter(({ file }) => file.name !== name));
  };

  async function action() {
    const file = files[0];
    if (!file) {
      const noFileError = { images: { _errors: ['Se requiere una imagen '] } };
      setValidationError(noFileError);
      return;
    }
    if (!title) {
      const noTitleError = { title: { _errors: ['Se requiere un titulo '] } };
      setValidationError(noTitleError);
      return;
    }
    if (!description) {
      const noDescriptionError = {
        description: { _errors: ['Se requiere descripción '] },
      };
      setValidationError(noDescriptionError);
      return;
    }
    if (!brand) {
      const noBrandError = {
        brand: { _errors: ['Se requiere un Marca '] },
      };
      setValidationError(noBrandError);
      return;
    }
    if (!price) {
      const noPriceError = {
        precio: { _errors: ['Se requiere un precio '] },
      };
      setValidationError(noPriceError);
      return;
    }
    if (!cost) {
      const noCostError = {
        cost: { _errors: ['Se requiere un costo de producto '] },
      };
      setValidationError(noCostError);
      return;
    }
    if (!sizes) {
      const noSizesError = {
        sizes: { _errors: ['Se requiere una talla o tamaño '] },
      };
      setValidationError(noSizesError);
      return;
    }
    if (!tags) {
      const noTagsError = {
        tags: { _errors: ['Se requiere mínimo una etiqueta '] },
      };
      setValidationError(noTagsError);
      return;
    }
    if (!colors) {
      const noColorsError = {
        colors: { _errors: ['Se requiere un color '] },
      };
      setValidationError(noColorsError);
      return;
    }

    const imageFormData = new FormData();
    files.forEach((file) => {
      imageFormData.append('images', file);
    });
    const endpoint = `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}/api/minio`;
    const data = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Type: 'products',
      },
      body: imageFormData,
    }).then((res) => res.json());

    let images = [];
    await data.images.forEach((element) => {
      images.push(element);
    });

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('stock', stock);
    formData.append('price', price);
    formData.append('cost', cost);
    formData.append('featured', featured);
    formData.append('brand', brand);
    formData.append('gender', gender);
    formData.append('images', JSON.stringify(images));
    formData.append('sizes', JSON.stringify(sizes));
    formData.append('tags', JSON.stringify(tags));
    formData.append('colors', JSON.stringify(colors));
    formData.append('salePrice', salePrice);
    formData.append('salePriceEndDate', salePriceEndDate);
    formData.append('createdAt', createdAt);
    // write to database using server actions

    const result = await addProduct(formData);
    if (result?.error) {
      setValidationError(result.error);
    } else {
      setValidationError(null);
      //reset the form
      formRef.current.reset();
      router.push('/admin/productos');
    }
  }
  const handleCategoryChange = async (e) => {
    setCategory(e);
    if (e === 'Calzado' && gender == 'Damas') {
      setSizeSelection(sizes_shoes_woman);
    } else {
      setSizeSelection(sizes_shoes_men);
    }

    if (e === 'Prendas' || e === 'Bolsas' || e === 'Accesorios') {
      setSizeSelection(sizes_prendas);
    }
  };

  const handleAddSizeField = (selectedOption) => {
    setSizes(selectedOption);
  };

  const handleAddTagField = (option) => {
    setTags(option);
  };

  const handleAddColorField = (option) => {
    setColors(option);
  };

  function onChangeDate(date) {
    setSalePriceEndDate(date);
  }

  const handleGenderChange = async (e) => {
    setGender(e);
    if (category === 'Calzado' && e == 'Damas') {
      setSizeSelection(sizes_shoes_woman);
    } else {
      setSizeSelection(sizes_shoes_men);
    }

    if (
      category === 'Prendas' ||
      category === 'Bolsas' ||
      category === 'Accesorios'
    ) {
      setSizeSelection(sizes_prendas);
    }
  };

  return (
    <main className="w-full p-4 maxsm:p-2 bg-slate-200">
      <section className="w-full ">
        <h1 className="text-2xl font-semibold text-black mb-8 font-EB_Garamond">
          Crear Nuevo Producto Simple
        </h1>

        <form
          action={action}
          ref={formRef}
          className="flex flex-col items-start gap-5 justify-start w-full"
        >
          <div className="flex flex-row  items-center gap-5 justify-between w-full">
            <div className="gap-y-5 flex-col flex px-2 w-full">
              <div className="mb-4">
                <label className="block mb-1  font-EB_Garamond">
                  {' '}
                  Titulo del Producto
                </label>
                <input
                  type="text"
                  className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                  placeholder="Nombre de Producto"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  name="title"
                />
                {validationError?.title && (
                  <p className="text-sm text-red-400">
                    {validationError.title._errors.join(', ')}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1  font-EB_Garamond">
                  {' '}
                  Description Corta
                </label>
                <textarea
                  rows="2"
                  className="appearance-none border  bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                  placeholder="Descripción del Producto"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  name="description"
                ></textarea>
                {validationError?.description && (
                  <p className="text-sm text-red-400">
                    {validationError.description._errors.join(', ')}
                  </p>
                )}
              </div>
              <div className="mb-4">
                <label className="block mb-1  font-EB_Garamond">
                  {' '}
                  Marca del Producto
                </label>
                <input
                  type="text"
                  className="appearance-none border bg-gray-100 rounded-md py-2 px-3 border-gray-300 focus:outline-none focus:border-gray-400 w-full"
                  placeholder="Marca del Producto"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  name="brand"
                />
                {validationError?.brand && (
                  <p className="text-sm text-red-400">
                    {validationError.brand._errors.join(', ')}
                  </p>
                )}
              </div>
              <div className="flex flex-row maxsm:flex-col items-center gap-5">
                <div className="mb-4 w-full">
                  <label className="block mb-1  font-EB_Garamond">
                    {' '}
                    Precio de Venta{' '}
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        name="price"
                      />
                      {validationError?.price && (
                        <p className="text-sm text-red-400">
                          {validationError.price._errors.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond"> Costo </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3focus:outline-none focus:border-gray-400 w-full"
                        placeholder="0.00"
                        min="1"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        name="cost"
                      />
                      {validationError?.cost && (
                        <p className="text-sm text-red-400">
                          {validationError.cost._errors.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond">
                    {' '}
                    Existencias{' '}
                  </label>
                  <div className="relative">
                    <div className="col-span-2">
                      <input
                        type="number"
                        className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                        placeholder="1"
                        min="1"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        name="stock"
                      />
                      {validationError?.stock && (
                        <p className="text-sm text-red-400">
                          {validationError.stock._errors.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond">
                    {' '}
                    Destacado{' '}
                  </label>
                  <div className="relative">
                    <select
                      className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                      name="featured"
                      onChange={(e) => setFeatured(e.target.value)}
                      value={featured}
                    >
                      {['No', 'Si'].map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                    {validationError?.featured && (
                      <p className="text-sm text-red-400">
                        {validationError.featured._errors.join(', ')}
                      </p>
                    )}
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
              <div className="flex flex-row maxsm:flex-col items-center gap-5">
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond">
                    {' '}
                    Género{' '}
                  </label>
                  <div className="relative">
                    <select
                      className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                      name="gender"
                      onChange={(e) => handleGenderChange(e.target.value)}
                    >
                      {genders?.map((gender) => (
                        <option key={gender.es} value={gender.es}>
                          {gender.es}
                        </option>
                      ))}
                    </select>
                    {validationError?.gender && (
                      <p className="text-sm text-red-400">
                        {validationError.gender._errors.join(', ')}
                      </p>
                    )}
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
                <div className="mb-4 w-full">
                  <label className="block mb-1 font-EB_Garamond">
                    {' '}
                    Categoría{' '}
                  </label>
                  <div className="relative">
                    <select
                      className="block appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3 focus:outline-none focus:border-gray-400 w-full"
                      name="category"
                      onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                      {product_categories.map((category) => (
                        <option key={category.es} value={category.es}>
                          {category.es}
                        </option>
                      ))}
                    </select>
                    {validationError?.category && (
                      <p className="text-sm text-red-400">
                        {validationError.category._errors.join(', ')}
                      </p>
                    )}
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
            </div>

            <div className="w-full flex-col flex justify-start px-2 gap-y-5">
              <div className="mb-4 w-full">
                <label className="block mb-1 font-EB_Garamond"> Talla </label>
                <div className="relative">
                  <MultiselectComponent
                    options={sizeSelection}
                    handleAddSizeField={handleAddSizeField}
                  />
                  {validationError?.sizes && (
                    <p className="text-sm text-red-400">
                      {validationError.sizes._errors.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4 w-full">
                <label className="block mb-1 font-EB_Garamond">
                  {' '}
                  Etiquetas{' '}
                </label>
                <div className="relative">
                  <MultiselectTagComponent
                    options={tagSelection}
                    handleAddTagField={handleAddTagField}
                  />
                  {validationError?.tags && (
                    <p className="text-sm text-red-400">
                      {validationError.tags._errors.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4 w-full">
                <label className="block mb-1 font-EB_Garamond"> Color </label>
                <div className="relative">
                  <MultiselectColor
                    options={colorSelection}
                    handleAddColorField={handleAddColorField}
                  />
                  {validationError?.colors && (
                    <p className="text-sm text-red-400">
                      {validationError.colors._errors.join(', ')}
                    </p>
                  )}
                </div>
              </div>
              <div className="mb-4 w-full">
                <label className="block mb-1 font-EB_Garamond">
                  {' '}
                  Precio de Oferta{' '}
                </label>
                <div className="relative">
                  <div className="col-span-2">
                    <input
                      type="number"
                      className="appearance-none border border-gray-300 bg-gray-100 rounded-md py-2 px-3focus:outline-none focus:border-gray-400 w-full"
                      placeholder="0.00"
                      min="0"
                      value={salePrice}
                      onChange={(e) => setSalePrice(e.target.value)}
                      name="salePrice"
                    />
                    {validationError?.salePrice && (
                      <p className="text-sm text-red-400">
                        {validationError.salePrice._errors.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mb-4 w-full">
                <label className="block mb-1 font-EB_Garamond">
                  {' '}
                  Finalización de Oferta{' '}
                </label>
                <div className="flex flex-row items-center gap-x-3"></div>
                <DateTimePicker
                  onChange={onChangeDate}
                  value={salePriceEndDate}
                  locale={'es-MX'}
                  minDate={cstDateTimeClient()}
                />
              </div>
            </div>
          </div>
          {/* Drop images */}
          <div className="w-full">
            <div
              {...getRootProps({})}
              className="h-[300px] bg-slate-200 cursor-pointer"
            >
              <input {...getInputProps({ name: 'file' })} />

              <div className="flex flex-col items-center justify-center gap-4 min-h-44">
                <FaArrowUp className="h-5 w-5 fill-current" />
                {isDragActive ? (
                  <p>Suelta los archivos aquí...</p>
                ) : (
                  <p>
                    Arrastre y suelte archivos aquí, o haga clic para
                    seleccionar archivos
                  </p>
                )}
                {validationError?.images && (
                  <p className="text-sm text-red-400">
                    {validationError.images._errors.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* Preview */}
            <section className="mt-10">
              <div className="flex gap-4">
                <h2 className="title text-3xl font-semibold">Vista previa</h2>
                <button
                  type="button"
                  onClick={removeAll}
                  className="mt-1 rounded-md border border-rose-400 px-3 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white"
                >
                  Eliminar todos los archivos
                </button>
              </div>
              {/* Accepted files */}
              <h3 className="title mt-10 border-b pb-3 text-lg font-semibold text-stone-600">
                Archivos aceptados
              </h3>
              <ul className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                {files.map((file) => (
                  <li
                    key={file.name}
                    className="relative h-32 rounded-md shadow-lg"
                  >
                    <Image
                      src={file.preview}
                      alt={file.name}
                      width={100}
                      height={100}
                      onLoad={() => {
                        URL.revokeObjectURL(file.preview);
                      }}
                      className="h-full w-full rounded-md object-contain"
                    />
                    <button
                      type="button"
                      className="absolute -right-3 -top-3 flex h-7 w-7 items-center justify-center rounded-full border border-rose-400 bg-rose-400 transition-colors hover:bg-white"
                      onClick={() => removeFile(file.name)}
                    >
                      <FaWindowClose className="h-5 w-5 fill-white transition-colors hover:fill-rose-400" />
                    </button>
                    <p className="mt-2 text-[12px] font-medium text-stone-500">
                      {file.name}
                    </p>
                  </li>
                ))}
              </ul>

              {/* Rejected Files */}
              <h3 className="title mt-24 border-b pb-3 text-lg font-semibold text-stone-600">
                Archivos rechazados
              </h3>
              <ul className="mt-6 flex flex-col">
                {rejected.map(({ file, errors }) => (
                  <li
                    key={file.name}
                    className="flex items-start justify-between"
                  >
                    <div>
                      <p className="mt-2 text-sm font-medium text-stone-500">
                        {file.name}
                      </p>
                      <ul className="text-[12px] text-red-400">
                        {errors.map((error) => (
                          <li key={error.code}>{error.message}</li>
                        ))}
                      </ul>
                    </div>
                    <button
                      type="button"
                      className="mt-1 rounded-md border border-rose-400 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-stone-500 transition-colors hover:bg-rose-400 hover:text-white"
                      onClick={() => removeRejected(file.name)}
                    >
                      remove
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </div>
          <button
            type="submit"
            className="my-2 px-4 py-2 text-center inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 w-full"
          >
            Guardar Producto
          </button>
        </form>
      </section>
    </main>
  );
};

export default NewProduct;
