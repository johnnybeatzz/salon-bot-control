import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Bell, MessageCircle, Calendar, AlertTriangle, CheckCircle, Info, X, CheckCircle2, XCircle, Clock, User, CalendarClock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "@/lib/api";
import { BlinkBlur } from "react-loading-indicators";
import { Riple } from "react-loading-indicators";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Sample hardcoded notification data (Updated to match API schema)
// --- REMOVED SAMPLE DATA ---
// const sampleNotifications = [ ... ];


const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      // Use the actual API call
      const data = await fetchNotifications();
      // Ensure data is always an array before setting state
      setNotifications(Array.isArray(data) ? data : []);
      console.log("Fetched notifications:", data); // Log fetched data
    } catch (error) {
      toast.error("Failed to load notifications");
      console.error("Error loading notifications:", error);
      setNotifications([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }

    // --- REMOVED SAMPLE DATA LOADING LOGIC ---
    // setTimeout(() => {
    //     setNotifications(sampleNotifications);
    //     setLoading(false);
    //     console.log("Loaded sample notifications.");
    // }, 500);
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
  
  const clearAllNotifications = async () => {
    try {
      // --- Placeholder for the API call ---
      // await deleteAllNotificationsFromAPI(); 
      // ------------------------------------

      // Keep this to update the UI immediately
      setNotifications([]); 
      toast.success("All notifications cleared");

    } catch (error) {
      toast.error("Failed to clear all notifications");
      console.error("Error clearing all notifications:", error);
      // Optional: You might want to reload notifications if clearing failed
      // loadNotifications(); 
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification);
    setIsModalOpen(true);
    if (!notification.read) {
      // Find the notification in the state and mark it as read locally
      // This provides immediate feedback even before the async handler completes
      setNotifications(prevNotifications =>
        prevNotifications.map(n =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
      // Still call the async handler to persist the change
      handleMarkAsRead(notification.id);
    }
  };

  const getNotificationTypeInfo = (type) => {
    switch (type) {
      case 'book appointment':
        return {
          icon: CheckCircle2,
          color: 'bg-green-100 text-green-700',
          label: 'Appointment Booked',
          animation: 'animate-bounce'
        };
      case 'reschedule appointment':
        return {
          icon: CalendarClock,
          color: 'bg-yellow-100 text-yellow-700',
          label: 'Appointment Rescheduled',
          animation: 'animate-pulse'
        };
      case 'cancel appointment':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-700',
          label: 'Appointment Cancelled',
          animation: 'animate-shake'
        };
      default:
        return {
          icon: Info,
          color: 'bg-gray-100 text-gray-700',
          label: 'System Notification',
          animation: ''
        };
    }
  };

  // Helper function to format date/time difference (optional, for relative time)
  const formatTimeAgo = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now - date) / 1000);
    const minutes = Math.round(seconds / 60);
    const hours = Math.round(minutes / 60);
    const days = Math.round(hours / 24);

    if (seconds < 60) return `${seconds}s ago`;
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return `Yesterday`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  // --- Filtering Logic ---
  // Filter notifications for the 'Alerts' tab
  const alertNotifications = notifications.filter(notification => 
    notification.type?.toLowerCase().includes('appointment')
  );

  // Placeholder filters for other tabs (excluding alerts)
  // TODO: Define actual criteria for messages and system notifications
  const messageNotifications = notifications.filter(notification => 
    !notification.type?.toLowerCase().includes('appointment') && 
    false // Replace 'false' with actual message criteria later
  ); 
  const systemNotifications = notifications.filter(notification => 
    !notification.type?.toLowerCase().includes('appointment') && 
    false // Replace 'false' with actual system criteria later
  );

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
        <p className="text-muted-foreground">Stay updated with activity from your ai</p>
      </div>
      
      <Card className="min-h-[700px]">
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
            Recent activity and alerts from your ai system
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
              <ScrollArea className="h-[500px]">
                {notifications.length > 0 ? (
                  <div className="divide-y">
                    {notifications.map((notification) => {
                      // Get type info based on notification.type
                      const typeInfo = getNotificationTypeInfo(notification.type);
                      const Icon = typeInfo.icon || Info;
                      const bgColor = typeInfo.color || 'bg-gray-100 text-gray-700';
                      const label = typeInfo.label || 'Notification';
                      const animation = typeInfo.animation || '';

                      return (
                        <div
                          key={notification.id}
                          className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${notification.read ? '' : 'bg-primary/5'}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="flex space-x-4 items-center">
                            {/* Use color and icon from typeInfo */}
                            <div className={`p-2 rounded-full ${bgColor} h-10 w-10 flex items-center justify-center flex-shrink-0 ${animation}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 space-y-1 overflow-hidden"> {/* Added overflow-hidden */}
                              <div className="flex items-center justify-between">
                                {/* Use label from typeInfo for title */}
                                <p className={`font-medium text-sm truncate ${!notification.read ? 'text-foreground' : ''}`}>
                                  {label}
                                </p>
                                {/* Timestamp moved below */}
                              </div>
                              {/* Use notification.note for description */}
                              <p className="text-sm text-muted-foreground truncate">
                                {notification.note || 'No details available.'}
                              </p>
                              {/* Move timestamp here */}
                              <p className="text-xs text-muted-foreground pt-1"> {/* Added pt-1 for slight spacing */}
                                {formatTimeAgo(notification.created_at)}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-auto h-auto flex-shrink-0 self-center"> {/* Adjust wrapper for Riple size */}
                                <Riple color="#2f4ff5" size="small" text="" textColor="" /> {/* Using theme color and smaller size */}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6">
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
              <ScrollArea className="h-[500px]">
                {messageNotifications.length > 0 ? (
                   <div className="divide-y">
                     {/* Map messageNotifications here */}
                     <p className="p-6 text-center text-muted-foreground">Message rendering not implemented yet.</p>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-center p-6">
                     <MessageCircle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                     <h3 className="text-lg font-medium">No messages</h3>
                     <p className="text-sm text-muted-foreground mt-1">
                       New messages will appear here.
                     </p>
                   </div>
                 )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="alerts" className="m-0">
              <ScrollArea className="h-[500px]">
                 {alertNotifications.length > 0 ? (
                   <div className="divide-y">
                     {alertNotifications.map((notification) => {
                       // Re-use the same rendering logic
                       const typeInfo = getNotificationTypeInfo(notification.type);
                       const Icon = typeInfo.icon || AlertTriangle; // Default to AlertTriangle if needed
                       const bgColor = typeInfo.color || 'bg-yellow-100 text-yellow-700';
                       const label = typeInfo.label || 'Alert';
                       const animation = typeInfo.animation || '';

                       return (
                         <div
                           key={notification.id}
                           className={`p-4 cursor-pointer hover:bg-muted/50 transition-colors ${notification.read ? '' : 'bg-primary/5'}`}
                           onClick={() => handleNotificationClick(notification)}
                         >
                           <div className="flex space-x-4 items-center">
                             <div className={`p-2 rounded-full ${bgColor} h-10 w-10 flex items-center justify-center flex-shrink-0 ${animation}`}>
                               <Icon className="h-5 w-5" />
                             </div>
                             <div className="flex-1 space-y-1 overflow-hidden">
                               <div className="flex items-center justify-between">
                                 <p className={`font-medium text-sm truncate ${!notification.read ? 'text-foreground' : ''}`}>
                                   {label}
                                 </p>
                               </div>
                               <p className="text-sm text-muted-foreground truncate">
                                 {notification.note || 'No details available.'}
                               </p>
                               <p className="text-xs text-muted-foreground pt-1">
                                 {formatTimeAgo(notification.created_at)}
                               </p>
                             </div>
                             {!notification.read && (
                               <div className="w-auto h-auto flex-shrink-0 self-center">
                                 <Riple color="#2f4ff5" size="small" text="" textColor="" />
                               </div>
                             )}
                           </div>
                         </div>
                       );
                     })}
                   </div>
                 ) : (
                   // Empty state specific to alerts
                   <div className="flex flex-col items-center justify-center h-full text-center p-6">
                     <AlertTriangle className="h-12 w-12 text-muted-foreground/50 mb-4" />
                     <h3 className="text-lg font-medium">No alerts</h3>
                     <p className="text-sm text-muted-foreground mt-1">
                       Appointment-related notifications and other alerts will appear here.
                     </p>
                   </div>
                 )}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="system" className="m-0">
              <ScrollArea className="h-[500px]">
                 {systemNotifications.length > 0 ? (
                   <div className="divide-y">
                     {/* Map systemNotifications here */}
                      <p className="p-6 text-center text-muted-foreground">System notification rendering not implemented yet.</p>
                   </div>
                 ) : (
                   <div className="flex flex-col items-center justify-center h-full text-center p-6">
                     <Info className="h-12 w-12 text-muted-foreground/50 mb-4" />
                     <h3 className="text-lg font-medium">No system updates</h3>
                     <p className="text-sm text-muted-foreground mt-1">
                       System-related notifications will appear here.
                     </p>
                   </div>
                 )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader className="space-y-3 pb-4 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedNotification && (() => {
                  const typeInfo = getNotificationTypeInfo(selectedNotification.type);
                  const Icon = typeInfo.icon || Info;
                  return (
                    <>
                      <div className={`p-2 rounded-full ${typeInfo.color} h-8 w-8 flex items-center justify-center flex-shrink-0`}>
                         <Icon className="h-4 w-4" />
                      </div>
                      <DialogTitle className="text-lg font-semibold">
                        {typeInfo.label || "Notification Details"}
                      </DialogTitle>
                    </>
                  );
                })()}
              </div>
            </div>
            <DialogDescription className="flex items-center gap-2 pt-1 text-xs">
              <Clock className="h-3 w-3" />
              {selectedNotification?.created_at
                ? new Date(selectedNotification.created_at).toLocaleString()
                : "Timestamp not available"}
            </DialogDescription>
          </DialogHeader>

          <div className="pt-4 space-y-6 max-h-[60vh] overflow-y-auto pr-2">
             {/* ... User Info Avatar section ... */}
              <div className="flex items-center">
              <Avatar className="h-10 w-10">
                <div className="h-full w-full rounded-full bg-muted flex items-center justify-center">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
              </Avatar>
              <div style={{ marginLeft: '0.5rem' }}>
                <h4 className="font-medium text-sm">{selectedNotification?.name || "Unknown User"}</h4>
                <p className="text-xs text-muted-foreground">@{selectedNotification?.username || "N/A"}</p>
              </div>
            </div>


            {selectedNotification?.note && (
              // Use Tailwind class my-4 instead of inline style
              <div 
                className="bg-muted/50 p-4 rounded-lg border" 
                style={{ marginTop: '1rem', marginBottom: '1rem' }} // Added inline margin styles
              >
                 <p className="text-sm text-foreground">{selectedNotification.note}</p>
              </div>
            )}

             {/* ... Details section ... */}
             {selectedNotification?.details && Object.keys(selectedNotification.details).length > 0 && (
              <div className="space-y-3 border-t pt-4">
                 <h4 className="font-medium text-sm text-muted-foreground mb-3">Details:</h4>
                 {Object.entries(selectedNotification.details).map(([key, value]) => (
                   <div key={key} className="flex justify-between items-start text-sm gap-4"> {/* Use items-start for long values */}
                     <span className="text-muted-foreground capitalize whitespace-nowrap">{key.replace(/_/g, ' ')}:</span> {/* Prevent key wrapping */}
                     <span className="font-medium text-right break-words"> {/* Allow value wrapping */}
                        {typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?(Z|[+-]\d{2}:\d{2})?$/) // Improved date regex
                          ? new Date(value).toLocaleString()
                          : (key.toLowerCase().includes('amount') || key.toLowerCase().includes('price')) && typeof value === 'number'
                          ? `$${value.toFixed(2)}`
                          : String(value)}
                     </span>
                   </div>
                 ))}
              </div>
            )}
             {!selectedNotification?.details && !selectedNotification?.note && (
                 <p className="text-sm text-muted-foreground text-center pt-4">No additional details available for this notification.</p>
             )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Notifications;

