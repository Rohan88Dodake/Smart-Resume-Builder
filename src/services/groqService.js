// groqService.js
// Place this file in: src/services/groqService.js

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY || "";
const MODEL = "llama-3.3-70b-versatile";

async function groqChat(messages) {
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: 1024 }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error?.message || "Groq API error");
  return data.choices[0].message.content;
}

// ─────────────────────────────────────────────
// 1. AUTO-GENERATE RESUME CONTENT
// ─────────────────────────────────────────────
export async function generateResumeContent({ jobTitle, skills, experience, section }) {
  const messages = [
    {
      role: "system",
      content: "You are a professional resume writer. Generate compelling, ATS-friendly resume content using strong action verbs. Return ONLY the content, no extra explanation.",
    },
    {
      role: "user",
      content: `Generate resume content for the "${section}" section.
Job Title: ${jobTitle}
Skills: ${skills}
Years of Experience: ${experience}
Use bullet points where appropriate. Be concise and impactful.`,
    },
  ];
  return await groqChat(messages);
}

// ─────────────────────────────────────────────
// 2. ATS SCORE CHECKER
// ─────────────────────────────────────────────
export async function checkATSScore({ resumeText, jobDescription }) {
  const messages = [
    {
      role: "system",
      content: "You are an ATS expert. Respond ONLY with valid JSON, no markdown, no extra text.",
    },
    {
      role: "user",
      content: `Analyze this resume against the job description and respond in this exact JSON format:
{
  "score": <number 0-100>,
  "matched_keywords": [<list of matching keywords>],
  "missing_keywords": [<list of important missing keywords>],
  "suggestions": [<list of 3-5 improvement tips>],
  "summary": "<one sentence overall assessment>"
}

RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`,
    },
  ];
  const text = await groqChat(messages);
  return JSON.parse(text.replace(/```json|```/g, "").trim());
}

// ─────────────────────────────────────────────
// 3. GRAMMAR & IMPROVEMENT
// ─────────────────────────────────────────────
export async function improveGrammar({ text }) {
  const messages = [
    {
      role: "system",
      content: "You are a professional resume editor. Respond ONLY with valid JSON, no markdown, no extra text.",
    },
    {
      role: "user",
      content: `Review and improve this resume text. Respond in this exact JSON format:
{
  "improved_text": "<corrected and improved version>",
  "changes": [<list of specific changes made>],
  "tone_score": <number 1-10 for professional tone>
}

TEXT TO IMPROVE:
"${text}"`,
    },
  ];
  const raw = await groqChat(messages);
  return JSON.parse(raw.replace(/```json|```/g, "").trim());
}

// ─────────────────────────────────────────────
// 4. CHAT ASSISTANT
// ─────────────────────────────────────────────
export async function chatWithAssistant({ messages, resumeContext }) {
  const systemMsg = {
    role: "system",
    content: `You are a helpful resume assistant. Answer questions about resumes, career advice, and job applications. Be concise and practical.${resumeContext ? `\n\nUser's resume context:\n${resumeContext}` : ""}`,
  };
  const groqMessages = [
    systemMsg,
    ...messages.filter(m => m.role !== "assistant" || m.content !== messages[0]?.content).map(m => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];
  return await groqChat(groqMessages);
}
