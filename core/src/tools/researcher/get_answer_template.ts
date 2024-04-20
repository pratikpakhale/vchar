export default function template(
  user_prompt: string,
  research_context: string
) {
  return `You are an AI bot which answers user queries based on contexxt. Answer the following query based on the user prompt, research context and chat history. If no answer is found, respond with empty string. DO NOT respond with the same answer as in the chat history. ONLY RESPOND WITH THE ANSWER IF IT IS NOT IN THE CHAT HISTORY. OR ELSE RESPOND WITH EMPTY STRING. eg. ""

  user prompt : ${user_prompt}

  research context : ${research_context}
  `;
}
