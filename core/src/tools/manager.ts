import axios from 'axios';

import GenericResearch from './generic_research';
import Tool from './Tool';

import { getURL } from '../utils';

import { io } from '../app';

const AI_BASE_URL = getURL('ai');

const TOOLS = [
  {
    name: 'generic_researcher',
    use: 'searches the web generically to satisfy user queries',
  },
];

const TOOL_MAP: {
  [key: string]: Tool;
} = {
  generic_researcher: new GenericResearch(),
};

const tool_info = TOOLS.map((tool) => {
  return Object.entries(tool)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');
}).join('\n\n');

const template = (
  user_prompt: string
) => `You are an autonomous stock, company, and market research agent. You are provided with a bunch of in house tools to help you with your research. You are supposed to use these tools to satisfy user queries. 

Your task is to understand the user query and return a list of names of tools that you would use to satisfy the user query.

USER QUERY: ${user_prompt}

TOOLS: ${tool_info}
`;

const response_schema = `{
  "tools": {
    "type": "list",
    "value": ["tool1", "tool2", "tool3"]
  }
}`;

const manager = async (user_prompt: string, id: string) => {
  io.to(id).emit('progress', {
    icon: 'tool',
    message: 'Selecting tools to satisfy your query...',
  });

  const response = await axios({
    method: 'post',
    url: `${AI_BASE_URL}/generate_response`,
    data: {
      prompt: template(user_prompt),
      schema: response_schema,
      context: 'no context, use your known knowledge of LLM',
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  io.to(id).emit('progress', {
    icon: 'tool',
    message: 'Selected tools are - ' + response.data.tools.join(', '),
  });

  let data = response.data;

  // @ts-ignore
  const tools = data?.tools || [];

  return tools;
};

const invoke_tools = async (
  tools: string[],
  user_prompt: string,
  id: string
) => {
  const responses: {
    response: string;
    sources: {
      title: string;
      description: string;
      url: string;
      favicon: string;
    }[];
  }[] = [];

  const promises = [];

  for (const tool of tools) {
    if (TOOL_MAP[tool]) {
      promises.push(
        TOOL_MAP[tool].invoke(user_prompt, id).then((response) => {
          responses.push(response);
        })
      );
    }
  }

  await Promise.all(promises);

  io.to(id).emit('done');

  return responses;
};

export { manager, invoke_tools };
