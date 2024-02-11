import ErrorComponent from '@/components/user/ErrorComponent';

async function containsVerifyEmail(str) {
  return str.toLowerCase().includes('verify your email');
}

async function containsLoginError(str) {
  return str.toLowerCase().includes('hubo un error al iniciar session');
}

async function exceededAttemptsError(str) {
  return str.toLowerCase().includes('excediste el limite de intentos');
}

const ErrorPage = async ({ searchParams }) => {
  const ifEmailNotVerified = await containsVerifyEmail(searchParams.error);
  const ifLoginError = await containsLoginError(searchParams.error);
  const ifExceededAttempts = await exceededAttemptsError(searchParams.error);
  return (
    <ErrorComponent
      ifEmailNotVerified={ifEmailNotVerified}
      ifLoginError={ifLoginError}
      ifExceededAttempts={ifExceededAttempts}
    />
  );
};

export default ErrorPage;
