import { useEffect } from "react";

const useDisableScroll = () => {
  useEffect(() => {
    // Asegura que se inicia arriba
    window.scrollTo(0, 0);

    // Desactiva el scroll
    const originalOverflow = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);
};

export default useDisableScroll;
