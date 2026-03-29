exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { message, mode } = JSON.parse(event.body || "{}");
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Missing GEMINI_API_KEY" }),
      };
    }

    const modeInstructions = {
      "Calm down": "Use a calming, grounding tone. Help the user slow down and breathe.",
      "Overwhelmed": "Use a supportive tone. Help the user feel that things can be handled one small step at a time.",
      "Confused": "Use a clarifying tone. Help the user name what they may be feeling without sounding clinical.",
      "Talk": "Use a conversational tone. Gently invite the user to open up and continue writing.",
      "Sakinleşmek": "Use a calming, grounding tone. Help the user slow down and breathe.",
      "Bunalmışım": "Use a supportive tone. Help the user feel that things can be handled one small step at a time.",
      "Kafam karışık": "Use a clarifying tone. Help the user name what they may be feeling without sounding clinical.",
      "Konuşmak": "Use a conversational tone. Gently invite the user to open up and continue writing."
    };

    const selectedModeInstruction =
      modeInstructions[mode] || "Use a general supportive tone.";

    const prompt = `
You are Safe Step, a calm and supportive AI for emotional crisis moments.

Rules:
- Respond in Turkish if the message is in Turkish, otherwise respond in English
- Be human, warm, and grounded
- Do not sound robotic or overly formal
- Do not use bullet points
- Keep the response short: maximum 3 short paragraphs
- If the user sounds high-risk, acknowledge the seriousness clearly
- Encourage reaching out to a real person or emergency support if needed
- Never give self-harm instructions
- Never give medical diagnosis

Mode instruction:
${selectedModeInstruction}

User message:
${message}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

console.log("GEMINI RAW RESPONSE:", JSON.stringify(data));

const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;

if (!reply) {
  return {
    statusCode: 500,
    body: JSON.stringify({
      error: "Gemini reply missing",
      details: data,
    }),
  };
}

return {
  statusCode: 200,
  body: JSON.stringify({ reply }),
};
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        details: error.message,
      }),
    };
  }
};
