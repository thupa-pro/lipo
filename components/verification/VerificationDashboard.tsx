"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  CheckCircle,
  AlertTriangle,
  X,
  Upload,
  FileText,
  Building,
  CreditCard,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Award,
  RefreshCw,
  Download,
  Eye,
  ExternalLink,
  Info,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Star,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { KYCVerificationFlow } from "./KYCVerificationFlow";

interface VerificationItem {
  id: string;
  type:
    | "identity"
    | "address"
    | "business"
    | "background"
    | "insurance"
    | "license";
  title: string;
  description: string;
  status: "pending" | "in_progress" | "verified" | "rejected" | "expired";
  submittedAt?: Date;
  completedAt?: Date;
  expiresAt?: Date;
  rejectionReason?: string;
  documents?: Array<{
    name: string;
    type: string;
    uploadedAt: Date;
    status: "pending" | "approved" | "rejected";
  }>;
  required: boolean;
  trustScoreImpact: number;
}

interface TrustMetrics {
  overallScore: number;
  breakdown: {
    identity: { score: number; weight: number; verified: boolean };
    experience: { score: number; weight: number; verified: boolean };
    background: { score: number; weight: number; verified: boolean };
    insurance: { score: number; weight: number; verified: boolean };
    reviews: { score: number; weight: number; verified: boolean };
  };
  benefits: string[];
  nextMilestone: {
    score: number;
    benefits: string[];
    requirements: string[];
  };
}

interface VerificationDashboardProps {
  providerId?: string;
  onUpdateVerification?: (type: string, status: string) => void;
}

