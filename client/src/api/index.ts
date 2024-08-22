import { useAuth } from '@clerk/clerk-react';

interface HeadersType {
  [key: string]: string;
}

export const endpoints = {
  createUser: 'user/create',

  message: 'chat/message',
  whisper: 'chat/whisper',
  getKey: 'chat/get-key',
};

const API_BASE_URL = import.meta.env.VITE_API_URL;

const useApi = () => {
  const { getToken } = useAuth();

  const getUrl = (url: string) => `${API_BASE_URL}/${url}`;

  const getHeaders = async (isForm = false): Promise<HeadersType> => {
    const token = await getToken();
    const contentTypeHeader = isForm ? null : { 'Content-Type': 'multipart/form-data' };

    return {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
      ...contentTypeHeader,
    };
  };

  const request = async (url: string, method: string, body: any = null, isForm = false) => {
    const headers = await getHeaders(isForm);

    const fetchOptions: RequestInit = {
      method,
      headers,
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

  const get = async (url: string, params: Record<string, any> = {}) => {
    const searchParams = new URLSearchParams(params).toString();
    return request(`${url}?${searchParams}`, 'GET');
  };

  const post = async (url: string, body: any, isForm?: boolean) =>
    request(url, 'POST', body, isForm);

  const put = async (url: string, body: any) => request(url, 'PUT', body);

  const deleteRequest = async (url: string) => request(url, 'DELETE');

  return { get, post, put, delete: deleteRequest };
};

export default useApi;
