'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Mic,
  MicOff,
  Image as ImageIcon,
  X,
  Loader2,
  Bot,
  User as UserIcon,
  Languages,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'ur', name: 'اردو (Urdu)' },
];

export default function AIAgosPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hello! I'm your AI Assistant for PunarJal's wastewater treatment system. I can help you understand water treatment processes, simulation results, real-time dashboard data, and more. How can I assist you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Fix hydration issue by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if ((!input.trim() && !selectedImage) || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    const imageToSend = selectedImage;
    setSelectedImage(null);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai-agos/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          image: imageToSend,
          language: selectedLanguage,
          history: messages.slice(-10), // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content:
          'I apologize, but I encountered an error. Please try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: 'audio/webm',
        });
        await transcribeAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check your permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('language', selectedLanguage);

      const response = await fetch('/api/ai-agos/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to transcribe audio');
      }

      const data = await response.json();
      setInput(data.text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Failed to transcribe audio. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <Header />

      <div className="container mx-auto px-4 pt-24 pb-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl opacity-50"></div>
                <div className="relative bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full p-4">
                  <Bot className="h-8 w-8 text-white" />
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-200 via-blue-200 to-white bg-clip-text text-transparent">
                AI Assistant
              </h1>
            </div>
            <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
              Your intelligent assistant for wastewater treatment, real-time
              monitoring, and water quality management
            </p>

            {/* Language Selector */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <Languages className="h-4 w-4 text-white/60" />
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Chat Container */}
          <Card className="bg-black/20 backdrop-blur-2xl border-white/10 shadow-2xl">
            {/* Messages Area */}
            <div className="h-[60vh] overflow-y-auto p-6 space-y-6">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full p-2">
                          <Bot className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}

                    <div
                      className={`max-w-[70%] rounded-2xl p-4 ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                          : 'bg-white/10 text-white border border-white/10'
                      }`}
                    >
                      {message.image && (
                        <img
                          src={message.image}
                          alt="Uploaded"
                          className="rounded-lg mb-2 max-h-48 object-cover"
                        />
                      )}
                      <div className="whitespace-pre-wrap break-words text-sm md:text-base">
                        {message.content}
                      </div>
                      <div
                        className={`text-xs mt-2 ${
                          message.role === 'user'
                            ? 'text-white/70'
                            : 'text-white/50'
                        }`}
                      >
                        {isClient
                          ? message.timestamp.toLocaleTimeString()
                          : '--:--:-- --'}
                      </div>
                    </div>

                    {message.role === 'user' && (
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-2">
                          <UserIcon className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full p-2">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                    <Loader2 className="h-5 w-5 text-cyan-400 animate-spin" />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Image Preview */}
            {selectedImage && (
              <div className="px-6 pb-2">
                <div className="relative inline-block">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="h-20 w-20 rounded-lg object-cover border-2 border-cyan-500"
                  />
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 hover:bg-red-600 transition-colors"
                  >
                    <X className="h-3 w-3 text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-6 border-t border-white/10">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Ask me anything about PunarJal... ${
                      isRecording ? '(Recording...)' : ''
                    }`}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/40 resize-none focus-visible:ring-cyan-500 min-h-[60px]"
                    disabled={isLoading || isRecording}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  {/* Voice Recording Button */}
                  <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isLoading}
                    className={`h-[60px] px-4 ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-white/10 hover:bg-white/20'
                    } border border-white/10`}
                    title="Voice input"
                  >
                    {isRecording ? (
                      <MicOff className="h-5 w-5 text-white animate-pulse" />
                    ) : (
                      <Mic className="h-5 w-5 text-white" />
                    )}
                  </Button>

                  {/* Image Upload Button */}
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading || isRecording}
                    className="h-[60px] px-4 bg-white/10 hover:bg-white/20 border border-white/10"
                    title="Upload image"
                  >
                    <ImageIcon className="h-5 w-5 text-white" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />

                  {/* Send Button */}
                  <Button
                    onClick={handleSend}
                    disabled={
                      isLoading ||
                      isRecording ||
                      (!input.trim() && !selectedImage)
                    }
                    className="h-[60px] px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    ) : (
                      <Send className="h-5 w-5 text-white" />
                    )}
                  </Button>
                </div>
              </div>

              <p className="text-xs text-white/40 mt-2 text-center">
                AI Assistant is trained on PunarJal data. Press Shift+Enter for
                new line
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
