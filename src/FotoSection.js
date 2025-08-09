import React from "react";

const FotoSection = ({ imageSrc, buttonText1, buttonLink1, buttonText2, buttonLink2, buttonText3, buttonLink3, buttonText4, buttonLink4, invitacion }) => {
  return (
    <section className="foto">
      <div className="style">
        <img src={imageSrc} alt="Imagen de sección" />
        
        {invitacion && (
          <div 
            className="contasis" 
            style={{ bottom: invitacion.nombre.length > 39 ? "21%" : "28%" }} // Ajuste dinámico
          >
            <h4 id="nombreInvitacion" style={{ whiteSpace: invitacion.nombre.length > 39 ? "pre-line" : "nowrap" }}>
              {invitacion.nombre}
            </h4>

            <h4 id="cantidadInvitados">{invitacion.invitados}</h4>
          </div>
        )}

        {/* Solo muestra el botón si hay texto y enlace */}
        {buttonText1 && buttonLink1 && (
          <button className="Confirmar" onClick={() => window.open(buttonLink1, "_blank")}>
            {buttonText1}
          </button>
        )}

        {buttonText2 && buttonLink2 && (
          <button className="No-asistir" onClick={() => window.open(buttonLink2, "_blank")}>
            {buttonText2}
          </button>
        )}

        {buttonText3 && buttonLink3 && (
          <button className="Ubicacion" onClick={() => window.open(buttonLink3, "_blank")}>
            {buttonText3}
          </button>
        )}

        {buttonText4 && buttonLink4 && (
          <button className="blason" onClick={() => window.open(buttonLink4, "_blank")}>
            {buttonText4}
          </button>
        )}
      </div>
    </section>
  );
};

export default FotoSection;