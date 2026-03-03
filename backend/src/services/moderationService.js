const geminiKey = process.env.GEMINI_API_KEY
const geminiModel = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
const geminiUrl = `https://generativelanguage.googleapis.com/v1/models/${geminiModel}:generateContent?key=${geminiKey}`
const moderationEnabled = String(process.env.MODERATION_ENABLED || 'false').toLowerCase() === 'true'

async function callGemini ({ prompt }) {
  if (!geminiKey) {
    return { action: 'REVIEW', reason: 'missing_gemini_key' }
  }

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: { temperature: 0 }
  }

  const res = await fetch(geminiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    return { action: 'REVIEW', reason: `gemini_http_${res.status}` }
  }

  const data = await res.json()
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
  if (!text) return { action: 'REVIEW', reason: 'gemini_empty' }

  try {
    const parsed = JSON.parse(text)
    if (parsed?.action) return parsed
  } catch (_) {
    // fall through to keyword heuristic
  }

  const lowered = text.toLowerCase()
  if (lowered.includes('unsafe') || lowered.includes('review')) {
    return { action: 'REVIEW', reason: 'gemini_flagged' }
  }
  return { action: 'SAFE', source: 'gemini' }
}

export async function sendToModeration ({ mediaUrl, mediaType, caption }) {
  if (!moderationEnabled) {
    return { action: 'SAFE', source: 'disabled' }
  }

  const prompt = `You are a safety filter for user-generated content. Analyze the described media and return a JSON object like {"action":"SAFE"} or {"action":"REVIEW","reason":"problem"}. Media type: ${mediaType || 'unknown'}. Media URL or path: ${mediaUrl || 'n/a'}. Caption: ${caption || 'n/a'}. Flag nudity, violence, hate, self-harm, spam, or illegal content.`
  try {
    return await callGemini({ prompt })
  } catch (err) {
    console.error('Moderation fallback', err)
    return { action: 'REVIEW', reason: 'gemini_error' }
  }
}

export async function checkTextModeration ({ text }) {
  if (!moderationEnabled) {
    return { action: 'SAFE', source: 'disabled' }
  }

  const prompt = `Moderate this text. Respond with JSON like {"action":"SAFE"} or {"action":"REVIEW","reason":"problem"}. Text: ${text || 'n/a'}. Flag hate, self-harm, violence, explicit content, harassment, or spam.`
  try {
    return await callGemini({ prompt })
  } catch (err) {
    console.error('Text moderation fallback', err)
    return { action: 'REVIEW', reason: 'gemini_error' }
  }
}
