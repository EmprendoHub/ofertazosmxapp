import AboutUsComponent from "@/components/about/AboutUsComponent";
import { getOnePage } from "../_actions";

export const metadata = {
  title: "Acerca de Ofertazos MX",
  description:
    "La moda es nuestra pasión viajamos todo el mundo en busca de prendas exclusivas de marcas reconocidas y la traemos hasta la puerta de tu casa.",
};

const AcercaPage = async () => {
  const data = await getOnePage("acerca");
  const acerca = JSON.parse(data.page);
  return <AboutUsComponent acerca={acerca} />;
};

export default AcercaPage;
