import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import FormGen from "./componentes/FormGen"
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Invitacion2 from './Invitacion2';
import Invitacion3 from './Invitacion3';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Invitacion3 />} />
      <Route path="/:categoria/:cliente" element={<App />} />
    </Routes>
  </BrowserRouter>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();


// rm -rf node_modules/.cache
// npm run build
// npm start

// <BrowserRouter> 
//   <Routes> 
//     {/* Para ti: Generar invitaciones */} 
//     <Route path="/" element={<App />} /> 
    
//     {/* Para invitados: Ver la invitación con nombre */} 
//     <Route path="/:cliente/invitaciones" element={<Invitacion3 />} /> 
//   </Routes> 
// </BrowserRouter>
