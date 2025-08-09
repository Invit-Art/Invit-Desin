import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, setDoc, doc, getDocs, getDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const RegistroCliente = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreCliente, setNombreCliente] = useState("");
  const [categoria, setCategoria] = useState("XV Años"); // Puedes hacer esto dinámico
  const [fechaEvento, setFechaEvento] = useState("");

  const registrarCliente = async (email, categoria, nombreCliente) => {
    const ref = doc(db, "Clientes", "Categorias", categoria, nombreCliente);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        throw new Error(`⚠️ Ya existe un cliente llamado "${nombreCliente}" en la categoría "${categoria}".`);
    }

    await setDoc(ref, {
        nombreCliente,
        categoria,
        correo: email,
        rutaPersonalizada: `/${categoria}/${nombreCliente}/invitaciones`,
    });

    console.log(`✅ Cliente guardado en /Clientes/Categorias/${categoria}/${nombreCliente}`);
    };

  const generarNombreClienteUnico = async (categoria, nombreClienteBase, correo) => {
  const clientesRef = collection(db, "Clientes", "Categorias", categoria);
  const snapshot = await getDocs(clientesRef);

  let variantes = snapshot.docs
    .filter(doc => doc.id.startsWith(nombreClienteBase))
    .map(doc => ({
      id: doc.id,
      correo: doc.data()?.correo || ""
    }));

  // ⚠️ Si ya existe una coincidencia exacta de nombre + correo → abortar
  const yaRegistrado = variantes.find(v => v.id === nombreClienteBase && v.correo === correo);
  if (yaRegistrado) {
    throw new Error(`🚫 Este cliente ya fue registrado con ese correo.`);
  }

  // 🌀 Buscar variante libre tipo Samuel0001, Samuel0002, ...
  let contador = 1;
  let nuevoNombre = nombreClienteBase;
  while (variantes.some(v => v.id === nuevoNombre)) {
    const sufijo = String(contador).padStart(4, "0");
    nuevoNombre = `${nombreClienteBase}${sufijo}`;
    contador++;
  }

  return nuevoNombre;
};


  const handleRegister = async () => {
  if (!email || !password || !nombreCliente || !categoria) {
    alert("⚠️ Por favor, completa todos los campos.");
    return;
  }

  try {
    const nombreClienteBase = nombreCliente.trim().replace(/\s+/g, "-");
    const nombreFinal = await generarNombreClienteUnico(categoria, nombreClienteBase, email);

    const userCred = await createUserWithEmailAndPassword(auth, email, password);

    const ref = doc(db, "Clientes", "Categorias", categoria, nombreFinal);
    await setDoc(ref, {
      nombreCliente: nombreFinal,
      categoria,
      correo: email,
      rutaPersonalizada: `/${categoria}/${nombreFinal}/invitaciones`,
      fechaLimite: new Date(fechaEvento).toISOString()
    });

    console.log(`✅ Cliente guardado en /Clientes/Categorias/${categoria}/${nombreFinal}`);
    alert(`✅ Registro exitoso: "${nombreFinal}"`);
    onLogin(userCred.user);
  } catch (err) {
    alert("❌ Error: " + err.message);
  }
};
  
  return (
    <div>
      <h2>📝 Registro de Cliente</h2>
      <input
        value={nombreCliente}
        onChange={(e) => setNombreCliente(e.target.value)}
        placeholder="Nombre del cliente (ej. Samuel)"
      />
      <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
        <option value="XV Años">XV Años</option>
        <option value="Eventos Empresariales">Eventos Empresariales</option>
        <option value="Bodas">Bodas</option>
        <option value="Baby Shower">Baby Shower</option>
        <option value="Graduación">Graduación</option>
        <option value="Fiestas/Cumpleaños">Fiestas/Cumpleaños</option>
      </select>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        type="password"
      />
      <input
        type="date"
        value={fechaEvento}
        onChange={(e) => setFechaEvento(e.target.value)}
        placeholder="Fecha del evento"
      />

      <button onClick={handleRegister}>Registrarse</button>
    </div>
  );
};

export default RegistroCliente;
