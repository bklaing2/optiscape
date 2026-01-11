import type { Prompt } from '$lib/types';
import { loadSettings } from '$lib/util/storage';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import LLM from './llm';
import Lyria from './lyria';

export const ssr = false
export const prerender = false

export const load: PageLoad = async () => {
  const settings = loadSettings();

  if (!settings.llmApiKey) error(400, { message: 'No OpenAI API key provided in settings.' });
  if (!settings.geminiApiKey) error(400, { message: 'No Gemini API key provided in settings.' });

  // Set up LLM
  const llm = new LLM({ apiKey: settings.llmApiKey });

  // Set up Lyria
  const lyria = new Lyria({ apiKey: settings.geminiApiKey });

  return { llm, lyria }
}
