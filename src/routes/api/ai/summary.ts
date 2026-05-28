import { prisma } from '#/db'
import { openrouter } from '#/lib/openrouter'
import { createFileRoute } from '@tanstack/react-router'
import { streamText } from 'ai'

export const Route = createFileRoute('/api/ai/summary')({
  server: {
    handlers: {
      POST: async ({ request, context }) => {
        try {
          const { itemId, prompt } = await request.json()
          const template = `You're a helpful assistant that creates concise informative summaries of web content.
          Your summaries should:
          - Be 2-3 paragraphs long
          - Capture the main points and key takeaways
          - Be written in clear, professional tone
          `

          if (!itemId || !prompt) {
            return new Response('Missing prompt or itemId', { status: 400 })
          }

          const item = await prisma.savedItem.findUnique({
            where: {
              id: itemId,
              userId: context?.session.user.id,
            },
          })

          if (!item) {
            return new Response('Item not found', { status: 404 })
          }

          const result = streamText({
            model: openrouter.chat(
              'nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free',
            ),
            system: template,
            prompt: `Please summarize the following content: \n\n${prompt}`,
          })

          return result.toTextStreamResponse()
        } catch (error) {
          throw new Error('Failed to process request', { cause: error })
        }
      },
    },
  },
})
