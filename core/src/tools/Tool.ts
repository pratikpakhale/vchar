export default abstract class Tool {
  abstract invoke(
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
  }>;
}
