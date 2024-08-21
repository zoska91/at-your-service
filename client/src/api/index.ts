import { useAuth } from '@clerk/clerk-react';

interface HeadersType {
  [key: string]: string;
}

export const endpoints = {
  createUser: 'user/create',

  message: 'chat/message',
  getKey: 'chat/get-key',
};

const API_BASE_URL = 'http://localhost:9000/api';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

const useApi = () => {
  const { getToken } = useAuth();

  const getUrl = (url: string) => `${API_BASE_URL}/${url}`;

  const getHeaders = async (isForm = false): Promise<HeadersType> => {
    const token = await getToken();
    const formHeader = isForm ? { 'Content-Type': 'multipart/form-data' } : null;
    return {
      ...headers,
      Authorization: `Bearer ${token}`,
      ...formHeader,
    };
  };

  const request = async (url: string, method: string, body: any = null, isForm = false) => {
    const headers = await getHeaders(isForm);

    const fetchOptions: RequestInit = {
      method,
      headers,
    };

    if (body) {
      fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body);
    }

    const resp = await fetch(getUrl(url), fetchOptions);

    if (!resp.ok) {
      const error = { message: 'Request failed', status: resp.status, url };
      throw error;
    }

    const json = await resp.json();
    return json;
  };

  const get = async (url: string, params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    return request(`${url}?${searchParams}`, 'GET');
  };

  const post = async (url: string, body: any) => request(url, 'POST', body);

  const put = async (url: string, body: any) => request(url, 'PUT', body);

  const deleteRequest = async (url: string) => request(url, 'DELETE');

  return { get, post, put, delete: deleteRequest };
};

export default useApi;
