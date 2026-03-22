import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const createPostSchema = z.object({
  title: z.string().min(1, "O título deve ter pelo menos 1 caracteres"),
  content: z.string().min(1, "O conteúdo não pode estar vazio"),
  image: z
    .any()
    .refine(
      (files) => !files?.[0] || files?.[0]?.size <= MAX_FILE_SIZE,
      `O tamanho máximo é 5MB.`,
    )
    .refine(
      (files) => !files?.[0] || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Apenas formatos .jpg, .jpeg, .png e .webp são aceitos.",
    )
    .optional(),
});

export type CreatePostData = z.infer<typeof createPostSchema>;
