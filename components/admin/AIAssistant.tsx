'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AI_AGENTS, aiClient, type AIAgent } from '@/lib/ai/gemini-client';
import { Send, Eye, MessageCircle, Lightbulb, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  agentId?: string;
}

interface AIAssistantProps {
  platformData?: any;
  onInsightGenerated?: (insight: string, agentId: string) => void;
}

export default function AIAssistant({ platformData, onInsightGenerated }: AIAssistantProps) {
  const [selectedAgent, setSelectedAgent] = useState<AIAgent>(AI_AGENTS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiClient.generateResponse(
        selectedAgent.id,
        input,
        platformData
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
        agentId: selectedAgent.id,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I, apologize, but I encountered an issue processing your request. As ${selectedAgent.name}, I'm still here to help you with platform insights and analysis. Please try rephrasing your question.`,
        timestamp: new Date(),
        agentId: selectedAgent.id,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateProactiveInsight = async (agent: AIAgent, dataType: string) => {
    setIsAnalyzing(true);
    try {
      const insight = await aiClient.generateInsight(agent.id, dataType, platformData);
      onInsightGenerated?.(insight, agent.id);
      
      const insightMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `💡 **Proactive Insight**: ${insight}`,
        timestamp: new Date(),
        agentId: agent.id,
      };
      
      setMessages(prev => [...prev, insightMessage]);
    } catch (error) {
      console.error('Error generating insight:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAgentIcon = (agentId: string) => {
    const icons = {
      sophia: <Zap className="h-4 w-4" />,
      marcus: <Shield className="h-4 w-4" />,
      elena: <Sparkles className="h-4 w-4" />,
      alex: <TrendingUp className="h-4 w-4" />
    };
    return icons[agentId as keyof typeof icons] || <MessageCircle className="h-4 w-4" />;
  };

  const getQuickActions = (agent: AIAgent) => {
    const actions = {
      sophia: [
        'Analyze user growth trends',
        'Identify optimization opportunities',
        'Review platform performance',
        'Predict upcoming challenges'
      ],
      marcus: [
        'Security threat assessment',
        'Vulnerability scan summary',
        'Compliance status check',
        'Risk mitigation strategies'
      ],
      elena: [
        'User satisfaction analysis',
        'Journey optimization tips',
        'Conversion rate insights',
        'Experience enhancement ideas'
      ],
      alex: [
        'Revenue performance review',
        'Market opportunity analysis',
        'Pricing strategy recommendations',
        'Financial forecasting'
      ]
    };
    return actions[agent.id as keyof typeof actions] || [];
  };

  return (
    <div className="space-y-6">
      {/* Agent Selection */}
      <Card className="gradient-border bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="h-5 w-5 text-blue-600" />
            AI Advisory Team
          </h3>
          <p className="text-sm text-gray-600">Elite AI agents ready to assist with platform insights</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {AI_AGENTS.map((agent) => (
              <div
                key={agent.id}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 ${
                  selectedAgent.id === agent.id
                    ? 'border-blue-500 bg-blue-50 shadow-lg'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedAgent(agent)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{agent.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">{agent.name}</h4>
                      {getAgentIcon(agent.id)}
                    </div>
                    <p className="text-sm text-blue-600 font-medium">{agent.role}</p>
                    <p className="text-xs text-gray-600 mt-1">{agent.specialty}</p>
                    <Badge variant="outline" className="mt-2 text-xs">
                      {agent.personality.split(',')[0]}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="gradient-border bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-amber-600" />
            Quick Insights with {selectedAgent.name}
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {getQuickActions(selectedAgent).map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="justify-start h-auto p-3 text-left"
                onClick={() => setInput(action)}
              >
                <Zap className="h-4 w-4 mr-2 text-blue-600" />
                {action}
              </Button>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t">
            <Button
              onClick={() => generateProactiveInsight(selectedAgent, 'platform_overview')}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {selectedAgent.name} is analyzing...
                </>
              ) : (
                <>
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Generate Proactive Insight
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="gradient-border bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-green-600" />
              Conversation with {selectedAgent.name}
            </h3>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {selectedAgent.avatar} Online
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Messages */}
          <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">{selectedAgent.avatar}</div>
                <p className="text-gray-600">
                  Hello! I'm {selectedAgent.name}, your {selectedAgent.role}.
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  I specialize in {selectedAgent.specialty.toLowerCase()}. How can I assist you today?
                </p>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-900'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                      <span className="text-lg">
                        {AI_AGENTS.find(a => a.id === message.agentId)?.avatar}
                      </span>
                      <span className="font-medium">
                        {AI_AGENTS.find(a => a.id === message.agentId)?.name}
                      </span>
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-sm text-gray-600">
                    <span className="text-lg">{selectedAgent.avatar}</span>
                    <span className="font-medium">{selectedAgent.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-gray-600">Analyzing and generating insights...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
              placeholder={`Ask ${selectedAgent.name} anything about your platform...`}
              onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}