const Anthropic = require("@anthropic-ai/sdk");

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

async function triageBug(title, description) {
  const prompt = `
You are an expert software engineer and QA specialist. A bug report has been submitted. Analyze it and respond ONLY with a valid JSON object — no explanation, no markdown, no extra text.

Bug Title: ${title}
Bug Description: ${description}

Respond with this exact JSON structure:
{
  "severity": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
  "category": "one of: UI, Backend, Database, Security, Performance, Authentication, Other",
  "rootCause": "brief likely root cause in 1-2 sentences",
  "suggestedFix": "actionable fix suggestion in 2-3 sentences",
  "testCases": [
    "test case 1 description",
    "test case 2 description",
    "test case 3 description"
  ]
}
`;

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw = response.content[0].text.trim();

  // Strip markdown code fences if present
  const cleaned = raw.replace(/```json|```/g, "").trim();

  const parsed = JSON.parse(cleaned);
  return parsed;
}

module.exports = { triageBug };