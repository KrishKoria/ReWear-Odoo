"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrengthIndicator?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrengthIndicator = false, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [strength, setStrength] = React.useState({
      score: 0,
      label: "",
      color: "",
    });

    const calculateStrength = (password: string) => {
      let score = 0;

      if (password.length >= 8) score += 1;
      if (password.length >= 12) score += 1;
      if (/[A-Z]/.test(password)) score += 1;
      if (/[a-z]/.test(password)) score += 1;
      if (/[0-9]/.test(password)) score += 1;
      if (/[^A-Za-z0-9]/.test(password)) score += 1;

      const strengthMap = {
        0: { label: "Very Weak", color: "rgb(239 68 68)" },
        1: { label: "Weak", color: "rgb(245 101 101)" },
        2: { label: "Fair", color: "rgb(251 146 60)" },
        3: { label: "Good", color: "rgb(250 204 21)" },
        4: { label: "Strong", color: "rgb(132 204 22)" },
        5: { label: "Very Strong", color: "rgb(34 197 94)" },
        6: { label: "Excellent", color: "rgb(16 185 129)" },
      };

      return {
        score,
        label: strengthMap[score as keyof typeof strengthMap].label,
        color: strengthMap[score as keyof typeof strengthMap].color,
      };
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const password = e.target.value;
      if (showStrengthIndicator) {
        setStrength(calculateStrength(password));
      }
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          className={cn("pr-10", className)}
          ref={ref}
          {...props}
          onChange={handlePasswordChange}
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

        {showStrengthIndicator && props.value && (
          <div className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(strength.score / 6) * 100}%`,
                    backgroundColor: strength.color,
                  }}
                />
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: strength.color }}
              >
                {strength.label}
              </span>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`flex items-center ${
                    (props.value as string).length >= 8
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  ✓ 8+ characters
                </div>
                <div
                  className={`flex items-center ${
                    /[A-Z]/.test(props.value as string)
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  ✓ Uppercase letter
                </div>
                <div
                  className={`flex items-center ${
                    /[a-z]/.test(props.value as string)
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  ✓ Lowercase letter
                </div>
                <div
                  className={`flex items-center ${
                    /[0-9]/.test(props.value as string)
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  ✓ Number
                </div>
                <div
                  className={`flex items-center ${
                    /[^A-Za-z0-9]/.test(props.value as string)
                      ? "text-green-600"
                      : "text-muted-foreground"
                  }`}
                >
                  ✓ Special character
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
