import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';

import Answer from './Answer';
import AnswerSkeleton from './AnswerSkeleton';
import { io } from 'socket.io-client';

import SearchAdditional from './SearchAdditional';

export default function OutputContainer() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState([]);
  const [answers, setAnswers] = useState<string[]>([]);
  const [sources, setSources] = useState([]);

  const { id } = useParams();

  const prompt = localStorage.getItem(id || '');

  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState<number>(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = () => {
    if (!isRunning) {
      const startTime = Date.now() - time;
      intervalRef.current = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 100);
      setIsRunning(true);
    }
  };

  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
  };

  const formatTime = (time: number): string => {
    const padTime = (time: number): string => {
      return time.toString().padStart(2, '0');
    };
    const minutes = padTime(Math.floor((time / 1000 / 60) % 60));
    const seconds = padTime(Math.floor((time / 1000) % 60));
    return `${minutes}:${seconds}`;
  };

  const [deeperInputLoading, setDeeperInputLoading] = useState(false);

  const handleSubmitPrompt = (deeperPrompt: string) => {
    if (deeperPrompt) {
      setProgress([
        // @ts-ignore
        { icon: 'rag', message: `Researching for ${deeperPrompt}` },
        ...progress,
      ]);

      try {
        fetch(
          import.meta.env.VITE_APP_SERVER_ENDPOINT +
            `/search?prompt=${deeperPrompt}&id=${id}&deeper=true`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (e) {
        console.log(e);
      }
      console.log('refresh?');
      setDeeperInputLoading(true);
      start();
    }
  };

  useEffect(() => {
    if (id?.length === 0 || !id || !prompt) return;

    const socket = io(
      `${import.meta.env.VITE_APP_SERVER_ENDPOINT}?sessionId=${id}`
    );

    // @ts-ignore
    socket.on('progress', (data) => {
      // @ts-ignore
      setProgress((prev) => [data, ...prev]);
      if (data.icon === 'error') {
        setIsLoading(false);
        setDeeperInputLoading(false);
        stop();
      }
    });
    socket.on('response', (data) => {
      setIsLoading(false);
      setDeeperInputLoading(false);

      // @ts-ignore
      setAnswers((prev) => [...prev, data?.answer]);
      // @ts-ignore
      setSources((prev) => [...prev, ...data?.sources]);
    });
    socket.on('done', () => {
      stop();
      setDeeperInputLoading(false);
    });

    start();
    fetch(
      import.meta.env.VITE_APP_SERVER_ENDPOINT +
        `/search?prompt=${prompt}&id=${id}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return () => {
      socket.disconnect();
    };
  }, [id]);

  return (
    <div className="h-full w-full  flex justify-center items-start overflow-y-auto">
      {!isLoading ? (
        <Answer
          prompt={prompt || ''}
          sources={sources}
          answers={answers}
          progress={progress}
          time={formatTime(time)}
        />
      ) : (
        <AnswerSkeleton
          prompt={prompt || ''}
          progress={progress}
          time={formatTime(time)}
        />
      )}

      <div className=" flex absolute bottom-5 p-4 w-2/3 items-center justify-center">
        <SearchAdditional
          submit={handleSubmitPrompt}
          disabled={isLoading || deeperInputLoading}
          isLoading={deeperInputLoading}
        />
      </div>
    </div>
  );
}
