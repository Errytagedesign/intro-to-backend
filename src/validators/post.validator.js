import { z } from "zod";

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  tags: z.array(z.string()).optional().default([]),
});

const updatePostSchema = z
  .object({
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });

const listPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

const idParamSchema = z.object({
  id: z.string().regex(objectIdRegex, "Invalid ID format"),
});

export {
  createPostSchema,
  updatePostSchema,
  listPostsQuerySchema,
  idParamSchema,
};
