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
    this.client = new OpenAI({ dangerouslyAllowBrowser: true, ...llmOptions });
    this.model = model;
  }

  async requestMusic(previousPassage: string, nextPassage: string, currentMusic: Prompt[]) {
    const response = await this.client.responses.create({
      model: this.model,
      instructions: LLM_MUSIC_PROMPT,
      input: buildMusicInput(previousPassage, nextPassage, currentMusic),
      reasoning: { effort: 'none' },
    });

    return JSON.parse(response.output_text) as { anchor: string; prompts: Prompt[] } | null;
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
