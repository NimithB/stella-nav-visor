import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Volume2, VolumeX, MessageSquare, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface VoiceMessage {
  id: string;
  type: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  status?: 'processing' | 'completed';
}

export const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: '1',
      type: 'assistant',
      text: 'Smart Assist navigation system is ready. How can I help you navigate?',
      timestamp: new Date(),
      status: 'completed'
    }
  ]);
  const [currentCommand, setCurrentCommand] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock voice recognition
  const startListening = () => {
    setIsListening(true);
    setCurrentCommand('Listening...');
    
    // Simulate voice recognition after 3 seconds
    setTimeout(() => {
      const commands = [
        "Navigate to the kitchen",
        "Find the nearest exit",
        "Avoid obstacles ahead",
        "Show me the safest path",
        "What objects do you see?",
        "Take me to the living room"
      ];
      
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      setCurrentCommand(randomCommand);
      
      // Add user message
      const userMessage: VoiceMessage = {
        id: Date.now().toString(),
        type: 'user',
        text: randomCommand,
        timestamp: new Date(),
        status: 'completed'
      };
      
      setMessages(prev => [...prev, userMessage]);
      setIsListening(false);
      
      // Generate AI response
      generateAIResponse(randomCommand);
    }, 3000);
  };

  const generateAIResponse = (userCommand: string) => {
    // Add processing message first
    const processingMessage: VoiceMessage = {
      id: Date.now().toString() + '_processing',
      type: 'assistant',
      text: 'Processing your request...',
      timestamp: new Date(),
      status: 'processing'
    };
    
    setMessages(prev => [...prev, processingMessage]);
    setIsSpeaking(true);

    // Generate contextual response based on command
    setTimeout(() => {
      let response = '';
      
      if (userCommand.toLowerCase().includes('kitchen')) {
        response = 'I found a path to the kitchen. Turn right in 3 meters, then go straight for 5 meters. I detect a chair obstacle on the left side of the path.';
      } else if (userCommand.toLowerCase().includes('exit')) {
        response = 'The nearest exit is 12 meters ahead. I\'ll guide you there while avoiding the table and person I detected in the camera feed.';
      } else if (userCommand.toLowerCase().includes('obstacle')) {
        response = 'I detect 3 obstacles ahead: a chair at 2 meters, a table at 4 meters, and a person moving at 6 meters. Suggesting alternative path to the right.';
      } else if (userCommand.toLowerCase().includes('path')) {
        response = 'Calculating optimal path using STELLA-VSLAM data. The safest route is through the corridor with 94% confidence. No moving obstacles detected.';
      } else if (userCommand.toLowerCase().includes('objects') || userCommand.toLowerCase().includes('see')) {
        response = 'Current objects in view: 1 chair (87% confidence), 1 table (92% confidence), 1 person (95% confidence). All objects are being tracked for navigation.';
      } else {
        response = 'I understand your request. Analyzing the environment and calculating the best navigation path for you.';
      }

      // Replace processing message with actual response
      setMessages(prev => prev.map(msg => 
        msg.id === processingMessage.id 
          ? { ...msg, text: response, status: 'completed' }
          : msg
      ));
      
      setIsSpeaking(false);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setCurrentCommand('');
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="tech-panel p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold">Voice Assistant</h3>
          <div className="flex items-center gap-1">
            <div className="status-indicator status-online"></div>
            <span className="text-xs text-muted-foreground">GPT + Whisper</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <Badge variant="secondary" className="gap-1 animate-pulse">
              <Volume2 className="w-3 h-3" />
              Speaking
            </Badge>
          )}
          <Button
            variant={isListening ? "destructive" : "default"}
            size="sm"
            onClick={isListening ? stopListening : startListening}
            className="gap-2"
            disabled={isSpeaking}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            {isListening ? "Stop" : "Listen"}
          </Button>
        </div>
      </div>

      {/* Current listening status */}
      {isListening && (
        <div className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-primary">Listening...</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {currentCommand || "Say your navigation command"}
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="h-64 bg-muted/20 rounded-lg border glow-border">
        <ScrollArea className="h-full p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : message.status === 'processing'
                      ? 'bg-muted text-muted-foreground animate-pulse'
                      : 'bg-card border border-border'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.type === 'assistant' && (
                      <Bot className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary" />
                    )}
                    {message.type === 'user' && (
                      <Mic className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed">{message.text}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs opacity-70">
                          {formatTime(message.timestamp)}
                        </span>
                        {message.status === 'processing' && (
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-1 h-1 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Voice commands help */}
      <div className="mt-4 p-3 bg-muted/30 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <MessageSquare className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium text-muted-foreground">Example Commands</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>"Navigate to the kitchen"</div>
          <div>"Find the nearest exit"</div>
          <div>"Avoid obstacles ahead"</div>
          <div>"What objects do you see?"</div>
        </div>
      </div>
    </div>
  );
};