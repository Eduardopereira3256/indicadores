const CLIENT_ID = "757492209460-bdrra2bbdjnaar1lhlcj68q8dqcbksma.apps.googleusercontent.com"; // Reemplaza con tu Client ID
const API_KEY = "AIzaSyBWtpeEFdIHMkp5kHAUd18isMFSMq2r8CE"; // Reemplaza con tu API Key
const DISCOVERY_DOC = "https://sheets.googleapis.com/$discovery/rest?version=v4";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

const SPREADSHEET_ID = "1d-xYuOKUTuqvlQoJtNiKcuv5iK_4L7Kt2RMayUB8e08"; // ID de tu hoja de Google Sheets
const RANGE = "Hoja 1"; // Nombre de la hoja donde están los datos

function handleClientLoad() {
  gapi.load("client:auth2", initClient);
}

function initClient() {
  gapi.client.init({
    apiKey: API_KEY,
    clientId: CLIENT_ID,
    discoveryDocs: [DISCOVERY_DOC],
    scope: SCOPES,
  }).then(() => {
    const GoogleAuth = gapi.auth2.getAuthInstance();

    GoogleAuth.isSignedIn.listen(updateSigninStatus);
    updateSigninStatus(GoogleAuth.isSignedIn.get());

    document.getElementById("authorize_button").onclick = () => GoogleAuth.signIn();
    document.getElementById("signout_button").onclick = () => GoogleAuth.signOut();

    document.getElementById("indicator-form").addEventListener("submit", addIndicator);
  }).catch((error) => {
    console.error("Error al inicializar el cliente:", error);
  });
}

function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    document.getElementById("authorize_button").style.display = "none";
    document.getElementById("signout_button").style.display = "block";
    loadIndicators();
  } else {
    document.getElementById("authorize_button").style.display = "block";
    document.getElementById("signout_button").style.display = "none";
  }
}

function loadIndicators() {
  gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
  }).then((response) => {
    const rows = response.result.values || [];
    const container = document.getElementById("data-container");
    container.innerHTML = rows.map(row => `<p>${row[0]}: ${row[1]}</p>`).join("");
  }).catch((error) => {
    console.error("Error al cargar los indicadores:", error);
  });
}

function addIndicator(event) {
  event.preventDefault();
  const nombre = document.getElementById("nombre").value;
  const valor = document.getElementById("valor").value;

  gapi.client.sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: RANGE,
    valueInputOption: "RAW",
    resource: {
      values: [[nombre, valor]],
    },
  }).then(() => {
    loadIndicators();
    document.getElementById("indicator-form").reset();
  }).catch((error) => {
    console.error("Error al añadir el indicador:", error);
  });
}
