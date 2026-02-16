"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@/hooks/useAuth";
import { buildWhatsAppUrl } from "@/lib/utils/whatsapp";
import type { InquiryFormValues } from "@/types/inquiry";
import { Id } from "@/convex/_generated/dataModel";

interface UseInquiryOptions {
  destinationId: string;
  agencyId?: string;
  trekId?: string;
  guideId?: string;
  source: string;
  whatsappNumber?: string;
  trekName?: string;
}

export function useInquiry(options: UseInquiryOptions) {
  const { isAuthenticated } = useAuth();
  const createInquiry = useMutation(api.inquiries.createInquiry);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showInquiryForm, setShowInquiryForm] = useState(false);

  function handleConnectClick() {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      setShowInquiryForm(true);
    }
  }

  function handleLoginSuccess() {
    setShowLoginModal(false);
    setShowInquiryForm(true);
  }

  async function submitInquiry(values: InquiryFormValues) {
    setIsSubmitting(true);
    try {
      await createInquiry({
        destinationId: options.destinationId as Id<"destinations">,
        agencyId: options.agencyId as Id<"agencies"> | undefined,
        trekId: options.trekId as Id<"treks"> | undefined,
        guideId: options.guideId as Id<"guides"> | undefined,
        userName: values.userName,
        userPhone: values.userPhone,
        userEmail: values.userEmail,
        groupSize: values.groupSize,
        preferredStartDate: values.preferredStartDate,
        budgetPerPerson: values.budgetPerPerson,
        message: values.message,
        source: options.source,
      });

      if (options.whatsappNumber) {
        const url = buildWhatsAppUrl({
          phone: options.whatsappNumber,
          trekName: options.trekName,
          groupSize: values.groupSize,
          dates: values.preferredStartDate,
        });
        window.open(url, "_blank", "noopener,noreferrer");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    isSubmitting,
    showLoginModal,
    showInquiryForm,
    handleConnectClick,
    handleLoginSuccess,
    submitInquiry,
    closeLoginModal: () => setShowLoginModal(false),
    closeInquiryForm: () => setShowInquiryForm(false),
  };
}
