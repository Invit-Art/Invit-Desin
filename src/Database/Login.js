import React, { useState } from "react";
import { db } from "./firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import "./Login.css";

const Login = ({ onLogin, setVerificandoSesion, setUsuarioActual }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);

  const obtenerDatosCliente = async (email) => {
    const categorias = ["XV Años", "Eventos Empresariales", "Bodas", "Baby Shower"];
    for (const categoria of categorias) {
      const clientesRef = collection(db, "Clientes", "Categorias", categoria);
      const snapshot = await getDocs(clientesRef);

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        if (data.correo === email) {
          return data; // ✅ contiene rutaPersonalizada y fechaLimite
        }
      }
    }
    throw new Error("Cliente no registrado en Firestore.");
  };

  const handleLogin = async () => {
    try {
      setVerificandoSesion(true);
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const user = userCred.user;

      const clienteData = await obtenerDatosCliente(user.email);

      // ✅ Validar si la fechaLimite existe y está bien formateada
      const limite = clienteData?.fechaLimite
        ? new Date(clienteData.fechaLimite)
        : null;
      const ahora = new Date();
      const tieneAcceso = limite && ahora <= limite;

      // ✅ Enviar al padre toda la info necesaria
      const usuarioExtendido = {
        ...user,
        ...clienteData,
        fechaLimite: clienteData.fechaLimite,
        tieneAcceso: ahora <= new Date(clienteData.fechaLimite),
      };
      console.log("🔍 usuarioExtendido:", usuarioExtendido);


      setUsuarioActual(usuarioExtendido);
      onLogin(usuarioExtendido);
      setVerificandoSesion(false);
    } catch (err) {
      alert("❌ El correo o contraseña son incorrectos");
      setVerificandoSesion(false);
    }
  };

  return (
    <div className="fondo-login">
      <div className="wrapper">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <h2>Iniciar sesión</h2>

          <div className="input-field">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>Correo</label>
          </div>

          <div className="input-field password-field">
            <input
              type={mostrarPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <label>Contraseña</label>
            <span
              className="toggle-password"
              onClick={() => setMostrarPassword((prev) => !prev)}
            >
              <i
                className={`fa-solid ${
                  mostrarPassword ? "fa-eye" : "fa-eye-slash"
                }`}
              ></i>
            </span>
          </div>

          <div className="forget">
            <a href="#">¿Olvidaste tu contraseña?</a>
          </div>

          <button className="login" type="submit">
            Iniciar sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
