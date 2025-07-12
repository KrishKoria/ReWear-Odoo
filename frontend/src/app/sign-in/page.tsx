"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

import { authClient } from "@/lib/authclient";
import { signInSchema, type SignInFormData } from "@/lib/validations";
import { formatError, saveFormData, clearFormData } from "@/lib/utils";

import { AuthCard } from "@/components/auth/auth-card";
import { SocialLoginButton } from "@/components/auth/social-login-button";
import { LoadingButton } from "@/components/ui/loading-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SignInPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [socialLoading, setSocialLoading] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Load saved email on mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setValue("email", savedEmail);
    }
  }, [setValue]);

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    setAuthError(null);

    try {
      // Save form data temporarily
      saveFormData("signin-form", data);

      const { data: result, error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setAuthError(error.message ?? null);
        toast.error("Sign in failed", {
          description: error.message,
        });
        return;
      }

      if (result) {
        // Clear form data on success
        clearFormData("signin-form");

        // Remember email for future logins
        localStorage.setItem("rememberedEmail", data.email);

        toast.success("Welcome back!", {
          description: "You've been successfully signed in.",
        });

        // Redirect to dashboard or home
        router.push("/dashboard");
      }
    } catch (error) {
      const errorMessage = formatError(error);
      setAuthError(errorMessage);
      toast.error("Sign in failed", {
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
        setAuthError(error.message ?? null);
        toast.error(`${provider} sign in failed`, {
          description: error.message,
        });
      }

      // The social login will redirect automatically if successful
    } catch (error) {
      const errorMessage = formatError(error);
      setAuthError(errorMessage);
      toast.error(`${provider} sign in failed`, {
        description: errorMessage,
      });
    } finally {
      setSocialLoading(null);
    }
  };

  const handleForgotPassword = () => {
    const email = watch("email");
    const params = email ? `?email=${encodeURIComponent(email)}` : "";
    router.push(`/auth/forgot-password${params}`);
  };

  return (
    <AuthCard
      title="Welcome back"
      description="Enter your credentials to access your account"
    >
      <div className="space-y-6">
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                autoComplete="current-password"
                {...register("password")}
                className={`pr-10 ${
                  errors.password ? "border-destructive" : ""
                }`}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive animate-in slide-in-from-top-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="link"
              className="px-0 text-sm text-muted-foreground hover:text-primary"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </Button>
          </div>

          <LoadingButton
            type="submit"
            loading={isLoading}
            loadingText="Signing in..."
            disabled={socialLoading !== null}
            className="w-full"
          >
            Sign in
          </LoadingButton>

          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-primary hover:underline transition-colors"
            >
              Forgot your password?
            </Link>
          </div>
        </form>

        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="sign-up"
            className="font-medium text-primary hover:underline transition-colors"
          >
            Sign up
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
