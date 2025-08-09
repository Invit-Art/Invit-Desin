import React, { useRef, useState, useEffect } from "react";
import imagenes from "../assets/imagenes";
import "../invit-deluxe/Invit2.css";

const AudioController = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [icon, setIcon] = useState(imagenes.muteIcon);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIcon(imagenes.muteIcon);
    } else {
      audio.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Error al reproducir el audio:", err);
        }
      });
      setIcon(imagenes.soundOnIcon);
    }
    setIsPlaying(!isPlaying);
  };

  // Escucha el evento global para activar audio desde el botón del sobre
  useEffect(() => {
  const handlePlayRequest = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Solo intenta reproducir si está pausado
    if (audio.paused) {
      audio.play().then(() => {
        setIsPlaying(true);
        setIcon(imagenes.soundOnIcon);
      }).catch((err) => {
        if (err.name !== "AbortError") {
          console.warn("No se pudo reproducir el audio desde evento externo:", err);
        }
      });
    }
  };

  window.addEventListener("reproducir-audio", handlePlayRequest);
  return () => window.removeEventListener("reproducir-audio", handlePlayRequest);
  }, []);


  return (
    <section id="fixed-items">
        <button id="toggleButton" className="btn-music" onClick={toggleMusic}>
          <img
            id="soundIcon"
            src={icon}
            alt="Sound Icon"
            className="print"
            />
        </button>
      <audio ref={audioRef} id="music" loop preload="auto">
        <source src="/joansebastian-masalladeelsol.mp3" type="audio/mpeg" />
        Tu navegador no soporta la reproducción de audio.
      </audio>
    </section>
  );
};

export default AudioController;
