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

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await geminiRes.json();
    return res.status(geminiRes.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}
