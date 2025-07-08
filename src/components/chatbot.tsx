
'use client';

import { useState, useRef, useEffect, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageSquare, Send, X, Bot, User, MoreHorizontal, Download, Expand, Shrink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { handleChatbotQuery } from '@/app/actions';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
  );

const suggestedPrompts = [
  { label: 'Our Services', query: 'What services do you offer?' },
  { label: 'FAQs', query: 'What are your FAQs?' },
  { label: 'Get Help', query: 'How can I talk to a person?' },
];

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const handleDownloadTranscript = () => {
    const transcript = messages
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join('\n\n');
    
    const blob = new Blob([transcript], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'boxmoc-chat-transcript.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendMessage = async (query: string) => {
    if (!query.trim()) return;

    const userMessage: Message = { role: 'user', content: query };
    setMessages((prev) => [...prev, userMessage]);
    if (input === query) {
        setInput('');
    }
    setIsPending(true);

    const formData = new FormData();
    formData.append('query', query);
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

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendMessage(input);
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
        <div className={cn(
            "fixed bottom-20 right-4 z-50 transition-all duration-300 ease-in-out",
            isExpanded ? "w-[65vw] h-[80vh]" : "w-[350px] h-[500px]"
          )}>
          <Card className="h-full w-full flex flex-col shadow-2xl animate-in fade-in zoom-in-95">
            <CardHeader className="flex flex-row items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-headline">Boxmoc Assistant</CardTitle>
              </div>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? <Shrink className="h-5 w-5" /> : <Expand className="h-5 w-5" />}
                    <span className="sr-only">{isExpanded ? 'Collapse' : 'Expand'} chat</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                            <span className="sr-only">More options</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() => window.open('https://wa.me/1234567890', '_blank')}>
                            <WhatsAppIcon className="mr-2 h-4 w-4" />
                            Chat on WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={handleDownloadTranscript}>
                            <Download className="mr-2 h-4 w-4" />
                            Download Transcript
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
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
                        "p-3 rounded-lg",
                        isExpanded ? "max-w-md" : "max-w-xs", 
                        message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      )}>
                        {message.role === 'user' ? (
                            <p className="text-sm">{message.content}</p>
                        ) : (
                            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0">
                               <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {message.content}
                               </ReactMarkdown>
                            </div>
                        )}
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
             {messages.length === 0 && !isPending && (
                <div className="px-4 pb-4 pt-4">
                    <div className="flex flex-wrap justify-end gap-2">
                        {suggestedPrompts.map((prompt, i) => (
                            <Button
                                key={i}
                                variant="outline"
                                size="sm"
                                className="h-auto py-1.5 px-3 text-xs"
                                onClick={() => sendMessage(prompt.query)}
                            >
                                {prompt.label}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
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
