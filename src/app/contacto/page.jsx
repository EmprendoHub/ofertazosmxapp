import React from "react";
import ContactComponent from "@/components/contact/ContactComponent";
import { getOnePage } from "../_actions";

export const metadata = {
  title: "Contacto Ofertazos MX",
  description:
    "Comunícate con un representante para aclarar dudas o solicitudes.",
};

const ContactPage = async () => {
  const data = await getOnePage("contacto");
  const contacto = JSON.parse(data.page);
  return <ContactComponent contacto={contacto} />;
};

export default ContactPage;
