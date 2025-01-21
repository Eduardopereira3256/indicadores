let tokenClient;
let gapiInited = false;
let gisInited = false;

const CLIENT_ID = '757492209460-bdrra2bbdjnaar1lhlcj68q8dqcbksma.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBWtpeEFdIHMkp5kHAUd18isMFSMq2r8CE';
const SHEET_ID = '1d-xYuOKUTuqvlQoJtNiKcuv5iK_4L7Kt2RMayUB8e08';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';

function gapiLoaded() {
  gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
  await gapi.client.init({
    apiKey: API_KEY,
    discoveryDocs: ['https://sheets.googleapis.com/$discovery/rest?version=v4'],
  });
  gapiInited = true;
  maybeEnableButtons();
}

function gisLoaded() {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: '', // Manejar el token después
  });
  gisInited = true;
  maybeEnableButtons();
}

function maybeEnableButtons() {
  if (gapiInited && gisInited) {
    document.getElementById('btn-agregar').disabled = false;
  }
}

async function cargarDatos() {
  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: 'Hoja 1',
    });

    const rows = response.result.values || [];
    const tbody = document.getElementById('tabla-indicadores').querySelector('tbody');
    tbody.innerHTML = ''; // Limpiar tabla
    rows.slice(1).forEach(row => {
      const tr = document.createElement('tr');
      row.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  } catch (error) {
    console.error('Error al cargar datos:', error);
  }
}

async function agregarIndicador() {
  if (!gapiInited || !gisInited) {
    alert('La API de Google no está lista.');
    return;
  }

  tokenClient.callback = async (resp) => {
    if (resp.error) {
      throw resp;
    }
    const id = document.getElementById('id').value;
    const nombre = document.getElementById('nombre').value;
    const trazadora = document.getElementById('trazadora').value;
    const mes = document.getElementById('mes').value;
    const valor = document.getElementById('valor').value;
    const porcentaje = document.getElementById('porcentaje').value;
    const meta = document.getElementById('meta').value;

    const nuevoIndicador = [id, nombre, trazadora, mes, valor, porcentaje, meta];

    try {
      await gapi.client.sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: 'Hoja 1!A:G',
        valueInputOption: 'USER_ENTERED',
        resource: { values: [nuevoIndicador] },
      });
      alert('Indicador agregado exitosamente.');
      cargarDatos(); // Refrescar datos
    } catch (error) {
      alert(`Error al agregar el indicador: ${error.message}`);
    }
  };

  if (!gapi.client.getToken()) {
    tokenClient.requestAccessToken({ prompt: 'consent' });
  } else {
    tokenClient.callback('');
  }
}

// Cargar datos al inicio
window.onload = () => {
  gapiLoaded();
  gisLoaded();
};
