import React from "react";
import AnimacionScroll from "./AnimacionScroll"; // 🔥 Importamos la animación
import imagenes from "../assets/imagenes"; // ✅ Importamos el álbum de imágenes

const eventos = [
  { nombre: "Misa", hora: "3:45 PM", icono: "iglesia2" },
  { nombre: "Recepción", hora: "5:10 PM", icono: "recepcion2" },
  { nombre: "Comida", hora: "5:45 PM", icono: "comida" },
  { nombre: "Vals", hora: "9:30 PM", icono: "vals" },
  { nombre: "Baile", hora: "10:30 PM", icono: "baile" },
  { nombre: "Fin del Evento", hora: "1:00 AM", icono: "fin" }
];

const Itinerario = () => {
  return (
    <AnimacionScroll className="itinerario show-p-y"> {/* 🔥 Envuelve todo el itinerario */}
      <div>
        {eventos.map((evento, index) => {
          const posicion = index % 2 === 0 ? "izquierda" : "derecha";
          return (
            <AnimacionScroll key={index} className={`evento ${posicion}`}>
              {posicion === "izquierda" ? (
                <>
                  <AnimacionScroll className="icono show-n-x">
                    <div className="circulo">
                      <div
                        className="icono-itinerario"
                        style={{
                          WebkitMaskImage: `url(${imagenes[evento.icono]})`,
                          maskImage: `url(${imagenes[evento.icono]})`,
                          backgroundColor: "#000",
                          width: "70%",
                          height: "70%"
                        }}
                      ></div>
                    </div>
                  </AnimacionScroll>
                  <AnimacionScroll className="item show-p-x">
                    <h4 className="nombre">{evento.nombre}</h4>
                    <p className="hora">{evento.hora}</p>
                  </AnimacionScroll>
                </>
              ) : (
                <>
                  <AnimacionScroll className="item show-n-x">
                    <h4 className="nombre">{evento.nombre}</h4>
                    <p className="hora">{evento.hora}</p>
                  </AnimacionScroll>
                  <AnimacionScroll className="icono show-p-x">
                    <div className="circulo">
                      <div
                        className="icono-itinerario"
                        style={{
                          WebkitMaskImage: `url(${imagenes[evento.icono]})`,
                          maskImage: `url(${imagenes[evento.icono]})`,
                          backgroundColor: "#000",
                          width: "70%",
                          height: "70%"
                        }}
                      ></div>
                    </div>
                  </AnimacionScroll>
                </>
              )}
            </AnimacionScroll>
          );
        })}
      </div>
    </AnimacionScroll>
  );
};

export default Itinerario;
