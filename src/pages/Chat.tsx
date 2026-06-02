import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatConversations, chatMessages } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { 
  Send, 
  Paperclip, 
  Search, 
  Phone, 
  Video, 
  MoreVertical,
  Circle,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from '@/types';

const Chat = () => {
  const { user } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(chatConversations[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(chatMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: user?.id || '1',
      senderName: user?.name || 'User',
      receiverId: selectedConversation.participants.find(p => p.id !== user?.id)?.id || '2',
      content: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text',
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const otherParticipant = selectedConversation.participants.find(
    p => p.id !== user?.id
  );

  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-8rem)] animate-fade-in">
        <Card className="h-full border-border/50 overflow-hidden">
          <div className="grid md:grid-cols-[320px_1fr] h-full">
            {/* Conversations Sidebar */}
            <div className="border-r border-border flex flex-col">
              <div className="p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground mb-4">Messages</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <ScrollArea className="flex-1">
                <div className="p-2">
                  {chatConversations.map((conversation) => {
                    const otherPerson = conversation.participants.find(p => p.id !== user?.id);
                    const isSelected = selectedConversation.id === conversation.id;
                    
                    return (
                      <button
                        key={conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                        className={cn(
                          'w-full p-3 rounded-xl flex items-start gap-3 transition-colors text-left',
                          isSelected ? 'bg-accent' : 'hover:bg-muted/50'
                        )}
                      >
                        <div className="relative">
                          <Avatar className="h-12 w-12 border-2 border-border">
                            <AvatarImage src={otherPerson?.avatar} />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {otherPerson?.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <Circle className="absolute bottom-0 right-0 h-3.5 w-3.5 fill-success text-success border-2 border-card rounded-full" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={cn(
                              'font-medium truncate',
                              isSelected ? 'text-accent-foreground' : 'text-foreground'
                            )}>
                              {otherPerson?.name}
                            </p>
                            {conversation.lastMessage && (
                              <span className="text-xs text-muted-foreground">
                                {format(new Date(conversation.lastMessage.timestamp), 'h:mm a')}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm text-muted-foreground truncate">
                              {conversation.lastMessage?.content}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <Badge className="bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                                {conversation.unreadCount}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-border">
                    <AvatarImage src={otherParticipant?.avatar} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {otherParticipant?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{otherParticipant?.name}</p>
                    <div className="flex items-center gap-1 text-sm text-success">
                      <Circle className="h-2 w-2 fill-current" />
                      Online
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => {
                    const isSent = message.senderId === user?.id || 
                                   (user?.role === 'doctor' && message.senderId === '1') ||
                                   (user?.role === 'patient' && message.senderId === '2');
                    
                    return (
                      <div
                        key={message.id}
                        className={cn(
                          'flex',
                          isSent ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div className={cn(
                          'chat-bubble',
                          isSent ? 'chat-bubble-sent' : 'chat-bubble-received'
                        )}>
                          {message.type === 'text' && (
                            <p className="text-sm">{message.content}</p>
                          )}
                          {message.type === 'file' && (
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              <span className="text-sm underline cursor-pointer">
                                {message.fileName}
                              </span>
                            </div>
                          )}
                          <span className={cn(
                            'text-xs mt-1 block',
                            isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          )}>
                            {format(new Date(message.timestamp), 'h:mm a')}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="shrink-0">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button 
                    variant="hero" 
                    size="icon" 
                    className="shrink-0"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Chat;
