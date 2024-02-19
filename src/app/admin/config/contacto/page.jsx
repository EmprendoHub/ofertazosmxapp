import { getOnePage } from '@/app/_actions';
import NewContactPageComponent from '@/components/admin/config/NewContactPageComponent';

const NewPage = async () => {
  const data = await getOnePage('contacto');
  const contacto = JSON.parse(data.page);
  return <NewContactPageComponent contacto={contacto} />;
};

export default NewPage;
