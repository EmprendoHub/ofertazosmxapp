'use client';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaTrash,
  FaPencilAlt,
  FaStar,
  FaInstagramSquare,
} from 'react-icons/fa';
import FormattedPrice from '@/backend/helpers/FormattedPrice';
import Swal from 'sweetalert2';
import SearchProducts from '@/app/admin/productos/search';
import { changeProductAvailability, changeProductStatus } from '@/app/_actions';
import { TiCancel } from 'react-icons/ti';
import { FaShop } from 'react-icons/fa6';
import { MdOutlineWeb } from 'react-icons/md';
import { TbWorldWww } from 'react-icons/tb';

const AdminProducts = ({ products, filteredProductsCount, search }) => {
  const deleteHandler = (product_id) => {
    Swal.fire({
      title: 'Estas seguro(a)?',
      text: '¡No podrás revertir esta acción!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#000',
      confirmButtonText: '¡Sí, desactivar!',
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Desactivado!',
          text: 'Tu producto ha sido Desactivado.',
          icon: 'success',
        });
        changeProductStatus(product_id);
      }
    });
  };
  const deactivateHandler = (product_id, active) => {
    let title;
    let text;
    let confirmBtn;
    let successTitle;
    let successText;
    let icon;
    let confirmBtnColor;
    if (active === true) {
      icon = 'warning';
      title = 'Estas seguro(a)?';
      text =
        '¡Estas a punto de desactivar a este producto y quedara sin acceso!';
      confirmBtn = '¡Sí, desactivar producto!';
      confirmBtnColor = '#CE7E00';
      successTitle = 'Desactivar!';
      successText = 'El producto ha sido desactivado.';
    } else {
      icon = 'success';
      title = 'Estas seguro(a)?';
      text = '¡Estas a punto de reactivar a este producto!';
      confirmBtn = '¡Sí, reactivar producto!';
      confirmBtnColor = '#228B22';
      successTitle = 'Reactivado!';
      successText = 'El producto ha sido reactivado.';
    }
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: confirmBtnColor,
      cancelButtonColor: '#000',
      confirmButtonText: confirmBtn,
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: successTitle,
          text: successText,
          icon: icon,
        });
        changeProductStatus(product_id);
      }
    });
  };

  const deactivateOnlineHandler = (product_id, active) => {
    const location = 'Online';
    let title;
    let text;
    let confirmBtn;
    let successTitle;
    let successText;
    let icon;
    let confirmBtnColor;
    if (active === true) {
      icon = 'warning';
      title = 'Estas seguro(a)?';
      text =
        '¡Estas a punto de desactivar a este producto de la sucursal física y quedara sin acceso!';
      confirmBtn = '¡Sí, desactivar producto!';
      confirmBtnColor = '#CE7E00';
      successTitle = 'Desactivar!';
      successText = 'El producto ha sido desactivado.';
    } else {
      icon = 'success';
      title = 'Estas seguro(a)?';
      text =
        '¡Estas a punto de reactivar a este producto a la sucursal física!';
      confirmBtn = '¡Sí, reactivar producto!';
      confirmBtnColor = '#228B22';
      successTitle = 'Reactivado!';
      successText = 'El producto ha sido reactivado.';
    }
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: confirmBtnColor,
      cancelButtonColor: '#000',
      confirmButtonText: confirmBtn,
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: successTitle,
          text: successText,
          icon: icon,
        });
        changeProductAvailability(product_id, location);
      }
    });
  };

  const deactivateBranchHandler = (product_id, active) => {
    const location = 'Branch';
    let title;
    let text;
    let confirmBtn;
    let successTitle;
    let successText;
    let icon;
    let confirmBtnColor;
    if (active === true) {
      icon = 'warning';
      title = 'Estas seguro(a)?';
      text =
        '¡Estas a punto de desactivar a este producto de la sucursal física y quedara sin acceso!';
      confirmBtn = '¡Sí, desactivar producto!';
      confirmBtnColor = '#CE7E00';
      successTitle = 'Desactivar!';
      successText = 'El producto ha sido desactivado.';
    } else {
      icon = 'success';
      title = 'Estas seguro(a)?';
      text =
        '¡Estas a punto de reactivar a este producto a la sucursal física!';
      confirmBtn = '¡Sí, reactivar producto!';
      confirmBtnColor = '#228B22';
      successTitle = 'Reactivado!';
      successText = 'El producto ha sido reactivado.';
    }
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: confirmBtnColor,
      cancelButtonColor: '#000',
      confirmButtonText: confirmBtn,
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: successTitle,
          text: successText,
          icon: icon,
        });
        changeProductAvailability(product_id, location);
      }
    });
  };

  const deactivateInstagramHandler = (product_id, active) => {
    const location = 'Instagram';
    let title;
    let text;
    let confirmBtn;
    let successTitle;
    let successText;
    let icon;
    let confirmBtnColor;
    if (active === true) {
      icon = 'warning';
      title = 'Estas seguro(a)?';
      text = '¡Estas a punto de desactivar a este producto en Instagram!';
      confirmBtn = '¡Sí, desactivar producto!';
      confirmBtnColor = '#CE7E00';
      successTitle = 'Desactivar!';
      successText = 'El producto ha sido desactivado en Instagram.';
    } else {
      icon = 'success';
      title = 'Estas seguro(a)?';
      text = '¡Estas a punto de reactivar a este producto en Instagram!';
      confirmBtn = '¡Sí, reactivar producto en Instagram!';
      confirmBtnColor = '#228B22';
      successTitle = 'Reactivado!';
      successText = 'El producto ha sido reactivado en Instagram.';
    }
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonColor: confirmBtnColor,
      cancelButtonColor: '#000',
      confirmButtonText: confirmBtn,
      cancelButtonText: 'No, cancelar!',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: successTitle,
          text: successText,
          icon: icon,
        });
        changeProductAvailability(product_id, location);
      }
    });
  };

  return (
    <>
      <hr className="my-4 maxsm:my-1" />
      <div className="relative overflow-x-auto min-h-full shadow-md sm:rounded-lg">
        <div className=" flex flex-row  maxsm:items-start items-center justify-between">
          {' '}
          <h1 className="text-3xl maxsm:text-base my-5 maxsm:my-1 ml-4 maxsm:ml-0 font-bold font-EB_Garamond w-1/2">
            {`${filteredProductsCount} Productos `}
          </h1>
          <SearchProducts search={search} />
        </div>
        <table className="w-full text-sm  text-left h-full">
          <thead className="text-l text-gray-700 uppercase">
            <tr>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxmd:hidden">
                SKU
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxmd:hidden">
                slug
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 ">
                Img
              </th>

              <th scope="col" className="px-6 maxsm:px-0 py-3 ">
                Precio
              </th>
              <th scope="col" className="px-6 maxsm:px-0 py-3 maxsm:hidden">
                Titulo
              </th>
              <th scope="col" className="px-1 py-3 ">
                Exst.
              </th>
              <th scope="col" className="w-5 px-1 py-3 text-center">
                ...
              </th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => (
              <tr
                className={` ${
                  product?.active === true
                    ? 'bg-slate-100'
                    : 'bg-slate-200 text-slate-400'
                }`}
                key={index}
              >
                <td className="px-6 maxsm:px-2 py-2 maxmd:hidden">
                  <Link
                    key={index}
                    href={`/admin/productos/variacion/${product.slug}`}
                  >
                    {product._id.substring(0, 10)}...
                  </Link>
                </td>
                <td className="px-6 maxsm:px-2 py-2 maxmd:hidden">
                  <Link
                    key={index}
                    href={`/admin/productos/variacion/${product.slug}`}
                  >
                    {product.slug.substring(0, 10)}...
                  </Link>
                </td>
                <td className="px-6 maxsm:px-0 py-2 relative ">
                  <span className="relative flex items-center justify-center text-black w-12 h-12 maxsm:w-8 maxsm:h-8 shadow mt-2">
                    <Link href={`/admin/productos/variacion/${product.slug}`}>
                      <Image
                        src={product?.images[0].url}
                        alt="Title"
                        width={100}
                        height={100}
                        className="w-10 h-auto maxsm:w-10 "
                      />
                    </Link>
                    {product?.featured === 'Si' ? (
                      <span className="absolute -top-3 -right-1 z-20">
                        <FaStar className="text-xl text-amber-600" />
                      </span>
                    ) : (
                      ''
                    )}
                  </span>
                </td>
                <td className="px-6 maxsm:px-0 py-2 ">
                  <b>
                    <FormattedPrice amount={product?.variations[0].price} />
                  </b>
                </td>
                <td className={`px-6 maxsm:px-0 py-2 font-bold maxsm:hidden`}>
                  {product.title.substring(0, 15)}
                </td>
                <td className="px-1 py-2 ">{product.stock}</td>
                <td className="px-1 py-2 flex flex-row items-center gap-x-1">
                  <Link
                    href={`/admin/productos/variacion/${product.slug}`}
                    className="p-2 inline-block text-white hover:text-black bg-black shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
                  >
                    <FaPencilAlt className="maxsm:text-[10px]" />
                  </Link>
                  <button
                    onClick={() =>
                      deactivateOnlineHandler(product._id, product?.active)
                    }
                    className="p-2 inline-block text-white hover:text-black bg-slate-300 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
                  >
                    <TbWorldWww
                      className={` ${
                        product?.availability.online === true
                          ? 'text-green-800 maxsm:text-[10px]'
                          : 'text-slate-400 maxsm:text-[10px]'
                      }`}
                    />
                  </button>

                  <button
                    onClick={() =>
                      deactivateBranchHandler(product._id, product?.active)
                    }
                    className="p-2 inline-block text-white hover:text-black bg-slate-300 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
                  >
                    <FaShop
                      className={` ${
                        product?.availability.branch === true
                          ? 'text-green-800 maxsm:text-[10px]'
                          : 'text-slate-400 maxsm:text-[10px]'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() =>
                      deactivateInstagramHandler(product._id, product?.active)
                    }
                    className="p-2 inline-block text-white hover:text-black bg-slate-300 shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer "
                  >
                    <FaInstagramSquare
                      className={` ${
                        product?.availability.instagram === true
                          ? 'bg-gradient-to-tr from-amber-700 to-pink-600 maxsm:text-[10px]'
                          : 'text-slate-400 maxsm:text-[10px]'
                      }`}
                    />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <hr className="my-4" />
    </>
  );
};

export default AdminProducts;
