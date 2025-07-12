"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

import { authClient } from "@/lib/authclient";
import { AuthCard } from "@/components/auth/auth-card";
import { LoadingButton } from "@/components/ui/loading-button";

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = React.useState<
    "loading" | "success" | "error" | "invalid"
  >("loading");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  React.useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus("invalid");
        return;
      }

      try {
        const { error } = await authClient.verifyEmail({
          query: {
            token: token,
          },
        });

        if (error) {
          setStatus("error");
          setErrorMessage(error.message || "Email verification failed");
        } else {
          setStatus("success");
          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            router.push("/dashboard");
          }, 2000);
        }
      } catch (error) {
        setStatus("error");
        setErrorMessage("An unexpected error occurred during verification");
      }
    };

    verifyEmail();
  }, [token, router]);

  const handleContinue = () => {
    router.push("/dashboard");
  };

  const handleRequestNew = () => {
    router.push("/sign-up");
  };

  if (status === "loading") {
    return (
      <AuthCard
        title="Verifying your email"
        description="Please wait while we verify your email address"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">
            Verifying your email address...
          </p>
        </div>
      </AuthCard>
    );
  }

  if (status === "success") {
    return (
      <AuthCard
        title="Email verified successfully!"
        description="Your email has been verified. Welcome to ReWear!"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Your email has been successfully verified! You can now access all
              features of ReWear.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to your dashboard...
            </p>
          </div>

          <LoadingButton onClick={handleContinue} className="w-full">
            Continue to Dashboard
          </LoadingButton>
        </div>
      </AuthCard>
    );
  }

  if (status === "invalid") {
    return (
      <AuthCard
        title="Invalid verification link"
        description="The verification link is invalid or missing"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              The verification link is invalid or missing. Please make sure you
              clicked the correct link from your email.
            </p>
          </div>

          <div className="space-y-4">
            <LoadingButton onClick={handleRequestNew} className="w-full">
              Request new verification email
            </LoadingButton>

            <Link
              href="/sign-in"
              className="block text-sm text-primary hover:underline transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </AuthCard>
    );
  }

  // Error state
  return (
    <AuthCard
      title="Verification failed"
      description="We couldn't verify your email address"
    >
      <div className="space-y-6 text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {errorMessage || "Email verification failed"}
          </p>
          <p className="text-sm text-muted-foreground">
            The verification link may have expired or already been used.
          </p>
        </div>

        <div className="space-y-4">
          <LoadingButton
            onClick={handleRequestNew}
            variant="outline"
            className="w-full"
          >
            Request new verification email
          </LoadingButton>

          <Link
            href="/sign-in"
            className="block text-sm text-primary hover:underline transition-colors"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
