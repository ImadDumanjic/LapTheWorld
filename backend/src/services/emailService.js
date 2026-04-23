import { URLSearchParams } from 'url'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.GMAIL_SENDER_EMAIL

async function getAccessToken() {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GMAIL_CLIENT_ID,
      client_secret: process.env.GMAIL_CLIENT_SECRET,
      refresh_token: process.env.GMAIL_REFRESH_TOKEN,
      grant_type:    'refresh_token',
    }).toString(),
  })
  const data = await res.json()
  if (!data.access_token) {
    throw new Error(`Gmail OAuth2 token exchange failed: ${data.error_description || data.error}`)
  }
  return data.access_token
}

function toBase64Url(str) {
  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function buildMimeMessage({ from, to, subject, html, plainText }) {
  const ab = `ltw_alt_${Date.now()}`
  return [
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${ab}"`,
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    ``,
    `--${ab}`,
    `Content-Type: text/plain; charset=UTF-8`,
    ``,
    plainText,
    ``,
    `--${ab}`,
    `Content-Type: text/html; charset=UTF-8`,
    ``,
    html,
    ``,
    `--${ab}--`,
  ].join('\r\n')
}

function buildResetEmailHtml(resetUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Your Password – LapTheWorld</title>
</head>
<body style="margin:0;padding:0;background-color:#0a1a22;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a1a22;">
    <tr>
      <td align="center" style="padding:48px 20px;">

        <table width="560" cellpadding="0" cellspacing="0" border="0"
          style="max-width:560px;width:100%;background-color:#0F2027;border:1px solid #2C5364;border-radius:8px;overflow:hidden;box-shadow:0 0 30px rgba(44,83,100,0.35);">

          <!-- Header -->
          <tr>
            <td align="center"
              style="background:linear-gradient(135deg,#1a3340 0%,#2C5364 50%,#1a3340 100%);padding:32px 40px;border-bottom:1px solid #2C5364;">
              <span style="color:#ffffff;font-size:26px;font-weight:800;letter-spacing:5px;text-transform:uppercase;">
                LapTheWorld
              </span>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <h1 style="margin:0 0 18px;color:#ffffff;font-size:21px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">
                Reset Your Password
              </h1>
              <p style="margin:0 0 28px;color:rgba(255,255,255,0.65);font-size:14px;line-height:1.75;">
                We received a request to reset the password for your LapTheWorld account.
                Click the button below to choose a new password.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 28px;">
                <tr>
                  <td align="center">
                    <a href="${resetUrl}"
                      style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#3d7a96,#2C5364,#1a3340);color:#ffffff;font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border-radius:50px;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry notice -->
              <p style="margin:0 0 28px;color:rgba(255,255,255,0.45);font-size:13px;line-height:1.65;text-align:center;padding:12px 16px;border:1px solid rgba(44,83,100,0.5);border-radius:6px;background-color:rgba(44,83,100,0.08);">
                ⚠&nbsp; This link expires in <strong style="color:rgba(255,255,255,0.7);">15 minutes</strong>.
                After that, you will need to request a new reset link.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid rgba(44,83,100,0.35);margin:0 0 24px;" />

              <!-- Fallback link -->
              <p style="margin:0;color:rgba(255,255,255,0.35);font-size:12px;line-height:1.7;">
                Button not working? Copy and paste this link into your browser:<br />
                <a href="${resetUrl}" style="color:#5b8fa8;word-break:break-all;font-size:12px;">${resetUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;background-color:rgba(0,0,0,0.25);border-top:1px solid rgba(44,83,100,0.25);text-align:center;">
              <p style="margin:0;color:rgba(255,255,255,0.22);font-size:11px;line-height:1.7;">
                If you did not request a password reset, you can safely ignore this email.<br />
                Your password will not be changed.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export async function sendPasswordResetEmail(toEmail, rawToken) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  const resetUrl    = `${frontendUrl}/reset-password?token=${rawToken}`

  const accessToken = await getAccessToken()

  const mime = buildMimeMessage({
    from:      `"LapTheWorld" <${process.env.GMAIL_SENDER_EMAIL}>`,
    to:        toEmail,
    subject:   'Reset your LapTheWorld password',
    plainText: `Reset your LapTheWorld password.\n\nClick this link (expires in 15 minutes):\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
    html:      buildResetEmailHtml(resetUrl),
  })

  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: toBase64Url(mime) }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Gmail API error ${res.status}: ${err?.error?.message || res.statusText}`)
  }
}

async function sendEmail({ to, subject, html, plainText }) {
  const accessToken = await getAccessToken()
  const mime = buildMimeMessage({
    from:      `"LapTheWorld" <${process.env.GMAIL_SENDER_EMAIL}>`,
    to,
    subject,
    html,
    plainText,
  })
  const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw: toBase64Url(mime) }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(`Gmail API error ${res.status}: ${err?.error?.message || res.statusText}`)
  }
}

