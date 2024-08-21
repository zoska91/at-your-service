import useApi, { endpoints } from '../../api';
import { useWhisper } from '../../hooks/useWhisper/useWhisper';

const Speaker = () => {
  const { post } = useApi();

  const onTranscribe = async (blob: Blob) => {
    const file = new File([blob], 'speech.mp3', { type: 'audio/mpeg' });
    const formData = new FormData();
    formData.append('file', file);

    const response = await post(endpoints.whisper, formData, true);

    return {
      blob,
      text: response.text,
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
