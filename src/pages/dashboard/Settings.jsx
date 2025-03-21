import React, { useState, useEffect } from 'react';
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
import { BlinkBlur } from "react-loading-indicators"
import { get_business_data, save_business_data } from '@/lib/api';

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
  
  const [businessData, setBusinessData] = useState({});
  
  // Track expanded state for collapsible sections
  const [expandedSections, setExpandedSections] = useState({});
  
  // Add loading state
  const [loading, setLoading] = useState(false);
  
  // Fetch business data on component mount
  useEffect(() => {
    const fetchBusinessData = async () => {
      setLoading(true);
      try {
        const data = await get_business_data();
        setBusinessData(data);
      } catch (error) {
        toast.error('Failed to load business data');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessData();
  }, []);
  
  // Function to toggle section expansion
  const toggleSection = (path) => {
    setExpandedSections(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  
  // Handle file import
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target.result);
          setBusinessData(importedData);
          toast.success("JSON data imported successfully");
        } catch (error) {
          toast.error("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };
  
  // Function to add item to an array
  const handleAddArrayItem = (path, defaultItem) => {
    setBusinessData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Navigate to the array
      const pathArray = path.split('.');
      let current = newData;
      
      for (let key of pathArray) {
        current = current[key];
      }
      
      // Add new item to array
      current.push(defaultItem || '');
      
      return newData;
    });
    
    // Expand the section to show the new item
    setExpandedSections(prev => ({
      ...prev,
      [path]: true
    }));
  };
  
  // Function to remove item from an array
  const handleRemoveArrayItem = (path, index) => {
    setBusinessData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Navigate to the array
      const pathArray = path.split('.');
      let current = newData;
      
      for (let key of pathArray) {
        current = current[key];
      }
      
      // Remove item at index
      current.splice(index, 1);
      
      return newData;
    });
  };
  
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
  
  // Function to handle changes to business data fields
  const handleBusinessDataChange = (path, value) => {
    setBusinessData(prevData => {
      // Create a deep copy of the previous state
      const newData = JSON.parse(JSON.stringify(prevData));
      
      // Split the path into parts
      const pathArray = path.split('.');
      let current = newData;
      
      // Navigate to the nested property
      for (let i = 0; i < pathArray.length - 1; i++) {
        const key = pathArray[i];
        // Handle array indices
        if (key.includes('[') && key.includes(']')) {
          const arrayName = key.split('[')[0];
          const index = parseInt(key.split('[')[1].split(']')[0]);
          current = current[arrayName][index];
        } else {
          current = current[key];
        }
      }
      
      // Set the value at the specified path
      const lastKey = pathArray[pathArray.length - 1];
      
      // Handle array indices in the last key
      if (lastKey.includes('[') && lastKey.includes(']')) {
        const arrayName = lastKey.split('[')[0];
        const index = parseInt(lastKey.split('[')[1].split(']')[0]);
        current[arrayName][index] = value;
      } else {
        current[lastKey] = value;
      }
      
      return newData;
    });
  };
  
  // Function to render a simple key-value editor
  const renderFieldEditor = (label, path, value) => {
    // Add boolean support
    if (typeof value === 'boolean') {
      return (
        <div className="flex items-center space-x-2">
          <Switch
            checked={value}
            onCheckedChange={(checked) => handleBusinessDataChange(path, checked)}
          />
          <Label>{label}</Label>
        </div>
      );
    }

    // Add null handling
    if (value === null) {
      return (
        <div className="space-y-2">
          <Label>{label} (null)</Label>
          <Input disabled value="null" />
        </div>
      );
    }

    // Convert value to string for input if it's a number
    const stringValue = typeof value === 'number' ? value.toString() : value;
    
    return (
      <div className="space-y-2" key={path}>
        <Label htmlFor={path}>{label}</Label>
        <Input 
          id={path}
          value={stringValue}
          onChange={(e) => {
            // Convert back to number if the original value was a number
            const newValue = typeof value === 'number' && !isNaN(Number(e.target.value)) 
              ? Number(e.target.value) 
              : e.target.value;
            
            handleBusinessDataChange(path, newValue);
          }}
        />
      </div>
    );
  };
  
  // Function to render a textarea for longer text
  const renderTextareaEditor = (label, path, value) => {
    return (
      <div className="space-y-2" key={path}>
        <Label htmlFor={path}>{label}</Label>
        <Textarea 
          id={path}
          value={value}
          rows={4}
          onChange={(e) => handleBusinessDataChange(path, e.target.value)}
        />
      </div>
    );
  };
  
  // Create default item for arrays based on existing items
  const createDefaultItem = (arrayPath, array) => {
    // Handle mixed array types
    if (array.length > 0) {
      const types = array.map(item => typeof item);
      const uniqueTypes = [...new Set(types)];
      
      if (uniqueTypes.length > 1) {
        return ''; // Return string as fallback
      }
    }
    
    // Use first item as template
    const template = array[0];
    
    if (typeof template === 'string') return '';
    if (typeof template === 'number') return 0;
    if (typeof template === 'boolean') return false;
    
    if (typeof template === 'object' && template !== null) {
      const result = {};
      Object.keys(template).forEach(key => {
        // Create empty/default values for each property
        const value = template[key];
        if (typeof value === 'string') result[key] = '';
        else if (typeof value === 'number') result[key] = 0;
        else if (typeof value === 'boolean') result[key] = false;
        else if (Array.isArray(value)) result[key] = [];
        else if (typeof value === 'object' && value !== null) result[key] = {};
      });
      return result;
    }
    
    return {};
  };
  
  // Function to recursively render object properties
  const renderObjectEditor = (obj, basePath = '', level = 0) => {
    if (!obj || typeof obj !== 'object') {
      return null;
    }
    
    return Object.entries(obj).map(([key, value]) => {
      const path = basePath ? `${basePath}.${key}` : key;
      const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
      const isExpanded = expandedSections[path] === true; // Default to collapsed
      
      // If value is an object but not an array
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return (
          <div key={path} className={`space-y-2 ${level > 0 ? 'ml-2 border-l-2 pl-4 border-gray-200' : ''}`}>
            <div 
              className="flex items-center cursor-pointer py-2" 
              onClick={() => toggleSection(path)}
            >
              <div className="mr-2 text-gray-500">
                {isExpanded ? '▼' : '►'}
              </div>
              <h3 className="text-md font-semibold">{label}</h3>
            </div>
            
            {isExpanded && (
              <div className="space-y-4 pl-2">
                {renderObjectEditor(value, path, level + 1)}
              </div>
            )}
          </div>
        );
      }
      // If value is an array
      else if (Array.isArray(value)) {
        const singularLabel = label.endsWith('s') ? label.slice(0, -1) : label;
        
        return (
          <div key={path} className={`space-y-2 ${level > 0 ? 'ml-2 border-l-2 pl-4 border-gray-200' : ''}`}>
            <div 
              className="flex items-center justify-between py-2"
            >
              <div 
                className="flex items-center cursor-pointer"
                onClick={() => toggleSection(path)}
              >
                <div className="mr-2 text-gray-500">
                  {isExpanded ? '▼' : '►'}
                </div>
                <h3 className="text-md font-semibold">{label} ({value.length})</h3>
              </div>
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  const defaultItem = createDefaultItem(path, value);
                  handleAddArrayItem(path, defaultItem);
                }}
              >
                Add {singularLabel}
              </Button>
            </div>
            
            {isExpanded && value.map((item, index) => {
              const itemPath = `${path}[${index}]`;
              
              if (typeof item === 'object' && item !== null) {
                const title = item.name || `Item ${index + 1}`;
                const itemSectionPath = `${path}_item_${index}`;
                const isItemExpanded = expandedSections[itemSectionPath] === true; // Default to collapsed
                
                return (
                  <div key={itemPath} className="p-3 border rounded-md mb-3 bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <div 
                        className="flex items-center cursor-pointer"
                        onClick={() => toggleSection(itemSectionPath)}
                      >
                        <div className="mr-2 text-gray-500">
                          {isItemExpanded ? '▼' : '►'}
                        </div>
                        <h4 className="font-medium">{title}</h4>
                      </div>
                      
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500"
                        onClick={() => handleRemoveArrayItem(path, index)}
                      >
                        Remove
                      </Button>
                    </div>
                    
                    {isItemExpanded && (
                      <div className="space-y-3 pl-2">
                        {renderObjectEditor(item, itemPath, level + 1)}
                      </div>
                    )}
                  </div>
                );
              } else {
                return renderFieldEditor(`${singularLabel} ${index + 1}`, itemPath, item);
              }
            })}
          </div>
        );
      }
      // For simple string values
      else if (typeof value === 'string' && value.length > 100) {
        return renderTextareaEditor(label, path, value);
      }
      // For all other simple values
      else {
        return renderFieldEditor(label, path, value);
      }
    });
  };
  
  // Hidden file input for JSON import
  const fileInputRef = React.useRef(null);

  const handleSaveBusinessData = async () => {
    try {
      setLoading(true);
      await save_business_data(businessData);
      toast.success("Business data saved successfully");
    } catch (error) {
      toast.error("Failed to save business data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {loading && (
        <div className="fixed inset-0 bg-white/50 flex items-center justify-center">
          <BlinkBlur size="medium" color="#2f4ff5" />
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your bot configuration</p>
      </div>
      
      <Tabs defaultValue="automation" className="space-y-4">
        <TabsList>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="responses">Bot Knowledge</TabsTrigger>
          <TabsTrigger value="api">API & Integrations</TabsTrigger>
        </TabsList>
        
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
              <div className="flex items-center justify-between mt-4">
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
              
              <div className="flex items-center justify-between mt-4">
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
              
              <div className="flex items-center justify-between mt-4">
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
              
              <div className="flex items-center justify-between mt-4">
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
              
              <div className="flex items-center justify-between mt-4">
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
            </CardContent>
            <CardFooter>
              <Button className="bg-salon-600 hover:bg-salon-700" onClick={() => handleSave("Automation")}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Bot Knowledge */}
        <TabsContent value="responses">
          <Card>
            <CardHeader>
              <CardTitle>Bot Knowledge</CardTitle>
              <CardDescription>
                Configure business information and bot responses for customer inquiries
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold">Business Data Configuration</h3>
                <div className="space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(businessData, null, 2));
                      toast.success("JSON copied to clipboard");
                    }}
                  >
                    Export JSON
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Import JSON
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".json"
                    onChange={handleImportJSON}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-end space-x-2 mb-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setExpandedSections({});
                    }}
                  >
                    Collapse All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      const allExpanded = {};
                      const expandAll = (obj, basePath = '') => {
                        Object.entries(obj).forEach(([key, value]) => {
                          const path = basePath ? `${basePath}.${key}` : key;
                          if (typeof value === 'object' && value !== null) {
                            allExpanded[path] = true;
                            if (Array.isArray(value)) {
                              value.forEach((item, index) => {
                                if (typeof item === 'object' && item !== null) {
                                  allExpanded[`${path}_item_${index}`] = true;
                                }
                              });
                            } else {
                              expandAll(value, path);
                            }
                          }
                        });
                      };
                      expandAll(businessData);
                      setExpandedSections(allExpanded);
                    }}
                  >
                    Expand All
                  </Button>
                </div>
                
                <div className="max-h-[600px] overflow-y-auto pr-2 border p-4 rounded-md">
                  {renderObjectEditor(businessData)}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="bg-salon-600 hover:bg-salon-700" 
                onClick={handleSaveBusinessData}
              >
                Save Business Data
              </Button>
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
