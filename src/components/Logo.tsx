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
    <div className={`flex items-center transition-colors duration-300 ${className}`}>
      <img
        src={gcLogo}
        alt="Gilevo & Co. logo"
        className="h-12 w-12 rounded-full object-cover ring-1 ring-white transition-all duration-300 lg:h-14 lg:w-14"
      />
    </div>
  );
  return asLink ? <Link to="/" aria-label="Gilevo & Co. — Home">{inner}</Link> : inner;
};