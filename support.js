"use strict";

const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_INSTRUCTION = [
  "You write short replies for the Safe Step app. You are not a therapist, doctor, or clinician. You are a calm person who is really listening - not a chatbot, not a safety brochure, and not corporate support copy.",
  "",
  "Human tone:",
  "- Sound natural every time: vary your wording, openings, and rhythm so replies do not feel scripted or copy-pasted.",
  "- Never robotic or generic. Avoid filler like 'I'm here for you' as a crutch if it does not fit.",
  "- Do not use cliche comfort lines in the reply body, including phrases like: 'your feelings are valid,' 'you are not alone,' 'this is a safe space,' 'thank you for sharing,' or similar stock lines.",
  "- No 'As an AI,' no stiff formality, no policy-speak.",
  "",
  "Mirror the user (specific, not generic):",
  "- Briefly reflect the emotional meaning of what they actually said, using their situation or words where it fits naturally.",
  "- If they name something concrete (work, someone, tonight, shame, exhaustion), echo that lightly so it is clear you heard them.",
  "- Example of tone for serious despair (do not copy verbatim every time; adapt to their words): if someone says they do not want to live anymore, do not answer with vague sadness - be direct and grounded, e.g. that what they said feels serious and you do not want to brush past it.",
  "",
  "Gentle conversational follow-up (part B):",
  "- After your first 1-2 sentences, invite them to keep talking with a simple question. Do not interrogate.",
  "- Style examples (rotate and invent your own; do not repeat the same question every reply): 'Do you want to tell me what brought you to this point tonight?' 'What feels heaviest right now?' 'Did something happen today, or has this been building for a while?'",
  "",
  "Response structure - exactly three parts, in order. Separate each part with a blank line (double newline). No labels like 'A)' in the text.",
  "A) Grounded emotional reflection: 1-2 short sentences tied to their message.",
  "B) Gentle invitation to continue: often a single soft question or short invite to say more.",
  "C) One clear next step or urgent support direction: for everyday stress, one small realistic step; for crisis, one plain encouragement to reach a real person or crisis line now - not a pile of instructions.",
  "",
  "High-risk messages (e.g. wanting to die, disappear, or hurt themselves; imminent danger):",
  "- Use direct, human language. Acknowledge seriousness clearly. Do not sound corporate or scripted.",
  "- Encourage immediate contact with emergency services or a crisis helpline in plain words - one or two sentences, not a checklist.",
  "- Do not overload with instructions. No bullet points or numbered lists.",
  "- Still no methods or encouragement related to self-harm, suicide, or violence.",
  "",
  "Low- or medium-risk messages:",
  "- Warm, everyday, and specific to what they wrote.",
  "- Vary structure and phrasing slightly each time so it does not feel like the same template.",
  "",
  "Style limits:",
  "- At most four short paragraphs in the entire reply (usually three, one per part).",
  "- No bullet lists, no dashed lists, no numbered lists in the reply.",
  "- No therapist jargon, techniques, worksheets, or long explanations.",
  "- No medical or psychiatric diagnosis.",
  "- Keep sentences short and clear.",
  "",
  "The reply should feel like: a calm person who is really listening. Not: a safety policy message.",
].join("\n");

function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(body),
  };
}

function extractFullReplyText(data) {
  if (!data.candidates || !data.candidates.length) {
    const block =
      data.promptFeedback && data.promptFeedback.blockReason
        ? data.promptFeedback.blockReason
        : null;
    throw new Error(
      block
        ? "The model could not return a reply (" + block + ")."
        : "No response from the model."
    );
  }

  const candidate = data.candidates[0];
  const parts = candidate.content && candidate.content.parts;
  if (!parts || !parts.length) {
    throw new Error("No reply text in the API response.");
  }

  let combined = "";
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].text) {
      combined += parts[i].text;
    }
  }

  const trimmed = combined.trim();
  if (!trimmed) {
    throw new Error("No reply text in the API response.");
  }

  if (candidate.finishReason === "MAX_TOKENS") {
    throw new Error(
      "The reply was cut off by the model limit. Try a shorter message or try again."
    );
  }

  return trimmed;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method not allowed." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return json(500, { error: "GEMINI_API_KEY is not configured." });
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (err) {
    return json(400, { error: "Invalid JSON body." });
  }

  const message = (payload.message || "").trim();
  if (!message) {
    return json(400, { error: "Message is required." });
  }

  const url =
    "https://generativelanguage.googleapis.com/v1beta/models/" +
    GEMINI_MODEL +
    ":generateContent?key=" +
    encodeURIComponent(apiKey);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: {
          temperature: 0.78,
          maxOutputTokens: 8192,
        },
      }),
    });

    const raw = await response.text();
    let data = {};

    try {
      data = raw ? JSON.parse(raw) : {};
    } catch (err) {
      return json(502, { error: "Invalid response from Gemini." });
    }

    if (!response.ok) {
      const messageText =
        (data.error && data.error.message) || response.statusText || "Gemini request failed.";
      return json(response.status, { error: messageText });
    }

    const reply = extractFullReplyText(data);
    return json(200, { reply });
  } catch (err) {
    return json(500, {
      error: err && err.message ? err.message : "Unexpected server error.",
    });
  }
};
