import { getOnePage } from '@/app/_actions';
import NewAboutPageComponent from '@/components/admin/config/NewPageComponent';

const NewPage = async () => {
  const data = await getOnePage('acerca');
  const acerca = JSON.parse(data.page);
  return <NewAboutPageComponent acerca={acerca} />;
};

export default NewPage;
