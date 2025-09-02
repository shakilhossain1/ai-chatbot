import { set, useForm } from 'react-hook-form';
import axios from 'axios';
import { FaArrowUp } from 'react-icons/fa';
import ReactMarkDown from 'react-markdown';
import { Button } from './ui/button';
import { useEffect, useRef, useState } from 'react';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  content: string;
  role: 'user' | 'bot';
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState('');
  const conversationId = useRef(crypto.randomUUID());
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async ({ prompt }: FormData) => {
    try {
      setMessages((prev) => [...prev, { content: prompt, role: 'user' }]);
      setIsBotTyping(true);
      setError('');

      reset({ prompt: '' });

      const { data } = await axios.post<ChatResponse>('api/chat', {
        prompt,
        conversationId: conversationId.current,
      });

      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
    } catch (error) {
      console.log(error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsBotTyping(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const onCopyMessage = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            onCopy={onCopyMessage}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`px-3 py-1 rounded-xl ${
              message.role === 'user'
                ? 'bg-blue-600 text-white self-end'
                : 'bg-gray-100 text-black self-start'
            }`}
          >
            <ReactMarkDown>{message.content}</ReactMarkDown>
          </div>
        ))}
        {isBotTyping && (
          <div className="flex gap-1 px-3 py-3 bg-gray-200 rounded-xl self-start">
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
          </div>
        )}
        {error && <div className="text-red-500">{error}</div>}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (value) => value.trim().length > 0,
          })}
          className="w-full border-0 focus:outline-0 resize-none "
          placeholder="Ask anything..."
          autoFocus
          maxLength={1000}
        />
        <Button
          disabled={!formState.isValid}
          className="rounded-full"
          size={'icon'}
          type="submit"
        >
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default Chatbot;
