import { Resend } from 'resend';

// Initialize Resend only if API key is available
let resend: Resend | null = null;
if (process.env.RESEND_API_KEY) {
  resend = new Resend(process.env.RESEND_API_KEY);
}

interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
}

export class EmailService {
  private static instance: EmailService;
  
  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendEmail({ to, subject, html }: EmailTemplate) {
    try {
      // In development or without API key, log email instead of sending
      if (process.env.NODE_ENV === 'development' || !resend) {
        console.log('📧 EMAIL WOULD BE SENT IN PRODUCTION:', { to, subject });
        console.log('📧 EMAIL PREVIEW:', html.substring(0, 200) + '...');
        return { success: true, messageId: 'dev-mode' };
      }

      const { data, error } = await resend.emails.send({
        from: 'ServiceHub <noreply@servicehub.com>',
        to: [to],
        subject,
        html,
      });

      if (error) {
        console.error('Email sending failed:', error);
        return { success: false, error };
      }

      return { success: true, messageId: data?.id };
    } catch (error) {
      console.error('Email service error:', error);
      return { success: false, error };
    }
  }

  async sendVerificationEmail(email: string, token: string, name?: string) {
    const verificationUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/verify-email?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - ServiceHub</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #10b981 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: rgba(255,255,255,0.9); font-size: 16px; }
            .content { padding: 40px 20px; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; margin: 20px 0; }
            .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✨ ServiceHub</div>
              <div class="subtitle">Welcome to the future of local services</div>
            </div>
            <div class="content">
              <h1 style="color: #1e293b; margin-bottom: 20px;">Verify Your Email Address</h1>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                ${name ? `Hi ${name},` : 'Hello!'}<br><br>
                Thank you for joining ServiceHub! To complete your registration and start connecting with amazing local service providers, please verify your email address.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              <p style="color: #64748b; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${verificationUrl}" style="color: #3b82f6;">${verificationUrl}</a>
              </p>
              <p style="color: #64748b; font-size: 14px;">
                This verification link will expire in 24 hours. If you didn't create an account with ServiceHub, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 ServiceHub. All rights reserved.</p>
              <p>Connecting communities through trusted local services.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log(`📧 VERIFICATION EMAIL: ${verificationUrl}`);
    
    return this.sendEmail({
      to: email,
      subject: '✨ Verify your ServiceHub account',
      html,
    });
  }

  async sendPasswordResetEmail(email: string, token: string, name?: string) {
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Your Password - ServiceHub</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #f97316 50%, #eab308 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: rgba(255,255,255,0.9); font-size: 16px; }
            .content { padding: 40px 20px; }
            .button { display: inline-block; background: linear-gradient(135deg, #ef4444, #f97316); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; margin: 20px 0; }
            .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
            .warning { background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 16px; margin: 20px 0; color: #92400e; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🔐 ServiceHub</div>
              <div class="subtitle">Secure password reset</div>
            </div>
            <div class="content">
              <h1 style="color: #1e293b; margin-bottom: 20px;">Reset Your Password</h1>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                ${name ? `Hi ${name},` : 'Hello!'}<br><br>
                We received a request to reset your ServiceHub account password. Click the button below to create a new password.
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <div class="warning">
                <strong>⚠️ Security Notice:</strong> This link will expire in 1 hour. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
              </div>
              <p style="color: #64748b; font-size: 14px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${resetUrl}" style="color: #ef4444;">${resetUrl}</a>
              </p>
            </div>
            <div class="footer">
              <p>© 2024 ServiceHub. All rights reserved.</p>
              <p>Your security is our priority.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log(`🔐 PASSWORD RESET EMAIL: ${resetUrl}`);

    return this.sendEmail({
      to: email,
      subject: '🔐 Reset your ServiceHub password',
      html,
    });
  }

  async sendWelcomeEmail(email: string, name: string, role: string) {
    const dashboardUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/signin`;
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ServiceHub!</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 50%, #8b5cf6 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: rgba(255,255,255,0.9); font-size: 16px; }
            .content { padding: 40px 20px; }
            .button { display: inline-block; background: linear-gradient(135deg, #10b981, #3b82f6); color: white; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; margin: 20px 0; }
            .footer { background-color: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
            .features { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 30px 0; }
            .feature { text-align: center; padding: 20px; background-color: #f8fafc; border-radius: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🎉 Welcome to ServiceHub!</div>
              <div class="subtitle">Your journey to amazing local services begins now</div>
            </div>
            <div class="content">
              <h1 style="color: #1e293b; margin-bottom: 20px;">Welcome, ${name}!</h1>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">
                Congratulations! Your ServiceHub account has been successfully verified. You're now part of a growing community of ${role === 'CUSTOMER' ? 'satisfied customers' : 'trusted service providers'}.
              </p>
              
              <div class="features">
                <div class="feature">
                  <div style="font-size: 32px; margin-bottom: 10px;">🔍</div>
                  <h3 style="color: #1e293b; margin: 10px 0;">Smart Matching</h3>
                  <p style="color: #64748b; font-size: 14px;">AI-powered system finds perfect matches</p>
                </div>
                <div class="feature">
                  <div style="font-size: 32px; margin-bottom: 10px;">⚡</div>
                  <h3 style="color: #1e293b; margin: 10px 0;">Instant Booking</h3>
                  <p style="color: #64748b; font-size: 14px;">Book services with just a few clicks</p>
                </div>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="${dashboardUrl}" class="button">Access Your Dashboard</a>
              </div>
              
              <p style="color: #64748b; font-size: 14px; text-align: center;">
                Need help getting started? Our support team is here to assist you 24/7.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 ServiceHub. All rights reserved.</p>
              <p>Building trust, one service at a time.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    console.log(`🎉 WELCOME EMAIL sent to ${email}`);

    return this.sendEmail({
      to: email,
      subject: '🎉 Welcome to ServiceHub - Get Started!',
      html,
    });
  }
}