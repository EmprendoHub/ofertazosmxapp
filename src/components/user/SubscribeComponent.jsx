import { getCookiesName } from '@/backend/helpers';
import GoogleCaptchaWrapper from '@/components/forms/GoogleCaptchaWrapper';
import { cookies } from 'next/headers';
import SubscribeForm from './SubscribeForm';

const SubscribeComponent = () => {
  //set cookies
  const nextCookies = cookies();
  const cookieName = getCookiesName();
  const nextAuthSessionToken = nextCookies.get(cookieName);
  const cookie = `${cookieName}=${nextAuthSessionToken?.value}`;
  return (
    <GoogleCaptchaWrapper>
      <SubscribeForm cookie={cookie} />
    </GoogleCaptchaWrapper>
  );
};
export default SubscribeComponent;
