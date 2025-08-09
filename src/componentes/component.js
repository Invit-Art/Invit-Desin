export const compartirPorWhatsApp = (link, nombre) => {
  const mensaje = `¡Hola ${nombre}! Te comparto tu invitación personalizada: ${link}`;
  const numeroDestino = "5215619060019"; // ← ajusta con número real si quieres envío directo
  const whatsappURL = `https://api.whatsapp.com/send?phone=${numeroDestino}&text=${encodeURIComponent(mensaje)}`;

  window.open(whatsappURL, "_blank");
};

export const copiarAlPortapapeles = (link) => {
  navigator.clipboard.writeText(link);
  alert("✅ Enlace copiado al portapapeles.");
};
