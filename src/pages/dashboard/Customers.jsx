
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, MoreHorizontal, UserPlus } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

// Mock data
const mockCustomers = [
  {
    id: 1,
    name: "Jessica Smith",
    avatar: "JS",
    email: "jessica.smith@example.com",
    phone: "+1 (555) 123-4567",
    conversations: 8,
    lastActive: "Today, 10:25 AM",
    botEnabled: true,
    status: "active",
  },
  {
    id: 2,
    name: "Michael Johnson",
    avatar: "MJ",
    email: "michael.johnson@example.com",
    phone: "+1 (555) 234-5678",
    conversations: 5,
    lastActive: "Yesterday, 2:30 PM",
    botEnabled: true,
    status: "active",
  },
  {
    id: 3,
    name: "Emma Davis",
    avatar: "ED",
    email: "emma.davis@example.com",
    phone: "+1 (555) 345-6789",
    conversations: 12,
    lastActive: "Yesterday, 4:15 PM",
    botEnabled: false,
    status: "inactive",
  },
  {
    id: 4,
    name: "Alex Rodriguez",
    avatar: "AR",
    email: "alex.rodriguez@example.com",
    phone: "+1 (555) 456-7890",
    conversations: 3,
    lastActive: "2 days ago",
    botEnabled: true,
    status: "active",
  },
  {
    id: 5,
    name: "Olivia Wilson",
    avatar: "OW",
    email: "olivia.wilson@example.com",
    phone: "+1 (555) 567-8901",
    conversations: 7,
    lastActive: "3 days ago",
    botEnabled: true,
    status: "active",
  },
  {
    id: 6,
    name: "Daniel Miller",
    avatar: "DM",
    email: "daniel.miller@example.com",
    phone: "+1 (555) 678-9012",
    conversations: 0,
    lastActive: "1 week ago",
    botEnabled: false,
    status: "inactive",
  },
  {
    id: 7,
    name: "Sophia Brown",
    avatar: "SB",
    email: "sophia.brown@example.com",
    phone: "+1 (555) 789-0123",
    conversations: 2,
    lastActive: "2 weeks ago",
    botEnabled: true,
    status: "active",
  }
];

const Customers = () => {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
  const handleBotToggle = (id, enabled) => {
    setCustomers(customers.map(customer => 
      customer.id === id ? { ...customer, botEnabled: enabled } : customer
    ));
    
    toast.success(`Bot ${enabled ? 'enabled' : 'disabled'} for ${customers.find(c => c.id === id).name}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Customers</h1>
          <p className="text-muted-foreground">Manage your customer list and bot settings</p>
        </div>
        <Button className="bg-salon-600">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search customers..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Export List</DropdownMenuItem>
                  <DropdownMenuItem>Bulk Edit</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Bulk Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all">
            <TabsList className="w-full rounded-none border-b border-t">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="active" className="flex-1">Active</TabsTrigger>
              <TabsTrigger value="inactive" className="flex-1">Inactive</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="m-0">
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted">
                    <tr>
                      <th scope="col" className="px-6 py-3">Customer</th>
                      <th scope="col" className="px-6 py-3">Contact</th>
                      <th scope="col" className="px-6 py-3">Conversations</th>
                      <th scope="col" className="px-6 py-3">Last Active</th>
                      <th scope="col" className="px-6 py-3">Bot</th>
                      <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.length > 0 ? (
                      filteredCustomers.map((customer) => (
                        <tr key={customer.id} className="bg-white border-b hover:bg-muted/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8 border-2 border-salon-200">
                                <div className="bg-salon-100 text-salon-800 flex items-center justify-center h-full w-full font-medium">
                                  {customer.avatar}
                                </div>
                              </Avatar>
                              <div>
                                <p className="font-medium">{customer.name}</p>
                                <Badge variant={customer.status === 'active' ? 'outline' : 'secondary'} className="mt-1">
                                  {customer.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-xs">{customer.email}</p>
                              <p className="text-xs text-muted-foreground">{customer.phone}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {customer.conversations}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            {customer.lastActive}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <Switch 
                                checked={customer.botEnabled} 
                                onCheckedChange={(checked) => handleBotToggle(customer.id, checked)}
                                aria-label="Toggle bot"
                              />
                              <span className="text-xs">{customer.botEnabled ? 'On' : 'Off'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => toast.info(`View ${customer.name}'s profile`)}>
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.info(`View ${customer.name}'s conversations`)}>
                                  View Conversations
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive">
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="px-6 py-10 text-center text-muted-foreground">
                          No customers found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="active" className="m-0">
              <div className="p-4 text-center text-muted-foreground">
                Active customers would appear here
              </div>
            </TabsContent>
            <TabsContent value="inactive" className="m-0">
              <div className="p-4 text-center text-muted-foreground">
                Inactive customers would appear here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
