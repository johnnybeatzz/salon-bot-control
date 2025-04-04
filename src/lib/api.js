// API service for handling all data fetching operations
// This simulates API calls to a backend server/database

// Base API URL - replace with your actual API endpoint when ready
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://instagram-agent.fly.dev';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000';

// Helper function for making API requests
async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('token');
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `API request failed with status ${response.status}`);
  }
  
  return response.json();
}

// Authentication API functions
export async function loginUser(username, password) {
  try {
    const response = await fetchAPI('/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    console.log(response)
    
    // If login is successful, store the token
    if (response.user.cookie) {
      localStorage.setItem('token', response.user.cookie);
      localStorage.setItem('_id', response.user._id);
      localStorage.setItem('username', response.user.username);
    }
    
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Dashboard data API functions
export async function fetchDashboardStats() {
  // In production, this would be a real API call
  // For now, we'll simulate a delay and return mock data
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        stats: [
          {
            title: "Total Users",
            value: "1,856",
            description: "Active Instagram followers",
            icon: "Users",
            change: "+12.5%",
            color: "bg-salon-100 text-salon-700",
          },
          
          {
            title: "Conversations",
            value: "358",
            description: "Last 30 days",
            icon: "MessageCircle",
            change: "+18.2%",
            color: "bg-indigo-100 text-indigo-700",
          },
 
          {
            title: "Unresolved",
            value: "12",
            description: "Needs attention",
            icon: "AlertTriangle",
            change: "+3.1%",
            color: "bg-amber-100 text-amber-700",
          }
        ]
      });
    }, 9000);
  });
}

export async function fetchChartData() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: 'Mon', conversations: 24 },
        { name: 'Tue', conversations: 35 },
        { name: 'Wed', conversations: 42 },
        { name: 'Thu', conversations: 38 },
        { name: 'Fri', conversations: 55 },
        { name: 'Sat', conversations: 29 },
        { name: 'Sun', conversations: 15 }
      ]);
    }, 700);
  });
}

export async function fetchRecentActivity() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          user: "Jessica Smith",
          message: "Asked about hair styling services",
          time: "10 min ago"
        },
        {
          id: 2,
          user: "Michael Johnson",
          message: "Inquired about appointment availability",
          time: "32 min ago"
        },
        {
          id: 3,
          user: "Emma Davis",
          message: "Asked about product recommendations",
          time: "1 hour ago"
        },
        {
          id: 4,
          user: "Alex Rodriguez",
          message: "Requested pricing information",
          time: "2 hours ago"
        }
      ]);
    }, 600);
  });
}

// Function to fetch all dashboard data at once
export async function fetchAllDashboardData() {
  try {
    const token = localStorage.getItem('token');
    const dashboardData = await fetchAPI('/dashboard', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Store the entire dashboard data in localStorage
    localStorage.setItem("dashboardData", JSON.stringify(dashboardData.data));
    
    return {
      stats: dashboardData.data.stats || [],
      recentActivity: dashboardData.data.recent_chats || []
    };
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw error;
  }
}

// Customers API functions
export async function fetchCustomers() {
  // Get dashboard data from localStorage
  const dashboardData = JSON.parse(localStorage.getItem('dashboardData'));
  
  // Return customers if they exist in the data, otherwise return empty array
  return dashboardData?.customers || [];
}

export async function updateCustomerBotStatus(customerId, enabled) {
  // Simulate API call
  const dashboardData = JSON.parse(localStorage.getItem('dashboardData'));
  const token = localStorage.getItem('token');
  for (const customer of dashboardData.customers) {
    console.log(customer.userId,customerId);
    
    if (customer.userId === customerId) {
      console.log(customer);
      customer.botEnabled = enabled;
      break;
    }
  }
  const response = await fetchAPI('/switch', {
    method: 'POST',
    body: JSON.stringify({ "userId":customerId,"is_enabled":enabled}),
  });
  console.log(response);
  
  localStorage.setItem('dashboardData', JSON.stringify(dashboardData));

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: `Bot ${enabled ? 'enabled' : 'disabled'} for customer ${customerId}` });
    }, 500);
  });
}

export async function deleteCustomer(customerId) {
  const owner_id = localStorage.getItem('_id')
  try {
    const response = await fetchAPI(`/delete_customer`, {
      method: 'POST',
      body: JSON.stringify({ "_id":customerId,"owner_id":owner_id}),
    });
    return response;
  } catch (error) {
    console.error('Failed to delete customer:', error);
    throw error;
  }
}

