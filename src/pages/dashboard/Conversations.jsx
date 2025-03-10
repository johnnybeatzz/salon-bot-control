import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Search, ChevronLeft, ChevronRight, Send, PaperclipIcon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

// Mock data
const mockConversations = [
  {
    id: 1,
    user: "Jessica mith",
    avatar: "JS", 
    lastMessage: "Thank you for the information about the hair treatments.",
    time: "10:25 AM",
    unread: true,
    messages: [
      { id: 1, content: "Hi, do you offer hair coloring services? I'm looking for a complete makeover and would like to know all my options.", isUser: true, time: "09:45 AM" },
      { id: 2, content: "Yes, we offer a wide range of hair coloring services including balayage, ombre, highlights, and full color transformations. Would you like to know more about each option?", isUser: false, time: "09:47 AM" },
      { id: 3, content: "What are your prices for highlights? I have medium-length hair and I'm looking for something that would last through the summer months.", isUser: true, time: "09:52 AM" },
      { id: 4, content: "Our highlights start at $95 for partial and $145 for full. The final price depends on hair length and desired effect. For medium-length hair, we typically recommend a full highlight package which would cost around $160-$180 depending on the technique used.", isUser: false, time: "09:55 AM" },
      { id: 5, content: "That sounds reasonable. What about maintenance? How often would I need to come in for touch-ups?", isUser: true, time: "10:00 AM" },
      { id: 6, content: "For highlights, we recommend touch-ups every 6-8 weeks to maintain the look. We also offer color-protecting treatments that can help extend the life of your color.", isUser: false, time: "10:02 AM" },
      { id: 7, content: "Do you use ammonia-free products? I have sensitive skin and want to make sure I won't have any reactions.", isUser: true, time: "10:05 AM" },
      { id: 8, content: "Yes, we use only high-quality, ammonia-free products that are gentle on both hair and scalp. All our colorists are trained in sensitive skin techniques and we always do a patch test before any color service.", isUser: false, time: "10:07 AM" },
      { id: 9, content: "That's great to hear. What's your availability like for next week? I'd like to book a consultation and possibly schedule my appointment.", isUser: true, time: "10:10 AM" },
      { id: 10, content: "We have several openings next week. Would you prefer a morning or afternoon appointment? I can check our schedule and find the best time for you.", isUser: false, time: "10:12 AM" },
      { id: 11, content: "Morning would be best. I'm free any day except Wednesday. What times do you have available?", isUser: true, time: "10:15 AM" },
      { id: 12, content: "Let me check... We have 9:30 AM on Monday, 10:00 AM on Tuesday, or 11:00 AM on Thursday. Which of these works best for you?", isUser: false, time: "10:17 AM" },
      { id: 13, content: "Tuesday at 10:00 AM works perfectly. Can you send me a confirmation and let me know what I should bring to the consultation?", isUser: true, time: "10:20 AM" },
      { id: 14, content: "Absolutely! I'll send you a confirmation email with all the details. For the consultation, it would be helpful if you could bring any photos of styles you like and information about any previous color treatments you've had.", isUser: false, time: "10:22 AM" },
      { id: 15, content: "Thank you for the information about the hair treatments. I'm looking forward to my appointment!", isUser: true, time: "10:25 AM" }
    ]
  },
  {
    id: 2,
    user: "Michael Johnson",
    avatar: "MJ",
    lastMessage: "Can I book an appointment for next Tuesday?",
    time: "Yesterday",
    unread: false,
    messages: [
      { id: 1, content: "Hello, I'd like to know your availability for next week.", isUser: true, time: "2:15 PM" },
      { id: 2, content: "We have several openings next week. What day and service are you interested in?", isUser: false, time: "2:17 PM" },
      { id: 3, content: "Can I book an appointment for next Tuesday?", isUser: true, time: "2:20 PM" },
    ]
  },
  {
    id: 3,
    user: "Emma Davis",
    avatar: "ED",
    lastMessage: "Which products do you recommend for frizzy hair?",
    time: "Yesterday",
    unread: false,
    messages: [
      { id: 1, content: "Hi there! I have very frizzy hair and need some product recommendations.", isUser: true, time: "4:05 PM" },
      { id: 2, content: "Which products do you recommend for frizzy hair?", isUser: true, time: "4:06 PM" },
    ]
  },
  {
    id: 4,
    user: "Alex Rodriguez",
    avatar: "AR",
    lastMessage: "Do you offer any special packages for bridal parties?",
    time: "2 days ago",
    unread: false,
    messages: [
      { id: 1, content: "I'm getting married next month and looking for salon services.", isUser: true, time: "11:30 AM" },
      { id: 2, content: "Congratulations! We do offer bridal packages. Would you like to know more about them?", isUser: false, time: "11:35 AM" },
      { id: 3, content: "Do you offer any special packages for bridal parties?", isUser: true, time: "11:40 AM" },
    ]
  },
  {
    id: 5,
    user: "Olivia Wilson",
    avatar: "OW",
    lastMessage: "Thanks for the information, I'll come in tomorrow.",
    time: "3 days ago",
    unread: false,
    messages: [
      { id: 1, content: "What are your opening hours?", isUser: true, time: "3:15 PM" },
      { id: 2, content: "We're open Monday to Friday from 9 AM to 7 PM, and Saturdays from 10 AM to 6 PM. We're closed on Sundays.", isUser: false, time: "3:17 PM" },
      { id: 3, content: "Thanks for the information, I'll come in tomorrow.", isUser: true, time: "3:20 PM" },
    ]
  }
];

const Conversations = () => {
  const [selectedConversation, setSelectedConversation] = useState(mockConversations[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newMessage, setNewMessage] = useState("");
  
  const filteredConversations = mockConversations.filter((conversation) =>
    conversation.user.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSendMessage = () => {
    if (newMessage.trim() === "") return;
    
    // In a real app, this would send to your API and update with real data
    console.log(`Sending message: ${newMessage} to ${selectedConversation.user}`);
    
    // Clear input after sending
    setNewMessage("");
  };

  // Add navigation functions
  const navigateToNext = () => {
    const currentIndex = filteredConversations.findIndex(conv => conv.id === selectedConversation.id);
    const nextIndex = (currentIndex + 1) % filteredConversations.length;
    setSelectedConversation(filteredConversations[nextIndex]);
  };

  const navigateToPrevious = () => {
    const currentIndex = filteredConversations.findIndex(conv => conv.id === selectedConversation.id);
    const previousIndex = (currentIndex - 1 + filteredConversations.length) % filteredConversations.length;
    setSelectedConversation(filteredConversations[previousIndex]);
  };

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
              <Badge variant="outline">{mockConversations.length}</Badge>
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
                      className={`p-4 cursor-pointer hover:bg-muted ${selectedConversation.id === conversation.id ? 'bg-muted' : ''}`}
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
                    {selectedConversation.messages.map((message) => (
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
                  </div>
                </ScrollArea>
                
                <div className="p-4 border-t mt-auto">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="rounded-full">
                      <PaperclipIcon className="h-4 w-4" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSendMessage();
                        }
                      }}
                      className="flex-1"
                    />
                    <Button onClick={handleSendMessage} className="bg-salon-600">
                      <Send className="h-4 w-4 mr-2" />
                      Send
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Bot is active • Responses are automated
                  </p>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="p-6 flex flex-col items-center justify-center h-[calc(100vh-280px)]">
              <div className="text-center space-y-2">
                <MessageCircle className="h-12 w-12 text-salon-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium">No conversation selected</h3>
                <p className="text-muted-foreground">Select a conversation from the list to view messages</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Conversations;
