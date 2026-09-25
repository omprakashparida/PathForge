import groq from "../utils/groq.js";

const FALLBACK_TIP =
  "Stay consistent! Even 30 minutes of focused practice daily will compound into expertise over time.";

const sanitize = (v) => String(v ?? "").replace(/[\r\n]+/g, " ").slice(0, 80);

// ==========================
// POST /api/tips
// Returns one short AI tip for the user's role/phase.
// Proxied through the backend so the Groq API key never
// ships to the browser.
// ==========================
export const getTip = async (req, res) => {
  try {
    const role = sanitize(req.body.role);
    const phase = sanitize(req.body.phase);

    if (!role) {
      return res.json({ tip: FALLBACK_TIP });
    }

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful mentor. Every time you are asked, give a DIFFERENT tip than before. Never repeat yourself.",
        },
        {
          role: "user",
          content: `Give me one single complete tip (1-2 sentences max, must end with a period) for someone learning to become a ${role} in phase ${phase}. Be specific and actionable. Never cut off mid sentence.`,
        },
      ],
      max_tokens: 80,
      temperature: 1.0,
    });

    const raw = completion.choices?.[0]?.message?.content?.trim();

    // Groq often wraps the tip in quotes — strip one layer of surrounding
    // quotes (straight or curly, single or double) so the UI doesn't show "".
    const tip = raw?.replace(/^["'“”‘’]+|["'“”‘’]+$/g, "").trim();

    return res.json({ tip: tip || FALLBACK_TIP });
  } catch (error) {
    console.log("Tip generation failed:", error.message);
    return res.json({ tip: FALLBACK_TIP });
  }
};
