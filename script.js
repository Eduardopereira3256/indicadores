const CLIENT_ID = "757492209460-bdrra2bbdjnaar1lhlcj68q8dqcbksma.apps.googleusercontent.com"; // Reemplaza con tu Client ID
const API_KEY = "AIzaSyBWtpeEFdIHMkp5kHAUd18isMFSMq2r8CE"; // Reemplaza con tu API Key
const SHEET_ID = "1d-xYuOKUTuqvlQoJtNiKcuv5iK_4L7Kt2RMayUB8e08"; // Reemplaza con tu ID de hoja
const DISCOVERY_DOC = "https://sheets.googleapis.com/$discovery/rest?version=v4";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

// Botones y elementos
const authorizeButton = document.getElementById("authorize_button");
const signoutButton = document.getElementById("signout_button");
const formulario = document.getElementById("miFormulario");

let token;

function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

async function initClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: [DISCOVERY_DOC],
    scope: SCOPES,
  });

  const GoogleAuth = gapi.auth2.getAuthInstance();

  GoogleAuth.isSignedIn.listen(updateSigninStatus);
  updateSigninStatus(GoogleAuth.isSignedIn.get());

  authorizeButton.onclick = () => GoogleAuth.signIn();
  signoutButton.onclick = () => GoogleAuth.signOut();
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorizeButton.style.display = "none";
    signoutButton.style.display = "block";
    token = gapi.auth.getToken().access_token;
    console.log("Token obtenido:", token);
  } else {
    authorizeButton.style.display = "block";
    signoutButton.style.display = "none";
  }
}

async function agregarDatos(datos) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Hoja%201:append?valueInputOption=USER_ENTERED`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Usa el token para autenticarte
      },
      body: JSON.stringify({
        values: [datos], // Los datos a agregar
      }),
    });

    if (!response.ok) {
      throw new Error(`Error al agregar datos: ${response.status}`);
    }

    const result = await response.json();
    console.log("Datos agregados exitosamente:", result);
    document.getElementById("output").innerText = "Datos agregados exitosamente";
  } catch (error) {
    console.error("Error:", error);
    document.getElementById("output").innerText = "Error al agregar datos";
  }
}

// Manejar el envío del formulario
formulario.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = document.querySelector("#id").value;
  const nombreIndicador = document.querySelector("#nombreIndicador").value;
  const trazadora = document.querySelector("#trazadora").value;
  const mes = document.querySelector("#mes").value;
  const valorAcumulado = document.querySelector("#valorAcumulado").value;
  const porcentajeAcumulado = document.querySelector("#porcentajeAcumulado").value;
  const meta = document.querySelector("#meta").value;

  agregarDatos([id, nombreIndicador, trazadora, mes, valorAcumulado, porcentajeAcumulado, meta]);
});

// Iniciar la carga del cliente
handleClientLoad();
