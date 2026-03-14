import { IUser, User } from "../../schema/user.schema";
import { Utils } from "../../utils/Utils";
import { EmailTemplateService } from "./email_template.service";
import { ResendEmailService } from "./resend_email.service";

export class UserEmailService {

    public static async sendVerificationEmail(Iuser: IUser) {
        let user = await User.findOne({ email: Iuser.email });

        if (!user) {
            throw new Error("User not found");
        }

        const token = Utils.createHash(user.email);

        const htmlTemplate = await EmailTemplateService.GetUserVerificationTemplate(user.user_name, token);

        const res = await ResendEmailService.resendEmail(user.email, htmlTemplate.subject, htmlTemplate.html);
        if (Utils.isNull(res.error)) {
            user = await User.findByIdAndUpdate(user._id, {
                is_verified: false,
                verify_token: token
            }, { returnDocument: "after" });
        }
    }

}