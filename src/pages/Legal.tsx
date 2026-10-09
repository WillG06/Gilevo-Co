import { Link } from "react-router-dom";
import { PageHero } from "@/components/PageHero";
import { CATEGORIES, COOKIE_REGISTRY, CONSENT_MAX_AGE_DAYS, openCookieSettings } from "@/lib/cookie-consent";

/**
 * ⚠️  TEMPLATES, NOT LEGAL ADVICE.
 * Anything in [SQUARE BRACKETS] needs filling in or checking against what
 * your site and hosting actually do. Update LAST_UPDATED when you edit.
 */
const LAST_UPDATED = "9 October 2026";
const CONTACT_EMAIL = "gilevo.co@gmail.com";
const BUSINESS = "Will Giles, trading as Gilevo";
const ADDRESS = "Birmingham, United Kingdom";

const Shell = ({ children }: { children: React.ReactNode }) => (
  <section className="relative pb-32">
    <div className="mx-auto max-w-[900px] px-6 lg:px-10 pt-4 space-y-14">
      <p className="mono text-faint">Last updated: {LAST_UPDATED}</p>
      {children}
    </div>
  </section>
);

const Block = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border-t border-hairline pt-8">
    <h2 className="display-sans text-2xl lg:text-3xl tracking-tight text-blue-deep">{title}</h2>
    <div className="mt-4 space-y-4 text-ink/70 leading-relaxed max-w-2xl [&_a]:ink-underline [&_a]:text-blue-deep [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
      {children}
    </div>
  </div>
);

/* ───────────────────────── Cookie Policy ───────────────────────── */

