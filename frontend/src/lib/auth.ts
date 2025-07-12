import { db } from "@/db";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import {
  sendEmail,
  createVerificationEmailTemplate,
  createPasswordResetEmailTemplate,
} from "./email";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url, token }, request) => {
      const template = createPasswordResetEmailTemplate(
        url,
        user.name,
        user.email
      );
      await sendEmail({
        to: user.email,
        subject: "Reset your ReWear password",
        text: template.text,
        html: template.html,
      });
    },
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const template = createVerificationEmailTemplate(
        url,
        user.name,
        user.email
      );
      await sendEmail({
        to: user.email,
        subject: "Verify your ReWear account",
        text: template.text,
        html: template.html,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
});
