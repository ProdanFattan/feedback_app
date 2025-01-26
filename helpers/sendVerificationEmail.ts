import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/email-template";
import { ApiResponse } from "@/types/ApiResponse";
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Verify your email address',
        react: VerificationEmail({ username, otp: verifyCode }),
      });
    return {
      success: true,
      message: "Verification email sent",
      isAcceptingMessages: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "Failed to send verification email",
      isAcceptingMessages: false,
    };
  }
}
