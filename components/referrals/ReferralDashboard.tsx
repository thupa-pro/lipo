import { OptimizedIcon, NavigationIcons, BusinessIcons, UIIcons } from "@/lib/icons/optimized-icons";
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Share2, Copy, TrendingUp, Gift, ExternalLink, Facebook, Twitter, QrCode, Download, Trophy, Award, Sparkles, Target, Zap } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  conversionRate: number;
  clickThroughRate: number;
  lifetimeValue: number;
  tier: "Bronze" | "Silver" | "Gold" | "Platinum";
}

interface ReferralHistory {
  id: string;
  referredUser: {
    name: string;
    email: string;
    avatar?: string;
  };
  status: "pending" | "completed" | "paid";
  signupDate: Date;
  conversionDate?: Date;
  earnings: number;
  source: "link" | "email" | "social" | "direct";
}

interface ReferralReward {
  id: string;
  type: "signup" | "first_booking" | "milestone";
  amount: number;
  description: string;
  earnedDate: Date;
  status: "pending" | "approved" | "paid";
}

const MOCK_STATS: ReferralStats = {
  totalReferrals: 24,
  activeReferrals: 18,
  totalEarnings: 1250.00,
  pendingEarnings: 320.00,
  conversionRate: 75,
  clickThroughRate: 12.5,
  lifetimeValue: 52.08,
  tier: "Gold",
};

const MOCK_HISTORY: ReferralHistory[] = [
  {
    id: "1",
    referredUser: {
      name: "Sarah Johnson",
      email: "sarah@example.com",
      avatar: "/avatars/sarah.jpg",
    },
    status: "completed",
    signupDate: new Date("2024-01-15"),
    conversionDate: new Date("2024-01-18"),
    earnings: 50.00,
    source: "link",
  },
  {
    id: "2",
    referredUser: {
      name: "Mike Chen",
      email: "mike@example.com",
    },
    status: "pending",
    signupDate: new Date("2024-01-20"),
    earnings: 25.00,
    source: "email",
  },
  {
    id: "3",
    referredUser: {
      name: "Emma Wilson",
      email: "emma@example.com",
    },
    status: "paid",
    signupDate: new Date("2024-01-10"),
    conversionDate: new Date("2024-01-12"),
    earnings: 75.00,
    source: "social",
  },
];

const MOCK_REWARDS: ReferralReward[] = [
  {
    id: "1",
    type: "signup",
    amount: 25.00,
    description: "New user signup bonus",
    earnedDate: new Date("2024-01-20"),
    status: "pending",
  },
  {
    id: "2",
    type: "first_booking",
    amount: 50.00,
    description: "First booking completed",
    earnedDate: new Date("2024-01-18"),
    status: "approved",
  },
  {
    id: "3",
    type: "milestone",
    amount: 100.00,
    description: "10 successful referrals milestone",
    earnedDate: new Date("2024-01-15"),
    status: "paid",
  },
];

const TIER_BENEFITS = {
  Bronze: { multiplier: 1.0, bonuses: ["Basic support"], color: "orange" },
  Silver: { multiplier: 1.2, bonuses: ["Priority support", "Monthly bonus"], color: "gray" },
  Gold: { multiplier: 1.5, bonuses: ["VIP support", "Quarterly bonus", "Exclusive events"], color: "yellow" },
  Platinum: { multiplier: 2.0, bonuses: ["Personal manager", "Custom rewards", "Beta access"], color: "purple" },
};

