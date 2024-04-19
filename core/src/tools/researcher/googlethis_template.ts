export default function template(
  user_prompt: string,
  research_context: string
) {
  return `You are an advanced AI researcher which uses google to search for information. You are provided with a research context and the user query. You are expected to generate a perfect google search query based on the user query and the research context provided.

  user prompt : ${user_prompt}

  research context : ${research_context}
  `;
}
