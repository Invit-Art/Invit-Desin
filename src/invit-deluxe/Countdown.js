import React, { useState, useEffect } from "react";

// Traducción de meses de español a inglés
const translateMonth = (month) => {
  const months = {
    enero: "January",
    febrero: "February",
    marzo: "March",
    abril: "April",
    mayo: "May",
    junio: "June",
    julio: "July",
    agosto: "August",
    septiembre: "September",
    octubre: "October",
    noviembre: "November",
    diciembre: "December",
  };
  return months[month.toLowerCase()] || month;
};

const Countdown = ({ day, month, year, time }) => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    // Validaciones para evitar errores
    if (!day || !month || !year || !time) {
      console.error("Error: Se requieren todos los parámetros (día, mes, año, hora)");
      return;
    }

    // Separar hora y verificar formato correcto
    const timeParts = time.match(/^(\d{1,2}):(\d{2})\s?(am|pm)$/i);
    if (!timeParts) {
      console.error("Error: Formato de hora incorrecto. Usa 'HH:MM AM/PM'");
      return;
    }

    const hour = parseInt(timeParts[1], 10);
    const minutes = timeParts[2];
    const period = timeParts[3].toLowerCase();

    // Convertir a formato de 24 horas
    let hour24 = hour;
    if (period === "pm" && hour !== 12) hour24 += 12;
    else if (period === "am" && hour === 12) hour24 = 0;

    const countDownDate = new Date(
      `${translateMonth(month)} ${day}, ${year} ${hour24}:${minutes}:00`
    ).getTime();

    if (isNaN(countDownDate)) {
      console.error("Error: Fecha inválida generada");
      return;
    }

    // Iniciar el intervalo para actualizar el conteo regresivo
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const timeRemaining = countDownDate - now;

      if (timeRemaining < 0) {
        clearInterval(interval);
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setCountdown({
          days: Math.floor(timeRemaining / (1000 * 60 * 60 * 24)),
          hours: Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timeRemaining % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [day, month, year, time]);

  return (
    <div className="cuenta aparecer">
      <p className="segmento">
        <span className="numero">{countdown.days}</span>
        <span className="unidad"> Días</span>
      </p>
      <p className="segmento">
        <span className="numero">{countdown.hours}</span>
        <span className="unidad"> Horas</span>
      </p>
      <p className="segmento">
        <span className="numero">{countdown.minutes}</span>
        <span className="unidad"> Minutos</span>
      </p>
      <p className="segmento">
        <span className="numero">{countdown.seconds}</span>
        <span className="unidad"> Segundos</span>
      </p>
    </div>
  );
};

export default Countdown;
