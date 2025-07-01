'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, X, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { handleChatbotQuery } from '@/app/actions';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsPending(true);

    const formData = new FormData();
    formData.append('query', input);
    formData.append('history', JSON.stringify(messages));

    const result = await handleChatbotQuery({ response: '' }, formData);
    
    setIsPending(false);

    if (result.response) {
      const botMessage: Message = { role: 'model', content: result.response };
      setMessages((prev) => [...prev, botMessage]);
    } else if (result.error) {
      const errorMessage: Message = { role: 'model', content: `Error: ${result.error}` };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg z-50"
        aria-label="Toggle chatbot"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50">
          <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-headline">Boxmoc Assistant</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
              <div ref={chatContainerRef} className="h-full overflow-y-auto">
                <div className="p-4 space-y-4">
                  <div className="flex items-start gap-3">
                      <Avatar className="h-8 w-8">
                          <AvatarFallback><Bot /></AvatarFallback>
                      </Avatar>
                      <div className="bg-muted p-3 rounded-lg max-w-xs">
                          <p className="text-sm">Hello! How can I help you with your design needs today?</p>
                      </div>
                  </div>
                  {messages.map((message, index) => (
                    <div key={index} className={cn("flex items-start gap-3", message.role === 'user' ? 'justify-end' : '')}>
                      {message.role === 'model' && (
                        <Avatar className="h-8 w-8">
                          <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                      )}
                      <div className={cn(
                        "p-3 rounded-lg max-w-xs", 
                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}>
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.role === 'user' && (
                         <Avatar className="h-8 w-8">
                          <AvatarFallback><User /></AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}
                  {isPending && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        <div className="bg-muted p-3 rounded-lg max-w-xs">
                            <div className="flex space-x-1">
                               <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                               <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                               <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-pulse"></span>
                            </div>
                        </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4">
              <form onSubmit={handleSubmit} className="w-full flex items-center gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question..."
                  disabled={isPending}
                  autoComplete="off"
                />
                <Button type="submit" size="icon" disabled={isPending || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}
