import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Database/firebaseConfig";

const HubInvitaciones = ({ nombreCliente }) => {
  const [invitaciones, setInvitaciones] = useState([]);

  useEffect(() => {
    const obtenerInvitaciones = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, `clientes/${nombreCliente}/invitaciones`));
        const data = querySnapshot.docs.map(doc => doc.data());
        setInvitaciones(data);
      } catch (error) {
        console.error("❌ Error al obtener las invitaciones:", error);
      }
    };

    obtenerInvitaciones();
  }, [nombreCliente]);

  return (
    <div>
      <h2>📌 Invitaciones Generadas para {nombreCliente}</h2>
      <ul>
        {invitaciones.length > 0 ? (
          invitaciones.map((invitacion, index) => (
            <li key={index}>
              <strong>{invitacion.nombreInvitado}</strong> → 
              Adultos: {invitacion.invitadosAdultos}, 
              Niños: {invitacion.invitadosNiños}, 
              Total: {invitacion.totalInvitados}  
              ➜ <a href={invitacion.link} target="_blank" rel="noopener noreferrer">Ver Invitación</a>
            </li>
          ))
        ) : (
          <li>No hay invitaciones registradas aún.</li>
        )}
      </ul>
    </div>
  );
};

export default HubInvitaciones;
