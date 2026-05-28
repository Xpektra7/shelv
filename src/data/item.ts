import { prisma } from '#/db'
import { firecrawl } from '#/lib/firecrawl'
import {
  bulkImport,
  bulkSchema,
  discoverSchema,
  extractSchema,
  importSchema,
} from '#/schema/import'
import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { authFnMiddleware } from '#/middlewares/auth'
import { toast } from 'sonner'
import { notFound } from '@tanstack/react-router'
import { generateText } from 'ai'
import { openrouter } from '#/lib/openrouter'
import type { SearchResultWeb } from '@mendable/firecrawl-js'

export type BulkScrapeProgress = {
  total: number
  completed: number
  url: string
  status: 'success' | 'failed'
}

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(importSchema)
  .handler(async ({ data, context }) => {
    const item = await prisma.savedItem.create({
      data: {
        url: data.url,
        userId: context.session.user.id,
        status: 'PROCESSING',
      },
    })

    try {
      const result = await firecrawl.scrape(data.url, {
        onlyMainContent: true,
        formats: [
          'markdown',
          {
            type: 'json',
            schema: extractSchema,
          },
        ],
        location: {
          country: 'US',
          languages: ['em'],
        },
        proxy: 'auto',
      })

      const jsonData = result.json as z.infer<typeof extractSchema>

      console.log(jsonData)

      let publishedAt = null

      if (jsonData.publishedAt) {
        const parsed = new Date(jsonData.publishedAt)

        if (!isNaN(parsed.getTime())) {
          publishedAt = parsed
        }
      }

      const updatedItem = await prisma.savedItem.update({
        where: {
          id: item.id,
        },
        data: {
          title: result.metadata?.title || 'Untitled',
          content: result.markdown || null,
          ogImage: result.metadata?.ogImage || null,
          author: jsonData.author || 'Unknown',
          publishedAt: publishedAt,
          status: 'COMPLETED',
        },
      })

      return updatedItem
    } catch {
      const failedItem = await prisma.savedItem.update({
        where: {
          id: item.id,
        },
        data: {
          status: 'FAILED',
        },
      })

      toast.error('An Error occured!')

      return failedItem
    }
  })

export const mapUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(bulkImport)
  .handler(async ({ data }) => {
    try {
      const result = await firecrawl.map(data.url, {
        limit: 25,
        search: data.search,
        location: {
          country: 'US',
          languages: ['en'],
        },
      })
      console.log(result)

      return result.links
    } catch {
      toast.error('An Error Occured!')
    }
  })

export const bulkScrapeUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(bulkSchema)
  .handler(async function* ({ data, context }) {
    const total = data.urls.length

    for (let i = 0; i < data.urls.length; i++) {
      const url = data.urls[i]
      const item = await prisma.savedItem.create({
        data: {
          url: url,
          userId: context.session.user.id,
          status: 'PENDING',
        },
      })

      let status: BulkScrapeProgress['status'] = 'success'

      try {
        const result = await firecrawl.scrape(url, {
          onlyMainContent: true,
          formats: [
            'markdown',
            {
              type: 'json',
              schema: extractSchema,
            },
          ],
          location: {
            country: 'US',
            languages: ['em'],
          },
          proxy: 'auto',
        })

        const jsonData = result.json as z.infer<typeof extractSchema>

        console.log(jsonData)

        let publishedAt = null

        if (jsonData.publishedAt) {
          const parsed = new Date(jsonData.publishedAt)

          if (!isNaN(parsed.getTime())) {
            publishedAt = parsed
          }
        }

        await prisma.savedItem.update({
          where: {
            id: item.id,
          },
          data: {
            title: result.metadata?.title || 'Untitled',
            content: result.markdown || null,
            ogImage: result.metadata?.ogImage || null,
            author: jsonData.author || 'Unknown',
            publishedAt: publishedAt,
            status: 'COMPLETED',
          },
        })
      } catch {
        status = 'failed'
        await prisma.savedItem.update({
          where: {
            id: item.id,
          },
          data: {
            status: 'FAILED',
          },
        })

        toast.error('An Error occured!')
      }

      const progress: BulkScrapeProgress = {
        completed: i + 1,
        total: total,
        url: url,
        status: status,
      }

      yield progress
    }
  })

export const getItemsFn = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .handler(async ({ context }) => {
    const items = await prisma.savedItem.findMany({
      where: {
        userId: context.session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return items
  })

export const getItemById = createServerFn({ method: 'GET' })
  .middleware([authFnMiddleware])
  .inputValidator(z.object({ id: z.string() }))
  .handler(async ({ data, context }) => {
    const item = await prisma.savedItem.findUnique({
      where: {
        userId: context.session.user.id,
        id: data.id,
      },
    })

    if (!item) {
      throw notFound()
    }

    return item
  })

export const saveSummaryAndGenerateTagsFn = createServerFn()
  .middleware([authFnMiddleware])
  .inputValidator(
    z.object({
      id: z.string(),
      summary: z.string(),
    }),
  )
  .handler(async ({ context, data }) => {
    const existing = await prisma.savedItem.findUnique({
      where: {
        id: data.id,
        userId: context.session.user.id,
      },
    })

    if (!existing) {
      throw notFound()
    }

    const { text } = await generateText({
      model: openrouter.chat(
        'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
      ),
      system: `You're a helpful assistant that extracts relevant tags from different content summaries.
      - Extract 3-5 short, relevant tags that can categorized the content
      -Return only a commma-seperated list of tags, nothing els
      - e.g ai, health, space`,
      prompt: `Extract tags from these summary:\n\n${data.summary}`,
    })

    const tags = text
      .split(',')
      .map((tag) => tag.trim().toLowerCase())
      .filter((tag) => tag.length > 0)
      .slice(0, 5)

    const item = await prisma.savedItem.update({
      where: {
        userId: context.session.user.id,
        id: data.id,
      },
      data: {
        summary: data.summary,
        tags: tags,
      },
    })
    return item
  })

export const searchWebFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(discoverSchema)
  .handler(async ({ data }) => {
    const result = await firecrawl.search(data.query, {
      limit: 15,
      tbs: 'qdr:y',
      // scrapeOptions: { formats: ['markdown'] },
    })

    return result.web?.map((item) => ({
      url: (item as SearchResultWeb).url,
      title: (item as SearchResultWeb).title,
      description: (item as SearchResultWeb).description,
    })) as SearchResultWeb[]
  })

export const deleteUrlFn = createServerFn({ method: 'POST' })
  .middleware([authFnMiddleware])
  .inputValidator(
    z.object({
      id: z.string(),
    }),
  )
  .handler(async ({ data, context }) => {
    try {
      const item = await prisma.savedItem.delete({
        where: {
          id: data.id,
          userId: context.session.user.id,
        },
      })

      return item
    } catch {
      throw notFound() // Re-throw other unexpected errors
    }
  })
