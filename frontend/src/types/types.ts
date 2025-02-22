export interface IResponse {
  status: string;
  message?: string;
  payload?: string;
}

export interface ISugestionResponse {
  status: string;
  message?: string;
  payload?: string[];
}