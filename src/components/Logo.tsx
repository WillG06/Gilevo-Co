import { Link } from "react-router-dom";
import gcLogo from "@/assets/gc-logo.png";

interface Props {
  className?: string;
  asLink?: boolean;
  /** Light text variant for use on dark backgrounds (eg open mobile/blue overlay) */
  invert?: boolean;
}

export const Logo = ({ className = "", asLink = true, invert = false }: Props) => {
  const inner = (
    <div className={`flex items-center gap-3 transition-colors duration-300 ${className}`}>
      <img
        src={gcLogo}
        alt="Gilevo & Co. logo"
        className={`h-14 w-14 lg:h-16 lg:w-16 rounded-lg object-cover ring-1 transition-all duration-300 ${
          invert ? "ring-brand-gold/60 shadow-[0_0_0_2px_hsl(var(--brand-gold)/0.25)]" : "ring-brand-gold/30"
        }`}
      />
      <span
        className={`brush-script text-3xl lg:text-[2.5rem] leading-none transition-colors duration-300 ${
          invert ? "text-background" : "text-brand-blue-deep"
        }`}
      >
        Gilevo<span className="text-brand-gold">&amp;</span>Co.
      </span>
    </div>
  );
  return asLink ? <Link to="/" aria-label="Gilevo & Co. — Home">{inner}</Link> : inner;
};
