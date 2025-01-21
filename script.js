// ID de la hoja de Google Sheets y API Key (configúralo con tus datos)
const SHEET_ID = 'TU_GOOGLE_SHEET_ID';
const API_KEY = 'TU_GOOGLE_API_KEY';
const SHEET_NAME = 'Hoja1';

// Función para cargar los datos desde Google Sheets
async function cargarDatos() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  const rows = data.values.slice(1); // Excluir encabezados
  const tbody = document.getElementById('tabla-indicadores').querySelector('tbody');
  tbody.innerHTML = ''; // Limpiar tabla
  rows.forEach(row => {
    const tr = document.createElement('tr');
    row.forEach(cell => {
      const td = document.createElement('td');
      td.textContent = cell;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// Función para agregar un nuevo indicador
async function agregarIndicador() {
  const id = document.getElementById('id').value;
  const nombre = document.getElementById('nombre').value;
  const trazadora = document.getElementById('trazadora').value;
  const mes = document.getElementById('mes').value;
  const valor = document.getElementById('valor').value;
  const porcentaje = document.getElementById('porcentaje').value;
  const meta = document.getElementById('meta').value;

  const nuevoIndicador = [id, nombre, trazadora, mes, valor, porcentaje, meta];

  // Actualizar la hoja de cálculo (requiere un servicio backend o autenticación avanzada)
  console.log('Enviar datos a la hoja:', nuevoIndicador);

  // Refrescar los datos (simulado)
  const tbody = document.getElementById('tabla-indicadores').querySelector('tbody');
  const tr = document.createElement('tr');
  nuevoIndicador.forEach(cell => {
    const td = document.createElement('td');
    td.textContent = cell;
    tr.appendChild(td);
  });
  tbody.appendChild(tr);

  // Limpiar los campos del formulario
  document.querySelectorAll('.form-container input').forEach(input => input.value = '');
}

document.getElementById('btn-agregar').addEventListener('click', agregarIndicador);

// Cargar datos al inicio
cargarDatos();
