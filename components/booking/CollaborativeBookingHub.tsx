"use client";

import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Video, 
  MessageCircle, 
  Share2, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Camera,
  Mic,
  MicOff,
  VideoOff
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CollaborativeParticipant {
  id: string;
  name: string;
  avatar: string;
  role: "customer" | "provider" | "family_member" | "consultant";
  status: "online" | "viewing" | "idle" | "offline";
  cursor?: { x: number; y: number };
  permissions: string[];
}

interface BookingSession {
  id: string;
  serviceId: string;
  participants: CollaborativeParticipant[];
  stage: "consultation" | "negotiation" | "confirmation" | "completed";
  sharedNotes: string[];
  decisions: Array<{
    type: string;
    value: any;
    decidedBy: string;
    timestamp: Date;
  }>;
  liveEditing: {
    requirements: string;
    timeline: Date;
    budget: number;
    specialRequests: string;
  };
}

interface CollaborativeBookingHubProps {
  serviceId: string;
  initialParticipants: CollaborativeParticipant[];
  onBookingComplete: (booking: any) => void;
}

export default function CollaborativeBookingHub({
  serviceId,
  initialParticipants,
  onBookingComplete
}: CollaborativeBookingHubProps) {
  const [session, setSession] = useState<BookingSession>({
    id: crypto.randomUUID(),
    serviceId,
    participants: initialParticipants,
    stage: "consultation",
    sharedNotes: [],
    decisions: [],
    liveEditing: {
      requirements: "",
      timeline: new Date(),
      budget: 0,
      specialRequests: "",
    },
  });

  const [activeParticipants, setActiveParticipants] = useState<string[]>([]);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [cursors, setCursors] = useState<Record<string, { x: number; y: number }>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  // Real-time synchronization
  useEffect(() => {
    const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_URL}/collaborative-booking`);
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join_session",
        sessionId: session.id,
        participant: initialParticipants[0],
      }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case "participant_update":
          setActiveParticipants(data.activeParticipants);
          break;
        case "cursor_move":
          setCursors(prev => ({
            ...prev,
            [data.participantId]: data.position,
          }));
          break;
        case "session_update":
          setSession(prev => ({ ...prev, ...data.updates }));
          break;
        case "stage_change":
          setSession(prev => ({ ...prev, stage: data.stage }));
          break;
      }
    };

    // Track mouse movement for collaborative cursors
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const position = {
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100,
        };
        
        ws.send(JSON.stringify({
          type: "cursor_move",
          sessionId: session.id,
          position,
        }));
      }
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      ws.close();
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [session.id]);

  const addSharedNote = () => {
    if (newNote.trim()) {
      const note = `${initialParticipants[0].name}: ${newNote}`;
      setSession(prev => ({
        ...prev,
        sharedNotes: [...prev.sharedNotes, note],
      }));
      setNewNote("");
    }
  };

  const updateLiveField = (field: keyof BookingSession["liveEditing"], value: any) => {
    setSession(prev => ({
      ...prev,
      liveEditing: {
        ...prev.liveEditing,
        [field]: value,
      },
    }));
  };

  const makeDecision = (type: string, value: any) => {
    const decision = {
      type,
      value,
      decidedBy: initialParticipants[0].id,
      timestamp: new Date(),
    };
    
    setSession(prev => ({
      ...prev,
      decisions: [...prev.decisions, decision],
    }));
  };

  const progressToNextStage = () => {
    const stages = ["consultation", "negotiation", "confirmation", "completed"];
    const currentIndex = stages.indexOf(session.stage);
    
    if (currentIndex < stages.length - 1) {
      setSession(prev => ({
        ...prev,
        stage: stages[currentIndex + 1] as any,
      }));
    }
  };

  const startVideoCall = () => {
    setIsVideoCall(true);
    // Initialize WebRTC connection
  };

  const getStageProgress = () => {
    const stages = ["consultation", "negotiation", "confirmation", "completed"];
    return ((stages.indexOf(session.stage) + 1) / stages.length) * 100;
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900"
    >
      {/* Collaborative Cursors */}
      {Object.entries(cursors).map(([participantId, position]) => {
        const participant = session.participants.find(p => p.id === participantId);
        if (!participant || participantId === initialParticipants[0].id) return null;
        
        return (
          <motion.div
            key={participantId}
            className="absolute pointer-events-none z-50"
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <div className="flex items-center space-x-1">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
                style={{ backgroundColor: participant.role === "provider" ? "#3B82F6" : "#10B981" }}
              />
              <div className="bg-black text-white text-xs px-2 py-1 rounded shadow-lg">
                {participant.name}
              </div>
            </div>
          </motion.div>
        );
      })}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">Collaborative Booking</h1>
              <Badge variant="outline" className="capitalize">
                {session.stage}
              </Badge>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Active Participants */}
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-gray-500" />
                <div className="flex -space-x-2">
                  {session.participants.slice(0, 4).map((participant) => (
                    <Avatar key={participant.id} className="w-8 h-8 border-2 border-white">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  ))}
                  {session.participants.length > 4 && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium">
                      +{session.participants.length - 4}
                    </div>
                  )}
                </div>
              </div>

              {/* Video Call Button */}
              <Button
                variant={isVideoCall ? "default" : "outline"}
                size="sm"
                onClick={startVideoCall}
              >
                <Video className="w-4 h-4 mr-2" />
                {isVideoCall ? "In Call" : "Start Video"}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span>Booking Progress</span>
              <span>{Math.round(getStageProgress())}% Complete</span>
            </div>
            <Progress value={getStageProgress()} className="h-2" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Live Editing Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Share2 className="w-5 h-5 mr-2" />
                  Live Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Service Requirements
                  </label>
                  <textarea
                    value={session.liveEditing.requirements}
                    onChange={(e) => updateLiveField("requirements", e.target.value)}
                    className="w-full p-3 border rounded-lg resize-none h-32 focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe your service requirements..."
                  />
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <div className="flex -space-x-1">
                      {session.participants.slice(0, 3).map((p) => (
                        <Avatar key={p.id} className="w-4 h-4">
                          <AvatarImage src={p.avatar} />
                          <AvatarFallback className="text-xs">{p.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                    <span className="ml-2">Editing together</span>
                  </div>
                </div>

                {/* Timeline and Budget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Preferred Timeline
                    </label>
                    <input
                      type="date"
                      value={session.liveEditing.timeline.toISOString().split('T')[0]}
                      onChange={(e) => updateLiveField("timeline", new Date(e.target.value))}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Budget Range
                    </label>
                    <input
                      type="number"
                      value={session.liveEditing.budget}
                      onChange={(e) => updateLiveField("budget", parseFloat(e.target.value))}
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter budget"
                    />
                  </div>
                </div>

                {/* Decision Points */}
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Key Decisions</h4>
                  <div className="space-y-3">
                    {session.decisions.map((decision, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center">
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-sm font-medium">{decision.type}</span>
                          <span className="text-sm text-gray-600 ml-2">: {String(decision.value)}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {session.participants.find(p => p.id === decision.decidedBy)?.name}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stage-Specific Actions */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {session.stage === "consultation" && "Consultation Phase"}
                  {session.stage === "negotiation" && "Negotiation Phase"}
                  {session.stage === "confirmation" && "Confirmation Phase"}
                  {session.stage === "completed" && "Booking Complete"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {session.stage === "consultation" && (
                    <motion.div
                      key="consultation"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <p className="text-gray-600">
                        Discuss requirements and expectations with all participants.
                      </p>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={() => makeDecision("consultation_complete", true)}
                          className="flex-1"
                        >
                          Complete Consultation
                        </Button>
                        <Button variant="outline" onClick={startVideoCall}>
                          <Video className="w-4 h-4 mr-2" />
                          Video Chat
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {session.stage === "negotiation" && (
                    <motion.div
                      key="negotiation"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <p className="text-gray-600">
                        Finalize pricing, timeline, and service details.
                      </p>
                      <div className="grid grid-cols-2 gap-4">
                        <Button 
                          onClick={() => makeDecision("price_agreed", session.liveEditing.budget)}
                          variant="outline"
                        >
                          Agree on Price
                        </Button>
                        <Button 
                          onClick={() => makeDecision("timeline_confirmed", session.liveEditing.timeline)}
                          variant="outline"
                        >
                          Confirm Timeline
                        </Button>
                      </div>
                      <Button 
                        onClick={progressToNextStage}
                        className="w-full"
                        disabled={session.decisions.length < 2}
                      >
                        Proceed to Confirmation
                      </Button>
                    </motion.div>
                  )}

                  {session.stage === "confirmation" && (
                    <motion.div
                      key="confirmation"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <p className="text-gray-600">
                        Review and confirm all booking details.
                      </p>
                      <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                        <h5 className="font-medium">Booking Summary</h5>
                        <p className="text-sm">Budget: ${session.liveEditing.budget}</p>
                        <p className="text-sm">Timeline: {session.liveEditing.timeline.toLocaleDateString()}</p>
                        <p className="text-sm">Participants: {session.participants.length}</p>
                      </div>
                      <Button 
                        onClick={() => {
                          progressToNextStage();
                          onBookingComplete(session);
                        }}
                        className="w-full"
                      >
                        Confirm Booking
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Participants Panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session.participants.map((participant) => (
                    <div key={participant.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{participant.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{participant.role}</p>
                        </div>
                      </div>
                      <Badge 
                        variant={participant.status === "online" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {participant.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shared Notes */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Shared Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
                  {session.sharedNotes.map((note, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                      {note}
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 p-2 border rounded text-sm"
                    onKeyPress={(e) => e.key === "Enter" && addSharedNote()}
                  />
                  <Button size="sm" onClick={addSharedNote}>
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Video Call Panel */}
            {isVideoCall && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Video className="w-5 h-5 mr-2" />
                      Video Call
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsVideoCall(false)}
                    >
                      End Call
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center">
                    <p className="text-white text-sm">Video call in progress...</p>
                  </div>
                  <div className="flex justify-center space-x-2">
                    <Button size="sm" variant="outline">
                      <Mic className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Camera className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive">
                      <VideoOff className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
