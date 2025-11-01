
"use client";

/* eslint-disable */

import { handleHybridAiFlow } from "@/lib/hybridAi";
import { useUser } from "@clerk/nextjs";
import { useEffect, useRef, useState } from "react";
import { Card } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { checkChromeAiAvailability, promptChromeAi, destroyChromeAiSession } from "@/lib/chromeAi";
import { translateText, checkTranslatorAvailability, destroyAllTranslators } from "@/lib/chromeTranslator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

// Declare SpeechRecognition types
interface SpeechRecognitionType {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionType;
    webkitSpeechRecognition: new () => SpeechRecognitionType;
  }
}

const SpeechRecognition = 
  typeof window !== 'undefined' 
    ? (window.SpeechRecognition || window.webkitSpeechRecognition) 
    : undefined;

type Message = { 
  content: string; 
  role: 'user' | 'assistant' | 'system'; 
  speaker?: string;
  translated?: string;
  originalLang?: string;
  targetLang?: string;
};

function Widget() {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [callEnded, setCallEnded] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [partialAi, setPartialAi] = useState<string | null>(null);
  const [targetLanguage, setTargetLanguage] = useState<string>("en");
  const [translatorAvailable, setTranslatorAvailable] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const { user, isLoaded } = useUser();
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);
  const debounceRef = useRef<number | null>(null);
  const waveHeightsRef = useRef<number[]>([30, 50, 40, 60, 35]);

  // Check translator availability on mount
  useEffect(() => {
    checkTranslatorAvailability().then(setTranslatorAvailable);
  }, []);

  // auto-scroll for messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // setup speech recognition
  useEffect(() => {
    if (!SpeechRecognition) return;
    try {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript;
        const newMessage: Message = { content: transcript, role: 'user' };
        setMessages((prev) => [...prev, newMessage]);

        // Process with AI (try Chrome built-in first, fallback to server)
        try {
          setIsSpeaking(true);
          try { recognitionRef.current?.stop?.(); } catch { /* ignore */ }

          const userId = (user as unknown as { id?: string })?.id || 'guest';
          
          let aiText = '';
          
          // Try Chrome built-in AI first
          console.log('[Widget Voice] Checking Chrome AI availability...');
          const chromeAiAvailable = await checkChromeAiAvailability();
          console.log('[Widget Voice] Chrome AI available:', chromeAiAvailable);
          
          if (chromeAiAvailable) {
            try {
              console.log('[Widget Voice] Calling Chrome AI...');
              aiText = await promptChromeAi(transcript);
              console.log('[Widget Voice] Chrome AI response:', aiText);
            } catch (error) {
              console.warn('[Widget Voice] Chrome AI failed, using fallback:', error);
            }
          }
          
          // Fallback to server API if Chrome AI not available or failed
          if (!aiText) {
            console.log('[Widget Voice] Using server API (Gemini)...');
            const aiResponse = await handleHybridAiFlow(userId, transcript, targetLanguage || 'en');
            console.log('[Widget Voice] Full aiResponse object:', aiResponse);
            aiText = aiResponse.summary ?? aiResponse.aiResponse ?? aiResponse.translated ?? String(aiResponse);
            console.log('[Widget Voice] Extracted aiText:', aiText);
          }

          const aiMessage: Message = { content: aiText || 'No response generated', role: 'assistant' };
          console.log('[Widget Voice] Adding AI message to state:', aiMessage);
          setMessages((prev) => {
            const updated = [...prev, aiMessage];
            console.log('[Widget Voice] Updated messages array:', updated);
            return updated;
          });

          // Restart recognition immediately (no TTS)
          try { if (callActive) recognitionRef.current?.start?.(); } catch { /* ignore */ }
        } catch (error) {
          console.error('AI processing error:', error);
          const errorMessage: Message = { content: "Sorry, I couldn't process that request.", role: 'assistant' };
          setMessages((prev) => [...prev, errorMessage]);
        } finally {
          setIsSpeaking(false);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error ?? event);
        setCallActive(false);
        setConnecting(false);
      };

      recognitionRef.current.onend = () => {
        if (callActive) {
          // Restart recognition if call is still active
          try { recognitionRef.current?.start?.(); } catch { /* ignore */ }
        }
      };
    } catch {
      console.warn('Speech recognition initialization failed');
    }

    return () => {
      try { recognitionRef.current?.stop?.(); } catch { /* ignore */ }
      destroyChromeAiSession();
      destroyAllTranslators();
    };
  }, [user, callActive]);

  const toggleCall = () => {
    if (callActive) {
      setCallActive(false);
      setCallEnded(true);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    } else {
      setConnecting(true);
      setMessages([]);
      setCallEnded(false);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setConnecting(false);
          setCallActive(true);
        } catch (error) {
          console.error("Failed to start speech recognition:", error);
          setConnecting(false);
        }
      }
    }
  };

  // Load an example conversation from the new /api/conversation endpoint
  const loadExampleConversation = async () => {
    try {
      setConnecting(true);
      // sample request: topic and speakers
      const res = await fetch('/api/conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: 'haircut ideas for thin curly hair',
          speakers: ['Alex', 'Priya'],
          turns: 6,
          format: 'json',
        }),
      });
      const data = await res.json();
      if (data?.conversation && Array.isArray(data.conversation)) {
        const conv = data.conversation.map((c: any) => ({ content: String(c.text ?? c.message ?? ''), role: 'assistant' as const, speaker: String(c.speaker ?? '') }));
        setMessages(conv);
      } else if (data?.raw) {
        setMessages([{ content: String(data.raw), role: 'assistant' }]);
      } else {
        setMessages([{ content: 'No conversation returned', role: 'assistant' }]);
      }
    } catch (err) {
      console.error('Conversation load error', err);
      setMessages([{ content: 'Failed to load conversation', role: 'assistant' }]);
    } finally {
      setConnecting(false);
    }
  };

  const handleAcceptSuggestion = () => {
    if (!partialAi) return;
    setTextInput(partialAi);
    setPartialAi(null);
  };

  const handleSendSuggestion = async () => {
    if (!partialAi) return;
    const suggestion = partialAi;
    setPartialAi(null);

    const newMessage: Message = { content: suggestion, role: 'user' };
    setMessages((prev) => [...prev, newMessage]);

    try {
      setIsSpeaking(true);
      try { recognitionRef.current?.stop?.(); } catch { /* ignore */ }

      const userId = (user as unknown as { id?: string })?.id || 'guest';
      
      let aiText = '';
      
      // Try Chrome built-in AI first
      if (await checkChromeAiAvailability()) {
        try {
          aiText = await promptChromeAi(suggestion);
        } catch (error) {
          console.warn('[Widget Suggestion] Chrome AI failed, using fallback:', error);
        }
      }
      
      // Fallback to server API
      if (!aiText) {
        const aiResponse = await handleHybridAiFlow(userId, suggestion, targetLanguage || 'en');
        aiText = aiResponse.summary ?? aiResponse.aiResponse ?? aiResponse.translated ?? String(aiResponse);
      }

      const aiMessage: Message = { content: aiText, role: 'assistant' };
      setMessages((prev) => [...prev, aiMessage]);

      // Restart recognition immediately (no TTS)
      try { if (callActive) recognitionRef.current?.start?.(); } catch { /* ignore */ }
    } catch (err) {
      console.error('AI suggestion send error', err);
      setMessages((prev) => [...prev, { content: "Sorry, couldn't send suggestion", role: 'assistant' }]);
    } finally {
      setIsSpeaking(false);
    }
  };

  const handleSendMessage = async () => {
    if (!textInput.trim()) return;

    const message = textInput.trim();
    setTextInput('');

    const newMessage: Message = { content: message, role: 'user' };
    setMessages((prev) => [...prev, newMessage]);

    try {
      setIsSpeaking(true);
      try { recognitionRef.current?.stop?.(); } catch { /* ignore */ }

      const userId = (user as unknown as { id?: string })?.id || 'guest';
      
      let aiText = '';
      
      // Try Chrome built-in AI first
      console.log('[Widget Text] Checking Chrome AI availability...');
      const chromeAiAvailable = await checkChromeAiAvailability();
      console.log('[Widget Text] Chrome AI available:', chromeAiAvailable);
      
      if (chromeAiAvailable) {
        try {
          console.log('[Widget Text] Calling Chrome AI...');
          aiText = await promptChromeAi(message);
          console.log('[Widget Text] Chrome AI response:', aiText);
        } catch (error) {
          console.warn('[Widget Text] Chrome AI failed, using fallback:', error);
        }
      }
      
      // Fallback to server API if Chrome AI not available or failed
      if (!aiText) {
        console.log('[Widget Text] Using server API (Gemini)...');
        const aiResponse = await handleHybridAiFlow(userId, message, targetLanguage || 'en');
        console.log('[Widget Text] Full aiResponse object:', aiResponse);
        aiText = aiResponse.summary ?? aiResponse.aiResponse ?? aiResponse.translated ?? String(aiResponse);
        console.log('[Widget Text] Extracted aiText:', aiText);
      }

      const aiMessage: Message = { content: aiText || 'No response generated', role: 'assistant' };
      console.log('[Widget Text] Adding AI message to state:', aiMessage);
      setMessages((prev) => {
        const updated = [...prev, aiMessage];
        console.log('[Widget Text] Updated messages array:', updated);
        return updated;
      });

      // Restart recognition immediately (no TTS)
      try { if (callActive) recognitionRef.current?.start?.(); } catch { /* ignore */ }
    } catch (error) {
      console.error('AI processing error:', error);
      const errorMessage: Message = { content: "Sorry, I couldn't process that request.", role: 'assistant' };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSpeaking(false);
    }
  };

  // Debounced live suggestions while typing (as-you-type replies)
  useEffect(() => {
    if (!callActive) return;
    if (!textInput || textInput.trim().length === 0) {
      setPartialAi(null);
      return;
    }

    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(async () => {
      try {
  const userId = (user as unknown as { id?: string })?.id || 'guest';
        const aiResponse = await handleHybridAiFlow(userId, textInput, 'es');
        const aiText = aiResponse.summary ?? aiResponse.aiResponse ?? aiResponse.translated ?? String(aiResponse);
        setPartialAi(aiText);
      } catch (err) {
        console.error('Suggestion error', err);
        setPartialAi(null);
      }
    }, 600);

    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [textInput, callActive, user]);

  if (!isLoaded) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 flex flex-col overflow-hidden pb-20">
      {/* TITLE */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold font-mono">
          <span>Talk to Your </span>
          <span className="text-primary uppercase">AI Hairdresser Assistant</span>
        </h1>
        <p className="text-muted-foreground mt-2">
          Have a voice conversation with our AI assistant for hairstyles
        </p>
      </div>

      {/* VIDEO CALL AREA */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* AI ASSISTANT CARD */}

        <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative">
          <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
            {/* AI VOICE ANIMATION */}
            <div
              className={`absolute inset-0 ${
                isSpeaking ? "opacity-30" : "opacity-0"
              } transition-opacity duration-300`}
            >
              {/* voice wave animation when speaking */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center items-center h-20">
                {waveHeightsRef.current.map((h, i) => (
                   
                  <div
                    key={i}
                    className={`mx-1 h-16 w-1 bg-primary rounded-full ${isSpeaking ? "animate-sound-wave" : ""}`}
                    style={{ animationDelay: `${i * 0.1}s`, height: isSpeaking ? `${h}%` : '5%' }}
                  />
                ))}
              </div>
            </div>

            {/* AI LOGO */}
            <div className="relative size-32 mb-4">
              <div
                className={`absolute inset-0 bg-primary opacity-10 rounded-full blur-lg ${
                  isSpeaking ? "animate-pulse" : ""
                }`}
              />

              <div className="relative w-full h-full rounded-full bg-card flex items-center justify-center border border-border overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-primary/5"></div>
                <Image
                  src="/logo.png"
                  alt="AI Hairdresser Assistant"
                  width={80}
                  height={80}
                  className="w-20 h-20 object-contain"
                />
              </div>
            </div>

            <h2 className="text-xl font-bold text-foreground">Bata AI</h2>
            <p className="text-sm text-muted-foreground mt-1">Hairdresser Assistant</p>

            {/* SPEAKING INDICATOR */}
            <div
              className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border ${
                isSpeaking ? "border-primary" : ""
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full ${
                  isSpeaking ? "bg-primary animate-pulse" : "bg-muted"
                }`}
              />

              <span className="text-xs text-muted-foreground">
                {isSpeaking
                  ? "Speaking..."
                  : callActive
                  ? "Listening..."
                  : callEnded
                  ? "Call ended"
                  : "Waiting..."}
              </span>
            </div>
          </div>
        </Card>

        {/* USER CARD */}
        <Card className={`bg-card/90 backdrop-blur-sm border overflow-hidden relative`}>
          <div className="aspect-video flex flex-col items-center justify-center p-6 relative">
            {/* User Image */}
            <div className="relative size-32 mb-4">
              <Image
                src={user?.imageUrl || "/default-avatar.png"}
                alt="User"
                width={128}
                height={128}
                className="size-full object-cover rounded-full"
              />
            </div>

            <h2 className="text-xl font-bold text-foreground">You</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {user ? (user.firstName + " " + (user.lastName || "")).trim() : "Guest"}
            </p>

            {/* User Ready Text */}
            <div className={`mt-4 flex items-center gap-2 px-3 py-1 rounded-full bg-card border`}>
              <div className={`w-2 h-2 rounded-full bg-muted`} />
              <span className="text-xs text-muted-foreground">Ready</span>
            </div>
          </div>
        </Card>
      </div>

      {/* MESSAGE CONTAINER */}
      {(messages.length > 0 || callActive) && (
        <div
          ref={messageContainerRef}
          className="w-full bg-card/90 backdrop-blur-sm border border-border rounded-xl p-4 mb-8 h-64 overflow-y-auto transition-all duration-300 scroll-smooth"
        >
          {/* DEBUG INFO */}
          <div className="text-xs text-muted-foreground mb-2 font-mono">
            Messages count: {messages.length} | Call active: {String(callActive)} | Speaking: {String(isSpeaking)}
          </div>
          <div className="space-y-3">
            {messages.map((msg, index) => {
              const speakerLabel = msg.speaker ? msg.speaker : (msg.role === 'assistant' ? 'Bata AI' : 'You');
              return (
                <div key={index} className="message-item animate-in fade-in duration-300">
                  <div className="font-semibold text-xs text-muted-foreground mb-1">{speakerLabel}:</div>
                  <p className="text-foreground">{msg.content}</p>
                </div>
              );
            })}

            {callEnded && (
              <div className="message-item animate-in fade-in duration-300">
                <div className="font-semibold text-xs text-primary mb-1">System:</div>
                <p className="text-foreground">Call ended. Thank you for using Bata AI!</p>
              </div>
            )}

            {callActive && messages.length === 0 && (
              <div className="message-item animate-in fade-in duration-300">
                <div className="font-semibold text-xs text-primary mb-1">System:</div>
                <p className="text-foreground">Call started. You can speak or type your message.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEXT INPUT */}
      {callActive && (
        <div className="w-full flex gap-2 mb-4">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-card/90 backdrop-blur-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={handleSendMessage} disabled={!textInput.trim()}>
            Send
          </Button>
        </div>
      )}
      {callActive && partialAi && (
        <div className="w-full mb-4 p-3 bg-muted/20 rounded flex items-start justify-between">
          <div className="flex-1 text-sm italic text-muted-foreground">{partialAi}</div>
          <div className="flex gap-2 ml-4">
            <Button onClick={handleAcceptSuggestion} variant="outline">Use</Button>
            <Button onClick={handleSendSuggestion}>Send</Button>
          </div>
        </div>
      )}

      {/* CALL CONTROLS */}
      <div className="w-full flex justify-center gap-4">
        <Button
          className={`w-44 text-xl rounded-3xl ${
            callActive
              ? "bg-destructive hover:bg-destructive/90"
              : callEnded
              ? "bg-red-500 hover:bg-red-700"
              : "bg-primary hover:bg-primary/90"
          } text-white relative`}
          onClick={toggleCall}
          disabled={connecting || callEnded}
        >
          {connecting && (
            <span className="absolute inset-0 rounded-full animate-ping bg-primary/50 opacity-75"></span>
          )}

          <span>
            {callActive
              ? "End Call"
              : connecting
              ? "Connecting..."
              : callEnded
              ? "Call Ended"
              : "Start Call"}
          </span>
        </Button>
        <Button
          className="w-44 text-sm rounded-3xl bg-secondary/80 text-white"
          onClick={loadExampleConversation}
          disabled={connecting}
        >
          Load Example Conversation
        </Button>
      </div>
    </div>
  );
}

export default Widget;
