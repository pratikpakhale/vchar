import Tool from '../Tool';
import axios from 'axios';
import { getURL } from '../../utils';
import { io } from '../../app';

import { JSONStore } from '../../store';
const AI_BASE_URL = getURL('ai');
const TRADINGVIEW_BASE_URL = getURL('tradingview');

export default class TechnicalAnalysis extends Tool {
  async invoke(
    user_prompt: string,
    session_id: string
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
      const tool = 'Technical Analysis';
      const store = new JSONStore();

      io.to(session_id).emit('progress', {
        icon: 'tool',
        message: 'Running ' + tool,
      });
      const llmResponse = await axios.post(
        `${AI_BASE_URL}/generate_response`,
        {
          prompt: user_prompt,
          schema: `{
                "company": { "type": "str", "value":"name of the company user wants to search" },
                "interval": { "type": "str", "value": "time range of information user wants to search" }
              }`,
          context:
            'Given the following user prompt, identify the company name from the given prompt',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(llmResponse.data);

      const company_name = llmResponse.data?.company;
      const interval = llmResponse?.data?.interval || '7d';
      io.to(session_id).emit('progress', {
        icon: 'rag',
        message: tool + ': Looking for ' + company_name,
      });

      const tradingViewResponse = await axios.get(
        `${TRADINGVIEW_BASE_URL}/tradingview?company_name=${company_name}&interval=${interval}`
      );

      const values = tradingViewResponse.data.values;
      const symbol = tradingViewResponse.data.symbol;

      io.to(session_id).emit('progress', {
        icon: 'llm',
        message: tool + ': Research done. Generating a response for you',
      });

      const research = await axios.post(
        `${AI_BASE_URL}/generate_response`,
        {
          prompt: `
                Given the following user prompt,  based on the data of the values of the company's stock price, generate a technical analysis of the company's stock price.
                what the factors would affect and what would be the risks and benefits of investing in the company's stock.

                

                user prompt : This are the values of the stock prices and values in json format are ${JSON.stringify(
                  values
                )}

                STRICTLY RESPOND ONLY IN BELOW JSON FORMAT
              `,
          schema: `{"analysis": { "type": "str", "value":"technical analysis of the company's stock price" }}`,
          context: 'no context, use your known knowledge of LLM',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      // @ts-ignore
      const answer = research.data.analysis;

      const sources = [
        {
          title: 'TradingView',
          description: `Technical Analysis of ${company_name} `,
          url: `http://in.tradingview.com/symbols/BSE-${symbol}`,
          favicon: 'https://www.tradingview.com/static/images/favicon.ico',
        },
      ];

      io.to(session_id).emit('response', {
        tool,
        answer,
        sources,
      });

      store.append(session_id, {
        prompt: user_prompt,
        context: JSON.stringify(values),
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
        message: `Technical Ananlysis: Error occured. Please try again later. Error: ${error}`,
      });
      io.to(session_id).emit('done');
      throw error;
    }
  }
}
