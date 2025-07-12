"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { z } from "zod";

import { authClient } from "@/lib/authclient";
import { passwordSchema } from "@/lib/validations";
import { formatError } from "@/lib/utils";

import { AuthCard } from "@/components/auth/auth-card";
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<"form" | "success">("form");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password");

  React.useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link", {
        description: "The password reset link is invalid or has expired.",
      });
      router.push("/forgot-password");
    }
  }, [token, router]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    setIsLoading(true);
    setAuthError(null);

    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (error) {
        setAuthError(error.message || "Failed to reset password");
        toast.error("Failed to reset password", {
          description: error.message || "An unexpected error occurred",
        });
        return;
      }

      toast.success("Password reset successful!", {
        description: "Your password has been updated successfully.",
      });
      setStep("success");
    } catch (error) {
      const errorMessage = formatError(error);
      setAuthError(errorMessage);
      toast.error("Failed to reset password", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    router.push("/sign-in");
  };

  if (step === "success") {
    return (
      <AuthCard
        title="Password reset successful"
        description="Your password has been updated successfully"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Your password has been successfully reset. You can now sign in
              with your new password.
            </p>
          </div>

          <LoadingButton onClick={handleSignIn} className="w-full">
            Sign in to your account
          </LoadingButton>
        </div>
      </AuthCard>
    );
  }

  if (!token) {
    return (
      <AuthCard
        title="Invalid reset link"
        description="The password reset link is invalid or has expired"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              The password reset link is invalid, expired, or has already been
              used.
            </p>
          </div>

          <Link href="/forgot-password" className="inline-block w-full">
            <LoadingButton variant="outline" className="w-full">
              Request new reset link
            </LoadingButton>
          </Link>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your new password below"
    >
      <div className="space-y-6">
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
            <Label htmlFor="password">New Password</Label>
            <PasswordInput
              id="password"
              placeholder="Enter your new password"
              autoComplete="new-password"
              showStrengthIndicator
              {...register("password")}
              value={watchedPassword}
              className={errors.password ? "border-destructive" : ""}
            />
            {errors.password && (
              <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your new password"
              autoComplete="new-password"
              {...register("confirmPassword")}
              className={errors.confirmPassword ? "border-destructive" : ""}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <LoadingButton
            type="submit"
            loading={isLoading}
            loadingText="Resetting password..."
            className="w-full"
          >
            Reset password
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
