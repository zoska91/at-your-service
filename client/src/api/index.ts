import { useAuth } from '@clerk/clerk-react';

interface HeadersType {
  [key: string]: string;
}

export const endpoints = {
  createUser: 'user/create',
  message: 'chat/message',
  whisper: 'chat/whisper',
  getOpenaiApiKey: 'user/get-openai-api-key',
  addOpenaiApiKey: 'user/add-openai-api-key',
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface RequestOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  isForm?: boolean;
  addOpenaiApiKey?: boolean;
}

const useApi = () => {
  const { getToken } = useAuth();

  const getUrl = (url: string) => `${API_BASE_URL}/${url}`;
  const getOpenaiApiKey = async () => {
    const { openaiApiKey } = await get({ url: endpoints.getOpenaiApiKey });
    return openaiApiKey;
  };

  const getHeaders = async ({
    isForm,
    addOpenaiApiKey,
  }: Pick<RequestOptions, 'isForm' | 'addOpenaiApiKey'>): Promise<HeadersType> => {
    const cookies = document.cookie;
    const token = await getToken();

    const headers: HeadersType = {
      Cookie: cookies,
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    };

    if (!isForm) headers['Content-Type'] = 'application/json';

    if (addOpenaiApiKey) {
      const apiKey = await getOpenaiApiKey();
      if (apiKey) headers['openai-api-key'] = apiKey;
    }

    return headers;
  };

  const request = async (options: RequestOptions) => {
    const { url, method, body, isForm, addOpenaiApiKey } = options;
    const headers = await getHeaders({ isForm, addOpenaiApiKey });
    const fetchOptions: RequestInit = {
      method,
      headers,
      credentials: 'include',
    };

    if (body) {
      fetchOptions.body = isForm ? body : JSON.stringify(body);
    }

    const resp = await fetch(getUrl(url), fetchOptions);

    if (!resp.ok) {
      const error = { message: 'Request failed', status: resp.status, url };
      throw error;
    }

    const json = await resp.json();
    return json;
  };

  const get = async (options: Omit<RequestOptions, 'method'>) => {
    return request({ ...options, method: 'GET' });
  };

  const post = async (options: Omit<RequestOptions, 'method'>) => {
    return request({ ...options, method: 'POST' });
  };

  const put = async (options: Omit<RequestOptions, 'method'>) => {
    return request({ ...options, method: 'PUT' });
  };

  const deleteRequest = async (options: Omit<RequestOptions, 'method'>) => {
    return request({ ...options, method: 'DELETE' });
  };

  return { get, post, put, delete: deleteRequest };
};

export default useApi;
