const Groq = require("groq-sdk");

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function triageBug(title, description) {
  const response = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: `
You are an expert software QA engineer. Analyze the following bug report and respond ONLY in valid JSON with no extra text.

Bug Title: ${title}
Bug Description: ${description}

Respond with this exact JSON structure:
{
  "severity": "CRITICAL | HIGH | MEDIUM | LOW",
  "rootCause": "brief root cause analysis in 1-2 sentences",
  "suggestion": "actionable fix suggestion in 2-3 sentences",
  "testCases": [
    "test case 1 description",
    "test case 2 description",
    "test case 3 description"
  ]
}`,
      },
    ],
  });

  const raw = response.choices[0].message.content.trim();
  const parsed = JSON.parse(raw);
  return parsed;
}

module.exports = { triageBug };