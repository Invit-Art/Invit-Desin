import React, { useState, useEffect } from "react";
import imagenes from "../assets/imagenes";
import "../prueba.css";

const GaleriaSimple = () => {
  const imageKeys = [
    "img11", "img12",
    "img21", "img22",
    "img31", "img32",
    "img51", "img52",
    "img53",
  ];

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animacion, setAnimacion] = useState("");

  const abrirModal = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
  };

  const cerrarModal = () => setModalOpen(false);

  const imagenActual = imagenes[imageKeys[currentIndex]];

  const siguienteImagen = (e) => {
    e.stopPropagation();
    setAnimacion("animate-left-out");
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % imageKeys.length);
      setAnimacion("animate-in");
    }, 300);
  };

  const imagenAnterior = (e) => {
    e.stopPropagation();
    setAnimacion("animate-right-out");
    setTimeout(() => {
      setCurrentIndex((prev) =>
        prev === 0 ? imageKeys.length - 1 : prev - 1
      );
      setAnimacion("animate-in-left");
    }, 300);
  };

  useEffect(() => {
    if (animacion === "animate-in") {
      const timeout = setTimeout(() => setAnimacion(""), 300);
      return () => clearTimeout(timeout);
    }
  }, [animacion]);

  return (
    <>
      <div className="galeria-container">
        {imageKeys.map((key, index) => (
          <div key={index} className="galeria-item">
            <img
              src={imagenes[key]}
              alt={`Imagen ${index + 1}`}
              onClick={() => abrirModal(index)}
              className="galeria-thumb"
            />
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <span className="close-btn" onClick={cerrarModal}>
              &times;
            </span>
            <span className="prev-btn" onClick={imagenAnterior}>
              ‹
            </span>
            <img
              className={`modal-img ${animacion}`}
              src={imagenActual}
              alt="Imagen ampliada"
            />
            <span className="next-btn" onClick={siguienteImagen}>
              ›
            </span>
          </div>
        </div>
      )}
    </>
  );
};

export default GaleriaSimple;
