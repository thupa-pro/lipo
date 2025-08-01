import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Bot, Brain, Zap, Play, Pause, RotateCcw, TrendingUp, Sparkles, Crown, Activity, Target, Award, Plus, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface SovereignAgent {
  id: string;
  name: string;
  type: "personal" | "provider" | "negotiator" | "community";
  status: "active" | "idle" | "working" | "paused";
  avatar: string;
  capabilities: string[];
  currentTask?: string;
  stats: {
    tasksCompleted: number;
    successRate: number;
    avgResponseTime: string;
    costSavings: number;
  };
  autonomyLevel: "supervised" | "semi-autonomous" | "fully-autonomous";
  specializations: string[];
}

interface AgentTask {
  id: string;
  agentId: string;
  type: "booking" | "negotiation" | "search" | "monitoring" | "optimization";
  description: string;
  status: "pending" | "in-progress" | "completed" | "failed";
  progress: number;
  startTime: Date;
  estimatedCompletion?: Date;
  result?: any;
}

export function SovereignAgentSystem() {
  const [agents, setAgents] = useState<SovereignAgent[]>([
    {
      id: "agent-1",
      name: "Sofia",
      type: "personal",
      status: "active",
      avatar: "🤖",
      capabilities: ["booking", "search", "scheduling", "communication"],
      currentTask: "Finding pet grooming services",
      stats: {
        tasksCompleted: 142,
        successRate: 97,
        avgResponseTime: "1.2s",
        costSavings: 1250
      },
      autonomyLevel: "semi-autonomous",
      specializations: ["Local Services", "Scheduling", "Budget Optimization"]
    },
    {
      id: "agent-2", 
      name: "Marcus",
      type: "provider",
      status: "working",
      avatar: "💼",
      capabilities: ["pricing", "availability", "customer-service", "analytics"],
      currentTask: "Optimizing pricing for weekend bookings",
      stats: {
        tasksCompleted: 89,
        successRate: 94,
        avgResponseTime: "0.8s",
        costSavings: 2100
      },
      autonomyLevel: "fully-autonomous",
      specializations: ["Revenue Optimization", "Customer Relations", "Market Analysis"]
    },
    {
      id: "agent-3",
      name: "Nova",
      type: "negotiator",
      status: "idle",
      avatar: "⚡",
      capabilities: ["negotiation", "dispute-resolution", "price-optimization"],
      stats: {
        tasksCompleted: 67,
        successRate: 91,
        avgResponseTime: "2.1s",
        costSavings: 890
      },
      autonomyLevel: "supervised",
      specializations: ["Price Negotiation", "Conflict Resolution", "Deal Optimization"]
    }
  ]);

  const [activeTasks, setActiveTasks] = useState<AgentTask[]>([
    {
      id: "task-1",
      agentId: "agent-1",
      type: "search",
      description: "Finding certified pet groomers within 5 miles",
      status: "in-progress",
      progress: 75,
      startTime: new Date(Date.now() - 300000),
      estimatedCompletion: new Date(Date.now() + 120000)
    },
    {
      id: "task-2",
      agentId: "agent-2",
      type: "optimization",
      description: "Analyzing weekend demand patterns for pricing adjustment",
      status: "in-progress", 
      progress: 45,
      startTime: new Date(Date.now() - 180000),
      estimatedCompletion: new Date(Date.now() + 300000)
    }
  ]);

  const [isCreatingAgent, setIsCreatingAgent] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<SovereignAgent | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500";
      case "working": return "bg-blue-500";
      case "idle": return "bg-gray-400";
      case "paused": return "bg-yellow-500";
      default: return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Activity className="w-4 h-4" />;
      case "working": return <Zap className="w-4 h-4" />;
      case "idle": return <OptimizedIcon name="Clock" className="w-4 h-4" />;
      case "paused": return <Pause className="w-4 h-4" />;
      default: return <OptimizedIcon name="Clock" className="w-4 h-4" />;
    }
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case "personal": return <NavigationIcons.Users className="w-5 h-5 text-blue-500" / />;
      case "provider": return <Crown className="w-5 h-5 text-purple-500" />;
      case "negotiator": return <Target className="w-5 h-5 text-orange-500" />;
      case "community": return <OptimizedIcon name="Shield" className="w-5 h-5 text-green-500" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Sovereign Agent System
          </h1>
          <p className="text-muted-foreground mt-2">
            Deploy AI agents to automate your marketplace operations
          </p>
        </div>
        
        <Dialog open={isCreatingAgent} onOpenChange={setIsCreatingAgent}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
              <Plus className="w-4 h-4 mr-2" />
              Create Agent
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Sovereign Agent</DialogTitle>
              <DialogDescription>
                Design an AI agent to handle specific marketplace tasks autonomously
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agent-name">Agent Name</Label>
                  <Input id="agent-name" placeholder="e.g., Sophia, Marcus, Nova" />
                </div>
                <div>
                  <Label htmlFor="agent-type">Agent Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select agent type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal Assistant</SelectItem>
                      <SelectItem value="provider">Provider Manager</SelectItem>
                      <SelectItem value="negotiator">Negotiation Specialist</SelectItem>
                      <SelectItem value="community">Community Monitor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="capabilities">Core Capabilities</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Booking", "Search", "Pricing", "Negotiation", "Analytics", "Customer Service"].map((capability) => (
                    <label key={capability} className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">{capability}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <Label htmlFor="autonomy">Autonomy Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select autonomy level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="supervised">Supervised (Requires approval)</SelectItem>
                    <SelectItem value="semi-autonomous">Semi-Autonomous (Major decisions only)</SelectItem>
                    <SelectItem value="fully-autonomous">Fully Autonomous (Complete independence)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="instructions">Custom Instructions</Label>
                <Textarea 
                  id="instructions"
                  placeholder="Define specific behaviors, preferences, and constraints for this agent..."
                  className="h-24"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreatingAgent(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Sparkles className="w-4 h-4 mr-2" />
                Deploy Agent
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedAgent(agent)}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <CardHeader className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{agent.avatar}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{agent.name}</h3>
                      <div className="flex items-center space-x-2">
                        {getAgentTypeIcon(agent.type)}
                        <span className="text-sm text-muted-foreground capitalize">
                          {agent.type} Agent
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="flex items-center space-x-1">
                      <div className={cn("w-2 h-2 rounded-full", getStatusColor(agent.status))} />
                      <span className="capitalize">{agent.status}</span>
                    </Badge>
                    {getStatusIcon(agent.status)}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative z-10 space-y-4">
                {agent.currentTask && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                      Current Task
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      {agent.currentTask}
                    </p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {agent.stats.tasksCompleted}
                    </div>
                    <div className="text-xs text-muted-foreground">Tasks Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {agent.stats.successRate}%
                    </div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Autonomy Level</span>
                    <Badge variant="secondary" className="text-xs">
                      {agent.autonomyLevel.replace("-", " ")}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Cost Savings</span>
                    <span className="font-semibold text-emerald-600">
                      ${agent.stats.costSavings}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {agent.specializations.slice(0, 2).map((spec) => (
                    <Badge key={spec} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {agent.specializations.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{agent.specializations.length - 2} more
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Active Tasks */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5" />
            <span>Active Tasks</span>
            <Badge variant="secondary">{activeTasks.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeTasks.map((task) => {
              const agent = agents.find(a => a.id === task.agentId);
              return (
                <div key={task.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="text-2xl">{agent?.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium">{agent?.name}</h4>
                      <Badge variant="outline" className="text-xs capitalize">
                        {task.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {task.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <Progress value={task.progress} className="h-2" />
                      </div>
                      <span className="text-sm font-medium">{task.progress}%</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      {task.estimatedCompletion && (
                        <>ETA: {Math.ceil((task.estimatedCompletion.getTime() - Date.now()) / 60000)}m</>
                      )}
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Agent Details Modal */}
      {selectedAgent && (
        <Dialog open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <span className="text-3xl">{selectedAgent.avatar}</span>
                <div>
                  <h2 className="text-2xl">{selectedAgent.name}</h2>
                  <p className="text-muted-foreground capitalize">
                    {selectedAgent.type} Agent
                  </p>
                </div>
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Tasks Completed</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-emerald-600">
                        {selectedAgent.stats.tasksCompleted}
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Success Rate</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-blue-600">
                        {selectedAgent.stats.successRate}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Cost Savings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-purple-600">
                        ${selectedAgent.stats.costSavings}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                {selectedAgent.currentTask && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Current Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{selectedAgent.currentTask}</p>
                      <Progress value={75} className="mt-4" />
                      <p className="text-sm text-muted-foreground mt-2">75% Complete</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="capabilities" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {selectedAgent.capabilities.map((capability) => (
                    <Card key={capability}>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <UIIcons.CheckCircle className="w-5 h-5 text-emerald-500" / />
                          <span className="font-medium capitalize">{capability}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="analytics" className="space-y-4">
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground">
                    Detailed performance metrics and insights coming soon
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="settings" className="space-y-4">
                <div className="space-y-6">
                  <div>
                    <Label>Autonomy Level</Label>
                    <Select defaultValue={selectedAgent.autonomyLevel}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supervised">Supervised</SelectItem>
                        <SelectItem value="semi-autonomous">Semi-Autonomous</SelectItem>
                        <SelectItem value="fully-autonomous">Fully Autonomous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button variant="outline">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Agent
                    </Button>
                    <Button variant="outline">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reset Training
                    </Button>
                    <Button variant="destructive">
                      Delete Agent
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
