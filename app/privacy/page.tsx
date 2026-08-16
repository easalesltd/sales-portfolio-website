import Link from 'next/link'
import { getCspNonce } from '@/app/lib/csp-nonce'

const privacySchema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Privacy Policy',
  description:
    'Privacy policy for East Anglian Sales LTD, explaining how personal data is handled on easalesltd.co.uk.',
  url: 'https://www.easalesltd.co.uk/privacy',
  isPartOf: {
    '@type': 'WebSite',
    name: 'East Anglian Sales LTD',
    url: 'https://www.easalesltd.co.uk',
  },
  publisher: {
    '@type': 'Organization',
    name: 'East Anglian Sales LTD',
    url: 'https://www.easalesltd.co.uk',
  },
}

export default async function PrivacyPage() {
  const nonce = await getCspNonce()

  return (
    <div className="min-h-screen py-12">
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(privacySchema) }}
      />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-neutral-100 md:text-4xl">Privacy Policy</h1>
        <p className="mt-3 text-sm text-gray-500 dark:text-neutral-500">Last updated: 8 June 2026</p>

        <div className="prose prose-lg mt-8 max-w-none text-gray-700 dark:prose-invert dark:text-neutral-300">
          <p>
            East Anglian Sales LTD (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;) respects your privacy. This
            policy explains what personal information we collect when you use{' '}
            <Link href="/">www.easalesltd.co.uk</Link>, why we collect it, and your rights under UK data protection law.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Who we are</h2>
          <p>
            East Anglian Sales LTD is a UK company providing greeting card and gift sales agency services across East
            Anglia.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Registered office: Office 2, Paragon House, 35 Lower Brook Street, Ipswich, England, IP4 1AQ</li>
            <li>Company registration number: 14725288</li>
            <li>VAT number: 481 2602 07</li>
            <li>
              Email:{' '}
              <a href="mailto:dave@easalesltd.co.uk" className="site-link-quiet">
                dave@easalesltd.co.uk
              </a>
            </li>
            <li>
              Phone:{' '}
              <a href="tel:07709197915" className="site-link-quiet">
                07709 197915
              </a>
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Information we collect</h2>
          <p>Depending on how you use the site, we may collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Contact details</strong> you provide when requesting an agent visit, placing an order enquiry, or
              contacting us (for example name, business name, email address, phone number, and message content).
            </li>
            <li>
              <strong>Technical and usage data</strong> if you accept analytics cookies, such as pages viewed, approximate
              location (country/region), device type, browser, and referral source. See our{' '}
              <Link href="/cookies">cookie policy</Link> for details.
            </li>
            <li>
              <strong>Security data</strong> processed by Cloudflare Turnstile when you submit certain forms, to help
              prevent spam and abuse.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">How we use your information</h2>
          <p>We use personal information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Respond to enquiries and arrange sales agent visits</li>
            <li>Process wholesale order requests and trade communications</li>
            <li>Protect our website and forms from automated abuse</li>
            <li>Understand website usage and improve content and performance (only if you accept analytics cookies)</li>
            <li>Comply with legal obligations</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Lawful bases</h2>
          <p>Under UK GDPR we rely on:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              <strong>Legitimate interests</strong> to respond to business enquiries, operate our website, and prevent
              fraud or abuse (balanced against your rights).
            </li>
            <li>
              <strong>Consent</strong> for non-essential analytics cookies. You can withdraw consent at any time using
              Cookie settings in the site footer.
            </li>
            <li>
              <strong>Contract or pre-contractual steps</strong> where processing is necessary to handle a trade enquiry
              or order you request.
            </li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Sharing and processors</h2>
          <p>
            We do not sell your personal information. We use trusted service providers who process data on our behalf,
            including:
          </p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Google Analytics (website analytics, if you consent)</li>
            <li>Cloudflare Turnstile (form security)</li>
            <li>Our website hosting and email providers</li>
          </ul>
          <p>
            These providers may process data outside the UK. Where they do, we rely on appropriate safeguards such as
            UK adequacy regulations or standard contractual clauses.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">How long we keep information</h2>
          <p>
            We keep enquiry and order-related information for as long as needed to manage our business relationship and
            meet legal, tax, or accounting requirements. Analytics data retention is configured in Google Analytics (typically
            up to 14 months for standard reports).
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Your rights</h2>
          <p>Under UK data protection law you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Request access to your personal data</li>
            <li>Ask us to correct inaccurate data</li>
            <li>Ask us to delete your data in certain circumstances</li>
            <li>Object to or restrict certain processing</li>
            <li>Withdraw consent for analytics cookies at any time</li>
            <li>Lodge a complaint with the Information Commissioner&apos;s Office (ICO) at ico.org.uk</li>
          </ul>
          <p>
            To exercise your rights, contact us at{' '}
            <a href="mailto:dave@easalesltd.co.uk" className="site-link-quiet">
              dave@easalesltd.co.uk
            </a>
            .
          </p>

          <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The &ldquo;Last updated&rdquo; date at the top of this page will
            change when we do.
          </p>

          <p className="text-sm text-gray-600 dark:text-neutral-400">
            For details of cookies used on this site, see our{' '}
            <Link href="/cookies" className="site-link-quiet">
              cookie policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
