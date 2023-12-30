'use client';
import React from 'react';
import { useState } from 'react';
import emailjs from '@emailjs/browser';

const EmailForm = ({ templateID, serviceID, publicKEY }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [activeButton, setActiveButton] = useState(false);
  //email js service Ids
  const templateId = templateID;
  const serviceId = serviceID;
  const publicKey = publicKEY;

  const handleSubmit = (e) => {
    e.preventDefault();
    setActiveButton(true);

    // create a new object that contains dynamic params
    const templateParams = {
      from_name: name,
      from_email: email,
      to_name: 'Shopout MX',
      message: message,
    };

    //send email using email js
    emailjs
      .send(serviceId, templateId, templateParams, publicKey)
      .then((response) => {
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        console.error('Error sending email:', error);
      });
  };

  return (
    <div className="relative flex fle-col py-7  pr-7 m-auto w-full rounded-xl z-10">
      <form onSubmit={handleSubmit} className="flex flex-col w-full gap-y-4">
        <input
          type="text"
          placeholder={'Tu nombre aquí'}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border-black border-b font-playfair-display"
        />
        <input
          type="email"
          placeholder={'Correo Electrónico'}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border-black border-b font-playfair-display"
        />
        <textarea
          cols="30"
          rows="5"
          placeholder="|"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="p-2 border-black border-b font-playfair-display"
        ></textarea>
        <button type="submit" className="mt-5" disabled={activeButton}>
          <p className="bg-black  text-white py-3">{'Enviar Mensaje'}</p>
        </button>
      </form>
    </div>
  );
};

export default EmailForm;
