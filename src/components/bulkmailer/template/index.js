import { Alert } from '@mui/material';
import React from 'react';

export default function Template() {
  return (
    <div className="border shadow-lg p-5 rounded-lg w-full">
      <Alert severity="info" variant="filled">
        Este correo se enviara a todos los clientes seleccionados revisa el
        listado en la parte inferior.
      </Alert>
    </div>
  );
}
