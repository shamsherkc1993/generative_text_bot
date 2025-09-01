import "dotenv/config";
import Groq from "groq-sdk";
import { tavily } from "@tavily/core";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

async function main() {
  const messages = [
    {
      role: "system",
      content: `
            you are a smart persinal assistant who answer the asked questions. 
            You have access to following tools:

            1. searchWeb //search the latest information and realtine data on the internet.
            `,
    },
    {
      role: "user",
      content: "what is the current weather in tokyo?",
    },
  ];

  while (true) {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "search the latest information and realtine data on the internet",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to perform search on",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    messages.push(completion.choices[0].message);
    const tooCalls = completion.choices[0].message.tool_calls;

    if (!tooCalls) {
      console.log("AI:", completion.choices[0].message.content);
      break;
    }

    for (const tool of tooCalls) {
      // console.log("tools", tool);
      const functionName = tool.function.name;
      const functionParams = tool.function.arguments;

      if (functionName === "webSearch") {
        const toolResult = await webSearch(JSON.parse(functionParams));
        // console.log("toolresult", toolResult);
        messages.push({
          tool_call_id: tool.id,
          role: "tool",
          name: functionName,
          content: toolResult,
        });
      }
    }

    const completion2 = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,
      messages: messages,
      tools: [
        {
          type: "function",
          function: {
            name: "webSearch",
            description:
              "search the latest information and realtine data on the internet",
            parameters: {
              type: "object",
              properties: {
                query: {
                  type: "string",
                  description: "The search query to perform search on",
                },
              },
              required: ["query"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });
    // console.log(JSON.stringify(completion2.choices[0].message, null, 2));
  }
}

main();

async function webSearch({ query }) {
  //here we will do tabily api call
  console.log("calling web search");
  const response = await tvly.search(query);
  // console.log("respones:", response);

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");
  // console.log("final:", finalResult);

  return finalResult;
}
