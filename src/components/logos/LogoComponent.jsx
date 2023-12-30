import Link from 'next/link';
import Image from 'next/image';

const LogoComponent = () => {
  return (
    <Link href={`/`}>
      <Image
        width={250}
        height={250}
        src={'/images/rifas_bac_motors_white_text_logo.webp'}
        alt="central Medica de Especialidades"
        className="main-logo-class w-[200px] sm:w-[120px]"
      />
    </Link>
  );
};

export default LogoComponent;
