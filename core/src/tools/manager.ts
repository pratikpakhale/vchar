import axios from 'axios';

import GenericResearch from './generic_research';
import Tool from './Tool';

import { getURL } from '../utils';
import { io, emitEvent } from '../app';
import { JSONStore } from '../store';

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

const manager = async (user_prompt: string, id: string, deeper: boolean) => {
  try {
    const store = new JSONStore();

    const history = store.get(id);

    if (history.length > 0 && !deeper) {
      emitEvent(id, 'progress', {
        icon: 'rag',
        message: 'Restored the session',
      });
      history.forEach((chat) => {
        emitEvent(id, 'response', {
          tool: 'manager',
          answer: chat.answer,
          sources: chat.sources,
        });
      });
      emitEvent(id, 'done', null);

      return [];
    }

    io.to(id).emit('progress', {
      icon: 'tool',
      message: 'Selecting tools to satisfy your query',
    });

    let all_queries = history.map((chat) => chat.prompt);

    user_prompt = user_prompt + '\n' + all_queries.join('\n');

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
    let tools = data?.tools || [];

    return tools.length > 0 ? tools : ['generic_researcher'];
  } catch (e) {
    io.to(id).emit('progress', {
      icon: 'error',
      message: 'Error occured while selecting tools',
    });
    io.to(id).emit('done');
    // console.log(e.message);
    throw e;
  }
};

const invoke_tools = async (
  tools: string[],
  user_prompt: string,
  id: string
) => {
  try {
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
  } catch (e) {
    io.to(id).emit('progress', {
      icon: 'error',
      message: 'Error in running tools',
    });
    io.to(id).emit('done');
    throw e;
  }
};

export { manager, invoke_tools };
