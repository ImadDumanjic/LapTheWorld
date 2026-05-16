import { Link } from 'react-router-dom'

const LAST_UPDATED = '16 May 2026'

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 36 }}>
      <h2 style={{
        fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.22em', color: 'rgba(100,168,200,0.75)',
        marginBottom: 12, paddingBottom: 10,
        borderBottom: '1px solid rgba(100,168,200,0.1)',
      }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.48)' }}>
        {children}
      </div>
    </section>
  )
}

function Li({ children }) {
  return <li style={{ marginBottom: 6, paddingLeft: 4 }}>{children}</li>
}

export default function TermsPage() {
  return (
    <div className="min-h-svh">

      {/* Hero */}
      <div style={{ position: 'relative', overflow: 'hidden', paddingTop: 120, paddingBottom: 56 }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)',
          width: 800, height: 480,
          background: 'radial-gradient(ellipse at 50% 10%, rgba(44,83,100,0.55) 0%, transparent 65%)',
          pointerEvents: 'none',
        }} />

        {/* Title block */}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '0 24px' }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(100,168,200,0.5)', marginBottom: 14 }}>
            Legal
          </p>
          <h1 style={{ fontSize: 'clamp(32px, 5.5vw, 56px)', fontWeight: 900, color: '#fff', textTransform: 'uppercase', letterSpacing: '-1px', lineHeight: 1, marginBottom: 20 }}>
            Terms of Service
          </h1>
          <div style={{
            width: 56, height: 3,
            background: 'linear-gradient(90deg, rgba(100,168,200,0.9), rgba(44,83,100,0.2))',
            borderRadius: 2, margin: '0 auto 18px',
          }} />
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em' }}>
            Last updated: {LAST_UPDATED}
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 840, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: 'rgba(10,22,32,0.55)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(100,168,200,0.08)',
          borderRadius: 16,
          padding: 'clamp(28px, 5vw, 48px)',
          marginBottom: 20,
        }}>
          <Section title="1. Acceptance of Terms">
            <p>By accessing or using LapTheWorld ("Service", "we", "our"), you agree to be bound by these Terms of Service. If you do not agree, do not use the Service. These terms form a binding agreement between you and LapTheWorld.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>LapTheWorld is a Formula 1 travel guide and fan platform. It provides race weekend guides, circuit information, weather data, travel recommendations, and community features including a blog. The Service is intended for personal, non-commercial use.</p>
          </Section>

          <Section title="3. Account Registration">
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              <Li>You must provide accurate, current, and complete information during registration.</Li>
              <Li>You are responsible for maintaining the confidentiality of your credentials.</Li>
              <Li>You must be at least 16 years old to create an account (GDPR minimum age in most EU member states).</Li>
              <Li>You may not create accounts for others without their consent, or impersonate any person or entity.</Li>
            </ul>
          </Section>

          <Section title="4. Acceptable Use">
            <p style={{ marginBottom: 10 }}>You agree not to:</p>
            <ul style={{ paddingLeft: 18, margin: 0 }}>
              <Li>Post content that is unlawful, harmful, defamatory, or infringes on intellectual property rights.</Li>
              <Li>Attempt to gain unauthorised access to any part of the Service or other users' accounts.</Li>
              <Li>Use automated tools to scrape, crawl, or extract data from the Service.</Li>
              <Li>Use the Service for commercial advertising or spam.</Li>
              <Li>Interfere with or disrupt the integrity or performance of the Service.</Li>
            </ul>
          </Section>

          <Section title="5. User-Generated Content">
            <p>By posting blog content or other material on LapTheWorld, you grant us a non-exclusive, royalty-free licence to display and distribute that content within the platform. You retain ownership of your content. We reserve the right to remove content that violates these Terms.</p>
          </Section>

          <Section title="6. Intellectual Property">
            <p>All platform content, branding, design, and code — excluding user-generated content — is the intellectual property of LapTheWorld. Formula 1, F1, and related marks are trademarks of Formula One Licensing B.V. LapTheWorld is an independent fan platform and is not affiliated with or endorsed by Formula 1.</p>
          </Section>

          <Section title="7. Privacy">
            <p>Your use of the Service is subject to our <Link to="/privacy" style={{ color: 'rgba(100,168,200,0.65)', textDecoration: 'none' }}>Privacy Policy</Link>, which is incorporated into these Terms by reference. By using the Service, you consent to the data practices described therein.</p>
          </Section>

          <Section title="8. Account Termination">
            <p>You may delete your account at any time via Profile → Delete Account. We may suspend or terminate accounts that violate these Terms. Upon termination, your personal data is permanently deleted as described in our Privacy Policy.</p>
          </Section>

          <Section title="9. Disclaimer of Warranties">
            <p>The Service is provided "as is" without warranties of any kind. We do not warrant that the Service will be uninterrupted, error-free, or that travel information is current or accurate. Always verify travel details with official sources.</p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>To the fullest extent permitted by law, LapTheWorld shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service. Our total liability for any claim shall not exceed €100 or the amount you paid us in the preceding 12 months, whichever is less.</p>
          </Section>

          <Section title="11. Governing Law">
            <p>These Terms are governed by the laws of Bosnia and Herzegovina. Any disputes shall be subject to the exclusive jurisdiction of the courts of Bosnia and Herzegovina, without prejudice to your rights as a consumer under the laws of your country of residence within the EU.</p>
          </Section>

          <Section title="12. Changes to Terms">
            <p>We may modify these Terms at any time. Continued use of the Service after changes are posted constitutes your acceptance. We will notify you of material changes within the app.</p>
          </Section>

          <Section title="13. Contact">
            <p style={{ marginBottom: 0 }}>For any questions regarding these Terms, contact us at <a href="mailto:legal@laptheworld.com" style={{ color: 'rgba(100,168,200,0.65)', textDecoration: 'none' }}>legal@laptheworld.com</a>.</p>
          </Section>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Link
            to="/privacy"
            style={{ fontSize: 12, color: 'rgba(100,168,200,0.5)', textDecoration: 'none', letterSpacing: '0.04em' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'rgba(100,168,200,0.85)' }}
            onMouseLeave={e => { e.currentTarget.style.color = 'rgba(100,168,200,0.5)' }}
          >
            Privacy Policy →
          </Link>
        </div>
      </div>
    </div>
  )
}
