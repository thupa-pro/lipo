"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plug,
  Globe,
  Code,
  Database,
  Webhook,
  Key,
  Shield,
  Settings,
  Play,
  Pause,
  XCircle,
  AlertCircle
  Download,
  Upload,
  Copy,
  Eye,
  EyeOff,
  Edit
  Plus,
  ExternalLink,
  RefreshCw,
  Activity,
  BarChart3,
  Terminal,
  FileText
  Server,
  Cloud,
  Smartphone,
  CreditCard,
  Mail
  Calendar,
  MapPin,
  Package,
  Building,
  CheckCircle,
  Clock,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: "payment" | "communication" | "analytics" | "productivity" | "mapping" | "crm" | "marketing";
  provider: string;
  logo: string;
  isConnected: boolean;
  isEnabled: boolean;
  lastSync: Date;
  status: "active" | "error" | "warning" | "disabled";
  config: Record<string, any>;
  endpoints: string[];
  rateLimit: {
    requests: number;
    period: string;
    remaining: number;
  };
}

interface APIEndpoint {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  description: string;
  version: string;
  isPublic: boolean;
  isDeprecated: boolean;
  rateLimit: number;
  usage24h: number;
  responseTime: number;
  successRate: number;
  parameters: { name: string; type: string; required: boolean; description: string }[];
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret: string;
  lastTriggered: Date;
  successCount: number;
  failureCount: number;
  retryPolicy: {
    maxRetries: number;
    backoffMultiplier: number;
  };
}

interface APIKey {
  id: string;
  name: string;
  key: string;
  environment: "development" | "staging" | "production";
  permissions: string[];
  lastUsed: Date;
  usageCount: number;
  isActive: boolean;
  expiresAt: Date;
}

