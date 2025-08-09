import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation,useParams  } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore"; // ✅ Import correcto
import { db } from "./Database/firebaseConfig";
import "./invit-deluxe/Invit2.css"
import imagenes from "./assets/imagenes";
import Galeria from "./invit-deluxe/Galeria";
import Itinerario from "./invit-deluxe/Itinerario";
import Countdown from "./invit-deluxe/Countdown";
import AnimacionScroll from "./invit-deluxe/AnimacionScroll";
import FotoSection from "./FotoSection";
import Confirmacion from "./invit-deluxe/Confirmacion";
import AudioController from "./invit-deluxe/AudioController";

const Separador = () => (
    <div className="icono-inv" data-icono="ornamento2"
      style={{
        marginTop: "3%",
        marginBottom: "-5%",
        width: "100%",
        maskImage: `url(${imagenes.ornamentos})`,
        WebkitMaskImage: `url(${imagenes.ornamentos})` // ✅ Para compatibilidad en Chrome/Safari
      }}
    ></div>
)

const Separador3 = () => (
    <div className="icono-inv" data-icono="ornamento3"
      style={{
        marginTop: "5%",
        marginBottom: "5%",
        width: "85%",
        maskImage: `url(${imagenes.ornamento3})`,
        WebkitMaskImage: `url(${imagenes.ornamento3})` // ✅ Para compatibilidad en Chrome/Safari
      }}
    ></div>
)

const SepTitle = () => (
    <div className="icono-title" data-icono="Separador2"
      style={{
        marginTop: "2%",
        marginBottom: "-5%",
        width: "100%",
        maskImage: `url(${imagenes.Separador2})`,
        WebkitMaskImage: `url(${imagenes.Separador2})` // ✅ Para compatibilidad en Chrome/Safari
      }}
    ></div>
)

const ImageSep = ( )=> (
<div className="imagensepa">
  <img className="decoracion imagen-v" src={imagenes.img11} alt="Decoración" />
</div>
)

const cuenta = "651651618681"; // Número de cuenta
const copiarCuenta = () => {
  navigator.clipboard.writeText(cuenta)
    .then(() => alert("Número de cuenta copiado 📋"))
    .catch((err) => console.error("Error al copiar: ", err));
};

// Componente Ubicacion
const Ubicacion = ({ titulo, direccion, hora, imagen, link }) => (
  <a className="ubicacion" href={link} target="_blank" rel="noopener noreferrer">
    <div>
        <img className="foto aparecer" src={imagen} alt={`Ubicación: ${titulo}`} />
      <p className="lugar">{titulo}</p>
      <span className="direccion">{direccion}</span>
      <span className="hora aparecer">{hora}</span>
      <div className="boton aparecer">Ir al Mapa</div>
    </div>
  </a>
);

const ConfirmacionMemo = React.memo(Confirmacion);

