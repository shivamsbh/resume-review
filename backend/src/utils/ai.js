import axios from "axios";

// OpenRouter-only implementation
// Env:
// - OPENROUTER_API_KEY: required (https://openrouter.ai/api/v1)
// - AI_BASE_URL: optional override (default https://openrouter.ai/api/v1)
// - AI_MODEL: optional (default deepseek/deepseek-chat:free)
// - OPENROUTER_SITE_URL: optional header for OpenRouter (HTTP-Referer)
// - OPENROUTER_APP_TITLE: optional header for OpenRouter (X-Title)
export async function generateResumeSuggestions(resumeContent, jobDescription) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("Missing OPENROUTER_API_KEY in environment");
  }

  const baseURL = process.env.AI_BASE_URL || "https://openrouter.ai/api/v1";
  const model = process.env.AI_MODEL || "deepseek/deepseek-chat-v3-0324:free";

  try {
    const response = await axios.post(
      `${baseURL}/chat/completions`,
      {
        model,
        messages: [
          {
            role: "system",
            content: `You are an expert career advisor and resume optimization specialist. Your job is to analyze a resume against a specific job description and provide actionable, constructive feedback. 

Analyze the resume and job description to provide:

1. **Skills Gap Analysis**: What skills are missing or need improvement
2. **Experience Alignment**: How to better highlight relevant experience
3. **Keyword Optimization**: Important keywords from the job description to include
4. **Content Suggestions**: Specific improvements for sections like summary, experience, projects
5. **Skill Development**: Recommendations for courses, certifications, or projects to pursue

Format your response in clean markdown with:
- **Bold** for section headers
- *Italics* for emphasis
- Bullet points for lists
- Clear, actionable advice

Keep suggestions practical, specific, and achievable. Focus on improvements that will make the biggest impact for this specific role.`
          },
          { 
            role: "user", 
            content: `Please analyze this resume against the job description and provide improvement suggestions:

**Job Description:**
${jobDescription}

**Resume Content:**
${resumeContent}` 
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:5173",
          "X-Title": process.env.OPENROUTER_APP_TITLE || "Resume Optimizer",
        },
        timeout: 15_000, // Reduced from 30s for faster response
        maxRedirects: 0, // Disable redirects for faster response
      }
    );

    const reply = response.data?.choices?.[0]?.message?.content;
    return reply || undefined;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const providerMessage =
        err.response?.data?.error?.message ||
        (typeof err.response?.data === "string" ? err.response?.data : undefined);

      if (status === 401) {
        throw new Error("OpenRouter authentication failed (401): invalid API key");
      }
      if (status === 402) {
        throw new Error(
          `OpenRouter billing/access issue (402): ${providerMessage || "insufficient credit or model not accessible"}`
        );
      }
      if (status === 404) {
        const currentModel = process.env.AI_MODEL || "deepseek/deepseek-chat:free";
        throw new Error(
          `OpenRouter model not found (404) for '${currentModel}'. Set AI_MODEL in backend/.env to an available model for your key (e.g., 'deepseek/deepseek-chat-v3-0324:free' or 'deepseek/deepseek-chat'). See https://openrouter.ai/api/v1/models`
        );
      }
      throw new Error(
        `OpenRouter API error (${status ?? "network"}): ${providerMessage || err.message}`
      );
    }
    throw err;
  }
}