export default function ReferralDashboard() {
  const [stats, setStats] = useState<ReferralStats>(MOCK_STATS);
  const [history, setHistory] = useState<ReferralHistory[]>(MOCK_HISTORY);
  const [rewards, setRewards] = useState<ReferralReward[]>(MOCK_REWARDS);
  const [referralLink, setReferralLink] = useState("https://loconomy.com/ref/user123");
  const [customMessage, setCustomMessage] = useState("");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Referral link copied to clipboard!");
  };

  const handleShareEmail = () => {
    const subject = "Join Loconomy - The Best Local Services Platform";
    const body = `Hi there!\n\nI've been using Loconomy to find amazing local services and thought you'd love it too! You can get started with this special link:\n\n${referralLink}\n\n${customMessage}\n\nBest regards!`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleShareSocial = (platform: string) => {
    const message = `Check out Loconomy - the best platform for local services! ${referralLink}`;
    
    const urls = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`,
    };

    window.open(urls[platform as keyof typeof urls], "_blank", "width=600,height=400");
  };

  const getTierColor = (tier: string) => {
    const colors = {
      Bronze: "text-orange-600 bg-orange-100",
      Silver: "text-gray-600 bg-gray-100", 
      Gold: "text-yellow-600 bg-yellow-100",
      Platinum: "text-purple-600 bg-purple-100",
    };
    return colors[tier as keyof typeof colors] || colors.Bronze;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800",
      completed: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      paid: "bg-emerald-100 text-emerald-800",
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const nextTierProgress = () => {
    const tiers = ["Bronze", "Silver", "Gold", "Platinum"];
    const currentIndex = tiers.indexOf(stats.tier);
    if (currentIndex === tiers.length - 1) return 100;
    
    const thresholds = [0, 5, 15, 30];
    const nextThreshold = thresholds[currentIndex + 1];
    return (stats.totalReferrals / nextThreshold) * 100;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <NavigationIcons.Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold">Referral Dashboard</h1>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Earn rewards by referring friends and family to Loconomy. 
          The more people you, refer, the more you earn!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <NavigationIcons.Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalReferrals}</p>
                <p className="text-sm text-gray-600">Total Referrals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BusinessIcons.DollarSign className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Earnings</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.conversionRate}%</p>
                <p className="text-sm text-gray-600">Conversion Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Trophy className={`h-8 w-8 ${getTierColor(stats.tier).includes('orange') ? 'text-orange-600' : 
                                             getTierColor(stats.tier).includes('gray') ? 'text-gray-600' :
                                             getTierColor(stats.tier).includes('yellow') ? 'text-yellow-600' : 'text-purple-600'}`} />
              <div>
                <p className="text-2xl font-bold">{stats.tier}</p>
                <p className="text-sm text-gray-600">Current Tier</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tier Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Tier Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge className={getTierColor(stats.tier)}>
                {stats.tier} Tier
              </Badge>
              <span className="text-sm text-gray-600">
                {stats.totalReferrals} referrals
              </span>
            </div>
            <Progress value={nextTierProgress()} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {Object.entries(TIER_BENEFITS).map(([tier, benefits]) => (
                <div key={tier} className={`p-3 rounded-lg border ${stats.tier === tier ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className={`h-4 w-4 ${benefits.color === 'orange' ? 'text-orange-600' : 
                                                  benefits.color === 'gray' ? 'text-gray-600' :
                                                  benefits.color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`} />
                    <span className="font-semibold text-sm">{tier}</span>
                  </div>
                  <p className="text-xs text-gray-600">{benefits.multiplier}x multiplier</p>
                  <ul className="text-xs text-gray-500 mt-1">
                    {benefits.bonuses.slice(0, 2).map((bonus, index) => (
                      <li key={index}>• {bonus}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Link Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Your Referral Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="flex-1" />
            <Button onClick={handleCopyLink} variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
            <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Share Your Referral Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Custom Message (Optional)</label>
                    <textarea
                      className="w-full mt-1 p-2 border rounded-md text-sm"
                      placeholder="Add a personal message..."
                      value={customMessage}
                      onChange={(e) => setCustomMessage(e.target.value)}
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button onClick={handleShareEmail} variant="outline" className="w-full">
                      <OptimizedIcon name="Mail" className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                    <Button onClick={() => handleShareSocial("facebook")} variant="outline" className="w-full">
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button onClick={() => handleShareSocial("twitter")} variant="outline" className="w-full">
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
                    </Button>
                    <Button onClick={() => handleShareSocial("linkedin")} variant="outline" className="w-full">
                      <OptimizedIcon name="MessageSquare" className="h-4 w-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-blue-50 rounded-lg">
              <Target className="h-6 w-6 mx-auto text-blue-600 mb-2" />
              <p className="text-sm font-medium">Link Clicks</p>
              <p className="text-2xl font-bold text-blue-600">1,234</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <NavigationIcons.Users className="h-6 w-6 mx-auto text-green-600 mb-2" />
              <p className="text-sm font-medium">Signups</p>
              <p className="text-2xl font-bold text-green-600">156</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <Zap className="h-6 w-6 mx-auto text-purple-600 mb-2" />
              <p className="text-sm font-medium">Conversions</p>
              <p className="text-2xl font-bold text-purple-600">98</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <BusinessIcons.DollarSign className="h-6 w-6 mx-auto text-orange-600 mb-2" />
              <p className="text-sm font-medium">Avg. Value</p>
              <p className="text-2xl font-bold text-orange-600">${stats.lifetimeValue}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="history">Referral History</TabsTrigger>
          <TabsTrigger value="rewards">Rewards & Earnings</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Referrals</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referred User</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Signup Date</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Earnings</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((referral) => (
                    <TableRow key={referral.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">
                              {referral.referredUser.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{referral.referredUser.name}</p>
                            <p className="text-sm text-gray-600">{referral.referredUser.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(referral.status)}>
                          {referral.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{format(referral.signupDate, "MMM, dd, yyyy")}</p>
                          {referral.conversionDate && (
                            <p className="text-sm text-gray-600">
                              Converted: {format(referral.conversionDate, "MMM dd")}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {referral.source}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          ${referral.earnings.toFixed(2)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <BusinessIcons.DollarSign className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <p className="text-3xl font-bold text-green-600">${stats.totalEarnings.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Earned</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <OptimizedIcon name="Clock" className="h-12 w-12 mx-auto text-yellow-600 mb-4" />
                <p className="text-3xl font-bold text-yellow-600">${stats.pendingEarnings.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Pending Approval</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6 text-center">
                <Sparkles className="h-12 w-12 mx-auto text-purple-600 mb-4" />
                <p className="text-3xl font-bold text-purple-600">{TIER_BENEFITS[stats.tier].multiplier}x</p>
                <p className="text-sm text-gray-600">Earning Multiplier</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Reward History</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Date Earned</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rewards.map((reward) => (
                    <TableRow key={reward.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {reward.type.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell>{reward.description}</TableCell>
                      <TableCell>{format(reward.earnedDate, "MMM, dd, yyyy")}</TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          ${reward.amount.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(reward.status)}>
                          {reward.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}