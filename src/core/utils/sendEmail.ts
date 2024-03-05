import nodemailer from 'nodemailer';
import hbs from "nodemailer-express-handlebars";
import dotenv from 'dotenv';
import { EmailTemplate } from '@/interfaces';

dotenv.config();

class sendEmail {
    private sender: string;
    private nodeMailerTransporter: nodemailer.Transporter;

    constructor() {
        this.sender = `FINLAP <${process.env.EMAIL_ADDRESS}>`;

        this.nodeMailerTransporter = nodemailer.createTransport({
            host: "smtp-relay.brevo.com",
            port: 587,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        this.nodeMailerTransporter.use(
            "compile",
            hbs({
                viewPath: "src/views/templates",
                extName: ".hbs",
                viewEngine: {
                    extname: ".hbs",
                    layoutsDir: "src/views/",
                    defaultLayout: "layout",
                    partialsDir: "src/views/partials",
                },
            })
        );
    }

    sendMail = async (mailOptions: nodemailer.SendMailOptions) =>
        new Promise((resolve, reject) => {
            this.nodeMailerTransporter.sendMail(mailOptions, (err, info) => {
                if (err) {
                    reject(err);
                    // console.error('Error sending email:', err);
                    return;
                }
                resolve(info);
                // console.log('Email sent successfully:', info);
                return;
            });
        });

    sendTemplatedEmail = async ({
        recipients,
        template,
        templateData,
    }: {
        recipients: Array<string> | string;
        template: EmailTemplate;
        templateData: any;
    }): Promise<boolean> => {
        let mailOptions: any = {
            from: this.sender,
            to: recipients,
            subject: template.subject,
            template: template.name,
            context: templateData,
        };

        try {
            const isSent = await this.sendMail(mailOptions);
            if (isSent) {
                // console.log('Email sent successfully:', mailOptions);
            } else {
                // console.error('Failed to send email:', mailOptions);
            }
            return !!isSent;
        } catch (e) {
            // console.error('Error sending templated email:', e);
            return false;
        }
    };
}

export default sendEmail;