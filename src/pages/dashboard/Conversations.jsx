import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, ChevronLeft, ChevronRight, Send, PaperclipIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { fetchConversations, sendMessage } from "@/lib/api";
import { BlinkBlur } from "react-loading-indicators"


const Conversations = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const data = await fetchConversations();
      setConversations(data);
      if (data.length > 0) {
        setSelectedConversation(data[0]);
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedConversation) return;
    
    try {
      const response = await sendMessage(selectedConversation.id, newMessage);
      if (response.success) {
        setSelectedConversation({
          ...selectedConversation,
          messages: [...selectedConversation.messages, response.message]
        });
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Add navigation functions
  const navigateToNext = () => {
    const currentIndex = filteredConversations.findIndex(conv => conv.id === selectedConversation?.id);
    const nextIndex = (currentIndex + 1) % filteredConversations.length;
    setSelectedConversation(filteredConversations[nextIndex]);
  };

  const navigateToPrevious = () => {
    const currentIndex = filteredConversations.findIndex(conv => conv.id === selectedConversation?.id);
    const previousIndex = (currentIndex - 1 + filteredConversations.length) % filteredConversations.length;
    setSelectedConversation(filteredConversations[previousIndex]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (selectedConversation) {
      scrollToBottom();
    }
  }, [selectedConversation]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <BlinkBlur color='#2f4ff5' size="medium" text="" textColor="" />
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
    </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Conversations</h1>
        <p className="text-muted-foreground">Review and manage customer conversations</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversation List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>Chats</CardTitle>
              <Badge variant="outline">{conversations.length}</Badge>
            </div>
            <div className="relative mt-1">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="all">
              <TabsList className="w-full rounded-none border-b border-t">
                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                <TabsTrigger value="flagged" className="flex-1">Flagged</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="m-0">
                <ScrollArea className="h-[calc(100vh-350px)]">
                  {filteredConversations.map((conversation) => (
                    <div 
                      key={conversation.id}
                      className={`p-4 cursor-pointer hover:bg-muted ${selectedConversation?.id === conversation.id ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedConversation(conversation)}
                    >
                      <div className="flex items-start">
                        <Avatar className="h-10 w-10 border-2 border-salon-200">
                          <div className="bg-salon-100 text-salon-800 flex items-center justify-center h-full w-full font-medium">
                            {conversation.avatar}
                          </div>
                        </Avatar>
                        <div className="flex-1" style={{ marginLeft: '20px' }}>
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{conversation.user}</p>
                            <p className="text-xs text-muted-foreground">{conversation.time}</p>
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {conversation.lastMessage}
                          </p>
                          {conversation.unread && (
                            <Badge variant="default" className="bg-salon-600 text-white text-[10px] px-1.5 ml-auto">New</Badge>
                          )}
                        </div>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="unread" className="m-0">
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Showing unread conversations would appear here
                </div>
              </TabsContent>
              <TabsContent value="flagged" className="m-0">
                <div className="p-4 text-center text-muted-foreground text-sm">
                  Showing flagged conversations would appear here
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Conversation Detail */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b p-4 py-3 flex flex-row items-center justify-between">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 border-2 border-salon-200">
                    <div className="bg-salon-100 text-salon-800 flex items-center justify-center h-full w-full font-medium">
                      {selectedConversation.avatar}
                    </div>
                  </Avatar>
                  <div style={{ marginLeft: '20px' }}>
                    <CardTitle className="text-base">{selectedConversation.user}</CardTitle>
                    <p className="text-xs text-muted-foreground">Last active: {selectedConversation.time}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon" onClick={navigateToPrevious}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={navigateToNext}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0 flex flex-col h-[400px]">
                <ScrollArea className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: "320px" }}>
                  <div className="space-y-4 pb-2">
                    {selectedConversation.messages.slice().map((message) => (
                      <div 
                        key={message.id} 
                        className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                            message.isUser 
                              ? 'bg-salon-600 text-white rounded-br-none' 
                              : 'bg-muted rounded-bl-none'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${message.isUser ? 'text-white/70' : 'text-muted-foreground'}`}>
                            {message.time}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="icon">
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    />
                    <Button onClick={handleSendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px] text-muted-foreground">
              <p>Select a conversation to view messages</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Conversations;
