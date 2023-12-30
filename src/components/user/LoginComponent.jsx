'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { IoLogoGoogle } from 'react-icons/io';
import WhiteLogoComponent from '../logos/WhiteLogoComponent';

const LoginComponent = () => {
  const session = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (session?.status === 'authenticated') {
      router.replace('/');
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password === '' || email === '') {
      toast.error('Fill all fields!');
      return;
    }

    if (password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return;
    }
    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl: '/carrito',
      });

      if (res?.error == null) {
        router.push('/carrito');
      } else {
        toast.error('Error occured while loggin');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center ">
      <div className="w-fit bg-blue-600  p-20 shadow-xl text-center text-black">
        <WhiteLogoComponent className={'ml-5 mt-4 w-[200px] sm:w-[120px]'} />
        <h2 className="flex justify-center py-5 text-white">Iniciar Session</h2>

        <button
          className="w-full hover:text-black hover:bg-slate-300 duration-500 ease-in-out text-white bg-black mb-4 flex flex-row gap-4
     items-center py-4 justify-center"
          onClick={() => {
            signIn('google');
          }}
        >
          <IoLogoGoogle />
          Iniciar con Google
        </button>
        <div className="text-center text-slate-200 my-4 ">- O -</div>
        <form
          className="flex flex-col justify-center items-center text-center gap-y-4"
          onSubmit={handleSubmit}
        >
          <input
            className="text-center py-2"
            type="email"
            placeholder="Correo Electrónico..."
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="text-center py-2"
            type="password"
            placeholder="contraseña..."
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="bg-black text-white w-[150px] p-2 rounded-sm mt-5">
            Iniciar
          </button>
        </form>
        <Link
          className="text-xs text-center mt-3 text-white"
          href={`/registro`}
        >
          ¿Aun no tienes cuenta? <br /> Registrar aquí.
        </Link>
      </div>
    </main>
  );
};

export default LoginComponent;
