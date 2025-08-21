import "dotenv/config";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "system",
        content: `
            you are a smart persinal assistant who answer the asked questions. 
            You have access to following
            `,
      },
      {
        role: "user",
        content: "when was iphone 16 launched?",
      },
    ],
  });
  console.log(`===============================AI ANSWER==============================================="
    ${completion.choices[0].message.content}`);
}

main();
