"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  CheckCircle,
  User,
  Calendar,
  ThumbsUp,
  Clock,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  customer: {
    name: string;
    avatar: string;
    isAnonymous: boolean;
  };
  service: {
    title: string;
    category: string;
  };
  rating: number;
  title: string;
  content: string;
  wouldRecommend: boolean;
  createdAt: Date;
  isVerified: boolean;
}

interface ProviderResponseModalProps {
  review: Review;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (response: string) => Promise<void>;
}

const responseTemplates = [
  {
    id: "thank_you",
    title: "Thank You",
    content:
      "Thank you so much for taking the time to leave this wonderful review! It was a pleasure working with, you, and I'm thrilled that you're happy with the service. I look forward to helping you again in the future!",
  },
  {
    id: "address_concerns",
    title: "Address Concerns",
    content:
      "Thank you for your feedback. I sincerely apologize for any issues you experienced during our service. Your comments are, valuable, and I'm committed to improving. Please feel free to contact me directly to discuss how I can make this right.",
  },
  {
    id: "professional",
    title: "Professional Response",
    content:
      "I appreciate you taking the time to share your experience. Your feedback helps me maintain the quality of service that my clients deserve. Thank you for choosing my, services, and I hope to work with you again soon.",
  },
  {
    id: "improvement",
    title: "Acknowledge Improvement",
    content:
      "Thank you for the honest feedback. I take all reviews seriously and will use your suggestions to improve my services. I appreciate your patience and the opportunity to serve you.",
  },
];

export function ProviderResponseModal({
  review,
  isOpen,
  onClose,
  onSubmit,
}: ProviderResponseModalProps) {
  const [response, setResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (template: (typeof responseTemplates)[0]) => {
    setResponse(template.content);
    setSelectedTemplate(template.id);
  };

  const handleSubmit = async () => {
    if (!response.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(response.trim());
      onClose();
      setResponse("");
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Failed to submit response:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(
            "w-4 h-4",
            rating >= star
              ? "text-yellow-400 fill-yellow-400"
              : "text-gray-300",
          )}
        />
      ))}
    </div>
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Respond to Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Review Display */}
          <Card className="border-l-4 border-blue-500">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Review Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          review.customer.isAnonymous
                            ? undefined
                            : review.customer.avatar
                        }
                        alt={review.customer.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                        {review.customer.isAnonymous
                          ? "A"
                          : review.customer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold">
                          {review.customer.isAnonymous
                            ? "Anonymous User"
                            : review.customer.name}
                        </h4>
                        {review.isVerified && (
                          <Badge variant="secondary" className="text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {renderStars(review.rating)}
                        <span>{formatDate(review.createdAt)}</span>
                        <span>• {review.service.title}</span>
                      </div>
                    </div>
                  </div>

                  {review.wouldRecommend && (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-600"
                    >
                      <ThumbsUp className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                </div>

                {/* Review Content */}
                <div>
                  <h5 className="font-medium mb-2">{review.title}</h5>
                  <p className="text-muted-foreground">{review.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Response Guidelines */}
          <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Response Best Practices
              </h4>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                <li>• Thank the customer for their feedback</li>
                <li>• Address specific points mentioned in the review</li>
                <li>• Keep the tone professional and friendly</li>
                <li>• Offer to resolve any issues privately if needed</li>
                <li>• Avoid being defensive or argumentative</li>
              </ul>
            </CardContent>
          </Card>

          {/* Response Templates */}
          <div>
            <h4 className="font-semibold mb-3">Quick Response Templates</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {responseTemplates.map((template) => (
                <Button
                  key={template.id}
                  variant="outline"
                  className={cn(
                    "h-auto p-3 text-left flex flex-col items-start gap-1",
                    selectedTemplate === template.id &&
                      "border-blue-500 bg-blue-50 dark:bg-blue-950/20",
                  )}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <span className="font-medium">{template.title}</span>
                  <span className="text-xs text-muted-foreground line-clamp-2">
                    {template.content.substring(0, 60)}...
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* Response Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Your Response *
            </label>
            <Textarea
              placeholder="Write a thoughtful response to this review..."
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              maxLength={1000}
              className="resize-none"
            />
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{response.length}/1000 characters</span>
              <span>Responses are public and visible to all users</span>
            </div>
          </div>

          {/* Response Preview */}
          {response.trim() && (
            <div>
              <h4 className="font-semibold mb-3">Response Preview</h4>
              <Card className="border-l-4 border-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium">Your Response</span>
                    <Badge variant="outline" className="text-xs">
                      Provider
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      <Clock className="w-3 h-3 inline mr-1" />
                      Just now
                    </span>
                  </div>
                  <p className="text-sm">{response}</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={!response.trim() || isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Submit Response
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
