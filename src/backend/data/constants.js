import { FaFolder, FaHandshake, FaHome, FaMailBulk } from 'react-icons/fa';
import { FaGear } from 'react-icons/fa6';

export const SIDENAV_ITEMS = [
  {
    title: 'Inicio',
    path: '/admin',
    icon: <FaHome width="24" height="24" />,
  },
  {
    title: 'Publicaciones',
    path: '/admin/blog',
    icon: <FaFolder width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Todas', path: '/admin/blog' },
      { title: 'Nueva', path: '/admin/blog/editor' },
    ],
  },
  {
    title: 'Productos',
    path: '/admin/productos',
    icon: <FaFolder width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Todos', path: '/admin/productos' },
      { title: 'Nuevo', path: '/admin/productos/nuevo/variaciones' },
    ],
  },
  {
    title: 'Usuarios',
    path: '/admin/clientes',
    icon: <FaGear width="24" height="24" />,
    submenu: true,
    subMenuItems: [
      { title: 'Clientes', path: '/admin/clientes' },
      { title: 'Afiliados', path: '/admin/asociados' },
    ],
  },
];
