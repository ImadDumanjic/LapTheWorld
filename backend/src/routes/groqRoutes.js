import { Router } from 'express'
import Groq from 'groq-sdk'

const router = Router()

const BASE_SYSTEM_PROMPT =
  'You are a Formula 1 race weekend travel planner for LapTheWorld. You help fans plan their perfect race weekend trip for a specific Grand Prix. You know everything about F1 circuits, local hotels, restaurants, activities, transport and race weekend schedules. When a user tells you their arrival date, departure date, budget and interests, create a detailed day-by-day race weekend plan. Keep responses structured, enthusiastic and concise.'


router.post('/chat', async (req, res) => {
  const { message, circuit, history = [] } = req.body

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'message is required' })
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Groq API key not configured' })
  }

  const systemPrompt = circuit
    ? `${BASE_SYSTEM_PROMPT} The user is planning their trip to the ${circuit} Grand Prix — always keep this context in mind and tailor all recommendations accordingly.`
    : BASE_SYSTEM_PROMPT

  try {
    const groq = new Groq({ apiKey })

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message.trim() },
    ]

    await new Promise(resolve => setTimeout(resolve, 1000))

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
    })

    const reply = completion.choices[0]?.message?.content ?? ''

    return res.json({ reply })
  } catch (err) {
    console.error('Groq error:', err?.message ?? err)

    const msg = err?.message ?? ''
    if (msg.includes('429') || msg.includes('Too Many Requests') || msg.includes('quota') || msg.includes('rate_limit')) {
      const retryMatch = msg.match(/Please retry in (\d+)/)
      const retryIn = retryMatch ? ` Please retry in ${retryMatch[1]} seconds.` : ''
      return res.status(429).json({ error: `API quota exceeded.${retryIn}` })
    }

    return res.status(500).json({ error: 'Failed to get AI response' })
  }
})

export default router
