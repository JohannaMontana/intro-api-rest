const API_URL = 'https://68bb0de484055bce63f104ac.mockapi.io/api/v1/dispositivos_IoT';

// Mapear todos los estados a colores
function getStatusClass(status) {
    switch (status) {
        case 'ADELANTE':
        case 'ADELANTE DERECHA':
        case 'ADELANTE IZQUIERDA':
            return 'bg-success';
        case 'ATRAS':
        case 'ATRAS DERECHA':
        case 'ATRAS IZQUIERDA':
            return 'bg-warning';
        case 'DETENER':
            return 'bg-danger';
        case 'GIRO 90 GRADOS DERECHA':
        case 'GIRO 90 GRADOS IZQUIERDA':
        case 'GIRO 360 GRADOS DERECHA':
        case 'GIRO 360 GRADOS IZQUIERDA':
            return 'bg-info';
        default:
            return 'bg-secondary';
    }
}

// Formatear fecha
function formatDate(dateStr) {
    const timestamp = Date.parse(dateStr);
    if (!isNaN(timestamp)) return new Date(timestamp).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
    
    // Si es formato local "dd/mm/yyyy, hh:mm:ss am/pm"
    const parts = dateStr.split(/[\/, :]+/);
    if (parts.length >= 7) {
        let day = parseInt(parts[0]);
        let month = parseInt(parts[1]) - 1;
        let year = parseInt(parts[2]);
        let hour = parseInt(parts[3]);
        const minute = parseInt(parts[4]);
        const second = parseInt(parts[5]);
        const ampm = parts[6].toLowerCase();
        if (ampm.includes('p') && hour < 12) hour += 12;
        if (ampm.includes('a') && hour === 12) hour = 0;
        return new Date(year, month, day, hour, minute, second).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
    }
    return dateStr;
}

// Parsear fecha a timestamp para ordenar
function parseDate(dateStr) {
    const ts = Date.parse(dateStr);
    if (!isNaN(ts)) return ts;
    // Formato local
    const parts = dateStr.split(/[\/, :]+/);
    if (parts.length >= 7) {
        let day = parseInt(parts[0]);
        let month = parseInt(parts[1]) - 1;
        let year = parseInt(parts[2]);
        let hour = parseInt(parts[3]);
        const minute = parseInt(parts[4]);
        const second = parseInt(parts[5]);
        const ampm = parts[6].toLowerCase();
        if (ampm.includes('p') && hour < 12) hour += 12;
        if (ampm.includes('a') && hour === 12) hour = 0;
        return new Date(year, month, day, hour, minute, second).getTime();
    }
    return 0;
}

// Cargar datos
async function loadMonitorData() {
    try {
        const res = await fetch(API_URL);
        const data = await res.json();

        // Ordenar descendente por fecha
        const sorted = data.sort((a, b) => parseDate(b.date) - parseDate(a.date));

        // Tabla últimos 10
        const lastTen = sorted.slice(0, 10);
        const tableBody = document.getElementById('monitorTableBody');
        tableBody.innerHTML = '';
        lastTen.forEach(d => {
            const statusClass = getStatusClass(d.status);
            tableBody.innerHTML += `
                <tr>
                    <td>${d.name}</td>
                    <td><span class="badge ${statusClass} status-badge">${d.status}</span></td>
                    <td>${d.ip}</td>
                    <td>${formatDate(d.date)}</td>
                </tr>
            `;
        });

        // Círculo → el más reciente
        const lastDevice = sorted[0];
        const lastStatusCircle = document.getElementById('lastStatusCircle');
        lastStatusCircle.textContent = lastDevice?.status || 'Sin datos';
        lastStatusCircle.className = `rounded-circle d-flex align-items-center justify-content-center mx-auto status-badge ${getStatusClass(lastDevice?.status || '')}`;
    } catch (err) {
        console.error('Error cargando monitor:', err);
    }
}

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadMonitorData();
    setInterval(loadMonitorData, 2000);
});
