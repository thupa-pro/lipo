"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
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
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Share2,
  Copy,
  DollarSign,
  Users,
  TrendingUp,
  Gift,
  Star,
  Calendar,
  ExternalLink,
  Mail,
  MessageSquare,
  Facebook,
  Twitter,
  Link,
  QrCode,
} from "lucide-react";
import { format } from "date-fns";
import { useReferralClient } from "@/lib/referral/utils";
import { ReferralStats, ReferralHistory } from "@/lib/referral/types";
import { useToast } from "@/hooks/use-toast";

export default function ReferralsPage() {
  const { user } = useUser();
  const { toast } = useToast();
  const referralClient = useReferralClient();

  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [referralHistory, setReferralHistory] = useState<ReferralHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [referralCode, setReferralCode] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadReferralData();
    }
  }, [user?.id]);

  const loadReferralData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const [statsData, historyData, code] = await Promise.all([
        referralClient.getReferralStats(user.id),
        referralClient.getReferralHistory(user.id),
        referralClient.getReferralCode(user.id),
      ]);

      setStats(statsData);
      setReferralHistory(historyData);
      setReferralCode(code);
    } catch (error) {
      console.error("Error loading referral data:", error);
      toast({
        title: "Error",
        description: "Failed to load referral data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateReferralLink = (code: string) => {
    return `${window.location.origin}/signup?ref=${code}`;
  };

  const copyReferralLink = async () => {
    const link = generateReferralLink(referralCode);
    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Link Copied!",
        description: "Your referral link has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  const shareViaEmail = () => {
    const link = generateReferralLink(referralCode);
    const subject = "Join Loconomy and get $10 credit!";
    const body = `Hi! I'm loving Loconomy for finding local services. Use my referral link to sign up and we'll both get $10 credit: ${link}`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`,
    );
  };

  const shareViaSocial = (platform: string) => {
    const link = generateReferralLink(referralCode);
    const text =
      "Join me on Loconomy and get $10 credit for your first booking!";

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
    };

    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], "_blank");
    }
  };

  const getReferralStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your referral dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Referral Program
        </h1>
        <p className="text-gray-600">
          Invite friends and earn rewards for every successful referral!
        </p>
      </div>

      {/* Program Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <Gift className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-blue-900 mb-2">
              Earn $10 for Every Friend You Refer!
            </h2>
            <p className="text-blue-700">
              Your friends get $10 credit, and you earn $10 when they complete
              their first booking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <Share2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">
                1. Share Your Link
              </h3>
              <p className="text-sm text-blue-700">
                Send your unique referral link to friends
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">
                2. Friend Signs Up
              </h3>
              <p className="text-sm text-blue-700">
                They create an account using your link
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <DollarSign className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold text-blue-900">3. You Both Earn</h3>
              <p className="text-sm text-blue-700">
                $10 credit for you, $10 for them!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Referrals
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_referrals}</div>
              <p className="text-xs text-muted-foreground">
                {stats.successful_referrals} successful
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Earnings
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${stats.total_earnings.toFixed(2)}
              </div>
              <p className="text-xs text-muted-foreground">
                ${stats.pending_earnings.toFixed(2)} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.monthly_referrals}
              </div>
              <p className="text-xs text-muted-foreground">
                ${stats.monthly_earnings.toFixed(2)} earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Conversion Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.total_referrals > 0
                  ? (
                      (stats.successful_referrals / stats.total_referrals) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Sign-ups to bookings
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Share Section */}
      <Card>
        <CardHeader>
          <CardTitle>Share Your Referral Link</CardTitle>
          <p className="text-sm text-gray-600">
            Share this link with friends to start earning rewards
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={generateReferralLink(referralCode)}
              readOnly
              className="flex-1"
            />
            <Button onClick={copyReferralLink}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant="outline"
              onClick={shareViaEmail}
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Email
            </Button>
            <Button
              variant="outline"
              onClick={() => shareViaSocial("twitter")}
              className="w-full"
            >
              <Twitter className="w-4 h-4 mr-2" />
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => shareViaSocial("facebook")}
              className="w-full"
            >
              <Facebook className="w-4 h-4 mr-2" />
              Facebook
            </Button>
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  More
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Your Referral Link</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">
                      Your Referral Link
                    </label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={generateReferralLink(referralCode)}
                        readOnly
                        className="flex-1"
                      />
                      <Button size="sm" onClick={copyReferralLink}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Your Referral Code
                    </label>
                    <div className="flex gap-2 mt-1">
                      <Input value={referralCode} readOnly className="flex-1" />
                      <Button
                        size="sm"
                        onClick={() =>
                          navigator.clipboard.writeText(referralCode)
                        }
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" onClick={shareViaEmail}>
                      <Mail className="w-4 h-4 mr-2" />
                      Share via Email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => shareViaSocial("twitter")}
                    >
                      <Twitter className="w-4 h-4 mr-2" />
                      Share on Twitter
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <Star className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Pro Tip</h4>
                <p className="text-sm text-yellow-800">
                  Personal recommendations work best! Share your experience with
                  friends who might benefit from local services like cleaning,
                  handyman work, or tutoring.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral History */}
      <Tabs defaultValue="history" className="space-y-6">
        <TabsList>
          <TabsTrigger value="history">Referral History</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Your Referrals</CardTitle>
              <p className="text-sm text-gray-600">
                Track the status of your referrals and earnings
              </p>
            </CardHeader>
            <CardContent>
              {referralHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No referrals yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start sharing your referral link to see your referrals here!
                  </p>
                  <Button onClick={() => setShareDialogOpen(true)}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Your Link
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Friend</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reward</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referralHistory.map((referral) => (
                      <TableRow key={referral.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {referral.referred_email?.replace(
                                /(.{2})(.*)(@.*)/,
                                "$1***$3",
                              ) || "Anonymous"}
                            </div>
                            <div className="text-sm text-gray-600">
                              Joined via: {referral.referral_source}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(referral.created_at), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getReferralStatusColor(referral.status)}
                          >
                            {referral.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            ${referral.reward_amount.toFixed(2)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {referral.completed_at
                            ? format(
                                new Date(referral.completed_at),
                                "MMM d, yyyy",
                              )
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leaderboard">
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <p className="text-sm text-gray-600">
                See how you rank among our top referrers this month
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { rank: 1, name: "Sarah M.", referrals: 12, earnings: 120 },
                  { rank: 2, name: "David K.", referrals: 8, earnings: 80 },
                  { rank: 3, name: "Emma L.", referrals: 6, earnings: 60 },
                  {
                    rank: 4,
                    name: "You",
                    referrals: stats?.monthly_referrals || 0,
                    earnings: stats?.monthly_earnings || 0,
                  },
                  { rank: 5, name: "Alex R.", referrals: 3, earnings: 30 },
                ].map((entry) => (
                  <div
                    key={entry.rank}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      entry.name === "You"
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          entry.rank === 1
                            ? "bg-yellow-100 text-yellow-800"
                            : entry.rank === 2
                              ? "bg-gray-100 text-gray-800"
                              : entry.rank === 3
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {entry.rank}
                      </div>
                      <div>
                        <div className="font-medium">{entry.name}</div>
                        <div className="text-sm text-gray-600">
                          {entry.referrals} referrals this month
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${entry.earnings}</div>
                      <div className="text-sm text-gray-600">earned</div>
                    </div>
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
