import { CreateEmailResponse, Resend } from 'resend';
import dotenv from 'dotenv'
dotenv.config()

const resend = new Resend(process.env.RESEND_EMAIL_KEY!);

export class ResendEmailService {
    public static async resendEmail(to: string, subject: string, html: string): Promise<CreateEmailResponse> {
        const res = await resend.emails.send({
            from: 'Guru-chatify <onboarding@resend.dev>',
            // to: [to],
            to: "gnanagurubb33@gmail.com",
            subject: subject,
            html: html,
        });

        return res;
    }
}
