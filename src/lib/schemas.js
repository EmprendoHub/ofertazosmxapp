import { z } from 'zod';

export const AddressEntrySchema = z.object({
  street: z.string().min(5, { message: 'Se requiere la calle y numero' }),
  city: z.string().min(3, { message: 'Se requiere la ciudad' }),
  province: z
    .string()
    .min(3, { message: 'Se requiere la provincia o entidad' }),
  zip_code: z.string().min(5, { message: 'Se requiere el código postal' }),
  country: z.string().min(1, { message: 'Se requiere el país' }),
  phone: z.string().min(5, { message: 'Se requiere numero de teléfono ' }),
});

export const PostEntrySchema = z.object({
  title: z.string().min(5, { message: 'Se requiere el titulo' }),
  category: z.string().min(3, { message: 'Se requiere la categoria' }),
  mainImage: z.object({
    url: z
      .string()
      .min(1, { message: 'La imagen principal debe tener una URL válida' }),
  }),
  images: z.array(z.object({ url: z.string() })),
  summary: z.string().min(5, { message: 'Se requiere el resumen' }),
  content: z.string().min(5, { message: 'Se requiere contenido ' }),
  createdAt: z.date(),
});