export async function sendBlogSubmissionAdminEmail({ blog, author, isEdit = false }) {
  const frontendUrl  = process.env.FRONTEND_URL  || 'http://localhost:5173'
  const backendUrl   = process.env.BACKEND_URL   || 'http://localhost:3000'
  const adminPanelUrl = `${frontendUrl}/admin`

  const authorName  = [author.firstName, author.lastName].filter(Boolean).join(' ') || author.username
  const contentPreview = blog.content.length > 500 ? blog.content.slice(0, 500) + '…' : blog.content
  const imageSection = blog.image_url
    ? `<tr><td style="padding:0 0 24px;"><img src="${backendUrl}${blog.image_url}" alt="Cover" style="width:100%;max-height:280px;object-fit:cover;border-radius:8px;display:block;" /></td></tr>`
    : ''

  const eyebrow = isEdit ? 'Updated Post — Re-review Required' : 'Admin Review Required'
  const headline = isEdit ? 'Blog Post Updated &amp; Resubmitted' : 'New Blog Post Submitted'
  const footerNote = isEdit
    ? 'This post was edited by the author and is awaiting your re-approval before the changes go live.'
    : 'This post is awaiting your approval before it appears publicly on LapTheWorld.'

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>${isEdit ? 'Updated' : 'New'} Blog Post – LapTheWorld</title></head>
<body style="margin:0;padding:0;background-color:#0a1a22;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a1a22;">
    <tr><td align="center" style="padding:48px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" border="0"
        style="max-width:560px;width:100%;background-color:#0F2027;border:1px solid #2C5364;border-radius:8px;overflow:hidden;box-shadow:0 0 30px rgba(44,83,100,0.35);">
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#1a3340 0%,#2C5364 50%,#1a3340 100%);padding:32px 40px;border-bottom:1px solid #2C5364;">
            <span style="color:#ffffff;font-size:26px;font-weight:800;letter-spacing:5px;text-transform:uppercase;">LapTheWorld</span>
          </td>
        </tr>
        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 6px;color:rgba(100,168,200,0.8);font-size:10px;font-weight:800;letter-spacing:3.5px;text-transform:uppercase;">${eyebrow}</p>
          <h1 style="margin:0 0 20px;color:#ffffff;font-size:21px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">${headline}</h1>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 24px;background:rgba(44,83,100,0.1);border:1px solid rgba(44,83,100,0.3);border-radius:6px;">
            <tr><td style="padding:16px 20px;">
              <p style="margin:0 0 8px;color:rgba(255,255,255,0.45);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Author</p>
              <p style="margin:0 0 4px;color:#fff;font-size:14px;font-weight:600;">${authorName}</p>
              <p style="margin:0;color:rgba(255,255,255,0.5);font-size:13px;">${author.email}</p>
            </td></tr>
          </table>
          <p style="margin:0 0 6px;color:rgba(255,255,255,0.45);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Title</p>
          <p style="margin:0 0 20px;color:#fff;font-size:17px;font-weight:700;">${blog.title}</p>
          ${imageSection}
          <p style="margin:0 0 6px;color:rgba(255,255,255,0.45);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Content Preview</p>
          <p style="margin:0 0 28px;color:rgba(255,255,255,0.65);font-size:13px;line-height:1.75;white-space:pre-wrap;">${contentPreview}</p>
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 16px;">
            <tr><td align="center">
              <a href="${adminPanelUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#3d7a96,#2C5364,#1a3340);color:#ffffff;font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border-radius:50px;">
                Review in Admin Panel
              </a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:20px 40px;background-color:rgba(0,0,0,0.25);border-top:1px solid rgba(44,83,100,0.25);text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.22);font-size:11px;line-height:1.7;">${footerNote}</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  const subjectPrefix = isEdit ? 'Updated Post Awaiting Re-review' : 'New Blog Post Awaiting Review'
  const plainTextPrefix = isEdit
    ? 'A blog post was edited and resubmitted on LapTheWorld.'
    : 'New blog post submitted on LapTheWorld.'

  await sendEmail({
    to:        ADMIN_EMAIL,
    subject:   `${subjectPrefix}: "${blog.title}"`,
    plainText: `${plainTextPrefix}\n\nAuthor: ${authorName} (${author.email})\nTitle: ${blog.title}\n\nContent preview:\n${contentPreview}\n\nReview it here: ${adminPanelUrl}`,
    html,
  })
}

