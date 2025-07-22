import InternationalContactForm from "@/components/forms/international-contact-form";

export const metadata = {
  title: "International Contact Form | Auto-detecting Currency & Phone",
  description:
    "Contact form with automatic currency and phone number formatting based on user location",
};

export default function InternationalFormPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">International Contact Form</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Experience our intelligent form that automatically detects your
          location and formats phone numbers and currency values according to
          your country's standards.
        </p>
      </div>

      <InternationalContactForm />
    </div>
  );
}
