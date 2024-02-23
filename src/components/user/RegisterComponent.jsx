'use client';
import React, { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { IoLogoGoogle } from 'react-icons/io';
import { useRouter } from 'next/navigation';
import WhiteLogoComponent from '../logos/WhiteLogoComponent';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const RegisterFormComponent = ({ cookie }) => {
  const [notification, setNotification] = useState('');
  const { executeRecaptcha } = useGoogleReCaptcha();
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.replace('/');
    }
  }, [session, router]);

  const [honeypot, setHoneypot] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (username === '') {
      toast.error('Por favor complete el nombre de usuario para registrarse.');
      return;
    }

    if (email === '') {
      toast.error('Por favor agregue su correo electrónico para registrarse.');
      return;
    }

    if (!isValidEmail(email)) {
      toast.error('Utilice un correo electrónico válido.');
      return;
    }

    if (!password || password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (!executeRecaptcha) {
      console.log('Execute recaptcha not available yet');
      setNotification(
        'Execute recaptcha not available yet likely meaning key not recaptcha key not set'
      );
      return;
    }
    executeRecaptcha('enquiryFormSubmit').then(async (gReCaptchaToken) => {
      try {
        const res = await fetch(`/api/register`, {
          headers: {
            'Content-Type': 'application/json',
            Cookie: cookie,
          },
          method: 'POST',
          body: JSON.stringify({
            username,
            email,
            password,
            recaptcha: gReCaptchaToken,
            honeypot,
          }),
        });

        if (res?.data?.success === true) {
          setNotification(`Success with score: ${res?.data?.score}`);
        } else {
          setNotification(`Failure with score: ${res?.data?.score}`);
        }

        if (res.status === 400) {
          toast.warning('This email is already in use');
          setError('This email is already in use');
        }
        if (res.ok) {
          toast.success('Successfully registered the user');
          setTimeout(() => {
            signIn();
          }, 200);
          return;
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  return (
    <main className="flex min-h-screen maxsm:min-h-[70vh] flex-col items-center justify-center">
      <div className="w-fit flex flex-col items-center bg-slate-200 maxsm:p-8 p-20 shadow-xl text-center mx-auto">
        {/* <LogoComponent /> */}
        <WhiteLogoComponent className={'ml-5 mt-4 w-[200px] maxsm:w-[120px]'} />
        <h2 className="my-4 text-black font-bold font-EB_Garamond text-2xl">
          Registro Nuevo
        </h2>
        <button
          className="w-full hover:text-black hover:bg-slate-300 duration-500 ease-in-out text-white bg-black mb-4 flex flex-row gap-4
            items-center py-4 justify-center"
          onClick={() => {
            signIn('google');
          }}
        >
          <IoLogoGoogle />
          Continua con Google
        </button>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col justify-center items-center text-center gap-y-4 text-black"
        >
          <input
            className="text-center py-2"
            type="text"
            placeholder="Nombre y Apellidos..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            className="text-center py-2"
            type="email"
            placeholder="Correo Electrónico..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            hidden
            className="text-center py-2"
            type="text"
            placeholder="Honeypot"
            onChange={(e) => setHoneypot(e.target.value)}
          />
          <input
            className="text-center py-2"
            type="password"
            placeholder="Contraseña..."
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className={`bg-black text-white py-2 px-8 text-xl hover:bg-slate-200 hover:text-black ease-in-out duration-700 rounded-md`}
          >
            Registrarme
          </button>
        </form>
        <button className={`text-black mt-3`} onClick={() => signIn()}>
          ¿Ya tienes cuenta? <br /> Iniciar Session
        </button>
      </div>
    </main>
  );
};

export default RegisterFormComponent;
