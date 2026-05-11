import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const cols = [
  {
    title: "Pages",
    links: [
      { label: "Home", to: "/" },
      { label: "Work", to: "/work" },
      { label: "Services", to: "/services" },
      { label: "About", to: "/about" },
      { label: "Pricing", to: "/pricing" },
      { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Elsewhere",
    external: true,
    links: [
      { label: "Instagram", to: "https://instagram.com/gilevo.co/" },
      { label: "LinkedIn", to: "www.linkedin.com/in/williamedwardgiles/" },
      { label: "GitHub", to: "https://github.com/WillG06/" },
    ],
  },
];

export const Footer = () => (
  <footer className="relative border-t border-hairline bg-paper/50 mt-20">
    <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-16 grid lg:grid-cols-12 gap-12">
      <div className="lg:col-span-5">
        <Logo />
        <p className="mt-6 max-w-sm text-ink/65 leading-relaxed">
          Bespoke web design &amp; development from Birmingham, UK.
          Sites engineered to be seen.
        </p>
        <p className="mt-6 mono text-faint">/ Available for projects · 2026</p>
      </div>
      {cols.map((c) => (
        <div key={c.title} className="lg:col-span-2">
          <p className="mono text-faint mb-4">/ {c.title}</p>
          <ul className="space-y-2.5">
            {c.links.map((l) =>
              c.external ? (
                <li key={l.label}>
                  <a href={l.to} target="_blank" rel="noopener noreferrer" className="ink-underline text-ink/80 hover:text-ink text-sm">
                    {l.label}
                  </a>
                </li>
              ) : (
                <li key={l.label}>
                  <Link to={l.to} className="ink-underline text-ink/80 hover:text-ink text-sm">
                    {l.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>
      ))}
      <div className="lg:col-span-3">
        <p className="mono text-faint mb-4">/ Studio</p>
        <p className="display-serif text-2xl text-ink">Birmingham, UK</p>
        <p className="mono text-faint mt-2">52.4862° N, 1.8904° W</p>
        <a href="mailto:hello@gilevoandco.com" className="mt-6 inline-block ink-underline text-ink">
          gilevo.co@gmail.com
        </a>
      </div>
    </div>
    <div className="border-t border-hairline">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 mono text-faint">
        <p>© 2026 Gilevo &amp; Co. - All rights reserved.</p>
        <p>Designed &amp; Built by Gilevo &amp; Co.</p>
      </div>
    </div>
  </footer>
);
