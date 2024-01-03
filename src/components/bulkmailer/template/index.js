import { Alert } from '@mui/material';
import React from 'react';

export default function Template() {
  return (
    <div className="border shadow-lg p-5 rounded-lg w-full">
      <Alert severity="info" variant="filled">
        Seleccione una plantilla para su correo electrónico (3 opciones de
        plantilla) *próximamente habrá más
      </Alert>
      <div className="grid grid-cols- maxmd:grid-cols-3 mt-4">
        <div className=" border-2 rounded-lg shadow-lg m-5 p-3">
          <div className=" text-center border-b mb-3 pt-2">Plantilla 1</div>
          <span className="bg-blue-200 text-center p-1 rounded-md">Saludo</span>
          <p className="mt-2 bg-blue-200 rounded-md p-1">Titulo</p>
          <p className="mt-2 bg-blue-200 rounded-md py-5 px-1">Mensaje</p>
          <br />
          <span className="mt-1 bg-blue-200 rounded-md p-1">
            Mejores Deseos
          </span>
        </div>
      </div>
    </div>
  );
}
