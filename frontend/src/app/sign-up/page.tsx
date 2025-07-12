"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertCircle, CheckCircle2 } from "lucide-react";

import { authClient } from "@/lib/authclient";
import { signUpSchema, type SignUpFormData } from "@/lib/validations";
import { formatError, saveFormData, clearFormData } from "@/lib/utils";

import { AuthCard } from "@/components/auth/auth-card";
import { SocialLoginButton } from "@/components/auth/social-login-button";
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingButton } from "@/components/ui/loading-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignUpPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState<string | null>(null);
  const [authError, setAuthError] = React.useState<string | null>(null);
  const [step, setStep] = React.useState<"form" | "verification">("form");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedPassword = watch("password");

  React.useEffect(() => {
    const subscription = watch((value) => {
      saveFormData("signup-form", value);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  React.useEffect(() => {
    const savedData = localStorage.getItem("signup-form");
    if (savedData) {
      try {
        const data = JSON.parse(savedData);
        Object.keys(data).forEach((key) => {
          if (data[key]) {
            setValue(key as keyof SignUpFormData, data[key]);
          }
        });
      } catch (error) {
        console.warn("Failed to load saved form data:", error);
      }
    }
  }, [setValue]);

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const { data: result, error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (error) {
        setAuthError(error.message || "Sign up failed");
        toast.error("Sign up failed", {
          description: error.message || "An unexpected error occurred",
        });
        return;
      }

      if (result) {
        clearFormData("signup-form");

        toast.success("Account created successfully!", {
          description: "Please check your email to verify your account.",
        });

        setStep("verification");
        // The email verification is now handled automatically by Better Auth
        // when sendOnSignUp is enabled in the server configuration
      }
    } catch (error) {
      const errorMessage = formatError(error);
      setAuthError(errorMessage);
      toast.error("Sign up failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: "google") => {
    setSocialLoading(provider);
    setAuthError(null);

    try {
      const { data, error } = await authClient.signIn.social({
        provider,
        callbackURL: "/dashboard",
      });

      if (error) {
        setAuthError(error.message || "Social login failed");
        toast.error(`${provider} sign up failed`, {
          description: error.message || "An unexpected error occurred",
        });
      }
    } catch (error) {
      const errorMessage = formatError(error);
      setAuthError(errorMessage);
      toast.error(`${provider} sign up failed`, {
        description: errorMessage,
      });
    } finally {
      setSocialLoading(null);
    }
  };

  const handleResendVerification = async () => {
    const email = watch("email");
    if (!email) return;

    try {
      await authClient.sendVerificationEmail({
        email: email,
        callbackURL: "/dashboard",
      });
      toast.success("Verification email sent!", {
        description: "Please check your inbox for the verification link.",
      });
    } catch (error) {
      toast.error("Failed to resend verification email");
    }
  };

  if (step === "verification") {
    return (
      <AuthCard
        title="Check your email"
        description="We've sent a verification link to your email address"
      >
        <div className="space-y-6 text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              We've sent a verification email to:
            </p>
            <p className="font-medium">{watch("email")}</p>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Didn't receive the email? Check your spam folder or try again.
            </p>

            <LoadingButton
              onClick={handleResendVerification}
              variant="outline"
              className="w-full"
            >
              Resend verification email
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

  return (
    <AuthCard
      title="Create your account"
      description="Join ReWear and start your sustainable clothing journey"
    >
      <div className="space-y-6">
        {/* Social Login Section */}
        <div className="space-y-3">
          <SocialLoginButton
            provider="google"
            onClick={() => handleSocialLogin("google")}
            loading={socialLoading === "google"}
            disabled={isLoading || socialLoading !== null}
          />
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with email
            </span>
          </div>
        </div>

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

        {/* Sign Up Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              {...register("name")}
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
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

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="Create a strong password"
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
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your password"
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
            loadingText="Creating account..."
            disabled={socialLoading !== null}
            className="w-full"
          >
            Create account
          </LoadingButton>
        </form>

        <p className="text-xs text-muted-foreground text-center">
          By creating an account, you agree to our{" "}
          <Link
            href="/terms"
            className="underline hover:text-primary transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="underline hover:text-primary transition-colors"
          >
            Privacy Policy
          </Link>
        </p>

        {/* Sign In Link */}
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
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
