import { Alert } from '@mui/material';
import React from 'react';

export default function Template() {
  return (
    <div className="border shadow-lg p-5 rounded-lg w-full">
      <Alert severity="info" variant="filled">
        <span className="maxsm:text-[10px]">
          Este correo se enviara a todos los clientes seleccionados revisa el
          listado en la parte inferior.
        </span>
      </Alert>
    </div>
  );
}
