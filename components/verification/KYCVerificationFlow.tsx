"use client";

import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {
  Upload,
  Camera,
  FileText,
  X,
  AlertTriangle,
  Eye,
  Download, User,
  CreditCard,
  Building,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Lock,
  Award,
  Info,
  ArrowRight,
  ArrowLeft,
  Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface DocumentFile {
  id: string;
  file: File;
  type: DocumentType;
  status: "uploading" | "processing" | "verified" | "rejected";
  preview?: string;
  rejectionReason?: string;
  uploadProgress?: number;
}

type DocumentType =
  | "government_id"
  | "selfie"
  | "proof_of_address"
  | "business_license"
  | "insurance_certificate"
  | "tax_document"
  | "criminal_background_check";

interface PersonalInfo {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

interface BusinessInfo {
  businessName: string;
  businessType: string;
  taxId: string;
  yearsInBusiness: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  website?: string;
  description: string;
}

interface VerificationStatus {
  step: number;
  status: "pending" | "in_progress" | "completed" | "rejected";
  completedAt?: Date;
  rejectionReason?: string;
}

interface KYCVerificationFlowProps {
  onComplete: (data: {
    personalInfo: PersonalInfo;
    businessInfo: BusinessInfo;
    documents: DocumentFile[];
  }) => void;
  onClose: () => void;
  initialStep?: number;
}

const documentTypes: Array<{
  type: DocumentType;
  title: string;
  description: string;
  required: boolean;
  examples: string[];
  maxSize: string;
  formats: string[];
}> = [
  {
    type: "government_id",
    title: "Government-Issued ID",
    description: "Clear photo of your driver's, license, passport, or state ID",
    required: true,
    examples: ["Driver's License", "Passport", "State ID Card"],
    maxSize: "10MB",
    formats: ["JPEG", "PNG", "PDF"],
  },
  {
    type: "selfie",
    title: "Identity Verification Selfie",
    description: "Clear selfie holding your government ID next to your face",
    required: true,
    examples: ["Selfie with ID", "Live photo verification"],
    maxSize: "10MB",
    formats: ["JPEG", "PNG"],
  },
  {
    type: "proof_of_address",
    title: "Proof of Address",
    description: "Recent utility, bill, bank, statement, or lease agreement",
    required: true,
    examples: ["Utility Bill", "Bank Statement", "Lease Agreement"],
    maxSize: "10MB",
    formats: ["JPEG", "PNG", "PDF"],
  },
  {
    type: "business_license",
    title: "Business License",
    description: "Valid business license or permit for your services",
    required: false,
    examples: ["Business License", "Professional License", "Permit"],
    maxSize: "10MB",
    formats: ["JPEG", "PNG", "PDF"],
  },
  {
    type: "insurance_certificate",
    title: "Insurance Certificate",
    description: "Proof of liability insurance coverage",
    required: false,
    examples: ["General Liability", "Professional Liability", "Bonding"],
    maxSize: "10MB",
    formats: ["JPEG", "PNG", "PDF"],
  },
  {
    type: "criminal_background_check",
    title: "Background Check",
    description: "Recent criminal background check report",
    required: true,
    examples: ["FBI Background Check", "State Criminal History"],
    maxSize: "10MB",
    formats: ["PDF"],
  },
];

const verificationSteps = [
  {
    title: "Personal Information",
    icon: User,
    description: "Basic identity details",
  },
  {
    title: "Document Upload",
    icon: FileText,
    description: "Identity verification documents",
  },
  {
    title: "Business Information",
    icon: Building,
    description: "Professional details and credentials",
  },
  {
    title: "Review & Submit",
    icon: CheckCircle,
    description: "Final review and submission",
  },
];

export function KYCVerificationFlow({
  onComplete,
  onClose,
  initialStep = 0,
}: KYCVerificationFlowProps) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    phoneNumber: "",
    email: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: "",
    businessType: "",
    taxId: "",
    yearsInBusiness: "",
    businessAddress: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
    },
    website: "",
    description: "",
  });

  const [documents, setDocuments] = useState<DocumentFile[]>([]);
  const [uploadingDocument, setUploadingDocument] =
    useState<DocumentType | null>(null);
  const [showDocumentPreview, setShowDocumentPreview] =
    useState<DocumentFile | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToBackgroundCheck, setAgreedToBackgroundCheck] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const progress = ((currentStep + 1) / verificationSteps.length) * 100;

  const handleFileUpload = useCallback(
    async (files: FileList, documentType: DocumentType) => {
      const file = files[0];
      if (!file) return;

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a, JPEG, PNG, or PDF file",
          variant: "destructive",
        });
        return;
      }

      const documentFile: DocumentFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        file,
        type: documentType,
        status: "uploading",
        uploadProgress: 0,
      };

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          documentFile.preview = e.target?.result as string;
          setDocuments((prev) => [
            ...prev.filter((d) => d.type !== documentType),
            documentFile,
          ]);
        };
        reader.readAsDataURL(file);
      } else {
        setDocuments((prev) => [
          ...prev.filter((d) => d.type !== documentType),
          documentFile,
        ]);
      }

      setUploadingDocument(documentType);

      // Simulate upload progress
      const uploadInterval = setInterval(() => {
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentFile.id
              ? {
                  ...doc,
                  uploadProgress: Math.min((doc.uploadProgress || 0) + 10, 90),
                }
              : doc,
          ),
        );
      }, 200);

      // Simulate API upload
      setTimeout(() => {
        clearInterval(uploadInterval);
        setDocuments((prev) =>
          prev.map((doc) =>
            doc.id === documentFile.id
              ? { ...doc, status: "processing", uploadProgress: 100 }
              : doc,
          ),
        );

        // Simulate processing
        setTimeout(() => {
          setDocuments((prev) =>
            prev.map((doc) =>
              doc.id === documentFile.id ? { ...doc, status: "verified" } : doc,
            ),
          );
          setUploadingDocument(null);

          toast({
            title: "Document uploaded successfully",
            description: "Your document is being verified",
          });
        }, 1500);
      }, 2000);
    },
    [toast],
  );

  const removeDocument = (documentId: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    toast({
      title: "Document removed",
      description: "The document has been removed from your application",
    });
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return (
          personalInfo.firstName &&
          personalInfo.lastName &&
          personalInfo.dateOfBirth &&
          personalInfo.email &&
          personalInfo.phoneNumber &&
          personalInfo.address.street
        );
      case 1: // Document Upload
        const requiredDocs = documentTypes.filter((dt) => dt.required);
        const uploadedRequiredDocs = requiredDocs.filter((dt) =>
          documents.some(
            (doc) => doc.type === dt.type && doc.status === "verified",
          ),
        );
        return uploadedRequiredDocs.length === requiredDocs.length;
      case 2: // Business Information
        return (
          businessInfo.businessName &&
          businessInfo.businessType &&
          businessInfo.description &&
          businessInfo.yearsInBusiness
        );
      case 3: // Review & Submit
        return agreedToTerms && agreedToBackgroundCheck;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep() && currentStep < verificationSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsSubmitting(true);
    try {
      // Simulate API submission
      await new Promise((resolve) => setTimeout(resolve, 2000));

      onComplete({
        personalInfo,
        businessInfo,
        documents,
      });

      toast({
        title: "Verification submitted successfully!",
        description:
          "We'll review your information and get back to you within 24-48 hours.",
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description:
          "Please try again or contact support if the issue persists.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderPersonalInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <User className="w-12 h-12 mx-auto mb-3 text-blue-600" />
        <h3 className="text-xl font-semibold mb-2">Personal Information</h3>
        <p className="text-muted-foreground">
          Provide your basic identity information for verification
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={personalInfo.firstName}
            onChange={(e) =>
              setPersonalInfo((prev) => ({
                ...prev,
                firstName: e.target.value,
              }))
            }
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={personalInfo.lastName}
            onChange={(e) =>
              setPersonalInfo((prev) => ({ ...prev, lastName: e.target.value }))
            }
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="dateOfBirth">Date of Birth *</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={personalInfo.dateOfBirth}
            onChange={(e) =>
              setPersonalInfo((prev) => ({
                ...prev,
                dateOfBirth: e.target.value,
              }))
            }
          />
        </div>
        <div>
          <Label htmlFor="phoneNumber">Phone Number *</Label>
          <Input
            id="phoneNumber"
            type="tel"
            value={personalInfo.phoneNumber}
            onChange={(e) =>
              setPersonalInfo((prev) => ({
                ...prev,
                phoneNumber: e.target.value,
              }))
            }
            placeholder="+1 (555) 123-4567"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={personalInfo.email}
          onChange={(e) =>
            setPersonalInfo((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="your@email.com"
        />
      </div>

      <div>
        <Label className="text-base font-medium">Address Information *</Label>
        <div className="space-y-3 mt-2">
          <Input
            placeholder="Street Address"
            value={personalInfo.address.street}
            onChange={(e) =>
              setPersonalInfo((prev) => ({
                ...prev,
                address: { ...prev.address, street: e.target.value },
              }))
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Input
              placeholder="City"
              value={personalInfo.address.city}
              onChange={(e) =>
                setPersonalInfo((prev) => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value },
                }))
              }
            />
            <Input
              placeholder="State"
              value={personalInfo.address.state}
              onChange={(e) =>
                setPersonalInfo((prev) => ({
                  ...prev,
                  address: { ...prev.address, state: e.target.value },
                }))
              }
            />
            <Input
              placeholder="ZIP Code"
              value={personalInfo.address.zipCode}
              onChange={(e) =>
                setPersonalInfo((prev) => ({
                  ...prev,
                  address: { ...prev.address, zipCode: e.target.value },
                }))
              }
            />
            <Select
              value={personalInfo.address.country}
              onValueChange={(value) =>
                setPersonalInfo((prev) => ({
                  ...prev,
                  address: { ...prev.address, country: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label className="text-base font-medium">Emergency Contact</Label>
        <div className="space-y-3 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              placeholder="Contact Name"
              value={personalInfo.emergencyContact.name}
              onChange={(e) =>
                setPersonalInfo((prev) => ({
                  ...prev,
                  emergencyContact: {
                    ...prev.emergencyContact,
                    name: e.target.value,
                  },
                }))
              }
            />
            <Input
              placeholder="Relationship"
              value={personalInfo.emergencyContact.relationship}
              onChange={(e) =>
                setPersonalInfo((prev) => ({
                  ...prev,
                  emergencyContact: {
                    ...prev.emergencyContact,
                    relationship: e.target.value,
                  },
                }))
              }
            />
          </div>
          <Input
            placeholder="Phone Number"
            value={personalInfo.emergencyContact.phone}
            onChange={(e) =>
              setPersonalInfo((prev) => ({
                ...prev,
                emergencyContact: {
                  ...prev.emergencyContact,
                  phone: e.target.value,
                },
              }))
            }
          />
        </div>
      </div>
    </div>
  );

  const renderDocumentUploadStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <FileText className="w-12 h-12 mx-auto mb-3 text-blue-600" />
        <h3 className="text-xl font-semibold mb-2">Document Verification</h3>
        <p className="text-muted-foreground">
          Upload, clear, high-quality images of your verification documents
        </p>
      </div>

      <Alert>
        <Info className="w-4 h-4" />
        <AlertDescription>
          All documents must be, clear, readable, and in color. Ensure all
          corners are visible and text is legible.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {documentTypes.map((docType) => {
          const uploadedDoc = documents.find(
            (doc) => doc.type === docType.type,
          );

          return (
            <Card
              key={docType.type}
              className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{docType.title}</h4>
                      {docType.required && (
                        <Badge variant="secondary">Required</Badge>
                      )}
                      {uploadedDoc?.status === "verified" && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {docType.description}
                    </p>

                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span>Max size: {docType.maxSize}</span>
                      <span>•</span>
                      <span>Formats: {docType.formats.join(", ")}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {uploadedDoc ? (
                      <div className="space-y-2">
                        {uploadedDoc.preview && (
                          <div className="relative">
                            <img
                              src={uploadedDoc.preview}
                              alt="Document preview"
                              className="w-20 h-20 object-cover rounded cursor-pointer"
                              onClick={() =>
                                setShowDocumentPreview(uploadedDoc)
                              }
                            />
                            {uploadedDoc.status === "uploading" && (
                              <div className="absolute inset-0 bg-black/50 rounded flex items-center justify-center">
                                <div className="text-white text-xs">
                                  {uploadedDoc.uploadProgress}%
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowDocumentPreview(uploadedDoc)}
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeDocument(uploadedDoc.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          fileInputRef.current?.click();
                          setUploadingDocument(docType.type);
                        }}
                        disabled={uploadingDocument === docType.type}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </Button>
                    )}
                  </div>
                </div>

                {uploadedDoc?.status === "uploading" && (
                  <div className="mt-4">
                    <Progress
                      value={uploadedDoc.uploadProgress || 0}
                      className="h-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && uploadingDocument) {
            handleFileUpload(e.target.files, uploadingDocument);
          }
        }}
      />
    </div>
  );

  const renderBusinessInfoStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <Building className="w-12 h-12 mx-auto mb-3 text-blue-600" />
        <h3 className="text-xl font-semibold mb-2">Business Information</h3>
        <p className="text-muted-foreground">
          Tell us about your business and professional experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="businessName">Business Name *</Label>
          <Input
            id="businessName"
            value={businessInfo.businessName}
            onChange={(e) =>
              setBusinessInfo((prev) => ({
                ...prev,
                businessName: e.target.value,
              }))
            }
            placeholder="Your business name"
          />
        </div>
        <div>
          <Label htmlFor="businessType">Business Type *</Label>
          <Select
            value={businessInfo.businessType}
            onValueChange={(value) =>
              setBusinessInfo((prev) => ({ ...prev, businessType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select business type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sole_proprietorship">
                Sole Proprietorship
              </SelectItem>
              <SelectItem value="llc">
                Limited Liability Company (LLC)
              </SelectItem>
              <SelectItem value="corporation">Corporation</SelectItem>
              <SelectItem value="partnership">Partnership</SelectItem>
              <SelectItem value="nonprofit">Nonprofit Organization</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="taxId">Tax ID / EIN</Label>
          <Input
            id="taxId"
            value={businessInfo.taxId}
            onChange={(e) =>
              setBusinessInfo((prev) => ({ ...prev, taxId: e.target.value }))
            }
            placeholder="XX-XXXXXXX"
          />
        </div>
        <div>
          <Label htmlFor="yearsInBusiness">Years in Business *</Label>
          <Select
            value={businessInfo.yearsInBusiness}
            onValueChange={(value) =>
              setBusinessInfo((prev) => ({ ...prev, yearsInBusiness: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="less_than_1">Less than 1 year</SelectItem>
              <SelectItem value="1_2">1-2 years</SelectItem>
              <SelectItem value="3_5">3-5 years</SelectItem>
              <SelectItem value="6_10">6-10 years</SelectItem>
              <SelectItem value="more_than_10">More than 10 years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="website">Website (Optional)</Label>
        <Input
          id="website"
          type="url"
          value={businessInfo.website}
          onChange={(e) =>
            setBusinessInfo((prev) => ({ ...prev, website: e.target.value }))
          }
          placeholder="https://your-website.com"
        />
      </div>

      <div>
        <Label htmlFor="description">Business Description *</Label>
        <Textarea
          id="description"
          value={businessInfo.description}
          onChange={(e) =>
            setBusinessInfo((prev) => ({
              ...prev,
              description: e.target.value,
            }))
          }
          placeholder="Describe your, business, services, and experience..."
          rows={4}
        />
      </div>

      <div>
        <Label className="text-base font-medium">Business Address</Label>
        <div className="space-y-3 mt-2">
          <Input
            placeholder="Street Address"
            value={businessInfo.businessAddress.street}
            onChange={(e) =>
              setBusinessInfo((prev) => ({
                ...prev,
                businessAddress: {
                  ...prev.businessAddress,
                  street: e.target.value,
                },
              }))
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Input
              placeholder="City"
              value={businessInfo.businessAddress.city}
              onChange={(e) =>
                setBusinessInfo((prev) => ({
                  ...prev,
                  businessAddress: {
                    ...prev.businessAddress,
                    city: e.target.value,
                  },
                }))
              }
            />
            <Input
              placeholder="State"
              value={businessInfo.businessAddress.state}
              onChange={(e) =>
                setBusinessInfo((prev) => ({
                  ...prev,
                  businessAddress: {
                    ...prev.businessAddress,
                    state: e.target.value,
                  },
                }))
              }
            />
            <Input
              placeholder="ZIP Code"
              value={businessInfo.businessAddress.zipCode}
              onChange={(e) =>
                setBusinessInfo((prev) => ({
                  ...prev,
                  businessAddress: {
                    ...prev.businessAddress,
                    zipCode: e.target.value,
                  },
                }))
              }
            />
            <Select
              value={businessInfo.businessAddress.country}
              onValueChange={(value) =>
                setBusinessInfo((prev) => ({
                  ...prev,
                  businessAddress: { ...prev.businessAddress, country: value },
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Canada">Canada</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-600" />
        <h3 className="text-xl font-semibold mb-2">Review & Submit</h3>
        <p className="text-muted-foreground">
          Review your information and submit for verification
        </p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>Name:</strong> {personalInfo.firstName}{" "}
              {personalInfo.lastName}
            </div>
            <div>
              <strong>Email:</strong> {personalInfo.email}
            </div>
            <div>
              <strong>Phone:</strong> {personalInfo.phoneNumber}
            </div>
            <div>
              <strong>Address:</strong> {personalInfo.address.street},{" "}
              {personalInfo.address.city}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              Business Information
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-2">
            <div>
              <strong>Business:</strong> {businessInfo.businessName}
            </div>
            <div>
              <strong>Type:</strong> {businessInfo.businessType}
            </div>
            <div>
              <strong>Experience:</strong> {businessInfo.yearsInBusiness}
            </div>
            {businessInfo.website && (
              <div>
                <strong>Website:</strong> {businessInfo.website}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Documents Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Uploaded Documents
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {documentTypes.map((docType) => {
              const uploadedDoc = documents.find(
                (doc) => doc.type === docType.type,
              );
              return (
                <div
                  key={docType.type}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{docType.title}</span>
                  {uploadedDoc ? (
                    <Badge className="bg-green-100 text-green-700">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Uploaded
                    </Badge>
                  ) : docType.required ? (
                    <Badge variant="destructive">Required</Badge>
                  ) : (
                    <Badge variant="outline">Optional</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Agreements */}
      <div className="space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="terms"
            checked={agreedToTerms}
            onCheckedChange={setAgreedToTerms}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I agree to the Terms of Service and Privacy Policy
            </Label>
            <p className="text-xs text-muted-foreground">
              You agree to our Terms of Service and Privacy Policy including
              data processing.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-2">
          <Checkbox
            id="background"
            checked={agreedToBackgroundCheck}
            onCheckedChange={setAgreedToBackgroundCheck}
          />
          <div className="grid gap-1.5 leading-none">
            <Label
              htmlFor="background"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              I consent to background check and verification
            </Label>
            <p className="text-xs text-muted-foreground">
              You authorize us to conduct background checks and verify your
              identity and credentials.
            </p>
          </div>
        </div>
      </div>

      <Alert>
        <Shield className="w-4 h-4" />
        <AlertDescription>
          Your verification typically takes 24-48 hours. You'll receive email
          updates on the progress.
        </AlertDescription>
      </Alert>
    </div>
  );

  return (
    <>
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Shield className="w-8 h-8 text-blue-600" />
            <CardTitle className="text-2xl">Identity Verification</CardTitle>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            {verificationSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div key={index} className="flex items-center">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full border-2 flex items-center justify-center",
                      isActive && "border-blue-600 bg-blue-50",
                      isCompleted && "border-green-600 bg-green-50",
                      !isActive && !isCompleted && "border-muted",
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5",
                        isActive && "text-blue-600",
                        isCompleted && "text-green-600",
                        !isActive && !isCompleted && "text-muted-foreground",
                      )}
                    />
                  </div>
                  {index < verificationSteps.length - 1 && (
                    <div
                      className={cn(
                        "w-8 h-0.5 mx-2",
                        isCompleted ? "bg-green-600" : "bg-muted",
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground">
            Step {currentStep + 1} of {verificationSteps.length}:{" "}
            {verificationSteps[currentStep].title}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {currentStep === 0 && renderPersonalInfoStep()}
          {currentStep === 1 && renderDocumentUploadStep()}
          {currentStep === 2 && renderBusinessInfoStep()}
          {currentStep === 3 && renderReviewStep()}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>

              {currentStep === verificationSteps.length - 1 ? (
                <Button
                  onClick={handleSubmit}
                  disabled={!validateCurrentStep() || isSubmitting}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Submit for Verification
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={nextStep} disabled={!validateCurrentStep()}>
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Document Preview Modal */}
      {showDocumentPreview && (
        <Dialog
          open={!!showDocumentPreview}
          onOpenChange={() => setShowDocumentPreview(null)}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Document Preview</DialogTitle>
              <DialogDescription>
                {
                  documentTypes.find(
                    (dt) => dt.type === showDocumentPreview.type,
                  )?.title
                }
              </DialogDescription>
            </DialogHeader>

            <div className="flex justify-center">
              {showDocumentPreview.preview ? (
                <img
                  src={showDocumentPreview.preview}
                  alt="Document preview"
                  className="max-w-full max-h-96 object-contain rounded"
                />
              ) : (
                <div className="w-32 h-32 bg-muted rounded flex items-center justify-center">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
