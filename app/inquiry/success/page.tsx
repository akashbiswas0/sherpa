import Link from "next/link";
import { Button } from "@/components/primitives/Button";

export default function InquirySuccessPage() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        gap: 24,
        textAlign: "center",
        padding: "40px 24px",
      }}
    >
      <div style={{ fontSize: 48 }}>✅</div>
      <h1 className="text-2xl font-bold text-gray-900">Inquiry Sent!</h1>
      <p className="text-gray-600 max-w-md">
        Your inquiry has been received. The agency or guide will reach out to
        you shortly. You can also message them directly on WhatsApp for a faster
        response.
      </p>
      <Link href="/">
        <Button label="Explore more destinations" variant="secondary" />
      </Link>
    </div>
  );
}
