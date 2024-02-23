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

async function botLoginError(str) {
  return str.toLowerCase().includes('no bots thank you');
}

async function NoCookieLoginError(str) {
  return str.toLowerCase().includes('you are not authorized no no no');
}

const ErrorPage = async ({ searchParams }) => {
  const ifEmailNotVerified = await containsVerifyEmail(searchParams.error);
  const ifLoginError = await containsLoginError(searchParams.error);
  const ifExceededAttempts = await exceededAttemptsError(searchParams.error);
  const ifBotLoginAttempt = await botLoginError(searchParams.error);
  const ifNoCookieLoginError = await NoCookieLoginError(searchParams.error);
  return (
    <ErrorComponent
      ifEmailNotVerified={ifEmailNotVerified}
      ifLoginError={ifLoginError}
      ifExceededAttempts={ifExceededAttempts}
      ifBotLoginAttempt={ifBotLoginAttempt}
      ifNoCookieLoginError={ifNoCookieLoginError}
    />
  );
};

export default ErrorPage;
