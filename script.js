// Configuración de la API
const GOOGLE_SHEET_ID = "1d-xYuOKUTuqvlQoJtNiKcuv5iK_4L7Kt2RMayUB8e08"; // Tu ID de hoja
const API_KEY = "AIzaSyBWtpeEFdIHMkp5kHAUd18isMFSMq2r8CE"; // Tu clave de API
const ACCESS_TOKEN = "TU_ACCESS_TOKEN"; // Necesitarás un token OAuth para escribir en la hoja

// URL base para la API
const API_URL = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/Hoja%201:append?valueInputOption=USER_ENTERED`;

// Función para agregar datos a Google Sheets
async function agregarDatos(nuevosDatos) {
  try {
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ACCESS_TOKEN}`, // Se necesita autenticación OAuth
      },
      body: JSON.stringify({
        values: [nuevosDatos], // Datos que se enviarán como nueva fila
      }),
    });

    if (!respuesta.ok) {
      throw new Error(`Error al agregar datos: ${respuesta.statusText}`);
    }

    const datos = await respuesta.json();
    console.log("Datos agregados correctamente:", datos);
  } catch (error) {
    console.error("Error al agregar datos:", error);
  }
}

// Ejemplo: Llamada a la función al enviar el formulario
document.querySelector("#miFormulario").addEventListener("submit", (event) => {
  event.preventDefault();

  // Recoger los datos del formulario
  const id = document.querySelector("#id").value;
  const nombreIndicador = document.querySelector("#nombreIndicador").value;
  const trazadora = document.querySelector("#trazadora").value;
  const mes = document.querySelector("#mes").value;
  const valorAcumulado = document.querySelector("#valorAcumulado").value;
  const porcentajeAcumulado = document.querySelector("#porcentajeAcumulado").value;
  const meta = document.querySelector("#meta").value;

  // Llamar a la función con los datos del formulario
  agregarDatos([id, nombreIndicador, trazadora, mes, valorAcumulado, porcentajeAcumulado, meta]);
});
