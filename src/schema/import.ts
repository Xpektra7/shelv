import z from 'zod'

export const importSchema = z.object({
  url: z.string().url(),
})

export const bulkImport = z.object({
  url: z.string().url(),
  search: z.string(),
})

export const bulkSchema = z.object({
  urls: z.array(z.string().url()),
})

export const discoverSchema = z.object({
  query: z.string().min(1),
})

export const extractSchema = z.object({
  author: z.string().nullable(),
  publishedAt: z.string().nullable(),
})
