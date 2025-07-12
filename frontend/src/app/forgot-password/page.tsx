"use client";

import * as React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2, ArrowLeft } from "lucide-react";

import { authClient } from "@/lib/authclient";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/lib/validations";
import { formatError } from "@/lib/utils";

import { AuthCard } from "@/components/auth/auth-card";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<"form" | "sent">("form");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        setAuthError(error.message || "Failed to send reset email");
        toast.error("Failed to send reset email", {
          description: error.message || "An unexpected error occurred",
        });
        return;
      }

      toast.success("Reset email sent!", {
        description: "Please check your inbox for the password reset link.",
      });
      setStep("sent");
    } catch (error) {
      const errorMessage = formatError(error);
      setAuthError(errorMessage);
      toast.error("Failed to send reset email", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendReset = async () => {
    const email = watch("email");
    if (!email) return;

    try {
      await authClient.requestPasswordReset({
        email: email,
        redirectTo: "/reset-password",
      });
      toast.success("Reset email sent!", {
        description: "Please check your inbox for the password reset link.",
      });
    } catch (error) {
      toast.error("Failed to resend reset email");
    }
  };

  if (step === "sent") {
    return (
      <AuthCard
        title="Check your email"
        description="We've sent a password reset link to your email address"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              We've sent a password reset email to:
            </p>
            <p className="font-medium">{watch("email")}</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <LoadingButton
              onClick={handleResendReset}
              variant="outline"
              className="w-full"
            >
              Resend reset email
            </LoadingButton>

            <Link
              href="/sign-in"
              className="inline-flex items-center text-sm text-primary hover:underline transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to sign in
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email address and we'll send you a link to reset your password"
    >
      <div className="space-y-6">
        <Link
          href="/sign-in"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to sign in
        </Link>

        {/* Error Alert */}
        {authError && (
          <Alert
            variant="destructive"
            className="animate-in slide-in-from-top-2"
          >
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              {...register("email")}
              className={errors.email ? "border-destructive" : ""}
            />
            {errors.email && (
              <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <LoadingButton
            type="submit"
            loading={isLoading}
            loadingText="Sending reset email..."
            className="w-full"
          >
            Send reset email
          </LoadingButton>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link
            href="/sign-in"
            className="font-medium text-primary hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
