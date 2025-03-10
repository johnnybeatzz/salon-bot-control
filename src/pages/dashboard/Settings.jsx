
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Settings = () => {
  const [generalSettings, setGeneralSettings] = useState({
    botName: "Salon Assistant",
    greeting: "Hello! I'm your salon assistant. How can I help you today?",
    operatingHours: "Monday-Friday: 9AM-7PM, Saturday: 10AM-6PM, Sunday: Closed",
    responseTime: "typically within 5 minutes",
    language: "english"
  });
  
  const [automationSettings, setAutomationSettings] = useState({
    autoReply: true,
    autoReplyDelay: "10",
    autoFollowUp: true,
    followUpDelay: "12",
    sendReadReceipts: true,
    workingHoursOnly: true
  });
  
  const handleGeneralChange = (e) => {
    const { name, value } = e.target;
    setGeneralSettings({
      ...generalSettings,
      [name]: value
    });
  };
  
  const handleAutomationChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAutomationSettings({
      ...automationSettings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSwitchChange = (checked, name) => {
    setAutomationSettings({
      ...automationSettings,
      [name]: checked
    });
  };
  
  const handleSave = (type) => {
    // In a real app, this would be an API call to save your settings
    toast.success(`${type} settings saved successfully`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your salon bot configuration</p>
      </div>
      
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="responses">Bot Responses</TabsTrigger>
          <TabsTrigger value="api">API & Integrations</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Configure the basic information and behavior of your salon bot
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="botName">Bot Name</Label>
                <Input 
                  id="botName" 
                  name="botName" 
                  value={generalSettings.botName} 
                  onChange={handleGeneralChange} 
                />
                <p className="text-xs text-muted-foreground">This name will be displayed to customers in chats</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="greeting">Welcome Message</Label>
                <Textarea 
                  id="greeting" 
                  name="greeting" 
                  value={generalSettings.greeting} 
                  onChange={handleGeneralChange} 
                  rows={3} 
                />
                <p className="text-xs text-muted-foreground">This message will be sent when a new conversation starts</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operatingHours">Operating Hours</Label>
                <Input 
                  id="operatingHours" 
                  name="operatingHours" 
                  value={generalSettings.operatingHours} 
                  onChange={handleGeneralChange} 
                />
                <p className="text-xs text-muted-foreground">Your salon's business hours</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="responseTime">Expected Response Time</Label>
                <Input 
                  id="responseTime" 
                  name="responseTime" 
                  value={generalSettings.responseTime} 
                  onChange={handleGeneralChange} 
                />
                <p className="text-xs text-muted-foreground">Let customers know how quickly they can expect a response</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Primary Language</Label>
                <Select 
                  value={generalSettings.language}
                  onValueChange={(value) => setGeneralSettings({...generalSettings, language: value})}
                >
                  <SelectTrigger id="language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">Primary language for bot responses</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-salon-600 hover:bg-salon-700" onClick={() => handleSave("General")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Automation Settings */}
        <TabsContent value="automation">
          <Card>
            <CardHeader>
              <CardTitle>Automation Settings</CardTitle>
              <CardDescription>
                Configure how the bot automatically responds to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoReply">Automatic Replies</Label>
                  <p className="text-xs text-muted-foreground">Enable the bot to automatically respond to customer messages</p>
                </div>
                <Switch 
                  id="autoReply" 
                  name="autoReply" 
                  checked={automationSettings.autoReply} 
                  onCheckedChange={(checked) => handleSwitchChange(checked, "autoReply")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="autoReplyDelay">Auto-Reply Delay (seconds)</Label>
                  <Input 
                    id="autoReplyDelay" 
                    name="autoReplyDelay" 
                    type="number" 
                    value={automationSettings.autoReplyDelay} 
                    onChange={handleAutomationChange} 
                    disabled={!automationSettings.autoReply}
                    className="max-w-[150px]"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="autoFollowUp">Automatic Follow-ups</Label>
                  <p className="text-xs text-muted-foreground">Send a follow-up message if customer hasn't responded</p>
                </div>
                <Switch 
                  id="autoFollowUp" 
                  name="autoFollowUp" 
                  checked={automationSettings.autoFollowUp} 
                  onCheckedChange={(checked) => handleSwitchChange(checked, "autoFollowUp")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1">
                  <Label htmlFor="followUpDelay">Follow-up Delay (hours)</Label>
                  <Input 
                    id="followUpDelay" 
                    name="followUpDelay" 
                    type="number" 
                    value={automationSettings.followUpDelay} 
                    onChange={handleAutomationChange} 
                    disabled={!automationSettings.autoFollowUp}
                    className="max-w-[150px]"
                  />
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="sendReadReceipts">Send Read Receipts</Label>
                  <p className="text-xs text-muted-foreground">Let customers know when their message has been read</p>
                </div>
                <Switch 
                  id="sendReadReceipts" 
                  name="sendReadReceipts" 
                  checked={automationSettings.sendReadReceipts} 
                  onCheckedChange={(checked) => handleSwitchChange(checked, "sendReadReceipts")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="workingHoursOnly">Working Hours Only</Label>
                  <p className="text-xs text-muted-foreground">Bot will only respond during salon operating hours</p>
                </div>
                <Switch 
                  id="workingHoursOnly" 
                  name="workingHoursOnly" 
                  checked={automationSettings.workingHoursOnly} 
                  onCheckedChange={(checked) => handleSwitchChange(checked, "workingHoursOnly")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-salon-600 hover:bg-salon-700" onClick={() => handleSave("Automation")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Bot Responses */}
        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>Bot Responses</CardTitle>
              <CardDescription>
                Configure the AI's responses for specific inquiries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm">Configure how the bot responds to common customer inquiries:</p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="services">Services Inquiry Response</Label>
                  <Textarea 
                    id="services" 
                    placeholder="Enter response template for services inquiries" 
                    rows={4}
                    defaultValue="Our salon offers a complete range of beauty services, including haircuts, coloring, styling, manicures, pedicures, facials, and more. Would you like specific information about any of these services?"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pricing">Pricing Inquiry Response</Label>
                  <Textarea 
                    id="pricing" 
                    placeholder="Enter response template for pricing inquiries" 
                    rows={4}
                    defaultValue="Our pricing varies depending on the service and stylist level. Haircuts start at $45, color services at $75, and spa services at $60. I'd be happy to provide specific pricing for any service you're interested in."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="booking">Booking Inquiry Response</Label>
                  <Textarea 
                    id="booking" 
                    placeholder="Enter response template for booking inquiries" 
                    rows={4}
                    defaultValue="I'd be happy to help you book an appointment! Could you please provide your preferred date, time, service, and stylist preference? Alternatively, you can book directly through our website or by calling us at (555) 123-4567."
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unavailable">Outside Hours Message</Label>
                <Textarea 
                  id="unavailable" 
                  placeholder="Enter message for when the salon is closed" 
                  rows={4}
                  defaultValue="Thank you for your message! Our salon is currently closed. Our operating hours are Monday-Friday: 9AM-7PM, Saturday: 10AM-6PM, Sunday: Closed. We'll respond to your message when we reopen. For immediate booking, please visit our website."
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-salon-600 hover:bg-salon-700" onClick={() => handleSave("Bot responses")}>Save Responses</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* API & Integrations */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API & Integrations</CardTitle>
              <CardDescription>
                Connect your bot to external services and manage API keys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="apiKey">AI Provider API Key</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="apiKey" 
                    type="password" 
                    defaultValue="sk-•••••••••••••••••••••••••••••••" 
                  />
                  <Button variant="outline">Show</Button>
                </div>
                <p className="text-xs text-muted-foreground">API key for your AI language model provider (e.g., OpenAI)</p>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Instagram Integration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="instagramId">Instagram Business ID</Label>
                    <Input id="instagramId" placeholder="Enter your Instagram Business ID" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="instagramToken">Access Token</Label>
                    <Input id="instagramToken" type="password" placeholder="Enter your access token" />
                  </div>
                </div>
                <Button variant="outline">Connect Instagram Account</Button>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-sm font-semibold">Salon Management Integration</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="bookingSystem">Booking System</Label>
                    <Select defaultValue="none">
                      <SelectTrigger id="bookingSystem">
                        <SelectValue placeholder="Select booking system" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="acuity">Acuity Scheduling</SelectItem>
                        <SelectItem value="calendly">Calendly</SelectItem>
                        <SelectItem value="mindbody">MindBody</SelectItem>
                        <SelectItem value="square">Square Appointments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bookingToken">Integration Token</Label>
                    <Input id="bookingToken" type="password" placeholder="Enter your integration token" />
                  </div>
                </div>
                <Button variant="outline">Connect Booking System</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-salon-600 hover:bg-salon-700" onClick={() => handleSave("API")}>Save Integration Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
