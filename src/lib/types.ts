export type Settings = {
  llmApiKey?: string;
  geminiApiKey?: string;
}

export type Prompt = {
  readonly promptId?: string;
  text: string;
  weight: number;
  cc?: number;
  color?: string;
}

export type ID<T> = { id: T };
export type Fn<A = never, R = unknown> = (...args: A[]) => R;
