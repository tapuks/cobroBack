import { z } from "zod";

const productSchema = z.object({
  nombre: z.string().min(1, "El nombre no puede estar vacío"),
  precio: z.number().positive(),
  seleccionado: z.boolean(),
  cantidad: z.number().int(),
  category: z.enum([
    "cafe",
    "refresco",
    "comida",
    "patatas",
    "extra",
    "licor",
    "helado",
  ]),
  imagen: z.string().url().optional(),
});

export function validateProduct(obj) {
  return productSchema.safeParse(obj);
}

// Pone todas las propiedades como opcionales
export function validatePartialProduct(obj) {
  return productSchema.partial().safeParse(obj);
}
