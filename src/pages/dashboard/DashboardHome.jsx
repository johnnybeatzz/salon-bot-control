import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, MessageCircle, Clock, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for demonstration
const stats = [
  {
    title: "Total Users",
    value: "1,256",
    description: "Active Instagram followers",
    icon: Users,
    change: "+12.5%",
    color: "bg-salon-100 text-salon-700",
  },
  {
    title: "Conversations",
    value: "358",
    description: "Last 30 days",
    icon: MessageCircle,
    change: "+18.2%",
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    title: "Average Response",
    value: "1.8m",
    description: "Response time",
    icon: Clock,
    change: "-25.3%",
    color: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Unresolved",
    value: "12",
    description: "Needs attention",
    icon: AlertTriangle,
    change: "+3.1%",
    color: "bg-amber-100 text-amber-700",
  }
];

const chartData = [
  { name: 'Mon', conversations: 24 },
  { name: 'Tue', conversations: 35 },
  { name: 'Wed', conversations: 42 },
  { name: 'Thu', conversations: 38 },
  { name: 'Fri', conversations: 55 },
  { name: 'Sat', conversations: 29 },
  { name: 'Sun', conversations: 15 }
];

const recentActivity = [
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
];

const DashboardHome = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to our Salon Bot control panel</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card className="mb-8" key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                <p className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Activity Chart & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Conversation Activity</CardTitle>
            <CardDescription>Daily conversations over the last week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="conversations" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest customer inquiries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4">
                  <div className="bg-salon-100 text-salon-700 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 border-salon-300 shadow-sm">
                    {activity.user.charAt(0)}
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm">{activity.user}</p>
                    <p className="text-xs text-muted-foreground">{activity.message}</p>
                    <p className="text-xs text-muted-foreground/70">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;
