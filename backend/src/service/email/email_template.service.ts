import { readFileSync } from "fs";
import template from "lodash.template";
import path from "path";

export class EmailTemplateService {

    public static GetTemplatePath(fileName: string): string {
        let file_url: string = "src/service/email/templates/";
        let resolved_path = file_url + fileName;
        resolved_path = path.resolve(resolved_path);
        return resolved_path;
    }

    public static async GetUserVerificationTemplate(user_name: string, verify_token: string): Promise<{ html: string; subject: string }> {
        let resolvedPath = this.GetTemplatePath("verify_email_template.html");
        let file_data = readFileSync(resolvedPath).toString();
        let htmlTemplate = template(file_data);

        let subject = "Verify your email address for Chat App";

        let html = htmlTemplate({
            user_name: user_name,
            verify_link: `${process.env.CLIENT_URL}/verify-email?token=${verify_token}`
        });

        return { html: html, subject: subject };
    }



}
