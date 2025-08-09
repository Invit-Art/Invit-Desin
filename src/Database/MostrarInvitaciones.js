import React, { useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../Database/firebaseConfig";
import { compartirPorWhatsApp, copiarAlPortapapeles } from "../componentes/component";


const MostrarInvitaciones = ({ CATEGORIA_EVENTO, NOMBRE_CLIENTE, setListaInvitaciones, setLinkPrevisualizacion }) => {

  const [invitaciones, setInvitaciones] = useState([]);


  useEffect(() => {
    if (!CATEGORIA_EVENTO || !NOMBRE_CLIENTE) {
      console.warn("⚠️ `CATEGORIA_EVENTO` o `NOMBRE_CLIENTE` están vacíos. No se puede obtener invitaciones.");
      return;
    }

    const invitacionesRef = collection(db, CATEGORIA_EVENTO, NOMBRE_CLIENTE, "invitaciones");

    // ✅ Escuchar cambios en tiempo real con `onSnapshot()`
    const unsubscribe = onSnapshot(invitacionesRef, (querySnapshot) => {
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log(`✅ Invitaciones actualizadas en tiempo real para ${CATEGORIA_EVENTO} - ${NOMBRE_CLIENTE}:`, data);
      setInvitaciones(data);
      setListaInvitaciones && setListaInvitaciones(data);
    });

    // 📌 Limpiar suscripción al desmontar el componente
    return () => unsubscribe();
  }, [CATEGORIA_EVENTO, NOMBRE_CLIENTE]);


  const compartirInvitacion = (link, nombre) => {
    const mensaje = `¡Hola! Te comparto tu invitación personalizada: ${link}`;
    const whatsappURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappURL, "_blank");
  };

  const copiarAlPortapapeles = (link) => {
    navigator.clipboard.writeText(link);
    alert("✅ Enlace copiado al portapapeles.");
  };


  const eliminarInvitacion = async (id) => {
    if (!CATEGORIA_EVENTO || !NOMBRE_CLIENTE) {
      console.error("⚠️ No se puede eliminar una invitación sin un evento definido.");
      return;
    }

    try {
      const idNormalizado = id.replace(/\s+/g, "").toLowerCase();
      const docRef = doc(db, CATEGORIA_EVENTO, NOMBRE_CLIENTE, "invitaciones", idNormalizado);
      
      await deleteDoc(docRef);
      console.log(`✅ Invitación con ID ${idNormalizado} eliminada correctamente.`);
      
      // 📌 Ya no es necesario actualizar manualmente el estado, `onSnapshot()` lo hace automáticamente
    } catch (error) {
      console.error("❌ Error al eliminar la invitación:", error);
    }
  };

  return (
    <div className="desing-table">
      <h2 className="table">Numero Total de invitados:</h2>

      {/* Tabla con los Totales de Invitados */}
      <table className="tabla-invitaciones">
        <thead>
          <tr>
            <th>Invitados Niños</th>
            <th>Invitados Adultos</th>
            <th>Total Invitados</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{invitaciones.reduce((total, invitacion) => total + (invitacion.invitadosNiños || 0), 0)}</td>
            <td>{invitaciones.reduce((total, invitacion) => total + (invitacion.invitadosAdultos || 0), 0)}</td>
            <td>{invitaciones.reduce((total, invitacion) => total + ((invitacion.invitadosNiños || 0) + (invitacion.invitadosAdultos || 0)), 0)}</td>
          </tr>
        </tbody>
      </table>
      <h2 className="table">Lista de Invitaciones Guardadas</h2>
      {!CATEGORIA_EVENTO || !NOMBRE_CLIENTE ? (
        <p>⚠️ No hay un evento definido para mostrar las invitaciones.</p>
      ) : (
        <table className="tabla-invitaciones2">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Adultos</th>
              <th>Niños</th>
              <th>Enlace</th>
              <th>Acciones</th>
              <th>Compartir</th>
            </tr>
          </thead>
          <tbody>
            {invitaciones.length > 0 ? (
              invitaciones.map((invitacion) => (
                <tr key={invitacion.id}>
                  <td>{invitacion.nombre}</td>
                  <td>{invitacion.invitadosAdultos}</td>
                  <td>{invitacion.invitadosNiños}</td>
                  <td><button onClick={() => setLinkPrevisualizacion(invitacion.link)}>👁️ Ver Invitación</button></td>
                  <td><button onClick={() => eliminarInvitacion(invitacion.id)}>❌ Eliminar</button></td>
                  <td><button onClick={() => compartirPorWhatsApp(invitacion.link, invitacion.nombre)}>📱 Compartir</button></td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No hay invitaciones registradas aún.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MostrarInvitaciones;