export default function IntegrationHub() {
  const [activeTab, setActiveTab] = useState("integrations");
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [apiEndpoints, setApiEndpoints] = useState<APIEndpoint[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showSecrets, setShowSecrets] = useState(false);

  // Mock data
  const mockIntegrations: Integration[] = [
    {
      id: "stripe",
      name: "Stripe",
      description: "Payment processing and billing automation",
      category: "payment",
      provider: "Stripe Inc.",
      logo: "💳",
      isConnected: true,
      isEnabled: true,
      lastSync: new Date(Date.now() - 5 * 60 * 1000),
      status: "active",
      config: { publicKey: "pk_live_...", webhookSecret: "whsec_..." },
      endpoints: ["/payments", "/subscriptions", "/customers"],
      rateLimit: { requests: 100, period: "per minute", remaining: 87 },
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "SMS, voice, and video communications",
      category: "communication",
      provider: "Twilio Inc.",
      logo: "📱",
      isConnected: true,
      isEnabled: true,
      lastSync: new Date(Date.now() - 15 * 60 * 1000),
      status: "active",
      config: { accountSid: "AC...", authToken: "..." },
      endpoints: ["/sms", "/voice", "/video"],
      rateLimit: { requests: 1000, period: "per hour", remaining: 856 },
    },
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Email delivery and marketing automation",
      category: "communication",
      provider: "Twilio Inc.",
      logo: "📧",
      isConnected: true,
      isEnabled: false,
      lastSync: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      status: "warning",
      config: { apiKey: "SG..." },
      endpoints: ["/email", "/templates", "/campaigns"],
      rateLimit: { requests: 600, period: "per minute", remaining: 0 },
    },
    {
      id: "google-maps",
      name: "Google Maps",
      description: "Location services and mapping",
      category: "mapping",
      provider: "Google",
      logo: "🗺️",
      isConnected: true,
      isEnabled: true,
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      status: "active",
      config: { apiKey: "AIza..." },
      endpoints: ["/geocoding", "/directions", "/places"],
      rateLimit: { requests: 2500, period: "per day", remaining: 2340 },
    },
    {
      id: "slack",
      name: "Slack",
      description: "Team communication and notifications",
      category: "communication",
      provider: "Slack Technologies",
      logo: "💬",
      isConnected: false,
      isEnabled: false,
      lastSync: new Date(0),
      status: "disabled",
      config: {},
      endpoints: [],
      rateLimit: { requests: 0, period: "per minute", remaining: 0 },
    },
    {
      id: "hubspot",
      name: "HubSpot",
      description: "CRM and marketing automation",
      category: "crm",
      provider: "HubSpot Inc.",
      logo: "🏢",
      isConnected: false,
      isEnabled: false,
      lastSync: new Date(0),
      status: "disabled",
      config: {},
      endpoints: [],
      rateLimit: { requests: 0, period: "per minute", remaining: 0 },
    },
  ];

  const mockApiEndpoints: APIEndpoint[] = [
    {
      id: "get-services",
      path: "/api/v1/services",
      method: "GET",
      description: "Retrieve all available services",
      version: "1.0",
      isPublic: true,
      isDeprecated: false,
      rateLimit: 1000,
      usage24h: 12450,
      responseTime: 120,
      successRate: 99.8,
      parameters: [
        { name: "category", type: "string", required: false, description: "Filter by service category" },
        { name: "location", type: "string", required: false, description: "Geographic location filter" },
        { name: "limit", type: "integer", required: false, description: "Number of results to return" },
      ],
    },
    {
      id: "create-booking",
      path: "/api/v1/bookings",
      method: "POST",
      description: "Create a new service booking",
      version: "1.0",
      isPublic: false,
      isDeprecated: false,
      rateLimit: 100,
      usage24h: 3247,
      responseTime: 250,
      successRate: 98.5,
      parameters: [
        { name: "serviceId", type: "string", required: true, description: "Unique service identifier" },
        { name: "providerId", type: "string", required: true, description: "Service provider ID" },
        { name: "datetime", type: "string", required: true, description: "Booking date and time" },
        { name: "customerInfo", type: "object", required: true, description: "Customer details" },
      ],
    },
    {
      id: "get-analytics",
      path: "/api/v1/analytics",
      method: "GET",
      description: "Retrieve platform analytics data",
      version: "1.0",
      isPublic: false,
      isDeprecated: false,
      rateLimit: 50,
      usage24h: 847,
      responseTime: 450,
      successRate: 99.2,
      parameters: [
        { name: "timeframe", type: "string", required: false, description: "Analytics timeframe" },
        { name: "metrics", type: "array", required: false, description: "Specific metrics to retrieve" },
      ],
    },
  ];

  const mockWebhooks: Webhook[] = [
    {
      id: "booking-events",
      name: "Booking Events",
      url: "https://api.partner.com/webhooks/bookings",
      events: ["booking.created", "booking.confirmed", "booking.completed", "booking.cancelled"],
      isActive: true,
      secret: "whsec_1234567890abcdef",
      lastTriggered: new Date(Date.now() - 10 * 60 * 1000),
      successCount: 1247,
      failureCount: 23,
      retryPolicy: { maxRetries: 3, backoffMultiplier: 2 },
    },
    {
      id: "payment-events",
      name: "Payment Events", 
      url: "https://api.accounting.com/webhooks/payments",
      events: ["payment.succeeded", "payment.failed", "payment.refunded"],
      isActive: true,
      secret: "whsec_fedcba0987654321",
      lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
      successCount: 892,
      failureCount: 5,
      retryPolicy: { maxRetries: 5, backoffMultiplier: 1.5 },
    },
  ];

  const mockApiKeys: APIKey[] = [
    {
      id: "key-1",
      name: "Production API Key",
      key: "lc_live_1234567890abcdef1234567890abcdef",
      environment: "production",
      permissions: ["read:services", "write:bookings", "read:analytics"],
      lastUsed: new Date(Date.now() - 30 * 60 * 1000),
      usageCount: 125000,
      isActive: true,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    },
    {
      id: "key-2",
      name: "Development API Key",
      key: "lc_test_fedcba0987654321fedcba0987654321",
      environment: "development",
      permissions: ["read:services", "write:bookings"],
      lastUsed: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      usageCount: 8500,
      isActive: true,
      expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setIntegrations(mockIntegrations);
      setApiEndpoints(mockApiEndpoints);
      setWebhooks(mockWebhooks);
      setApiKeys(mockApiKeys);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case "error":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "disabled":
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-50 border-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "error":
        return "text-red-600 bg-red-50 border-red-200";
      case "disabled":
        return "text-gray-600 bg-gray-50 border-gray-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const filteredIntegrations = integrations.filter(integration => 
    selectedCategory === "all" || integration.category === selectedCategory
  );

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-muted rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Integration Hub</h1>
          <p className="text-muted-foreground">
            Manage third-party, integrations, APIs, and developer tools
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Documentation
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Integration
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="api">API Endpoints</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          {/* Category Filter */}
          <div className="flex items-center gap-4">
            <Label>Filter by category:</Label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="payment">Payment</SelectItem>
                <SelectItem value="communication">Communication</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="mapping">Mapping</SelectItem>
                <SelectItem value="crm">CRM</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Integration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIntegrations.map((integration) => (
              <Card key={integration.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{integration.logo}</div>
                      <div>
                        <CardTitle className="text-lg">{integration.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{integration.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(integration.status)}
                      <Badge className={getStatusColor(integration.status)}>
                        {integration.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">{integration.description}</p>
                  
                  {integration.isConnected && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Last sync:</span>
                        <span className="text-muted-foreground">
                          {integration.lastSync.toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Rate limit:</span>
                          <span>{integration.rateLimit.remaining}/{integration.rateLimit.requests} {integration.rateLimit.period}</span>
                        </div>
                        <Progress 
                          value={(integration.rateLimit.remaining / integration.rateLimit.requests) * 100} 
                          className="h-2" 
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-sm">Enabled</span>
                        <Switch
                          checked={integration.isEnabled}
                          onCheckedChange={(checked) => {
                            setIntegrations(prev => prev.map(i => 
                              i.id === integration.id ? { ...i, isEnabled: checked } : i
                            ));
                          }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {integration.isConnected ? (
                      <>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" className="flex-1">
                        <Plug className="w-4 h-4 mr-2" />
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* API Endpoints Tab */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Endpoints</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiEndpoints.map((endpoint) => (
                  <div key={endpoint.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="font-mono">
                          {endpoint.method}
                        </Badge>
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {endpoint.path}
                        </code>
                        {endpoint.isDeprecated && (
                          <Badge variant="destructive">Deprecated</Badge>
                        )}
                        {endpoint.isPublic && (
                          <Badge variant="secondary">Public</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>v{endpoint.version}</span>
                        <span>{endpoint.usage24h.toLocaleString()} calls today</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">{endpoint.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Response Time:</span>
                        <span className="ml-2">{endpoint.responseTime}ms</span>
                      </div>
                      <div>
                        <span className="font-medium">Success Rate:</span>
                        <span className="ml-2">{endpoint.successRate}%</span>
                      </div>
                      <div>
                        <span className="font-medium">Rate Limit:</span>
                        <span className="ml-2">{endpoint.rateLimit}/min</span>
                      </div>
                    </div>

                    {endpoint.parameters.length > 0 && (
                      <div className="mt-4">
                        <h5 className="font-medium mb-2">Parameters:</h5>
                        <div className="space-y-2">
                          {endpoint.parameters.map((param) => (
                            <div key={param.name} className="flex items-center gap-4 text-sm">
                              <code className="bg-muted px-2 py-1 rounded">{param.name}</code>
                              <Badge variant="outline">{param.type}</Badge>
                              {param.required && <Badge variant="destructive" size="sm">Required</Badge>}
                              <span className="text-muted-foreground">{param.description}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Test
                      </Button>
                      <Button variant="outline" size="sm">
                        <FileText className="w-4 h-4 mr-2" />
                        Docs
                      </Button>
                      <Button variant="outline" size="sm">
                        <Code className="w-4 h-4 mr-2" />
                        Examples
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Webhooks Tab */}
        <TabsContent value="webhooks" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Webhooks</CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Webhook
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{webhook.name}</h4>
                        <Badge className={webhook.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {webhook.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={webhook.isActive}
                          onCheckedChange={(checked) => {
                            setWebhooks(prev => prev.map(w => 
                              w.id === webhook.id ? { ...w, isActive: checked } : w
                            ));
                          }}
                        />
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Play className="w-4 h-4 mr-2" />
                              Test
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Activity className="w-4 h-4 mr-2" />
                              Logs
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">URL:</span>
                        <code className="ml-2 bg-muted px-2 py-1 rounded text-xs">{webhook.url}</code>
                      </div>
                      
                      <div>
                        <span className="font-medium">Events:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {webhook.events.map((event) => (
                            <Badge key={event} variant="outline" className="text-xs">
                              {event}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                        <div>
                          <span className="font-medium">Last triggered:</span>
                          <span className="ml-2">{webhook.lastTriggered.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="font-medium">Success:</span>
                          <span className="ml-2 text-green-600">{webhook.successCount}</span>
                        </div>
                        <div>
                          <span className="font-medium">Failures:</span>
                          <span className="ml-2 text-red-600">{webhook.failureCount}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div>
                          <span className="font-medium">Secret:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="bg-muted px-2 py-1 rounded text-xs">
                              {showSecrets ? webhook.secret : "•".repeat(20)}
                            </code>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(webhook.secret)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="keys" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">API Keys</h3>
              <p className="text-sm text-muted-foreground">
                Manage API keys for different environments
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSecrets(!showSecrets)}
              >
                {showSecrets ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                {showSecrets ? "Hide" : "Show"} Keys
              </Button>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Generate Key
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">{apiKey.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{apiKey.environment}</Badge>
                        <Badge className={apiKey.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                          {apiKey.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Settings className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Regenerate
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="w-4 h-4 mr-2" />
                          Revoke
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label className="text-sm font-medium">API Key</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <code className="flex-1 bg-muted px-3 py-2 rounded font-mono text-sm">
                          {showSecrets ? apiKey.key : `${apiKey.key.substring(0, 12)}${"•".repeat(20)}`}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Last used:</span>
                        <span className="ml-2">{apiKey.lastUsed.toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">Usage count:</span>
                        <span className="ml-2">{apiKey.usageCount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="font-medium">Expires:</span>
                        <span className="ml-2">{apiKey.expiresAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
                      <span className="font-medium text-sm">Permissions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {apiKey.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>API Logs</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                {[
                  { time: "14:32:15", method: "POST", path: "/api/v1/bookings", status: 201, duration: "245ms", ip: "192.168.1.100" },
                  { time: "14:31:48", method: "GET", path: "/api/v1/services", status: 200, duration: "120ms", ip: "192.168.1.101" },
                  { time: "14:31:22", method: "PUT", path: "/api/v1/bookings/123", status: 200, duration: "180ms", ip: "192.168.1.100" },
                  { time: "14:30:55", method: "GET", path: "/api/v1/analytics", status: 403, duration: "45ms", ip: "192.168.1.102" },
                  { time: "14:30:30", method: "POST", path: "/api/v1/webhooks", status: 201, duration: "320ms", ip: "192.168.1.103" },
                ].map((log, index) => (
                  <div key={index} className="flex items-center gap-4 p-2 hover:bg-muted rounded">
                    <span className="text-muted-foreground">{log.time}</span>
                    <Badge variant="outline" className="w-16 justify-center">{log.method}</Badge>
                    <span className="flex-1">{log.path}</span>
                    <Badge className={log.status < 400 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                      {log.status}
                    </Badge>
                    <span className="text-muted-foreground">{log.duration}</span>
                    <span className="text-muted-foreground">{log.ip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}