// Conversations API functions
export async function fetchConversations() {
  
  const dashboardData = JSON.parse(localStorage.getItem('dashboardData'));
  return dashboardData?.conversations || [];

  // Simulate API call
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve([
  //       {
  //         id: 1,
  //         user: "Jessica Smith",
  //         avatar: "JS",
  //         lastMessage: "Thank you for the information about the hair treatments.",
  //         time: "10:25 AM",
  //         unread: true,
  //         messages: [
  //           { id: 1, content: "Hi, do you offer hair coloring services?", isUser: true, time: "09:45 AM" },
  //           { id: 2, content: "Yes, we offer a wide range of hair coloring services.", isUser: false, time: "09:47 AM" }
  //         ]
  //       },
  //       {
  //         id: 2,
  //         user: "Michael Johnson",
  //         avatar: "MJ",
  //         lastMessage: "Can I book an appointment for next Tuesday?",
  //         time: "Yesterday",
  //         unread: false,
  //         messages: [
  //           { id: 1, content: "Hello, I'd like to know your availability for next week.", isUser: true, time: "2:15 PM" },
  //           { id: 2, content: "We have several openings next week.", isUser: false, time: "2:17 PM" }
  //         ]
  //       }
  //     ]);
  //   }, 1000);
  // });
}

export async function sendMessage(conversationId, message) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: {
          id: Date.now(),
          content: message,
          isUser: false,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      });
    }, 500);
  });
}

// Notifications API functions
export async function fetchNotifications() {
  try {
    // Use fetchAPI helper for the GET request
    const response = await fetchAPI('/get_notifications', { method: 'GET' });

    // Check if the response has the 'notifications' key and it's an array
    if (response && Array.isArray(response.notifications)) {
      // Map the notifications array
      return response.notifications.map(notification => {
        // Clone details to avoid modifying the original if needed elsewhere,
        // or directly modify if not needed. Using direct modification here for simplicity.
        const details = notification.details || {};
        // Remove the 'Note' property from the details object if it exists
        if (details.hasOwnProperty('Note')) {
          delete details['Note'];
        }

        return {
          id: notification._id, // Use _id directly
          user_id: notification.user_id,
          owner_id: notification.owner_id,
          note: notification.note, // Use the top-level note for list display
          read: notification.viewed ?? false, // Use viewed, default to false
          // Ensure created_at is in a format Date can parse, or adjust formatTimeAgo
          created_at: notification.created_at?.replace(' ', 'T') + 'Z', // Attempt to convert to ISO-like format
          type: notification.details?.Type || 'unknown', // Extract type from details, provide default
          details: details, // Assign the modified details object
          name: notification.name,
          username: notification.username
        };
      });
    } else {
      console.warn("API response did not contain a 'notifications' array:", response);
      return []; // Return empty array if the structure is unexpected
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    // Optionally re-throw or return an empty array/error state
    // throw error;
    return []; // Return empty array on error to prevent UI crash
  }
}

export async function markNotificationAsRead(notificationId) {
  try {
    // Use fetchAPI to send a POST request to the backend
    const response = await fetchAPI('/read_notification', {
      method: 'POST',
      body: JSON.stringify({ notification_id: notificationId }), // Send the notification ID
    });
    console.log('Mark as read response:', response); // Optional: Log the response
    return response; // Return the backend response
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    throw error; // Re-throw the error to be caught by the calling component
  }

  // --- REMOVED SIMULATED API CALL ---
  // return new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve({ success: true, message: `Notification ${notificationId} marked as read` });
  //   }, 500);
  // });
}

export async function markAllNotificationsAsRead() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "All notifications marked as read" });
    }, 500);
  });
}

// Settings API functions
export async function fetchSettings() {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        generalSettings: {
          botName: "Salon Assistant",
          greeting: "Hello! I'm your salon assistant. How can I help you today?",
          operatingHours: "Monday-Friday: 9AM-7PM, Saturday: 10AM-6PM, Sunday: Closed",
          responseTime: "typically within 5 minutes",
          language: "english"
        },
        automationSettings: {
          autoReply: true,
          autoReplyDelay: "10",
          autoFollowUp: true,
          followUpDelay: "12",
          sendReadReceipts: true,
          workingHoursOnly: true
        }
      });
    }, 1000);
  });
}

export async function get_business_data() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetchAPI('/business_data', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch business data:', error);
    throw error;
  }
}

export async function updateSettings(settings) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, message: "Settings updated successfully" });
    }, 500);
  });
}

export async function save_business_data(data) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetchAPI('/save_business_data', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"business_data":data})
    });
    return response;
  } catch (error) {
    console.error('Failed to save business data:', error);
    throw error;
  }
} 