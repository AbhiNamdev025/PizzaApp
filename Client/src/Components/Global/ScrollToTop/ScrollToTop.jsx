import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useLayoutEffect(() => {
    try {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "instant",
      });
    } catch (error) {
      window.scrollTo(0, 0);
    }
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
