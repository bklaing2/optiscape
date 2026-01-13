import { PUBLIC_OPENAI_API_URL } from '$env/static/public';
import { LLM_MUSIC_PROMPT } from '$lib/constants';
import type { Prompt } from '$lib/types';
import { loadSettings } from '$lib/util/storage';
import OpenAI, { type ClientOptions } from 'openai';

export function makeClient() {
  const settings = loadSettings()
  return new OpenAI({
    apiKey: settings.llmApiKey
  });
}

export default class LLM {
  private client: OpenAI;
  private model: string;

  constructor(llmOptions = {} satisfies ClientOptions, model = 'gpt-5.2') {
    this.client = new OpenAI({ ...llmOptions, baseURL: PUBLIC_OPENAI_API_URL ? `${PUBLIC_OPENAI_API_URL}/v1` : undefined, dangerouslyAllowBrowser: true });
    this.model = model;
  }

  async requestMusic(previousPassage: string, nextPassage: string, currentMusic: Prompt[]) {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "developer", content: LLM_MUSIC_PROMPT },
        { role: "user", content: buildMusicInput(previousPassage, nextPassage, currentMusic) }
      ],
    });

    return JSON.parse(response.choices[0].message.content || "null") as { anchor: string; prompts: Prompt[] } | null;
  }
}

function buildMusicInput(previousPassage: string, nextPassage: string, currentMusic: Prompt[]) {
  return `
  # Previous Passage

  ${previousPassage}

  # Current Music

  ${currentMusic}

  # Next Passage

  ${JSON.stringify(nextPassage)}
  `
}
