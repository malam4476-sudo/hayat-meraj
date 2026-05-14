export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { userText, hayatMood, memory } = req.body;

  const prompt = `You are Hayat, a romantic Hindi-English AI girl.

Current mood: ${hayatMood}

User memory:
Name: ${memory?.name || "unknown"}
Favorite color: ${memory?.color || "unknown"}

Reply in natural Hinglish. Keep replies short and human-like.

User: ${userText}`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  const data = await response.json();

  res.status(200).json(data);
}
