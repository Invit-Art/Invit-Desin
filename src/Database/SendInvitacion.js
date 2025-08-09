import { addDoc, collection } from "firebase/firestore";
import { db } from "../Database/firebaseConfig";

const SendInvitacion = async (nombre, invitadosAdultos, invitadosNiños, incluirNiños, totalInvitados, linkGenerado) => {
  if (!linkGenerado) {
    alert("Primero genera la invitación antes de compartirla.");
    return;
  }

  try {
    await addDoc(collection(db, "invitaciones"), {
      nombre,
      invitadosAdultos,
      invitadosNiños: incluirNiños ? invitadosNiños : 0,
      totalInvitados,
      link: linkGenerado,
      timestamp: new Date(),
    });

    navigator.clipboard.writeText(linkGenerado);

    const mensajeWhatsApp = `¡Hola! Te comparto la invitación: ${linkGenerado}`;
    window.open(`https://api.whatsapp.com/send?phone=+5619060019&text=%C2%A1Hola!${encodeURIComponent(mensajeWhatsApp)}`, "_blank");
    
  } catch (error) {
    console.error("Error al compartir la invitación:", error);
  }
};

export default SendInvitacion;
