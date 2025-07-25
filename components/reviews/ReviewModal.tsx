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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  ThumbsUp,
  Upload,
  X,
  Camera,
  Award,
  TrendingUp,
  CheckCircle,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Provider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  totalReviews: number;
  verified: boolean;
}

interface Booking {
  id: string;
  serviceTitle: string;
  provider: Provider;
  completedDate: Date;
  totalAmount: number;
  duration: string;
}

interface ReviewModalProps {
  booking: Booking;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reviewData: ReviewSubmission) => Promise<void>;
}

interface ReviewSubmission {
  bookingId: string;
  providerId: string;
  rating: number;
  title: string;
  content: string;
  wouldRecommend: boolean;
  categories: {
    punctuality: number;
    quality: number;
    communication: number;
    professionalism: number;
    value: number;
  };
  photos?: File[];
  isAnonymous: boolean;
}

const categoryLabels = {
  punctuality: "Punctuality",
  quality: "Quality of Work",
  communication: "Communication",
  professionalism: "Professionalism",
  value: "Value for Money",
};

export function ReviewModal({
  booking,
  isOpen,
  onClose,
  onSubmit,
}: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [wouldRecommend, setWouldRecommend] = useState<boolean | null>(null);
  const [categories, setCategories] = useState({
    punctuality: 0,
    quality: 0,
    communication: 0,
    professionalism: 0,
    value: 0,
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const totalSteps = 3;

  const handleRatingClick = (value: number) => {
    setRating(value);
    if (value >= 4) {
      setWouldRecommend(true);
    } else if (value <= 2) {
      setWouldRecommend(false);
    } else {
      setWouldRecommend(null);
    }
  };

  const handleCategoryRating = (
    category: keyof typeof categories,
    value: number,
  ) => {
    setCategories((prev) => ({ ...prev, [category]: value }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (photos.length + files.length <= 5) {
      setPhotos((prev) => [...prev, ...files]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return rating > 0;
      case 2:
        return Object.values(categories).every((score) => score > 0);
      case 3:
        return title.trim().length > 0 && content.trim().length >= 10;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    if (!isStepValid()) return;

    setIsSubmitting(true);
    try {
      const reviewData: ReviewSubmission = {
        bookingId: booking.id,
        providerId: booking.provider.id,
        rating,
        title: title.trim(),
        content: content.trim(),
        wouldRecommend: wouldRecommend ?? rating >= 4,
        categories,
        photos: photos.length > 0 ? photos : undefined,
        isAnonymous,
      };

      await onSubmit(reviewData);
      onClose();
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps && isStepValid()) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStarRating = (
    value: number,
    onChange: (rating: number) => void,
    size: "sm" | "lg" = "lg",
  ) => {
    const starSize = size === "lg" ? "w-8 h-8" : "w-5 h-5";

    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => size === "lg" && setHoverRating(star)}
            onMouseLeave={() => size === "lg" && setHoverRating(0)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={cn(
                starSize,
                "transition-colors",
                (hoverRating || value) >= star
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300",
              )}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
            Review Your Experience
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 mb-6">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex-1 h-2 rounded-full transition-colors",
                index + 1 <= currentStep ? "bg-blue-600" : "bg-gray-200",
              )}
            />
          ))}
        </div>

        {/* Booking Info */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-12 h-12">
                <AvatarImage
                  src={booking.provider.avatar}
                  alt={booking.provider.name}
                />
                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                  {booking.provider.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{booking.serviceTitle}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>with {booking.provider.name}</span>
                  {booking.provider.verified && (
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Completed {booking.completedDate.toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">${booking.totalAmount}</p>
                <p className="text-xs text-muted-foreground">
                  {booking.duration}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 1: Overall Rating */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Overall Rating</h3>
              <p className="text-muted-foreground mb-6">
                How would you rate your overall experience?
              </p>

              <div className="flex justify-center mb-4">
                {renderStarRating(rating, handleRatingClick)}
              </div>

              {rating > 0 && (
                <div className="text-center">
                  <p className="text-lg font-medium">
                    {rating === 5 && "Exceptional! ⭐"}
                    {rating === 4 && "Great experience! 👍"}
                    {rating === 3 && "Good service 👌"}
                    {rating === 2 && "Below expectations 👎"}
                    {rating === 1 && "Poor experience 😞"}
                  </p>
                </div>
              )}

              {/* Recommendation */}
              {rating > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium mb-3">
                    Would you recommend {booking.provider.name} to others?
                  </p>
                  <div className="flex justify-center gap-3">
                    <Button
                      variant={wouldRecommend === true ? "default" : "outline"}
                      onClick={() => setWouldRecommend(true)}
                      className="flex items-center gap-2"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      Yes
                    </Button>
                    <Button
                      variant={wouldRecommend === false ? "default" : "outline"}
                      onClick={() => setWouldRecommend(false)}
                      className="flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      No
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Category Ratings */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Detailed Ratings</h3>
              <p className="text-muted-foreground mb-6">
                Rate specific aspects of the service
              </p>

              <div className="space-y-4">
                {Object.entries(categoryLabels).map(([key, label]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="font-medium">{label}</span>
                    {renderStarRating(
                      categories[key as keyof typeof categories],
                      (value) =>
                        handleCategoryRating(
                          key as keyof typeof categories,
                          value,
                        ),
                      "sm",
                    )}
                  </div>
                ))}
              </div>

              {/* Average Display */}
              {Object.values(categories).some((score) => score > 0) && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Category Average</span>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-600" />
                      <span className="font-bold text-blue-600">
                        {(
                          Object.values(categories).reduce(
                            (sum, score) => sum + score,
                            0,
                          ) /
                          Object.values(categories).filter((score) => score > 0)
                            .length
                        ).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Written Review */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Written Review</h3>
              <p className="text-muted-foreground mb-6">
                Share details about your experience
              </p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="review-title">Review Title *</Label>
                  <Input
                    id="review-title"
                    placeholder="Brief summary of your experience"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {title.length}/100 characters
                  </p>
                </div>

                <div>
                  <Label htmlFor="review-content">Your Review *</Label>
                  <Textarea
                    id="review-content"
                    placeholder="Tell others about your experience. What did you like? Any suggestions for improvement?"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    maxLength={1000}
                    rows={5}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {content.length}/1000 characters (minimum 10)
                  </p>
                </div>

                {/* Photo Upload */}
                <div>
                  <Label>Photos (optional)</Label>
                  <div className="mt-2">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                      id="photo-upload"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 transition-colors"
                    >
                      <div className="text-center">
                        <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-600">
                          Add photos (max 5)
                        </p>
                      </div>
                    </label>

                    {photos.length > 0 && (
                      <div className="grid grid-cols-5 gap-2 mt-3">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={URL.createObjectURL(photo)}
                              alt={`Upload ${index + 1}`}
                              className="w-full h-16 object-cover rounded"
                            />
                            <button
                              onClick={() => removePhoto(index)}
                              className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Privacy Options */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    Post anonymously
                  </Label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>

            {currentStep === totalSteps ? (
              <Button
                onClick={handleSubmit}
                disabled={!isStepValid() || isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    Submit Review
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={nextStep} disabled={!isStepValid()}>
                Next
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
