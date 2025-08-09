import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Asegúrate de que la ruta es correcta

const generarID = async (nombre) => {
  const prefijo = "SB";
  let numeroIncremental = 1;

  // 📌 Consultar el último número usado
  const docRef = doc(db, "configuracion", "contador");
  const docSnap = await getDocs(collection(db, "configuracion"));

  if (!docSnap.empty) {
    const ultimoNumero = docSnap.docs[0].data().ultimoNumero;
    numeroIncremental = ultimoNumero + 1;
  }

  const nuevoID = `${prefijo}${numeroIncremental}${nombre.replace(/\s/g, "")}`;

  // 📌 Guardar el nuevo número incremental en Firebase
  await setDoc(docRef, { ultimoNumero: numeroIncremental });

  return nuevoID;
};

export default generarID;
