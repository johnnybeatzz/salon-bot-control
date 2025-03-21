import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Bell, MessageCircle, Calendar, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api";
import { BlinkBlur } from "react-loading-indicators"


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const data = await fetchNotifications();
      setNotifications(data);
    } catch (error) {
      toast.error("Failed to load notifications");
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(notifications.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      ));
      toast.success("Notification marked as read");
    } catch (error) {
      toast.error("Failed to mark notification as read");
      console.error("Error marking notification as read:", error);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(notifications.map(notification => ({ ...notification, read: true })));
      toast.success("All notifications marked as read");
    } catch (error) {
      toast.error("Failed to mark all notifications as read");
      console.error("Error marking all notifications as read:", error);
    }
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    toast.success("All notifications cleared");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <BlinkBlur color='#2f4ff5' size="medium" text="" textColor="" />
          <p className="text-muted-foreground">Loading Notifications...</p>
        </div>
    </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Notifications</h1>
        <p className="text-muted-foreground">Stay updated with activity from your salon bot</p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CardTitle>Notifications</CardTitle>
              {unreadCount > 0 && (
                <Badge variant="default" className="bg-salon-600">
                  {unreadCount} unread
                </Badge>
              )}
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
                Mark all as read
              </Button>
              <Button variant="outline" size="sm" onClick={clearAllNotifications} disabled={notifications.length === 0}>
                Clear all
              </Button>
            </div>
          </div>
          <CardDescription>
            Recent activity and alerts from your salon bot system
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <TabsList className="w-full rounded-none border-b border-t">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
              <TabsTrigger value="alerts" className="flex-1">Alerts</TabsTrigger>
              <TabsTrigger value="system" className="flex-1">System</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="m-0">
              <ScrollArea className="h-[400px]">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 ${notification.read ? '' : 'bg-muted/30'}`}
                      >
                        <div className="flex space-x-4">
                          <div className={`p-2 rounded-full ${notification.color} h-10 w-10 flex items-center justify-center flex-shrink-0`}>
                            <notification.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{notification.title}</p>
                              <p className="text-xs text-muted-foreground">{notification.time}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">{notification.description}</p>
                            {!notification.read && (
                              <Button 
                                variant="link" 
                                size="sm" 
                                className="p-0 h-auto text-salon-600" 
                                onClick={() => handleMarkAsRead(notification.id)}
                              >
                                Mark as read
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-12 text-center">
                    <Bell className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium">No notifications</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      You're all caught up! Notifications will appear here when there's new activity.
                    </p>
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="messages" className="m-0">
              <div className="p-6 text-center text-muted-foreground">
                Message notifications would be filtered here
              </div>
            </TabsContent>
            
            <TabsContent value="alerts" className="m-0">
              <div className="p-6 text-center text-muted-foreground">
                Alert notifications would be filtered here
              </div>
            </TabsContent>
            
            <TabsContent value="system" className="m-0">
              <div className="p-6 text-center text-muted-foreground">
                System notifications would be filtered here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
