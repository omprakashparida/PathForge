import nodemailer from "nodemailer";

// Per-purpose email copy. The transport (Gmail local / Brevo production)
// is shared — only the words change.
const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

const TEMPLATES = {
  signup: {
    subject: "Welcome to PathForge — Verify your email \u{1F680}",
    preheader: "Welcome to PathForge — your verification code is inside.",
    eyebrow: "WELCOME TO PATHFORGE",
    heading: "Verify your email address",
    intro:
      "Thanks for joining PathForge. Enter the code below to verify your email and start forging your path.",
    codeLabel: "VERIFICATION CODE",
    note: "This code expires in 5 minutes.",
    footer:
      "If you didn't create a PathForge account, you can safely ignore this email.",
  },
  forgotPassword: {
    subject: "PathForge — Reset your password \u{1F511}",
    preheader: "Your PathForge password reset code is inside.",
    eyebrow: "PASSWORD RESET",
    heading: "Reset your password",
    intro:
      "We received a request to reset your PathForge password. Enter the code below to continue.",
    codeLabel: "RESET CODE",
    note: "This code expires in 5 minutes.",
    footer:
      "If you didn't request a password reset, no changes were made — just ignore this email.",
  },
};

// Single HTML builder so local (Gmail) and production (Brevo) emails
// always look the same. Table layout + inline styles only: this is what
// survives Gmail / Outlook / Apple Mail renderers.
const buildHtml = (otp, t) => `
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${t.preheader}</div>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#F4EFE6;margin:0;padding:0;">
<tr>
<td align="center" style="padding:36px 16px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="width:100%;max-width:560px;background-color:#FFFFFF;border-radius:16px;">

<tr>
<td align="center" style="background-color:#16100A;padding:32px 32px 28px 32px;border-radius:16px 16px 0 0;">
<div style="font-family:${FONT};font-size:28px;font-weight:800;letter-spacing:0.5px;color:#FFB25E;">Path<span style="color:#FFFFFF;">Forge</span></div>
<div style="font-family:${FONT};font-size:10px;letter-spacing:5px;color:#8A7B68;margin-top:8px;">FORGE YOUR PATH</div>
</td>
</tr>

<tr>
<td style="padding:36px 44px 4px 44px;">
<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:3px;color:#C2701D;margin-bottom:14px;">${t.eyebrow}</div>
<div style="font-family:${FONT};font-size:24px;font-weight:800;color:#1A1208;margin-bottom:12px;">${t.heading}</div>
<div style="font-family:${FONT};font-size:15px;line-height:24px;color:#4A4038;">${t.intro}</div>
</td>
</tr>

<tr>
<td style="padding:24px 44px 4px 44px;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
<tr>
<td align="center" style="background-color:#FFF7EC;border:2px dashed #FF8A1E;border-radius:12px;padding:28px 16px;">
<div style="font-family:${FONT};font-size:11px;font-weight:700;letter-spacing:3px;color:#B07A3E;margin-bottom:12px;">${t.codeLabel}</div>
<div style="font-family:Consolas,'Courier New',monospace;font-size:44px;font-weight:800;letter-spacing:12px;color:#1A1208;padding-left:12px;">${otp}</div>
<div style="font-family:${FONT};font-size:12px;color:#8A7B68;margin-top:12px;">${t.note}</div>
</td>
</tr>
</table>
</td>
</tr>

<tr>
<td style="padding:20px 44px 40px 44px;">
<div style="font-family:${FONT};font-size:13px;line-height:21px;color:#8A7B68;">${t.footer}</div>
</td>
</tr>

<tr>
<td align="center" style="background-color:#16100A;padding:24px 32px;border-radius:0 0 16px 16px;">
<div style="font-family:${FONT};font-size:12px;color:#8A7B68;">&copy; 2026 PathForge. All rights reserved.</div>
<div style="font-family:${FONT};font-size:11px;color:#5C5347;margin-top:6px;">This is an automated message &mdash; please do not reply.</div>
</td>
</tr>

</table>
</td>
</tr>
</table>
`;

export const sendOTP = async (email, otp, purpose = "signup") => {
  const t = TEMPLATES[purpose] || TEMPLATES.signup;
  const html = buildHtml(otp, t);

  try {
    // Explicit production check: anything that isn't exactly "production" is
    // treated as development. The old `!== "production"` inline check silently
    // routed production mail through Gmail whenever NODE_ENV was unset.
    const isProduction = process.env.NODE_ENV === "production";

    // ==========================================
    // LOCAL → NODEMAILER
    // ==========================================

    if (!isProduction) {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error(
          "EMAIL_USER and EMAIL_PASS must be set for local email sending"
        );
      }

      console.log("🚀 Local Mode: Nodemailer");

      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const info = await transporter.sendMail({
        from: `"PathForge" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: t.subject,
        html,
      });

      console.log("Email Sent:", info.messageId);

      return info;
    }

    // ==========================================
    // PRODUCTION → BREVO
    // ==========================================

    console.log("🌐 Production Mode: Brevo");

    if (!process.env.BREVO_API_KEY || !process.env.BREVO_SENDER_EMAIL) {
      throw new Error(
        "BREVO_API_KEY and BREVO_SENDER_EMAIL must be set in production"
      );
    }

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "PathForge",
          email: process.env.BREVO_SENDER_EMAIL,
        },
        to: [{ email }],
        subject: t.subject,
        htmlContent: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.log("BREVO ERROR:", data);
      throw new Error(data.message || "Failed sending email");
    }

    return data;
  } catch (error) {
    console.log("EMAIL ERROR:", error);
    throw error;
  }
};
