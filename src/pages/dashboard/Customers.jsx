import React, { useState, useEffect } from 'react';
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
import { fetchCustomers, updateCustomerBotStatus, deleteCustomer } from "@/lib/api";
import { BlinkBlur } from "react-loading-indicators"

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const data = await fetchCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error("Failed to load customers");
      console.error("Error loading customers:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );
  
  const handleBotToggle = async (id, enabled) => {
    try {
      setCustomers(customers.map(customer => 
        customer.userId === id ? { 
          ...customer, 
          botEnabled: enabled,
          status: enabled ? 'active' : 'inactive'
        } : customer
      ));
      await updateCustomerBotStatus(id, enabled);
      
      toast.success(`Bot ${enabled ? 'enabled' : 'disabled'} for ${customers.find(c => c.userId === id).name}`);
    } catch (error) {
      toast.error("Failed to update bot status");
      console.error("Error updating bot status:", error);
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      await deleteCustomer(id);
      setCustomers(customers.filter(customer => customer.userId !== id));
      toast.success('Customer deleted successfully');
    } catch (error) {
      toast.error('Failed to delete customer');
      console.error('Error deleting customer:', error);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4">
          <BlinkBlur color='#2f4ff5' size="medium" text="" textColor="" />
          <p className="text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

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
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  <thead className="text-xs text-muted-foreground uppercase bg-muted px-4" style={{paddingLeft:"20px"}}>
                    <tr>
                      <th scope="col" className="px-6 py-3">Customer</th>
                      <th scope="col" className="px-6 py-3">Username</th>
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
                            <div className="flex items-center">
                              <Avatar className="h-9 w-9 border-2 border-salon-200 flex-shrink-0 ml-1" style={{ marginRight: '8px', marginLeft:'20px'}}>
                                <div className="bg-salon-100 text-salon-800 flex items-center justify-center h-full w-full font-medium">
                                  {customer.avatar}
                                </div>
                              </Avatar>
                              <div style={{ marginLeft: '16px', paddingLeft: '4px' }}>
                                <p className="font-medium">{customer.name}</p>
                                <Badge variant={customer.status === 'active' ? 'outline' : 'secondary'} className="mt-1">
                                  {customer.status === 'active' ? 'Active' : 'Inactive'}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="text-xs">{customer.username}</p>
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
                                onCheckedChange={(checked) => handleBotToggle(customer.userId, checked)}
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
                                <DropdownMenuItem onClick={() => {
                                  toast.info(`View ${customer.name}'s profile`)
                                  window.open(`https://instagram.com/${customer.username}`, '_blank')
                                }}>
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toast.info(`View ${customer.name}'s conversations`)}>
                                  View Conversations
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDeleteCustomer(customer.userId)}
                                >
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
              <div className="p-4 text-center text-muted-foreground text-sm">
                Showing active customers would appear here
              </div>
            </TabsContent>
            <TabsContent value="inactive" className="m-0">
              <div className="p-4 text-center text-muted-foreground text-sm">
                Showing inactive customers would appear here
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Customers;
