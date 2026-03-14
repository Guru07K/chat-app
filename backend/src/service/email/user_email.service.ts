import { IUser } from "../../schema/user.schema";
import { EmailTemplateService } from "./email_template.service";
import { ResendEmailService } from "./resend_email.service";

export class UserEmailService {

    public static async sendVerificationEmail(user: IUser) {

        const htmlTemplate = await EmailTemplateService.GetUserVerificationTemplate(user.user_name, "token");

        await ResendEmailService.resendEmail(user.email, htmlTemplate.subject, htmlTemplate.html);

    }

}