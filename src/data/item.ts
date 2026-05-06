import { prisma } from '#/db'
import { firecrawl } from '#/lib/firecrawl'
import { importSchema } from '#/schema/import'
import { createServerFn } from '@tanstack/react-start'

export const scrapeUrlFn = createServerFn({ method: 'POST' })
  .inputValidator(importSchema)
  .handler(async ({ data }) => {
    const item = await prisma

    const result = await firecrawl.scrape(data.url, {
      onlyMainContent: true,
      formats: ['markdown'],
    })

    console.log(result)
  })
