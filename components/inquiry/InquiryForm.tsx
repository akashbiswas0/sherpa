"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema, type InquiryFormValues } from "@/types/inquiry";
import { Button } from "@/components/primitives/Button";
import { Input } from "@/components/primitives/Input";

interface InquiryFormProps {
  onSubmit: (values: InquiryFormValues) => Promise<void>;
  defaultEmail?: string;
  defaultName?: string;
  isSubmitting: boolean;
}

export function InquiryForm({
  onSubmit,
  defaultEmail,
  defaultName,
  isSubmitting,
}: InquiryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      userName: defaultName ?? "",
      userEmail: defaultEmail ?? "",
    },
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Input
        {...register("userName")}
        label="Your Name"
        error={errors.userName?.message}
      />
      <Input
        {...register("userPhone")}
        label="WhatsApp Number"
        placeholder="10-digit mobile number"
        error={errors.userPhone?.message}
      />
      <Input
        {...register("userEmail")}
        label="Email"
        type="email"
        error={errors.userEmail?.message}
      />
      <Input
        {...register("groupSize", { valueAsNumber: true })}
        label="Group Size"
        type="number"
        min={1}
        max={50}
        error={errors.groupSize?.message}
      />
      <Input
        {...register("preferredStartDate")}
        label="Preferred Start Date"
        type="date"
        error={errors.preferredStartDate?.message}
      />
      <Input
        {...register("budgetPerPerson", { valueAsNumber: true })}
        label="Budget per Person (₹) — optional"
        type="number"
        error={errors.budgetPerPerson?.message}
      />
      <Input
        {...register("message")}
        label="Message — optional"
        error={errors.message?.message}
      />
      <Button
        label="Send Inquiry"
        onClick={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
        fullWidth
      />
    </div>
  );
}
