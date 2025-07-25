"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Settings,
  Languages,
  Headphones,
  Waves,
  Brain,
  Zap,
  Globe,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocale } from "next-intl";
import { locales, localeNames } from "@/lib/i18n/config";

interface VoiceMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  confidence?: number;
  language?: string;
  duration?: number;
  audioUrl?: string;
}

interface VoiceAssistantProps {
  onCommand?: (command: string, context?: any) => void;
  context?: any;
  disabled?: boolean;
  className?: string;
}

// Advanced Voice Assistant with AI-powered multilingual support
export function VoiceAssistant({ 
  onCommand, 
  context, 
  disabled = false, 
  className = "" 
}: VoiceAssistantProps) {
  const locale = useLocale();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [confidence, setConfidence] = useState(0);
  const [volume, setVolume] = useState([0.8]);
  const [speechRate, setSpeechRate] = useState([1.0]);
  const [voiceLanguage, setVoiceLanguage] = useState(locale);
  const [isProcessing, setIsProcessing] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [supportedVoices, setSupportedVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Initialize speech recognition and synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Initialize Speech Recognition
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = voiceLanguage;
        
        recognition.onstart = () => {
          setIsListening(true);
          initializeAudioVisualization();
        };
        
        recognition.onend = () => {
          setIsListening(false);
          stopAudioVisualization();
        };
        
        recognition.onresult = (event) => {
          let interimTranscript = "";
          let finalTranscript = "";
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence;
            
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
              setConfidence(confidence);
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            handleVoiceInput(finalTranscript, confidence);
          } else {
            setCurrentMessage(interimTranscript);
          }
        };
        
        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };
        
        recognitionRef.current = recognition;
      }

      // Initialize Speech Synthesis
      synthesisRef.current = window.speechSynthesis;
      loadVoices();
      
      // Listen for voice changes
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      stopListening();
      stopSpeaking();
    };
  }, [voiceLanguage]);

  // Load available voices
  const loadVoices = () => {
    if (synthesisRef.current) {
      const voices = synthesisRef.current.getVoices();
      setSupportedVoices(voices);
      
      // Auto-select best voice for current language
      const languageVoices = voices.filter(voice => 
        voice.lang.startsWith(voiceLanguage.split('-')[0])
      );
      
      if (languageVoices.length > 0) {
        setSelectedVoice(languageVoices[0].name);
      }
    }
  };

  // Initialize audio visualization
  const initializeAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
      updateWaveform();
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  // Update waveform visualization
  const updateWaveform = () => {
    if (analyserRef.current && isListening) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      // Convert to normalized values for visualization
      const waveform = Array.from(dataArray).map(value => value / 255);
      setWaveformData(waveform.slice(0, 20)); // Show first 20 frequency bands
      
      requestAnimationFrame(updateWaveform);
    }
  };

  // Stop audio visualization
  const stopAudioVisualization = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    setWaveformData([]);
  };

  // Handle voice input
  const handleVoiceInput = async (text: string, confidence: number) => {
    const message: VoiceMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
      confidence,
      language: voiceLanguage
    };
    
    setMessages(prev => [...prev, message]);
    setCurrentMessage("");
    setIsProcessing(true);

    // Process command with AI
    try {
      const response = await processVoiceCommand(text, context);
      
      const aiMessage: VoiceMessage = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
        language: voiceLanguage
      };
      
      setMessages(prev => [...prev, aiMessage]);
      
      // Speak the response
      speak(response);
      
      // Trigger command callback
      if (onCommand) {
        onCommand(text, { response, confidence, language: voiceLanguage });
      }
    } catch (error) {
      console.error("Error processing voice command:", error);
      const errorMessage = "I'm sorry, I couldn't process that command. Please try again.";
      speak(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  // Process voice command with AI
  const processVoiceCommand = async (command: string, context?: any): Promise<string> => {
    const response = await fetch("/api/ai/voice-command", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command,
        language: voiceLanguage,
        context,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to process voice command");
    }

    const data = await response.json();
    return data.response;
  };

  // Text-to-speech
  const speak = (text: string) => {
    if (synthesisRef.current && !isSpeaking) {
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = voiceLanguage;
      utterance.rate = speechRate[0];
      utterance.volume = volume[0];
      
      // Set selected voice
      if (selectedVoice) {
        const voice = supportedVoices.find(v => v.name === selectedVoice);
        if (voice) {
          utterance.voice = voice;
        }
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      synthesisRef.current.speak(utterance);
    }
  };

  // Start listening
  const startListening = () => {
    if (recognitionRef.current && !isListening && !disabled) {
      recognitionRef.current.lang = voiceLanguage;
      recognitionRef.current.start();
    }
  };

  // Stop listening
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  // Stop speaking
  const stopSpeaking = () => {
    if (synthesisRef.current && isSpeaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle listening
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Clear conversation
  const clearConversation = () => {
    setMessages([]);
    setCurrentMessage("");
  };

  return (
    <Card className={`w-full max-w-md mx-auto ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-violet-600" />
            <span className="font-semibold">AI Voice Assistant</span>
          </div>
          <Badge variant={isListening ? "default" : "secondary"}>
            {isListening ? "Listening" : isSpeaking ? "Speaking" : "Ready"}
          </Badge>
        </div>
        
        {/* Waveform Visualization */}
        <div className="h-16 bg-gray-50 dark:bg-gray-800 rounded-lg p-2 flex items-end justify-center gap-1">
          <AnimatePresence>
            {waveformData.map((height, index) => (
              <motion.div
                key={index}
                className="bg-violet-500 rounded-full min-h-[4px]"
                style={{ width: "4px" }}
                initial={{ height: 4 }}
                animate={{ height: Math.max(4, height * 40) }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </AnimatePresence>
          {!isListening && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <Waves className="w-6 h-6" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Language Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Languages className="w-4 h-4" />
            Voice Language
          </label>
          <Select value={voiceLanguage} onValueChange={setVoiceLanguage}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {locales.map(locale => (
                <SelectItem key={locale} value={locale}>
                  {localeNames[locale]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Voice Selection */}
        {supportedVoices.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Headphones className="w-4 h-4" />
              Voice
            </label>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {supportedVoices
                  .filter(voice => voice.lang.startsWith(voiceLanguage.split('-')[0]))
                  .map(voice => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Voice Controls */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Volume: {Math.round(volume[0] * 100)}%
            </label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={1}
              min={0}
              step={0.1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Speech Rate: {speechRate[0].toFixed(1)}x
            </label>
            <Slider
              value={speechRate}
              onValueChange={setSpeechRate}
              max={2}
              min={0.5}
              step={0.1}
              className="w-full"
            />
          </div>
        </div>

        {/* Current Message */}
        {currentMessage && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              {currentMessage}
            </p>
          </div>
        )}

        {/* Confidence Indicator */}
        {confidence > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Confidence</span>
              <span>{Math.round(confidence * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-violet-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${confidence * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={toggleListening}
            disabled={disabled || isSpeaking}
            className={`flex-1 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-violet-500 hover:bg-violet-600'}`}
          >
            {isListening ? (
              <>
                <MicOff className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Listen
              </>
            )}
          </Button>

          {isSpeaking && (
            <Button
              onClick={stopSpeaking}
              variant="outline"
              className="flex-1"
            >
              <VolumeX className="w-4 h-4 mr-2" />
              Stop Speaking
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            onClick={clearConversation}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear
          </Button>
          
          <Button
            onClick={() => speak("Hello! I'm your AI assistant. How can I help you today?")}
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={isSpeaking}
          >
            <Play className="w-4 h-4 mr-2" />
            Test Voice
          </Button>
        </div>

        {/* Conversation History */}
        {messages.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            <h4 className="text-sm font-medium">Conversation</h4>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-2 rounded-lg text-sm ${
                  message.isUser
                    ? "bg-violet-100 dark:bg-violet-900/20 ml-4"
                    : "bg-gray-100 dark:bg-gray-800 mr-4"
                }`}
              >
                <p>{message.text}</p>
                {message.confidence && (
                  <p className="text-xs text-gray-500 mt-1">
                    Confidence: {Math.round(message.confidence * 100)}%
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Processing Indicator */}
        {isProcessing && (
          <div className="flex items-center justify-center p-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Brain className="w-6 h-6 text-violet-500" />
            </motion.div>
            <span className="ml-2 text-sm text-gray-600">Processing...</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}