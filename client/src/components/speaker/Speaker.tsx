import { useEffect, useRef, useState } from 'react';
import useApi, { endpoints } from '../../api';
import { useWhisper } from '../../hooks/useWhisper/useWhisper';
import { Howl } from 'howler';

type AudioQueueItem = {
  url: string;
  sequence: number;
};

const Speaker = () => {
  const { get } = useApi();

  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [audioQueue, setAudioQueue] = useState<AudioQueueItem[]>([]);
  const [status, setStatus] = useState<string>('Waiting...');
  const sentence = useRef<string>('');
  const [streamingAnswer, setStreamingAnswer] = useState<string>('');
  const sequenceNum = useRef<number>(0);
  const isPlayingRef = useRef<boolean>(false);

  const { post } = useApi();

  useEffect(() => {
    if (audioQueue.length > 0 && !isStreaming) {
      playNextAudio();
    }
  }, [audioQueue, isStreaming]);

  const fetchAudioAndEnqueue = async (sentence: string, sequence: number) => {
    try {
      const { openaiApiKey } = await get({ url: endpoints.getOpenaiApiKey });
      const respAudioAi = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + openaiApiKey,
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: sentence,
          voice: 'onyx',
          response_format: 'mp3',
        }),
      });

      const blob = await respAudioAi.blob();
      const url = URL.createObjectURL(blob);

      setAudioQueue((prev) => [...prev, { url, sequence }]);
    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };

  const streamAudio = async (reader: ReadableStreamDefaultReader<Uint8Array>) => {
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        console.log('Streaming completed');
        setIsStreaming(false);
        setStatus('Streaming completed.');
        break;
      }

      if (value) {
        const token = decoder.decode(value);
        sentence.current += token;
        setStreamingAnswer((prev) => prev + token);

        if (/[.?!]/.test(sentence.current)) {
          const stopIndex = sentence.current.search(/[,.?!]/);
          const sentenceToPlay = sentence.current.slice(0, stopIndex + 1).trim();
          sentence.current = sentence.current.slice(stopIndex + 1).trim();
          const currentSequence = sequenceNum.current++;

          await fetchAudioAndEnqueue(sentenceToPlay, currentSequence);
        }
      }
    }
  };

  const playNextAudio = () => {
    if (audioQueue.length === 0) {
      isPlayingRef.current = false;
      return;
    }

    if (isPlayingRef.current) return;

    const nextAudioItem = audioQueue.shift();
    if (nextAudioItem) {
      const sound = new Howl({
        src: [nextAudioItem.url],
        format: ['mp3'],
        onend: () => {
          URL.revokeObjectURL(nextAudioItem.url);
          setAudioQueue((prevQueue) => [...prevQueue]);
          isPlayingRef.current = false;
          playNextAudio();
        },
      });

      isPlayingRef.current = true;
      sound.play();
    }
  };

  const onTranscribe = async (blob: Blob) => {
    const file = new File([blob], 'speech.mp3', { type: 'audio/mpeg' });
    const formData = new FormData();
    formData.append('file', file);

    const reader = await post({
      url: endpoints.chatAudio,
      body: formData,
      isForm: true,
      addOpenaiApiKey: true,
      isStreaming: true,
    });

    streamAudio(reader);

    return {
      blob,
      text: '',
    };
  };

  const { transcript, recording, startRecording, stopRecording } = useWhisper({
    onTranscribe,
  });

  return (
    <>
      {recording ? (
        <button onClick={stopRecording}>stop</button>
      ) : (
        <button onClick={startRecording}>start</button>
      )}
      <p>{transcript.text}</p>
    </>
  );
};

export default Speaker;
