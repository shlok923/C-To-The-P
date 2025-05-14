import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/convert", async (req, res) => {

    const apiKey = process.env.OPENROUTER_API_KEY;
    // console.log("env:", process.env);
    console.log("API Key:", apiKey);

  if (!apiKey) {
    console.error("API Key is not set");
    return res.status(500).json({ error: "API Key is not configured" });
  }

  const { code } = req.body;

  try {
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          //'HTTP-Referer': 'https://your-frontend-site.com', 
          //'X-Title': 'C to Promela Converter',              
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "meta-llama/llama-3.3-70b-instruct:free",
          messages: [
            {
              role: "system",
              content: "You are a tool that converts C code to Promela code. Just give the equivalent code with no additional text, and if not convertable code, just say error and type of error.",
            },
            {
              role: "user",
              content: `Convert this C code to equivalent Promela code(no text or formatting, just raw code):\n\n${code}`,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res.status(500).json({ error: data });
    }
    console.log("OpenRouter raw response:", data); // Add this line

    const result = data.choices?.[0]?.message?.content || "";
    res.json({ promela: result });
  } catch (error) {
    console.error("Conversion failed:", error);
    res.status(500).json({ error: "Conversion failed." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server listening on http://localhost:${PORT}`)
);