export const CookiePolicy = () => (
  <>
    <PageHero
      eyebrow="Legal"
      titleSerif="Cookie"
      titleSans="policy"
      intro="What cookies this site uses, why, and how to change your mind."
      variant="compass"
    />
    <Shell>
      <Block title="What are cookies?">
        <p>
          Cookies are small text files placed on your device when you visit a website. Similar
          technologies, such as your browser's local storage, work in much the same way, so this
          policy covers those too.
        </p>
      </Block>

      <Block title="How I use them">
        <p>
          Strictly necessary cookies are used without asking, as the law allows, because the site
          couldn't work securely without them. Every other category stays off until you actively
          switch it on. Nothing optional is loaded before you choose.
        </p>
        <ul>
          {CATEGORIES.map((c) => (
            <li key={c.id}>
              <strong className="text-blue-deep">{c.label}:</strong> {c.description}
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Cookies in use">
        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-sm text-left min-w-[640px]">
            <thead>
              <tr className="mono text-brand-blue border-b border-hairline">
                <th className="py-3 px-2 font-normal">Name</th>
                <th className="py-3 px-2 font-normal">Provider</th>
                <th className="py-3 px-2 font-normal">Purpose</th>
                <th className="py-3 px-2 font-normal">Duration</th>
                <th className="py-3 px-2 font-normal">Category</th>
              </tr>
            </thead>
            <tbody>
              {COOKIE_REGISTRY.map((c) => (
                <tr key={c.name} className="border-b border-hairline align-top">
                  <td className="py-4 px-2 mono text-blue-deep break-all">{c.name}</td>
                  <td className="py-4 px-2">{c.provider}</td>
                  <td className="py-4 px-2">{c.purpose}</td>
                  <td className="py-4 px-2">{c.duration}</td>
                  <td className="py-4 px-2 capitalize">{c.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Block>

      <Block title="Managing your choices">
        <p>
          Your choice is remembered for {CONSENT_MAX_AGE_DAYS} days, after which I'll ask again. You
          can change or withdraw consent at any time, as easily as you gave it:
        </p>
        <p>
          <button
            onClick={openCookieSettings}
            className="inline-flex items-center px-6 py-3 rounded-full bg-brand-blue-deep text-background text-sm font-medium hover:bg-brand-gold hover:text-brand-blue-deep transition-colors"
          >
            Open cookie settings
          </button>
        </p>
        <p>
          You can also block or delete cookies in your browser settings. Doing so may stop parts of
          the site (like the contact form's security check) from working.
        </p>
      </Block>

      <Block title="Questions">
        <p>
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also my{" "}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </Block>
    </Shell>
  </>
);

/* ───────────────────────── Privacy Policy ───────────────────────── */

export const PrivacyPolicy = () => (
  <>
    <PageHero
      eyebrow="Legal"
      titleSerif="Privacy"
      titleSans="policy"
      intro="How I collect and look after your personal information."
      variant="compass"
    />
    <Shell>
      <Block title="Who I am">
        <p>
          This website is run by {BUSINESS}, {ADDRESS}. I'm the "data controller" for the personal
          information described here, under the UK GDPR and the Data Protection Act 2018. Contact:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </Block>

      <Block title="What I collect">
        <p>When you send a brief through the contact form, I collect:</p>
        <ul>
          <li>Your name and email address</li>
          <li>The project type and plan you're interested in</li>
          <li>The message you write</li>
          <li>
            Technical data used for spam protection, such as your IP address, processed by
            Cloudflare Turnstile
          </li>
        </ul>
        <p>
          I don't ask for sensitive information. Please don't include any in your message. If you
          allow analytics cookies, I'll also collect anonymised usage data as described in my{" "}
          <Link to="/cookies">Cookie Policy</Link>.
        </p>
      </Block>

      <Block title="Why I use it, and my legal basis">
        <ul>
          <li>
            <strong className="text-blue-deep">To reply to your enquiry and prepare a quote.</strong>{" "}
            Basis: taking steps at your request before entering a contract, and my legitimate
            interest in responding to enquiries.
          </li>
          <li>
            <strong className="text-blue-deep">To keep the site secure and free of spam.</strong>{" "}
            Basis: legitimate interests.
          </li>
          <li>
            <strong className="text-blue-deep">Optional analytics.</strong> Basis: your consent,
            which you can withdraw at any time.
          </li>
        </ul>
        <p>I won't add you to a mailing list or send marketing without asking you first.</p>
      </Block>

      <Block title="Who I share it with">
        <p>I don't sell your data. I use a small number of providers to run the site:</p>
        <ul>
          <li>Cloudflare, Inc.: spam protection (Turnstile)</li>
          <li>Vercel: website hosting and the contact form endpoint</li>
          <li>Resend and Google (Gmail): delivering and storing your message</li>
        </ul>
        <p>
          Some of these providers are based outside the UK. Where that's the case, transfers rely on
          the UK's adequacy regulations, the UK International Data Transfer Agreement/Addendum, or
          equivalent safeguards.
        </p>
      </Block>

      <Block title="How long I keep it">
        <p>
          Enquiries that don't go ahead are deleted after 1 month. If we work together, I keep
          project records for as long as needed for the contract and for legal, tax and accounting
          obligations (usually up to six years).
        </p>
      </Block>

      <Block title="Your rights">
        <p>Under UK data protection law you can ask me to:</p>
        <ul>
          <li>Give you a copy of your personal information</li>
          <li>Correct anything that's wrong</li>
          <li>Delete your information</li>
          <li>Restrict or object to how I use it</li>
          <li>Move your data to another provider (where applicable)</li>
          <li>Withdraw consent at any time, where I rely on it</li>
        </ul>
        <p>
          Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. I'll respond within one
          month. If you're unhappy with how I've handled your data, you can complain to the
          Information Commissioner's Office at{" "}
          <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
            ico.org.uk
          </a>{" "}
          or on 0303 123 1113. I'd appreciate the chance to put things right first.
        </p>
      </Block>

      <Block title="Changes to this policy">
        <p>
          If I change how I use your data I'll update this page and the date at the top. Material
          changes will be flagged on the site.
        </p>
      </Block>
    </Shell>
  </>
);

export default PrivacyPolicy;