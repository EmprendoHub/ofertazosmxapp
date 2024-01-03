'use client';
import AttachEmailIcon from '@mui/icons-material/AttachEmail';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import KeyIcon from '@mui/icons-material/Key';

import VerifiedIcon from '@mui/icons-material/Verified';

import { useState } from 'react';
import { Alert, Badge, Checkbox } from '@mui/material';
import UploadOne from './upload/uploadOne';
import Feedback from './feedback';
import Result from './result';

export default function TabOne() {
  // Form States
  const [senderName, setSenderName] = useState('');
  const [emailService, setEmailService] = useState('gmail');
  const [emailAddress, setEmailAddress] = useState('');
  const [passwordService, setPasswordService] = useState('');
  const [greeting, setGreeting] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [bestRegards, setBestRegards] = useState('');
  const [contactsList, setContactsList] = useState([]);

  // MUI states
  const [checked, setChecked] = useState(false);
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <span className="space-y-5 w-full">
      {/* Email Service */}
      <span className="w-full">
        <span className="ml-3">
          Servicio de Correo Electrónico
          <AttachEmailIcon className="text-green-600 ml-3" />
        </span>
        <select
          className="py-2 px-3 border rounded-lg"
          onChange={(event) => setEmailService(event.target.value)}
        >
          <option defaultValue value="gmail">
            Gmail
          </option>
          {/* <option value="mail.ru">Mail.ru</option>
          <option value="yahoo">Yahoo</option> */}
        </select>
      </span>

      {/* Email Address to be used */}
      <span className="flex">
        <input
          type="text"
          placeholder="Correo Electrónico e.g ejemplo@gmail.com"
          className="login_input w-full"
          onChange={(event) => setEmailAddress(event.target.value)}
        />

        <AlternateEmailIcon className="my-auto ml-3 text-blue-400" />
      </span>

      {/* Email Password */}
      <span className="flex">
        <input
          type="text"
          placeholder="Contraseña de Email App "
          className="login_input w-full"
          onChange={(event) => setPasswordService(event.target.value)}
        />
        <KeyIcon className="my-auto ml-3 text-red-400" />
      </span>

      {/* Sender Name */}
      <div>
        <Badge
          badgeContent="optional"
          color="info"
          className="w-full"
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <input
            type="text"
            className="login_subject w-full"
            placeholder="Nombre del Remitente"
            onChange={(e) => setSenderName(e.target.value)}
          ></input>
        </Badge>
      </div>

      {/* Subject */}
      <div>
        <input
          type="text"
          className="login_subject"
          placeholder="Agrega el Asunto"
          onChange={(e) => setSubject(e.target.value)}
        ></input>

        <span>
          <Checkbox
            checked={checked}
            onChange={handleChange}
            inputProps={{ 'aria-label': 'controlled' }}
          />
          <span className="ml-1 my-2">
            Usar el nombre del Remitente como el Asunto
          </span>
        </span>
      </div>

      {/* Greeting */}
      <input
        type="text"
        className="login_subject"
        placeholder="Saludo"
        onChange={(e) => setGreeting(e.target.value)}
      ></input>

      {/* Title */}
      <input
        type="text"
        className="login_subject"
        placeholder="Titulo"
        onChange={(e) => setTitle(e.target.value)}
      ></input>

      {/* Message */}
      <textarea
        id="Body"
        rows="6"
        onChange={(e) => setBody(e.target.value)}
        className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        placeholder="Mensaje"
      ></textarea>

      {/* Closing */}
      <input
        type="text"
        className="login_subject"
        placeholder="Fin e.g Mejores Deseos"
        onChange={(e) => setBestRegards(e.target.value)}
      ></input>

      <UploadOne />

      <div>
        <button className="py-3 px-5 m-5 text-sm font-medium text-center text-black rounded-lg bg-primary-700 sm:w-fit  focus:ring-4 focus:outline-none focus:ring-primary-300">
          Enviar Mensaje
        </button>
      </div>
    </span>
  );
}
