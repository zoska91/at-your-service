import { Navigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';
import { FormEvent, useRef } from 'react';
import Speaker from '../components/speaker/Speaker';
import useApi, { endpoints } from '../api';

const ChatPage = () => {
  const { isLogin } = useUser();
  const { post } = useApi();

  const apiKeyRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    if (!apiKeyRef?.current?.value) return;
    event.preventDefault();
    const apiKey = apiKeyRef.current.value;

    try {
      await post({ url: endpoints.addOpenaiApiKey, body: { apiKey } });
    } catch (error) {
      console.error('Failed to save API key', error);
    }
  };

  if (!isLogin) return <Navigate to='/chat' />;

  return (
    <div>
      chat
      <Speaker />
      <form onSubmit={handleSubmit}>
        <input name='openai-api-key' ref={apiKeyRef} required />
      </form>
    </div>
  );
};

export default ChatPage;
