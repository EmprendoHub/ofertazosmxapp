'use client';
import { resendEmail } from '@/app/_actions';
import React, { useRef, useState } from 'react';

const EmailVerification = () => {
  const formRef = useRef();
  const [validationError, setValidationError] = useState(null);

  async function action(data) {
    const result = await resendEmail(data);

    if (result?.error) {
      setValidationError(result.error);
    } else {
      setValidationError(null);
      //reset the form
      formRef.current.reset();
    }
  }
  return (
    <div>
      <form
        ref={formRef}
        action={action}
        className="flex flex-col items-center gap-5"
      >
        {validationError?.success && (
          <p className="text-base tracking-wider text-green-700">
            {validationError.success._errors.join(', ')}
          </p>
        )}
        <input
          type="email"
          name="email"
          className="p-3 text-xl text-center border border-slate-400"
          placeholder="Ingresa tu email"
        />
        {validationError?.email && (
          <p className="text-sm text-red-400">
            {validationError.email._errors.join(', ')}
          </p>
        )}

        <button className="bg-black py-4 px-5 text-white tracking-wider">
          Reenviar Correo
        </button>
      </form>
    </div>
  );
};

export default EmailVerification;
