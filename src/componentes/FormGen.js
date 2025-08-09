import React, { useState } from "react";
import "./FormGen.css";

const FormGen = ({ actualizarDatos, handleCompartir, linkGenerado }) => {  
  if (!actualizarDatos) {
    console.error("Error: La función `actualizarDatos` no fue pasada correctamente.");
  }

  const [nombre, setNombre] = useState("");
  const [invitadosAdultos, setInvitadosAdultos] = useState(1);
  const [invitadosNiños, setInvitadosNiños] = useState(0);
  const [incluirNiños, setIncluirNiños] = useState(false);
  const [nombreCliente, setNombreCliente] = useState("");  


  const manejarCambioNombre = (e) => {
    let valor = e.target.value.replace(/\s{2,}/g, " "); 

    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,\-\/]*$/.test(valor)) {
      alert("Solo puedes introducir texto y los caracteres especiales: . , - /");
      return;
    }

    if (valor.length > 28) {
      alert("El nombre no puede tener más de 24 caracteres.");
      return;
    }

    setNombreCliente(valor); // <--- importante
  };


  const manejarCambioInvitadosAdultos = (e) => {
    let valor = e.target.value;

    if (valor === "") {
      setInvitadosAdultos("");
      return;
    }

    let numeroInvitados = parseInt(valor, 10);
    if (isNaN(numeroInvitados) || numeroInvitados < 1 || numeroInvitados > 25) {
      alert("El número de invitados adultos debe estar entre 1 y 25.");
      return;
    }

    setInvitadosAdultos(numeroInvitados);
  };

  // ✅ Corrección: Definir `manejarCambioInvitadosNiños`
  const manejarCambioInvitadosNiños = (e) => {
    let valor = e.target.value;
  
    if (valor === "") {
      setInvitadosNiños("");
      return;
    }
  
    let numeroInvitados = parseInt(valor, 10);
    if (isNaN(numeroInvitados) || numeroInvitados < 1 || numeroInvitados > 25) {
      alert("El número de invitados adultos debe estar entre 1 y 25.");
      return;
    }
  
    setInvitadosNiños(numeroInvitados);
  };

  const manejarCheckbox = () => {
    setIncluirNiños(!incluirNiños);
    if (!incluirNiños) {
      setInvitadosNiños(prev => prev > 0 ? prev : 1);
    } else {
      setInvitadosNiños(0); // ✅ Si se desactiva, el número de niños se borra
    }
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    actualizarDatos(nombreCliente, nombre, invitadosAdultos, invitadosNiños, incluirNiños);
  };

  return (
    <section id="asistencia">
      <div className="card">
        <h1>Genera tu Invitación</h1>
        <form onSubmit={manejarEnvio}>
          <label className="text">Nombre del Invitado:</label>
          <input type="text" value={nombreCliente} onChange={manejarCambioNombre} required/>

          <label className="text">Número de Invitados (Adultos):</label>
          <input type="number" value={invitadosAdultos} min="1" max="25" onChange={manejarCambioInvitadosAdultos} required />

          <label>
            <input type="checkbox" checked={incluirNiños} onChange={manejarCheckbox} /> ¿Incluir niños?
          </label>

          {/* 📌 Solo muestra el campo si `incluirNiños` está activado */}
          {incluirNiños && (
            <>
              <label className="text">Número de Invitados (Niños):</label>
              <input type="number" value={invitadosNiños} min="0" max="25" onChange={manejarCambioInvitadosNiños} required />
            </>
          )}

          <button type="submit">Generar Invitación</button>

          {linkGenerado && (
            <button type="button" onClick={handleCompartir}>📤 Compartir Invitación</button>
          )}
        </form>
      </div>
    </section>
  );
};

export default FormGen;
