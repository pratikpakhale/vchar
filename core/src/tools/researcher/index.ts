import axios from 'axios';

import { getURL } from '../../utils';

const BROWSER_BASE_URL = getURL('browser');
const GOOGLE_BASE_URL = getURL('googlethis');
const AI_BASE_URL = getURL('ai');

import googlethisTemplate from './googlethis_template';

import { io } from '../../app';

async function researcher(
  user_prompt: string,
  research_context: string,
  session_id: string,
  tool: string
) {
  try {
    io.to(session_id).emit('progress', {
      icon: 'tool',
      message: 'Running ' + tool,
    });

    io.to(session_id).emit('progress', {
      icon: 'google',
      message: `${tool}: Generating Google search query`,
    });

    let response = await axios({
      method: 'post',
      url: `${AI_BASE_URL}/generate_response`,
      data: {
        prompt: googlethisTemplate(user_prompt, research_context),
        schema: `{"prompt": { "type": "str", "value":"google search query based on research context and user prompt"  } }`,
        context: 'No context, use your known knowledge of LLM',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let data = response.data;
    const google_query = data.prompt;

    io.to(session_id).emit('progress', {
      icon: 'google',
      message: `${tool}: Googling "${google_query}"`,
    });

    if (!google_query) {
      throw new Error('Google query not generated');
    }

    response = await axios({
      method: 'post',
      url: `${GOOGLE_BASE_URL}/search?q=${google_query}`,
      data: {
        options: {
          safe: true,
          params: {},
        },
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    data = response.data;

    const results = data.results;

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

    const promises: Promise<any>[] = [];
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
            responses.push({
              text: data?.TEXT,
              url: results[i]?.url,
              favicon: results[i]?.favicons.high_res,
              description: results[i]?.description,
              title: results[i]?.title,
            });
          })
          .catch((error: any) => console.log('error', error))
      );
    }

    await Promise.all(promises);

    io.to(session_id).emit('progress', {
      icon: 'rag',
      message: `${tool}: Reading done. Retrieveing necessary information`,
    });

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
      message: `${tool}: Retrieved necessary information. Generating a response for you`,
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
        prompt: user_prompt,
        schema: `{"answer": { "type": "str", "value":"answer goes here"  } }`,
        context: context,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    let answer = response.data?.answer;

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
