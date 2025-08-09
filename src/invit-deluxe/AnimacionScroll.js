import React, { useEffect, useRef, useState } from "react";

function AnimacionScroll({ className, children }) {
  const ref = useRef(null);
  const [activeClass, setActiveClass] = useState(""); // 🔥 Clase de animación dinámica
  const lastScrollY = useRef(window.scrollY); // 🔥 Detecta si el usuario hace scroll hacia abajo

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const windowHeight = window.innerHeight;
      const showTop = ref.current.getBoundingClientRect().top;
      const showPoint = 100;
      const scrollDown = window.scrollY > lastScrollY.current;
      lastScrollY.current = window.scrollY;

      // 🔥 Activa animación solo si entra en pantalla desde abajo
      if (scrollDown && showTop < windowHeight - showPoint && !activeClass) {
        setActiveClass(getAnimationClass(className)); 
      }

      // 🔥 Remueve la animación si el usuario sube y la sección sale completamente
      else if (!scrollDown && showTop > windowHeight) {
        setActiveClass(""); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [className, children]); // 🔥 Agrega `children` para que las animaciones respondan a los cambios internos

  return (
    <div ref={ref} className={`${className} ${activeClass}`}>
      {children}
    </div>
  );
}

// 🔥 Función para asignar las clases de animación específicas
function getAnimationClass(className) {
  if (className.includes("show-n-x")) return "active-n-x";
  if (className.includes("show-p-x")) return "active-p-x";
  if (className.includes("show-n-y")) return "active-n-y";
  if (className.includes("show-p-y")) return "active-p-y";
  if (className.includes("show")) return "active";
  return "";
}

export default AnimacionScroll;
