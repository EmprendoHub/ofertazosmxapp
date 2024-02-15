import Alert from '@mui/material/Alert';

export default function Result({ emails }) {
  return (
    <>
      {emails.length === 0 ? (
        <Alert security="success">
          Todos los correos se enviaron correctamente
        </Alert>
      ) : (
        <Alert security="warning">Error al enviar correos.</Alert>
      )}
    </>
  );
}
