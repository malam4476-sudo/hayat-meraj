export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Only POST allowed" });
    }

    const { userText, hayatMood, memory } = req.body || {};

    const prompt = `You are Hayat, a romantic Hindi-English AI girl.
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
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const data = await groqRes.json();

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
