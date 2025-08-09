import React, { useState } from "react";
import imagenes from "../assets/imagenes";

const BuzonDeDeseos = () => {
  const [mensaje, setMensaje] = useState(""); // ✅ Guarda el mensaje del usuario

  const enviarMensajeCA = () => {
    const numero = "5619060019";
    const url = `https://wa.me/52${numero}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, "_blank"); // ✅ Abre WhatsApp con el mensaje ingresado por el usuario
  };

  return (
    <div id="whatsappLink" className="extra aparecer show-p-y">
      <h3>Buzón de Deseos</h3>
      <div className="icono-inv" data-icono="buzon"
            style={{
            marginTop: "3%",
            marginBottom: "5%",
            width: "100%",
            fontSize: "50px",
            maskImage: `url(${imagenes.buzon})`,
            WebkitMaskImage: `url(${imagenes.buzon})` // ✅ Para compatibilidad en Chrome/Safari
            }}
        ></div>
      <p className="texto" style={{ width: "90%" }}>
        Si quieres dejarme un lindo mensaje por mis XV, puedes hacerlo escribiéndome un mensaje:
      </p>
      <textarea
        className="mensaje"
        placeholder="Escribe tu mensaje aquí"
        value={mensaje} // ✅ Guarda lo que el usuario escribe
        onChange={(e) => setMensaje(e.target.value)} // ✅ Actualiza el estado del mensaje
      />
      <button className="boton aparecer" style={{ width: "30%" }} onClick={enviarMensajeCA}>
        Enviar Mensaje
      </button>
    </div>
  );
};

export default BuzonDeDeseos;