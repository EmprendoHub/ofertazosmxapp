"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import AuthContext from "@/context/AuthContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateProfileWithFormData = () => {
  const { user, error, clearErrors, loading, updateProfile } =
    useContext(AuthContext);
  if (user) {
    //console.log(user);
  }

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  useEffect(() => {
    if (user) {
      const userAvatar = user?.avatar
        ? user.avatar.url
        : "/images/avatar_placeholder.jpg";
      setName(user?.name);
      setEmail(user?.email);
      setAvatarPreview(userAvatar);
    }

    if (error) {
      toast.error(error);
      clearErrors;
    }
  }, [user, error]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("image", avatar);

    try {
      const res = await updateProfile(formData);
    } catch (error) {
      toast.error("Error updating profile. Please try again.");
    }
  };

  const onImageChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
      }
    };
    reader.readAsDataURL(e);

    setAvatar(e);
  };

  return (
    <>
      <div className='mt-1 mb-20 p-4 md:p-7 mx-auto rounded bg-white max-w-[580px]'>
        <form onSubmit={submitHandler}>
          <h2 className='mb-5 text-2xl font-semibold'>Update Profile</h2>

          <div className='mb-4'>
            <label className='block mb-1'> Full Name </label>
            <input
              className='appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full'
              type='text'
              placeholder='Type your name'
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className='mb-4'>
            <label className='block mb-1'> Email </label>
            <input
              className='appearance-none border border-gray-200 bg-gray-100 rounded-md py-2 px-3 hover:border-gray-400 focus:outline-none focus:border-gray-400 w-full'
              type='text'
              placeholder='Type your email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className='mb-4'>
            <label className='block mb-1'> Avatar </label>
            <div className='mb-4 flex flex-col md:flex-row'>
              <div className='flex items-center mb-4 space-x-3 mt-4 cursor-pointer md:w-1/5 lg:w-1/4'>
                <Image
                  className='w-14 h-14 rounded-full'
                  src={avatarPreview}
                  width={50}
                  height={50}
                  alt='logo'
                />
              </div>
              <div className='md:w-2/3 lg:w-80'>
                <input
                  className='form-control block w-full px-2 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none mt-6'
                  type='file'
                  id='file'
                  onChange={(e) => onImageChange(e.target.files?.[0])}
                />
              </div>
            </div>
          </div>

          <button
            type='submit'
            className='my-2 px-4 py-2 text-center w-full inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700'
            disabled={loading ? true : false}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateProfileWithFormData;