export function VerificationDashboard({
  providerId,
  onUpdateVerification,
}: VerificationDashboardProps) {
  const [verificationItems, setVerificationItems] = useState<
    VerificationItem[]
  >([]);
  const [trustMetrics, setTrustMetrics] = useState<TrustMetrics | null>(null);
  const [showKYCFlow, setShowKYCFlow] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Initialize with mock data
  useEffect(() => {
    const mockVerifications: VerificationItem[] = [
      {
        id: "identity",
        type: "identity",
        title: "Identity Verification",
        description: "Government-issued ID and selfie verification",
        status: "verified",
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        required: true,
        trustScoreImpact: 25,
        documents: [
          {
            name: "Driver's License",
            type: "government_id",
            uploadedAt: new Date(),
            status: "approved",
          },
          {
            name: "Verification Selfie",
            type: "selfie",
            uploadedAt: new Date(),
            status: "approved",
          },
        ],
      },
      {
        id: "address",
        type: "address",
        title: "Address Verification",
        description: "Proof of current residential address",
        status: "verified",
        submittedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        required: true,
        trustScoreImpact: 15,
        documents: [
          {
            name: "Utility Bill",
            type: "proof_of_address",
            uploadedAt: new Date(),
            status: "approved",
          },
        ],
      },
      {
        id: "background",
        type: "background",
        title: "Background Check",
        description: "Criminal background verification",
        status: "in_progress",
        submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        required: true,
        trustScoreImpact: 30,
      },
      {
        id: "business",
        type: "business",
        title: "Business License",
        description: "Professional license and business registration",
        status: "pending",
        required: false,
        trustScoreImpact: 20,
      },
      {
        id: "insurance",
        type: "insurance",
        title: "Insurance Coverage",
        description: "General liability insurance certificate",
        status: "rejected",
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        rejectionReason:
          "Insurance certificate expired. Please upload current coverage.",
        required: false,
        trustScoreImpact: 15,
      },
      {
        id: "license",
        type: "license",
        title: "Professional License",
        description: "Industry-specific professional certification",
        status: "expired",
        submittedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000),
        expiresAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        required: false,
        trustScoreImpact: 10,
      },
    ];

    const mockTrustMetrics: TrustMetrics = {
      overallScore: 78,
      breakdown: {
        identity: { score: 100, weight: 25, verified: true },
        experience: { score: 85, weight: 20, verified: true },
        background: { score: 0, weight: 30, verified: false },
        insurance: { score: 0, weight: 15, verified: false },
        reviews: { score: 92, weight: 10, verified: true },
      },
      benefits: [
        "Priority in search results",
        "Trust badge display",
        "Higher booking rates",
        "Premium customer base",
      ],
      nextMilestone: {
        score: 90,
        benefits: [
          "Elite provider status",
          "Featured listings",
          "Priority support",
          "Exclusive job opportunities",
        ],
        requirements: [
          "Complete background check",
          "Upload insurance certificate",
          "Maintain 4.5+ rating",
        ],
      },
    };

    setVerificationItems(mockVerifications);
    setTrustMetrics(mockTrustMetrics);
  }, []);

  const getStatusIcon = (status: VerificationItem["status"]) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "in_progress":
        return <Clock className="w-5 h-5 text-blue-600" />;
      case "rejected":
        return <X className="w-5 h-5 text-red-600" />;
      case "expired":
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: VerificationItem["status"]) => {
    switch (status) {
      case "verified":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "expired":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    toast({
      title: "Verification status updated",
      description: "Your verification status has been refreshed",
    });
  };

  const handleStartVerification = (type: string) => {
    if (type === "identity" || type === "address" || type === "business") {
      setShowKYCFlow(true);
    } else {
      toast({
        title: "Verification process",
        description: `Starting ${type} verification process...`,
      });
    }
  };

  const verifiedCount = verificationItems.filter(
    (item) => item.status === "verified",
  ).length;
  const totalRequired = verificationItems.filter(
    (item) => item.required,
  ).length;
  const completionPercentage = (verifiedCount / verificationItems.length) * 100;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Trust Score
                </p>
                <p className="text-2xl font-bold">
                  {trustMetrics?.overallScore || 0}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Verifications
                </p>
                <p className="text-2xl font-bold">
                  {verifiedCount}/{verificationItems.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Completion
                </p>
                <p className="text-2xl font-bold">
                  {Math.round(completionPercentage)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Next Milestone
                </p>
                <p className="text-2xl font-bold">
                  {trustMetrics?.nextMilestone.score || 90}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="status" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="status">Verification Status</TabsTrigger>
            <TabsTrigger value="trust">Trust Metrics</TabsTrigger>
            <TabsTrigger value="benefits">Benefits</TabsTrigger>
          </TabsList>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2"
          >
            <RefreshCw
              className={cn("w-4 h-4", isRefreshing && "animate-spin")}
            />
            Refresh Status
          </Button>
        </div>

        <TabsContent value="status" className="space-y-4">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Verification Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Overall Completion
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(completionPercentage)}%
                  </span>
                </div>
                <Progress value={completionPercentage} className="h-2" />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                  <div className="text-center">
                    <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="text-sm font-medium">
                      {
                        verificationItems.filter((v) => v.status === "verified")
                          .length
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Verified
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium">
                      {
                        verificationItems.filter(
                          (v) => v.status === "in_progress",
                        ).length
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      In Progress
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Clock className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="text-sm font-medium">
                      {
                        verificationItems.filter((v) => v.status === "pending")
                          .length
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">Pending</div>
                  </div>

                  <div className="text-center">
                    <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <X className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="text-sm font-medium">
                      {
                        verificationItems.filter(
                          (v) =>
                            v.status === "rejected" || v.status === "expired",
                        ).length
                      }
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Needs Action
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Verification Items */}
          <div className="space-y-3">
            {verificationItems.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "transition-all duration-200 hover:shadow-md",
                  item.status === "rejected" || item.status === "expired"
                    ? "border-red-200 dark:border-red-800"
                    : "",
                  item.status === "verified"
                    ? "border-green-200 dark:border-green-800"
                    : "",
                )}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="mt-1">{getStatusIcon(item.status)}</div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold">{item.title}</h3>
                          {item.required && (
                            <Badge variant="secondary" className="text-xs">
                              Required
                            </Badge>
                          )}
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace("_", " ")}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {item.description}
                        </p>

                        {item.rejectionReason && (
                          <Alert className="mb-3">
                            <AlertTriangle className="w-4 h-4" />
                            <AlertDescription className="text-sm">
                              {item.rejectionReason}
                            </AlertDescription>
                          </Alert>
                        )}

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          {item.submittedAt && (
                            <span>
                              Submitted: {item.submittedAt.toLocaleDateString()}
                            </span>
                          )}
                          {item.completedAt && (
                            <span>
                              Completed: {item.completedAt.toLocaleDateString()}
                            </span>
                          )}
                          {item.expiresAt && (
                            <span className="text-orange-600">
                              Expires: {item.expiresAt.toLocaleDateString()}
                            </span>
                          )}
                          <span>
                            Impact: +{item.trustScoreImpact} trust score
                          </span>
                        </div>

                        {item.documents && item.documents.length > 0 && (
                          <div className="mt-3">
                            <div className="text-xs font-medium mb-2">
                              Documents:
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {item.documents.map((doc, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className={cn(
                                    "text-xs",
                                    doc.status === "approved" &&
                                      "border-green-600 text-green-600",
                                    doc.status === "rejected" &&
                                      "border-red-600 text-red-600",
                                  )}
                                >
                                  {doc.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {item.status === "pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleStartVerification(item.type)}
                        >
                          <Upload className="w-3 h-3 mr-1" />
                          Start
                        </Button>
                      )}

                      {(item.status === "rejected" ||
                        item.status === "expired") && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStartVerification(item.type)}
                        >
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Retry
                        </Button>
                      )}

                      {item.status === "verified" && (
                        <Button size="sm" variant="ghost">
                          <Eye className="w-3 h-3 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trust" className="space-y-6">
          {trustMetrics && (
            <>
              {/* Trust Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Trust Score Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {trustMetrics.overallScore}
                    </div>
                    <p className="text-muted-foreground">Overall Trust Score</p>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(trustMetrics.breakdown).map(
                      ([key, value]) => (
                        <div key={key} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="capitalize font-medium">
                                {key}
                              </span>
                              {value.verified && (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">{value.score}</span>
                              <span className="text-muted-foreground">
                                {" "}
                                / 100
                              </span>
                              <span className="text-xs text-muted-foreground ml-1">
                                ({value.weight}% weight)
                              </span>
                            </div>
                          </div>
                          <Progress value={value.score} className="h-2" />
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Next Milestone */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Next Milestone: {trustMetrics.nextMilestone.score} Trust
                    Score
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">
                        Benefits at {trustMetrics.nextMilestone.score}:
                      </h4>
                      <ul className="space-y-1">
                        {trustMetrics.nextMilestone.benefits.map(
                          (benefit, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Star className="w-3 h-3 text-yellow-500" />
                              {benefit}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Requirements:</h4>
                      <ul className="space-y-1">
                        {trustMetrics.nextMilestone.requirements.map(
                          (requirement, index) => (
                            <li
                              key={index}
                              className="flex items-center gap-2 text-sm"
                            >
                              <Clock className="w-3 h-3 text-blue-500" />
                              {requirement}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="benefits" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Current Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trustMetrics?.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
                  >
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Trust Score Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      50-69
                    </div>
                    <div className="text-sm font-medium mb-2">Basic Trust</div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Platform access</li>
                      <li>• Basic support</li>
                      <li>• Standard listings</li>
                    </ul>
                  </div>

                  <div className="text-center p-4 border-2 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-950/20">
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                      70-89
                    </div>
                    <div className="text-sm font-medium mb-2">
                      Trusted Provider
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Trust badge</li>
                      <li>• Priority support</li>
                      <li>• Enhanced visibility</li>
                    </ul>
                  </div>

                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-2">
                      90+
                    </div>
                    <div className="text-sm font-medium mb-2">
                      Elite Provider
                    </div>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Featured listings</li>
                      <li>• Premium support</li>
                      <li>• Exclusive opportunities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* KYC Flow Dialog */}
      {showKYCFlow && (
        <Dialog open={showKYCFlow} onOpenChange={setShowKYCFlow}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <KYCVerificationFlow
              onComplete={(data) => {
                console.log("KYC completed:", data);
                setShowKYCFlow(false);
                toast({
                  title: "Verification submitted",
                  description:
                    "Your verification documents have been submitted for review.",
                });
              }}
              onClose={() => setShowKYCFlow(false)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
