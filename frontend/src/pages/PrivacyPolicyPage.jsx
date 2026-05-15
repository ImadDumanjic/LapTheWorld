import { Link } from 'react-router-dom'

const LAST_UPDATED = '16 May 2026'

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{
        fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.2em', color: 'rgba(100,168,200,0.7)',
        marginBottom: 14, paddingBottom: 10,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.75, color: 'rgba(255,255,255,0.45)' }}>
        {children}
      </div>
    </section>
  )
}

function Li({ children }) {
  return (
    <li style={{ marginBottom: 6, paddingLeft: 4 }}>
      {children}
    </li>
  )
}

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-page-gradient min-h-svh">
      {/* Grid overlay */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: [
          'linear-gradient(rgba(120,200,220,0.04) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(120,200,220,0.04) 1px, transparent 1px)',
        ].join(','),
        backgroundSize: '48px 48px',
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 720, margin: '0 auto', padding: '80px 24px 80px' }}>

        {/* Back */}
        <Link
          to="/landing"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'rgba(100,168,200,0.5)', textDecoration: 'none', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 48 }}
          onMouseEnter={e => { e.currentTarget.style.color = 'rgba(100,168,200,0.8)' }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(100,168,200,0.5)' }}
        >
          ← Back
        </Link>

        {/* Header */}
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(100,168,200,0.5)', marginBottom: 12 }}>
          Legal
        </p>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 44px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-0.5px', lineHeight: 1, marginBottom: 8 }}>
          Privacy Policy
        </h1>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginBottom: 52, letterSpacing: '0.04em' }}>
          Last updated: {LAST_UPDATED}
        </p>

        <Section title="1. Who We Are">
          <p>LapTheWorld ("we", "our", "us") is a Formula 1 travel guide and fan platform. We are committed to protecting your personal data and complying with the General Data Protection Regulation (GDPR) and applicable data protection laws.</p>
          <p style={{ marginTop: 10 }}>Contact: <a href="mailto:privacy@laptheworld.com" style={{ color: 'rgba(100,168,200,0.6)', textDecoration: 'none' }}>privacy@laptheworld.com</a></p>
        </Section>

        <Section title="2. Data We Collect">
          <p style={{ marginBottom: 10 }}>We collect only the data necessary to provide our service:</p>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Account data:</strong> First name, last name, username, email address, and optionally a phone number — provided during registration.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Authentication data:</strong> Hashed passwords (never stored in plain text). If you use Google Sign-In, we receive your name and email from Google.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Usage data:</strong> Blog posts and travel plan content you create within the app.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Technical data:</strong> A session token stored in your browser's localStorage to keep you signed in.</Li>
          </ul>
          <p style={{ marginTop: 12 }}>We do <strong style={{ color: 'rgba(255,255,255,0.65)' }}>not</strong> collect location data, payment information, advertising identifiers, or any sensitive personal data.</p>
        </Section>

        <Section title="3. Legal Basis for Processing">
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Contract performance (Art. 6(1)(b) GDPR):</strong> Processing your account data is necessary to provide the service you signed up for.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Legitimate interests (Art. 6(1)(f) GDPR):</strong> Security logging and authentication to protect your account.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Consent (Art. 6(1)(a) GDPR):</strong> Cookie preferences, managed via the consent banner.</Li>
          </ul>
        </Section>

        <Section title="4. Cookies & Local Storage">
          <p style={{ marginBottom: 10 }}>We use browser localStorage (functionally equivalent to essential cookies) for:</p>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Authentication token:</strong> A signed JWT that keeps you logged in for up to 7 days. Cleared on logout.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>User role:</strong> Your account role ("User") stored locally for client-side routing only.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Cookie consent preference:</strong> Your consent choice, stored locally so we don't ask every visit.</Li>
          </ul>
          <p style={{ marginTop: 12 }}>We currently use <strong style={{ color: 'rgba(255,255,255,0.65)' }}>no analytics, advertising, or third-party tracking cookies</strong>.</p>
        </Section>

        <Section title="5. Data Sharing">
          <p>We do not sell, rent, or trade your personal data. We do not share your data with third parties except:</p>
          <ul style={{ paddingLeft: 18, margin: 0, marginTop: 10 }}>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Google:</strong> If you choose Google Sign-In. Subject to Google's Privacy Policy.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Infrastructure providers:</strong> Hosting and database services that process data under data processing agreements.</Li>
          </ul>
        </Section>

        <Section title="6. Your Rights Under GDPR">
          <p style={{ marginBottom: 10 }}>You have the right to:</p>
          <ul style={{ paddingLeft: 18, margin: 0 }}>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Access</strong> the personal data we hold about you.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Rectify</strong> inaccurate data — via your Profile page.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Erase</strong> your account and all associated data — via Profile → Delete Account.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Restrict</strong> processing in certain circumstances.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Data portability</strong> — contact us to request an export.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Object</strong> to processing based on legitimate interests.</Li>
            <Li><strong style={{ color: 'rgba(255,255,255,0.65)' }}>Withdraw consent</strong> at any time (for cookie preferences).</Li>
          </ul>
          <p style={{ marginTop: 12 }}>To exercise any right, contact us at <a href="mailto:privacy@laptheworld.com" style={{ color: 'rgba(100,168,200,0.6)', textDecoration: 'none' }}>privacy@laptheworld.com</a>. We will respond within 30 days.</p>
        </Section>

        <Section title="7. Data Retention">
          <p>Your data is retained for as long as your account is active. When you delete your account, all personal data is permanently and immediately erased from our systems. Anonymised aggregate data (no personal identifiers) may be retained for service improvement.</p>
        </Section>

        <Section title="8. Security">
          <p>We protect your data using industry-standard measures: bcrypt password hashing, signed JWTs with expiry, HTTPS in production, and access controls on all API endpoints. No system is completely secure; if you suspect unauthorised access, contact us immediately.</p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>We may update this policy. Material changes will be notified in the app. Continued use after changes constitutes acceptance.</p>
        </Section>

        <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 20, flexWrap: 'wrap' }}>
          <Link to="/terms" style={{ fontSize: 12, color: 'rgba(100,168,200,0.5)', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(100,168,200,0.8)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(100,168,200,0.5)' }}
          >Terms of Service →</Link>
        </div>
      </div>
    </div>
  )
}
