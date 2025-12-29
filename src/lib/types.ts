export type Settings = {
  llmApiKey?: string;
}

export type ID<T> = { id: T };
export type Fn<A = never, R = unknown> = (...args: A[]) => R;