function Invitacion3({ totalInvitadosInvitacion }) {
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [mostrarSobre, setMostrarSobre] = useState(true);
  const [mostrarBoton, setMostrarBoton] = useState(true);

  const { cliente } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const idInvitacion = useMemo(() => query.get("id")?.trim().toLowerCase() || "", [query]);

  const [nombreInvitacion, setNombreInvitacion] = useState(() => {
    return localStorage.getItem("nombreInvitado") || "Querido invitado";
  });

  const nombreNormalizado = nombreInvitacion.trim().toLowerCase();
  const esNombreGenerico = [
    "estas invitado",
    "invitado no registrado",
    "invitado desconocido",
    "querido invitado"
  ].includes(nombreNormalizado);

  useEffect(() => {
    // Solo consultar Firestore si NO hay nombre en localStorage
    if (localStorage.getItem("nombreInvitado")) return;

    if (!/^[a-zA-Z0-9_-]{3,}$/.test(idInvitacion)) {
      console.warn("ID inválido detectado");
      setNombreInvitacion("Estas invitado");
      return;
    }

    const obtenerNombre = async () => {
    if (!idInvitacion || !cliente) return;

    try {
      const categorias = ["XV Años", "Eventos Empresariales", "Bodas"]; // ajusta según tu sistema

      let categoriaEvento = null;

      for (const categoria of categorias) {
        const ref = doc(db, "Clientes", "Categorias", categoria, cliente);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          categoriaEvento = categoria;
          break;
        }
      }

      if (!categoriaEvento) {
        console.warn("❌ Cliente no encontrado en Firestore.");
        setNombreInvitacion("Invitado no registrado");
        return;
      }

      const invitacionRef = doc(db, categoriaEvento, cliente, "invitaciones", idInvitacion);
      const invitacionSnap = await getDoc(invitacionRef);

      if (invitacionSnap.exists()) {
        const nombre = invitacionSnap.data()?.nombre;
        setNombreInvitacion(nombre || "Invitado especial");
        localStorage.setItem("nombreInvitado", nombre || "Invitado especial");
      } else {
        setNombreInvitacion("Invitado no registrado");
      }
    } catch (error) {
      console.error("❌ Error al recuperar el nombre:", error);
      setNombreInvitacion("Invitado desconocido");
    }
  };

  obtenerNombre();
}, [idInvitacion, cliente]);
  

  return (
  <>
    <AudioController />
    {mostrarSobre && (
      <div className={`sobre ${sobreAbierto ? "abierto" : ""}`} translate="no">
        <div className="up" id="sobre_hoja1"></div>
          <button className={`blason ${!mostrarBoton ? "oculto" : ""}`}
            onClick={() => {
              window.dispatchEvent(new Event("reproducir-audio"));
              setTimeout(() => setMostrarBoton(false), 500); // ⏱️ Aplica clase 'oculto' tras 1s
              setSobreAbierto(true);
              setTimeout(() => setMostrarSobre(false), 3400);
            }}
          >
            <ConfirmacionMemo
              invitacion={{
                nombre: (
                  <div className={esNombreGenerico ? "nombre-centrado" : ""} translate="no">
                    {nombreInvitacion}
                    <br />
                    {!esNombreGenerico && <h4 className="portada">Estás invitado</h4>}
                  </div>
                ),
              }}
            />
            <h5 className="click">¡Haz Click aqui!</h5>

          </button>

        <div className="down" id="sobre_hoja2"></div>
      </div>
    )}

    {/* Contenido cargado desde el inicio pero oculto hasta abrir el sobre */}
    <div
      className="contenido invitacion3-tema" translate="no"
      style={{
        opacity: sobreAbierto ? 1 : 0,
        pointerEvents: sobreAbierto ? "auto" : "none",
        transition: "opacity 0.5s ease"
        
      }}
    >
      {<div className="contenido" translate="no">
          {/* MARK: Decoraciones */}
          <div className="extremos">
            <div className="top">
              <img className="top-img" src={imagenes.flor1} alt="Decoración superior" />
            </div>
            <div className="bottom">
              <img className="bottom-img" src={imagenes.flor2} alt="Decoración inferior" />
            </div>
          </div>

          {/* MARK: Nombre */}
          <div className="encabezado">
            <h1 className="evento">XV</h1>
            <SepTitle />
            <h2 className="nombre-principal">Briseyda</h2>
          </div>

          {/* MARK: Foto */}
          <div className="foto aparecer">
            <img className="principal" src={imagenes.XV} alt="Foto de la festejada" />
            <img className="aro-foto" src={imagenes.AroFlor} alt="Aro decorativo" />
          </div>

          <div className="Contend">
            <img className="Fecha" src={imagenes.fecha2} alt="fecha" />
          </div>

          <h1 className="reloj">¡Cuenta regresiva para el evento!</h1>
          <Countdown day={0} month={"diciembre"} year={0} time={"0"} />
          <Separador3 />

          {/* MARK: Frases */}
          <AnimacionScroll className="frase show-p-y">
            <h1 className="invit">Estas invitado a mis<br />XV años</h1>
            "Hoy quiero invitarte a un día lleno de alegría, música y celebración.
            Mis XV años son un momento que atesoraré para siempre, y quiero vivirlo contigo
            y en compañía de mis familiares."
          </AnimacionScroll>

          <Separador3 />

          {/* MARK: Ubicaciones */}
          <AnimacionScroll className="iglesia show-p-x">
          <Ubicacion
            titulo="Rectoría Nuestra Señora Del Refugio"
            direccion="Av. Insurgentes Manzana 001, Capula, 54603 Tepotzotlán, Méx."
            hora="3:45 PM"
            imagen={imagenes.iglesia}
            link="https://maps.app.goo.gl/vYWZwYKARzAEtoH59"
          />
          </AnimacionScroll>

          <AnimacionScroll className="recepcion show-n-x">
          <Ubicacion
            titulo="Jardín El Paraíso"
            direccion="Av Ignacio Zaragoza 9, Sta Maria Tianguistengo, 54710 Cuautitlán Izcalli, Méx."
            hora="5:10 PM"
            imagen={imagenes.Salon22}
            link="https://maps.app.goo.gl/j22ygmXXVu367w5u5"
          />
          </AnimacionScroll>

          <ImageSep />

          {/* MARK: Familia*/}
          <div className="familia">
            <AnimacionScroll className="Padres show-n-x">
              <h1 className="frase2">Con la bendicion de Dios<br/>&<br/>en compañia de:</h1>
              <h1 className="nombre">Mis Padres</h1>
              <Separador3 />
              <p className="parent texto">Angel Ortega Paredez<br />&<br />Jazmin Vazquez</p>
            </AnimacionScroll>
            <AnimacionScroll className="Padrinos show-p-x">
              <h1 className="nombre">Mis Padrinos</h1>
              <Separador3 />
              <p className="parent texto">Jose Miguel Monroy<br />&<br />Aracely Ortega Paredez</p>
            </AnimacionScroll>
          </div>

          {/* MARK: SPI */}
          <div className="imagensepa">
            <img className="decoracion imagen-v" src={imagenes.img12} alt="Decoración" />
          </div>

          {/* MARK: Separador*/}
          <Separador3 />

          <Galeria />
          <Separador3 />

          {/* MARK: SPI */}
          <div className="imagensepa">
            <img className="decoracion imagen-v" src={imagenes.img12} alt="Decoración" />
          </div>

          <h2 className="ith2">Programa del Evento</h2>
          <Separador3 />
          <Itinerario />
          <Separador3 />

          {/* MARK: SPI */}
          <div className="imagensepa">
            <img className="decoracion imagen-v" src={imagenes.img12} alt="Decoración" />
          </div>

          {/* MARK: Regalos */}
          <AnimacionScroll className="MesaRegalos show-n-y">
            <div className="banco">
              <h2 className="ith2 textstyle">Mesa de Regalos</h2>
              <Separador3/>
              <p>No es necesario estar cerca para hacer sentir el amor y cariño.
                Si lo prefieres, puedes hacer una transferencia bancaria como regalo 
                a la siguiente cuenta:
              </p>
              <h1 className="textstyle">Datos Bancarios</h1>
              <div className="tarjetas" data-icono="tarjetas"
                style={{
                  marginTop: "5%",
                  marginBottom: "5%",
                  width: "85%",
                  maskImage: `url(${imagenes.tarjetas})`,
                  WebkitMaskImage: `url(${imagenes.tarjetas})` // ✅ Para compatibilidad en Chrome/Safari
                }}
              ></div>              
              <h2 className="textstyle">Cuenta BBVA:</h2>
              <h2 className="copy textstyle">{cuenta}</h2>
              <button className="boton-copiar" onClick={copiarCuenta}>Copiar</button>
              <h2 className="textstyle">Beneficiaria:</h2>
              <h1 className="textstyle">Briseyda Ortega Vazquez</h1>
            </div>
          </AnimacionScroll>
          <Separador3/>
          {/* MARK: Confirmacion */}
          <AnimacionScroll className="frase show-p-y">
          <h2 className="ith2">Confirme su Asistencia</h2>
          </AnimacionScroll>
          <div className="extra">
            <h1 className="informacion" >Favor de confirmar su asistencia antes del 10 de Diciembre</h1>
          </div>
          
          <Confirmacion
            buttonText11="Confirmar asistencia"
            buttonLink11="https://api.whatsapp.com/send?phone=+5619060019&text=Asistire"
            buttonText22="No puedo asistir"
            buttonLink22="https://api.whatsapp.com/send?phone=+5619060019&text=No%20Asistir%C3%A9%20"
            
          />
          {/* <Separador3/> */}
        </div>}
    </div>
  </>
);

}

export default Invitacion3;
