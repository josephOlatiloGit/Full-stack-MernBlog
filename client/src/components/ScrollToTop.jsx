import { useEffect } from "react";
import { useLocation } from "react-router-dom";
/**
 * We create this reusable scroll to view component to ensure all page loads to screen view in the application.
 * so we import this component in our app.jsx to make it available in all our app.
 */

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default ScrollToTop;
