import axios from 'axios';

import { getURL } from '../../utils';

const BROWSER_BASE_URL = getURL('browser');
const GOOGLE_BASE_URL = getURL('googlethis');
const AI_BASE_URL = getURL('ai');

import googlethisTemplate from './googlethis_template';
import googlethisMultipleTemplate from './googlethis_multiple_template';
import getAnswerTemplate from './get_answer_template';

import { JSONStore } from '../../store';

import { io } from '../../app';

import { config } from '../../utils';

async function researcher(
  user_prompt: string,
  research_context: string,
  session_id: string,
  tool: string
): Promise<{
  response: string;
  sources: {
    title: string;
    description: string;
    url: string;
    favicon: string;
  }[];
}> {
  try {
    const store = new JSONStore();

    io.to(session_id).emit('progress', {
      icon: 'tool',
      message: 'Running ' + tool,
    });

    io.to(session_id).emit('progress', {
      icon: 'google',
      message: `${tool}: Generating Google search query`,
    });

    const chat_history = store.get(session_id);

    let chat_history_string = '';
    chat_history.forEach((chat) => {
      chat_history_string += `User: ${chat.prompt}\nContext: ${chat.context}\nAI: ${chat.answer}\n\n`;
    });

    let response;

    if (
      !config.core.googlethis_multiple_query ||
      config.core.googlethis_multiple_query === 'false'
    ) {
      response = await axios({
        method: 'post',
        url: `${AI_BASE_URL}/generate_response`,
        data: {
          prompt: googlethisTemplate(user_prompt, research_context),
          schema: `{"prompt": { "type": "str", "value":"google search query based on research context and user prompt"  } }`,
          context: chat_history_string,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      response = await axios({
        method: 'post',
        url: `${AI_BASE_URL}/generate_response`,
        data: {
          prompt: googlethisMultipleTemplate(
            user_prompt,
            research_context,
            config.core.max_google_queries
          ),
          schema: `{"prompts": { "type": "list", "value":"google search queries list based on research context and user prompt"  } }`,
          context: chat_history_string,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    if (chat_history.length > 0) {
      io.to(session_id).emit('progress', {
        icon: 'rag',
        message: `${tool}: Answering based on current context`,
      });
      axios({
        method: 'post',
        url: `${AI_BASE_URL}/generate_response`,
        data: {
          prompt: getAnswerTemplate(user_prompt, research_context),
          schema: `{"answer": { "type": "str", "value":"answer based on context"  } }`,
          context: chat_history_string,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => {
        let answer = `**Answer based on current research**\n\n${response.data?.answer}`;
        if (
          chat_history_string.includes(response.data?.answer) ||
          answer.includes('am sorry') ||
          answer.includes('cannot answer') ||
          answer.includes('apologize')
        )
          return;
        if (answer.length > 0) {
          store.append(session_id, {
            prompt: user_prompt,
            context: '',
            answer,
            sources: [],
          });
          io.to(session_id).emit('response', {
            tool: tool,
            answer,
            sources: [],
          });
        }
      });
    }

    let data = response.data;
    let google_queries =
      config.core.googlethis_multiple_query === 'true'
        ? data.prompts
        : [data.prompt];

    google_queries.length = Math.min(google_queries.length, 5);

    let google_query = google_queries.join(', ');

    io.to(session_id).emit('progress', {
      icon: 'google',
      message: `${tool}: Googling "${google_query}"`,
    });

    if (!google_query) {
      throw new Error('Google query not generated');
    }

    let promises: Promise<any>[] = [];

    let results: any = [];

    for (let i = 0; i < google_queries.length; i++) {
      promises.push(
        axios({
          method: 'post',
          url: `${GOOGLE_BASE_URL}/search?q=${google_queries[i]}`,
          data: {
            options: {
              safe: true,
              params: {},
            },
          },
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            results = [...results, ...response.data.results];
          })
          .catch((error) => console.log('error', error))
      );
    }

    await Promise.all(promises);

    if (results.length === 0) {
      io.to(session_id).emit('progress', {
        icon: 'error',
        message: `${tool}: No search results found. Please try again later.`,
      });
      io.to(session_id).emit('done');
      throw new Error('No search results found');
    }

    io.to(session_id).emit('progress', {
      icon: 'browser',
      message: `${tool}: Reading the search results`,
    });
    const responses: {
      url: string;
      text: string;
      favicon: string;
      description: string;
      title: string;
    }[] = [];

    promises = [];
    for (let i = 0; i < results.length; i++) {
      promises.push(
        fetch(BROWSER_BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: results[i]?.url,
            text: 'true',
            timeout: 6,
          }),
        })
          .then((response: Response) => response.json())
          .then((data: any) => {
            try {
              if (!data?.TEXT?.length) return;
              responses.push({
                text: data?.TEXT,
                url: results[i]?.url,
                favicon: results[i]?.favicons.high_res,
                description: results[i]?.description,
                title: results[i]?.title,
              });
            } catch (e: any) {
              console.log(e.message);
            }
          })
          .catch((error: any) => console.log('error', error))
      );
    }

    await Promise.all(promises);

    io.to(session_id).emit('progress', {
      icon: 'browser',
      message: `${tool}: BROWSER EFFECIENCY - ${(
        (responses.length / results.length) *
        100
      ).toFixed(2)}% for ${responses.length}/${results.length} results.`,
    });

    io.to(session_id).emit('progress', {
      icon: 'rag',
      message: `${tool}: Retrieveing necessary information`,
    });

    const QUERY = `${user_prompt} 
      Research Context: ${research_context}\n
      Chat History: ${chat_history_string}
    `;

    response = await axios({
      url: `${AI_BASE_URL}/get_context`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        query: google_query,
        context: responses,
      },
    });

    io.to(session_id).emit('progress', {
      icon: 'llm',
      message: `${tool}: Generating a response for you.`,
    });

    data = response.data;

    // @ts-ignore
    let sources: {
      title: string;
      description: string;
      url: string;
      favicon: string;
    }[] = [];

    if (typeof data === 'object') {
      data?.forEach((result: any) => {
        const existingSourceIndex = sources.findIndex(
          (source) => source.url === result?.url
        );

        if (existingSourceIndex === -1) {
          sources.push({
            title: result?.title,
            description: result?.description,
            url: result?.url,
            favicon: result?.favicon,
          });
        } else {
          sources[existingSourceIndex] = {
            ...sources[existingSourceIndex],
            title: result?.title,
            description: result?.description,
          };
        }
      });
    }

    let context = '';

    context += results?.knowledge_panel?.description + '\n';
    results.forEach((result: any) => {
      context += result?.title + '\n';
      context += result?.description + '\n';
    });

    context += '\n\n';

    if (typeof data === 'object') {
      data.forEach((result: any) => {
        context += result?.text + '\n';
      });
    }
    response = await axios({
      method: 'post',
      url: `${AI_BASE_URL}/generate_response`,
      data: {
        prompt: QUERY,
        schema: `{"answer": { "type": "str", "value":"answer goes here"  } }`,
        context: context,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let answer = `**${tool}**\n\n${response.data?.answer}`;

    io.to(session_id).emit('progress', {
      icon: 'llm',
      message: `${tool}: Got the answer for you.`,
    });

    if (!answer) {
      answer = 'Sorry, Something went wrong. Please try again later.';
    }

    io.to(session_id).emit('response', {
      tool,
      answer,
      sources,
    });

    store.append(session_id, {
      prompt: user_prompt,
      context: context,
      answer,
      sources,
    });

    return {
      response: answer,
      sources,
    };
  } catch (error) {
    io.to(session_id).emit('progress', {
      icon: 'error',
      message: `${tool}: Error occured. Please try again later. Error: ${error}`,
    });
    io.to(session_id).emit('done');
    throw error;
  }
}

export default researcher;
