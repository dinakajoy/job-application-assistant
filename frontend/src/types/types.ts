export interface IResponse {
  status: string;
  message?: string;
  payload?: string;
}

export type ISugestion = {
  missing: string;
  suggestion: string;
  section: string;
};
export interface ISugestionResponse {
  status: string;
  message?: string;
  payload?: ISugestion[];
}
