import "dotenv/config";
import Groq from "groq-sdk";
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function main() {
  const completion = await groq.chat.completions.create({
    temperature: 0, //less temperature means more focus and high temp generate more random ans
    // top_logprobs:08; //use pnly one temperature or top_logprobs, alternate of temperature
    // stop: "3", //it will limit the result according to the provided details in stop
    // max_completion_tokens: "1", //limits tokens
    // frequency_penalty: -2, //if set higher words repetation will decrease
    // presence_penalty:1,//it will generate new words. it generate more dymanic creative words
    // response_format: { type: "json_object" }, //show output in jsonobject
    model: "llama-3.3-70b-versatile",
    messages: [
      //give persona
      {
        role: "system",
        // content: `you are shamsher, a smart personal assistant. Be always polite and give good answer.
        //   classify the review as positive, negative or neutral. you must return the result in
        //   valid JSON structure.
        //   example:{"sentiment":"Negative"}`, //instruct how to behave
        content: `you are a smart persinal assistant who answer the asked questions. 
        You have access to following tools:
        1. searchWeb({query}:{query:string}) //"search the latest information and real time data on the internet",`,
      },
      {
        role: "user",
        content: "when was iphone 16 launched?",
        // content: "when is the current weather of tokyo",
      },
    ],
    // tools: [
    //   {
    //     type: "function",
    //     function: {
    //       name: "webSearch",
    //       description:
    //         "search the latest information and real time data on the internet",
    //       parameters: {
    //         type: "object",
    //         properties: {
    //           query: {
    //             type: "string",
    //             description: "The search query to perform search on",
    //           },
    //         },
    //         required: ["query"],
    //       },
    //     },
    //   },
    // ],
    // tool_choice: "auto",
  });

  //   const toolsCalls = completion.choices[0].message.tool_calls;

  //   if (!toolsCalls) {
  //     console.log(`Assistant: ${completion.choices[0].message.content}`);
  //     return;
  //   }

  //   for (const tool of toolsCalls) {
  //     console.log("tool :", tool);
  //     const functionname = tool.function.name;
  //     const functionParams = tool.function.arguments;

  //     if (functionname === "webSearch") {
  //       const toolResult = await webSearch(JSON.parse(functionParams));
  //       console.log("tool result : ", toolResult);
  //     }
  //   }
  console.log("=====result======" + completion.choices[0].message.content);
}

main();

async function webSearch({ query }) {
  console.log("calling web search");

  //tavily api called here
  return "iphone was launched on 20 september 2024";
}

/**tool calling/function callin ===> IF LLM was already in production and after few times if you try to seacrch info then
llma will not give correct answer because it was not trained after deployement in that situation
 we can use tool calling to get the correct answer

 -- e.g user: when was iphone 16 launched==> LLM(no data/answer)==>web search tool ==> LLM==> give answer(launched on 2016september)
 tools eg. calendar tool, web search tool

 in chatgpt it is called function calling/toolcalling
 
 */
