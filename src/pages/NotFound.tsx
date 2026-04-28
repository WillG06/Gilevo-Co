import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center pt-32">
      <div className="text-center px-6">
        <p className="mono text-faint">/ 404</p>
        <h1 className="display-sans text-7xl lg:text-9xl tracking-tighter mt-4 text-ink">
          Lost in <span className="display-serif">space.</span>
        </h1>
        <p className="mt-6 text-ink/60 max-w-md mx-auto">
          The page you're looking for doesn't exist — or has been moved.
        </p>
        <Link to="/" className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-ink text-background hover:bg-pop transition-colors">
          Return Home →
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