export async function sendBlogApprovedEmail({ toEmail, authorName, blogTitle }) {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
  const blogPageUrl = `${frontendUrl}/blog`

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Your Post Is Live – LapTheWorld</title></head>
<body style="margin:0;padding:0;background-color:#0a1a22;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a1a22;">
    <tr><td align="center" style="padding:48px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" border="0"
        style="max-width:560px;width:100%;background-color:#0F2027;border:1px solid #2C5364;border-radius:8px;overflow:hidden;box-shadow:0 0 30px rgba(44,83,100,0.35);">
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#1a3340 0%,#2C5364 50%,#1a3340 100%);padding:32px 40px;border-bottom:1px solid #2C5364;">
            <span style="color:#ffffff;font-size:26px;font-weight:800;letter-spacing:5px;text-transform:uppercase;">LapTheWorld</span>
          </td>
        </tr>
        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 6px;color:rgba(100,168,200,0.8);font-size:10px;font-weight:800;letter-spacing:3.5px;text-transform:uppercase;">Post Approved</p>
          <h1 style="margin:0 0 18px;color:#ffffff;font-size:21px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Your Story Is Live!</h1>
          <p style="margin:0 0 12px;color:rgba(255,255,255,0.65);font-size:14px;line-height:1.75;">Hi ${authorName},</p>
          <p style="margin:0 0 24px;color:rgba(255,255,255,0.65);font-size:14px;line-height:1.75;">
            Great news! Your blog post <strong style="color:#fff;">"${blogTitle}"</strong> has been reviewed and approved by our team. It is now live and visible to all LapTheWorld readers.
          </p>
          <table cellpadding="0" cellspacing="0" border="0" style="width:100%;margin:0 0 28px;">
            <tr><td align="center">
              <a href="${blogPageUrl}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#3d7a96,#2C5364,#1a3340);color:#ffffff;font-size:13px;font-weight:800;letter-spacing:2px;text-transform:uppercase;text-decoration:none;border-radius:50px;">
                View on Blog
              </a>
            </td></tr>
          </table>
          <hr style="border:none;border-top:1px solid rgba(44,83,100,0.35);margin:0 0 24px;" />
          <p style="margin:0;color:rgba(255,255,255,0.35);font-size:12px;line-height:1.7;">Keep sharing your F1 stories with the community!</p>
        </td></tr>
        <tr><td style="padding:20px 40px;background-color:rgba(0,0,0,0.25);border-top:1px solid rgba(44,83,100,0.25);text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.22);font-size:11px;line-height:1.7;">You received this email because you submitted a blog post on LapTheWorld.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  await sendEmail({
    to:        toEmail,
    subject:   `Your blog post "${blogTitle}" is now live on LapTheWorld!`,
    plainText: `Hi ${authorName},\n\nYour blog post "${blogTitle}" has been approved and is now live on LapTheWorld.\n\nRead it here: ${blogPageUrl}\n\nKeep sharing your F1 stories!`,
    html,
  })
}

