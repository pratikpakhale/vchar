import Tool from '../Tool';

import researcher from '../researcher/index';

export default class GenericResearch extends Tool {
  async invoke(user_prompt: string, session_id: string) {
    const research_context =
      'You are a general purpose research agent which will search the web to satisfy user quries';

    const response = await researcher(
      user_prompt,
      research_context,
      session_id,
      'Generic Researcher'
    );

    return response;
  }
}
