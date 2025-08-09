import React from "react";
import AnimacionScroll from "./AnimacionScroll";

const Confirmacion = ({buttonText11, buttonLink11, buttonText22, buttonLink22, buttonText33, buttonLink33, buttonText44, buttonLink44, invitacion }) => {
  return (
    <section className="Confirmar">
      <div className="style contenedor-confirmacion">        
        {invitacion && (
          <div className="contasis">
            <div id="nombreInvitacion">
              {typeof invitacion.nombre === "string" ? (
                <>
                  {invitacion.nombre.slice(0, 7)}
                  <br />
                  {invitacion.nombre.slice(7)}
                  <br />
                  <h4 className="portada">Estás invitado</h4>
                </>
              ) : (
                invitacion.nombre
              )}
            </div>

            <div id="cantidadInvitados">{invitacion.invitados}</div>
          </div>
        )}

        <div className="contenedor-botones">
          <AnimacionScroll className="show-n-x">
          {buttonText11 && buttonLink11 && (
            <button className="Confirmar1" onClick={() => window.open(buttonLink11, "_blank")}>
              {buttonText11}
            </button>
          )}
          </AnimacionScroll>

          <AnimacionScroll className="show-p-x">
          {buttonText22 && buttonLink22 && (
            <button className="No-asistir1" onClick={() => window.open(buttonLink22, "_blank")}>
              {buttonText22}
            </button>
          )}
          </AnimacionScroll>
        </div>
      </div>
    </section>

  );
};

export default Confirmacion;