export async function sendBlogRejectedEmail({ toEmail, authorName, blogTitle }) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><title>Blog Post Update – LapTheWorld</title></head>
<body style="margin:0;padding:0;background-color:#0a1a22;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a1a22;">
    <tr><td align="center" style="padding:48px 20px;">
      <table width="560" cellpadding="0" cellspacing="0" border="0"
        style="max-width:560px;width:100%;background-color:#0F2027;border:1px solid #2C5364;border-radius:8px;overflow:hidden;box-shadow:0 0 30px rgba(44,83,100,0.35);">
        <tr>
          <td align="center" style="background:linear-gradient(135deg,#1a3340 0%,#2C5364 50%,#1a3340 100%);padding:32px 40px;border-bottom:1px solid #2C5364;">
            <span style="color:#ffffff;font-size:26px;font-weight:800;letter-spacing:5px;text-transform:uppercase;">LapTheWorld</span>
          </td>
        </tr>
        <tr><td style="padding:40px 40px 32px;">
          <p style="margin:0 0 6px;color:rgba(100,168,200,0.8);font-size:10px;font-weight:800;letter-spacing:3.5px;text-transform:uppercase;">Post Review</p>
          <h1 style="margin:0 0 18px;color:#ffffff;font-size:21px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Post Not Approved</h1>
          <p style="margin:0 0 12px;color:rgba(255,255,255,0.65);font-size:14px;line-height:1.75;">Hi ${authorName},</p>
          <p style="margin:0 0 16px;color:rgba(255,255,255,0.65);font-size:14px;line-height:1.75;">
            Thank you for submitting your blog post <strong style="color:#fff;">"${blogTitle}"</strong> to LapTheWorld. After review, our team has determined that it does not meet our current content guidelines and cannot be published at this time.
          </p>
          <p style="margin:0 0 28px;color:rgba(255,255,255,0.45);font-size:13px;line-height:1.75;padding:16px;border:1px solid rgba(44,83,100,0.3);border-radius:6px;background:rgba(44,83,100,0.06);">
            This may be due to content that is off-topic, contains inappropriate language, violates our community standards, or does not align with the LapTheWorld editorial focus. You are welcome to revise your post and resubmit it.
          </p>
          <hr style="border:none;border-top:1px solid rgba(44,83,100,0.35);margin:0 0 24px;" />
          <p style="margin:0;color:rgba(255,255,255,0.35);font-size:12px;line-height:1.7;">If you believe this was a mistake, please reach out to us. We appreciate your contribution to the LapTheWorld community.</p>
        </td></tr>
        <tr><td style="padding:20px 40px;background-color:rgba(0,0,0,0.25);border-top:1px solid rgba(44,83,100,0.25);text-align:center;">
          <p style="margin:0;color:rgba(255,255,255,0.22);font-size:11px;line-height:1.7;">You received this email because you submitted a blog post on LapTheWorld.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`

  await sendEmail({
    to:        toEmail,
    subject:   `Update on your LapTheWorld blog post: "${blogTitle}"`,
    plainText: `Hi ${authorName},\n\nThank you for submitting "${blogTitle}" to LapTheWorld.\n\nAfter review, our team has determined that it does not meet our current content guidelines and cannot be published at this time.\n\nThis may be due to content that is off-topic, contains inappropriate language, violates our community standards, or does not align with the LapTheWorld editorial focus. You are welcome to revise your post and resubmit it.\n\nIf you believe this was a mistake, please reach out to us.`,
    html,
  })
}
