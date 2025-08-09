import React from "react";
import FotoSection from "./FotoSection";
import imagenes from "./assets/imagenes";

const Invitacion = ({ nombreInvitacion, totalInvitadosInvitacion }) => {
  return (
    <div>
      <FotoSection imageSrc={imagenes.img1}/>
      <FotoSection imageSrc={imagenes.img2}/>
      <FotoSection imageSrc={imagenes.img3}/>
      <FotoSection imageSrc={imagenes.img4}/>
      <FotoSection imageSrc={imagenes.img5}/>
      <FotoSection imageSrc={imagenes.img6}/>
      <FotoSection imageSrc={imagenes.img7}/>


      <FotoSection
        imageSrc={imagenes.img9}
        buttonText1="Confirmar asistencia"
        buttonLink1="https://wa.me/521XXXXXXXXXX?text=Confirmo asistencia"
        buttonText2="No puedo asistir"
        buttonLink2="https://wa.me/521XXXXXXXXXX?text=No puedo asistir"
        invitacion={{
          nombre: `${nombreInvitacion} estás invitado a mi Fiesta`,
          invitados: `Invitación para ${totalInvitadosInvitacion} personas`,
        }}
      />
    </div>
  );
};

export default Invitacion;
