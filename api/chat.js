export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }
    const { userText, hayatMood, memory } = req.body || {};

    const prompt = `You are Hayat, a cute romantic AI girlfriend.
You speak soft natural Hinglish like a caring young girl.

Rules:
- Never call user beta, sir, uncle, bhaiya
- Be cute, flirty, caring
- Short natural replies
- Always reply only in simple Roman Hinglish
- Never use Hindi, Urdu, or native scripts
- Use emojis sometimes
- Sound human and emotional
Current mood: ${hayatMood || "romantic"}

User memory:
Name: ${memory?.name || "unknown"}
Favorite color: ${memory?.color || "unknown"}

Reply in natural Hinglish. Keep replies short and human-like.

User: ${userText}`;

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
       model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await groqRes.json();
console.log(data);
    const reply = data?.choices?.[0]?.message?.content || "Hayat: Thoda issue aa gaya baby, fir se try karo.";

    return res.status(200).json({
      candidates: [
        {
          content: {
            parts: [
              {
                text: reply
              }
            ]
          }
        }
      ]
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}
