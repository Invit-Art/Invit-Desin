import React, { useState, useEffect, useCallback } from "react";
import { db } from "./Database/firebaseConfig";
import { query, where, collection, doc, setDoc, getDocs } from "firebase/firestore";

import axios from "axios";
import FotoSection from "./FotoSection";
import FormGen from "./componentes/FormGen";
import Invitacion from "./Invitacion";
import Invitacion3 from "./Invitacion3";
import imagenes from "./assets/imagenes";
import "./invit.css";
import SendInvitacion from "./Database/SendInvitacion";
import MostrarInvitaciones from "./Database/MostrarInvitaciones";
import RegistroCliente from "./Database/RegistroCliente";  // ajusta la ruta según dónde lo guardaste


import Login from "./Database/Login";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./Database/firebaseConfig";
import { signOut } from "firebase/auth";

const generarID = (nombreOriginal) => {
  return nombreOriginal
    .normalize("NFD")                   // separa los acentos
    .replace(/[\u0300-\u036f]/g, "")   // elimina los acentos
    .replace(/\s+/g, "")               // elimina espacios
    .toLowerCase();                    // convierte a minúsculas
};


const App = () => {
  const [nombre, setNombre] = useState(() => {
    return localStorage.getItem("nombreInvitado") || "Invitado";
  });
  const [invitadosAdultos, setInvitadosAdultos] = useState(1);
  const [invitadosNiños, setInvitadosNiños] = useState(0);
  const [incluirNiños, setIncluirNiños] = useState(false);
  const [totalInvitados, setTotalInvitados] = useState(1);
  const [linkGenerado, setLinkGenerado] = useState("");
  const [linkAcortado, setLinkAcortado] = useState("");
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  const [listaInvitaciones, setListaInvitaciones] = useState([]);
  const [nombreCliente, setNombreCliente] = useState("Invitado");
  const [categoriaEvento, setCategoriaEvento] = useState("XV Años");  // valor default temporal
  const [linkPrevisualizacion, setLinkPrevisualizacion] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [verificandoSesion, setVerificandoSesion] = useState(true);

  // Manejo de Sesion
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUsuarioActual(user);
        setLinkPrevisualizacion(false);
      } else {
        setUsuarioActual(null);
      }
      setVerificandoSesion(false); // ✅ Ahora sí puedes renderizar
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    signOut(auth).then(() => {
      // 🔄 Limpiar todos los estados relacionados con la sesión anterior
      setUsuarioActual(null);
      setNombre("Invitado");
      setInvitadosAdultos(1);
      setInvitadosNiños(0);
      setIncluirNiños(false);
      setTotalInvitados(1);
      setLinkGenerado("");
      setLinkAcortado("");
      setLinkPrevisualizacion(false); // 👈 este es el importante
      setListaInvitaciones([]);
      setNombreCliente("Invitado");
      setCategoriaEvento("XV Años");
      setMostrarMensaje(false);
      setMenuVisible(false);

      // 🧹 Limpiar localStorage si lo deseas
      localStorage.removeItem("nombreInvitado");
      localStorage.removeItem(`tieneAcceso_${usuarioActual?.email}`);
      localStorage.removeItem(`fechaLimite_${usuarioActual?.email}`);
    });
  };


  // Mensaje Genrado y scroll
  useEffect(() => {
    if (linkGenerado) {
      setMostrarMensaje(true);

      // 📌 Ocultar el mensaje después de 5 segundos
      const timer = setTimeout(() => {
        setMostrarMensaje(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [linkGenerado]);

  useEffect(() => {
    const manejarScroll = () => {
      setMostrarMensaje(false); // 📌 Ocultar cuando el usuario hace scroll
    };

    window.addEventListener("scroll", manejarScroll);
    return () => window.removeEventListener("scroll", manejarScroll);
  }, []);


  // Validacion del Cliente y acceso por fecha 
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const cliente = urlParams.get("cliente") || "Invitado";  // ✅ Captura el cliente de la URL
    setNombreCliente(cliente);
  }, []);

  useEffect(() => {
  const obtenerDatosCliente = async () => {
    if (!usuarioActual?.email) return;

    try {
      const categoriasPosibles = ["XV Años", "Eventos Empresariales", "Bodas", "Baby Shower"]; // ajusta las que uses
      for (const categoria of categoriasPosibles) {
        const clientesRef = collection(db, "Clientes", "Categorias", categoria);
        const snapshot = await getDocs(clientesRef);

        for (const docSnap of snapshot.docs) {
          const data = docSnap.data();
          if (data.correo === usuarioActual.email) {
            setNombreCliente(docSnap.id);
            setCategoriaEvento(categoria);
            return;
          }
        }
      }

      console.warn("❌ Cliente no registrado en la nueva estructura.");
    } catch (error) {
      console.error("❌ Error al buscar cliente:", error.message);
    }
  };

  obtenerDatosCliente();
}, [usuarioActual]);

  const CATEGORIA_EVENTO = categoriaEvento;
  const NOMBRE_CLIENTE = nombreCliente;

  const actualizarDatos = async (nombreInvitado, nuevoNombre, nuevaCantidadAdultos, nuevaCantidadNiños, incluirNiños) => {
    if (!nombreInvitado || typeof nombreInvitado !== "string" || nombreInvitado.trim() === "") {
        console.error("❌ Error: `nombreInvitado` no tiene un valor válido.");
        return;
    }

    let nombreLimpio = nuevoNombre.replace(/\s+/g, " ").trim();
    const idInvitacion = generarID(nombreInvitado);
    const nuevoLink = `https://invitacion-cn.web.app/${NOMBRE_CLIENTE}/invitaciones?id=${idInvitacion}`;
    const totalInvitadosCalculado = nuevaCantidadAdultos + (incluirNiños ? nuevaCantidadNiños : 0);    

    // 📌 Corregir la asignación de estados
    setNombre(nombreInvitado);
    console.log("✅ Estado actualizado en App.js:", nombreInvitado);
    setInvitadosAdultos(nuevaCantidadAdultos);
    setInvitadosNiños(nuevaCantidadNiños);
    setTotalInvitados(totalInvitadosCalculado);
    setLinkGenerado(nuevoLink);
    setLinkPrevisualizacion(nuevoLink);
    setMostrarMensaje(true);
    setTimeout(() => setMostrarMensaje(false), 5000);

    try {
        const uid = auth.currentUser?.uid;  // 🔐 Obtén el UID del usuario logueado
        await setDoc(doc(db, CATEGORIA_EVENTO, NOMBRE_CLIENTE, "invitaciones", idInvitacion), {
          id: idInvitacion,
          nombre: nombreInvitado,
          invitadosAdultos: nuevaCantidadAdultos,
          invitadosNiños: nuevaCantidadNiños,
          totalInvitados: totalInvitadosCalculado,
          categoria: CATEGORIA_EVENTO,
          cliente: NOMBRE_CLIENTE,
          uidUsuario: uid,  // ✅ Lo agregas aquí
          link: nuevoLink,
          timestamp: new Date(),
        });

        console.log(`✅ Invitación guardada en '${CATEGORIA_EVENTO}/${NOMBRE_CLIENTE}/invitaciones/${idInvitacion}'`);

        const response = await axios.get(`https://tinyurl.com/api-create.php?url=${nuevoLink}`);
        setLinkAcortado(response.data);
    } catch (error) {
        console.error("❌ Error al guardar la invitación:", error);
    }
  };
  
  const handleCompartir = () => {
    if (!linkGenerado) {
      alert("Primero genera la invitación antes de compartirla.");
      return;
    }

    // 📌 Copia el enlace al portapapeles
    navigator.clipboard.writeText(linkGenerado);

    // 📌 Enviar el enlace por WhatsApp
    const mensajeWhatsApp = `¡Hola! Te comparto la invitación: ${linkGenerado}`;
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=+5619060019&text=${encodeURIComponent(mensajeWhatsApp)}`;

    window.open(urlWhatsApp, "_blank");
  };

  useEffect(() => {
    const validarAccesoPorFecha = async () => {
      if (!usuarioActual?.email) return;

      const keyCorreo = usuarioActual.email; // clave única por cuenta
      const accesoLocal = localStorage.getItem(`tieneAcceso_${keyCorreo}`);
      const fechaLocal = localStorage.getItem(`fechaLimite_${keyCorreo}`);

      const haExpiradoPorFecha = (fecha) => {
        const hoy = new Date().toISOString().split("T")[0];
        const limite = new Date(fecha).toISOString().split("T")[0];
        return hoy > limite;
      };

      if (accesoLocal !== null && fechaLocal !== null) {
        const haExpirado = haExpiradoPorFecha(fechaLocal);
        const tieneAcceso = !haExpirado;

        setUsuarioActual((prev) => ({
          ...prev,
          fechaLimite: fechaLocal,
          tieneAcceso,
        }));

        if (!tieneAcceso) {
          console.warn("⛔ El acceso ha expirado según localStorage.");
        }

        return;
      }

      try {
        const categorias = ["XV Años", "Eventos Empresariales", "Bodas", "Baby Shower"];

        for (const categoria of categorias) {
          const clientesRef = collection(db, "Clientes", "Categorias", categoria);
          const q = query(clientesRef, where("correo", "==", usuarioActual.email));
          const snapshot = await getDocs(q);

          if (!snapshot.empty) {
            const docSnap = snapshot.docs[0];
            const data = docSnap.data();

            const fechaLimite = data.fechaLimite;
            const haExpirado = haExpiradoPorFecha(fechaLimite);
            const tieneAcceso = !haExpirado;

            const keyCorreo = usuarioActual.email; // o email del cliente desde Firestore
            localStorage.setItem(`fechaLimite_${keyCorreo}`, fechaLimite);
            localStorage.setItem(`tieneAcceso_${keyCorreo}`, tieneAcceso.toString());

            setUsuarioActual((prev) => ({
              ...prev,
              fechaLimite,
              tieneAcceso,
              rutaPersonalizada: data.rutaPersonalizada || "",
            }));

            setCategoriaEvento(categoria);
            setNombreCliente(docSnap.id);
            return;
          }
        }

        console.warn("❌ Cliente no encontrado o sin acceso.");
        localStorage.setItem("tieneAcceso", "false");
        setUsuarioActual((prev) => ({ ...prev, tieneAcceso: false }));
      } catch (error) {
        console.error("❌ Error al validar fecha:", error.message);
      }
    };

    validarAccesoPorFecha();
  }, [usuarioActual?.email]);

  return (
  <div className="fondo-app">
    {verificandoSesion ? (
      <div className="loader-contenedor">
        <span className="loader"></span>
        <p>Cargando...</p>
      </div>
    ) : !usuarioActual ? (
      <>
        <Login
          onLogin={(user) => setUsuarioActual(user)}
          setVerificandoSesion={setVerificandoSesion}
          setUsuarioActual={setUsuarioActual}
        />
        <RegistroCliente
          onLogin={(user) => {
            setUsuarioActual(user);
            setVerificandoSesion(false);
          }}
        />
      </>
    ) : (
      <div className="App">
        {mostrarMensaje && (
          <header className="invitacion-creada">
            <h1>🎉 Tu invitación ha sido creada 🎉</h1>
          </header>
        )}

        {menuVisible && (
          <div className="sidebar menu">
            <div className="logo_content">
              <div className="logo">
                <i className="fa-solid fa-user"></i>
                <p className="logo_name">{usuarioActual.email}</p>
              </div>
              <i className="fa-solid fa-bars" id="btn" onClick={() => setMenuVisible(false)}></i>
            </div>

            <ul className="nav">
              <li>
                <a href="#">
                  <i className="fa-solid fa-key"></i>
                  <span className="link_name">Cambiar Contraseña</span>
                </a>
              </li>
              <li>
                <a href="#">
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  <span className="link_name" onClick={handleLogout}>Cerrar sesión</span>
                </a>
              </li>
            </ul>
          </div>
        )}

        {!menuVisible && (
          <div className="toggle-menu">
            <i className="fa-solid fa-bars" onClick={() => setMenuVisible(true)}></i>
          </div>
        )}

        {/* ✅ Validación dinámica por fecha */}
       {usuarioActual?.tieneAcceso ? (
          <FormGen
            actualizarDatos={actualizarDatos}
            handleCompartir={handleCompartir}
            linkGenerado={linkGenerado}
          />
        ) : (
          <div className="bloqueado">
            🚫 Tu acceso ha expirado. Por favor, contacta para renovarlo.
          </div>
        )}


        <MostrarInvitaciones
          CATEGORIA_EVENTO={CATEGORIA_EVENTO}
          NOMBRE_CLIENTE={NOMBRE_CLIENTE}
          setListaInvitaciones={setListaInvitaciones}
          setLinkPrevisualizacion={setLinkPrevisualizacion}
        />

        {linkPrevisualizacion && (
          <section className="contenedor-iframe">
            <h2 className="titulo-iframe">🔍 Vista previa de las invitaciones</h2>
            <iframe
              src={linkPrevisualizacion}
              title="Previsualización de las invitaciones"
              className="iframe-preview"
              allow="fullscreen"
              loading="lazy"
              sandbox="allow-scripts allow-same-origin"
            />
          </section>
        )}
      </div>
    )}
  </div>
);

};

export default App;
