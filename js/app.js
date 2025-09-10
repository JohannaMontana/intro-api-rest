const API_URL = 'https://68bb0de484055bce63f104ac.mockapi.io/api/v1/dispositivos_IoT';

// Normaliza la fecha para que siempre devuelva un Date válido
function parseDate(dateStr) {
    const parsed = new Date(dateStr);
    if (!isNaN(parsed)) {
        return parsed;
    }

    // Intentar parsear formato local tipo "dd/mm/yyyy, hh:mm:ss a.m./p.m."
    const regex = /(\d{1,2})\/(\d{1,2})\/(\d{4}), (\d{1,2}):(\d{2}):(\d{2}) (a\.m\.|p\.m\.)/i;
    const match = dateStr.match(regex);

    if (match) {
        let [ , day, month, year, hour, minute, second, ampm ] = match;
        day = parseInt(day, 10);
        month = parseInt(month, 10) - 1; // JS months 0-11
        year = parseInt(year, 10);
        hour = parseInt(hour, 10);
        minute = parseInt(minute, 10);
        second = parseInt(second, 10);

        if (ampm.toLowerCase().includes("p") && hour < 12) hour += 12;
        if (ampm.toLowerCase().includes("a") && hour === 12) hour = 0;

        return new Date(year, month, day, hour, minute, second);
    }

    return new Date(); // fallback si falla
}

// Obtener IP pública con ipify
async function getPublicIP() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        document.getElementById("ip").value = data.ip; // Rellenar input automáticamente
    } catch (error) {
        console.error("Error al obtener la IP:", error);
        document.getElementById("ip").value = "No disponible";
    }
}

// Función para cargar y mostrar los últimos 5 dispositivos
async function loadDevices() {
    try {
        const response = await fetch(API_URL);
        const devices = await response.json();
        
        // Ordenar con fechas normalizadas
        const sortedDevices = devices.sort((a, b) => parseDate(b.date) - parseDate(a.date));
        const lastFiveDevices = sortedDevices.slice(0, 5);

        const tableBody = document.getElementById('devicesTableBody');
        tableBody.innerHTML = '';

        lastFiveDevices.forEach(device => {
            const row = document.createElement('tr');

            // Colores de estado
            let statusClass = '';
            if (device.status.includes('ADELANTE')) statusClass = 'bg-success';
            else if (device.status.includes('ATRAS')) statusClass = 'bg-warning';
            else if (device.status === 'DETENER') statusClass = 'bg-danger';
            else statusClass = 'bg-info';

            row.innerHTML = `
                <td>${device.name}</td>
                <td><span class="badge ${statusClass} status-badge">${device.status}</span></td>
                <td>${device.ip}</td>
                <td>${parseDate(device.date).toLocaleString('es-MX', { timeZone: 'America/Mexico_City' })}</td>
                <td>
                    <button class="btn btn-sm btn-outline-primary btn-action" onclick="editDevice(${device.id})">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-action" onclick="deleteDevice(${device.id})">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los dispositivos:', error);
        alert('Error al cargar los dispositivos. Por favor, intenta nuevamente.');
    }
}

// Función para agregar un nuevo dispositivo
async function addDevice(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const status = document.getElementById('status').value;
    const ip = document.getElementById('ip').value;
    
    const newDevice = {
        name,
        status,
        ip,
        date: new Date().toISOString() // ✅ Guardar siempre en ISO
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newDevice)
        });
        
        if (response.ok) {
            alert('Comando enviado correctamente!');
            document.getElementById('deviceForm').reset();
            getPublicIP(); // ✅ vuelve a poner la IP automáticamente
            loadDevices();
        } else {
            throw new Error('Error en la respuesta del servidor');
        }
    } catch (error) {
        console.error('Error al agregar el dispositivo:', error);
        alert('Error al enviar el comando. Por favor, intenta nuevamente.');
    }
}

// Función para eliminar un dispositivo
async function deleteDevice(id) {
    if (!confirm('¿Estás seguro de que quieres eliminar este comando?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Comando eliminado correctamente!');
            loadDevices();
        } else {
            throw new Error('Error al eliminar el dispositivo');
        }
    } catch (error) {
        console.error('Error al eliminar el dispositivo:', error);
        alert('Error al eliminar el comando. Por favor, intenta nuevamente.');
    }
}

// Función para editar un dispositivo
async function editDevice(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const device = await response.json();
        
        // Prellenar el formulario
        document.getElementById('name').value = device.name;
        document.getElementById('status').value = device.status;
        document.getElementById('ip').value = device.ip;
        
        const form = document.getElementById('deviceForm');
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            const updatedDevice = {
                name: document.getElementById('name').value,
                status: document.getElementById('status').value,
                ip: document.getElementById('ip').value,
                date: device.date // Mantener la fecha original
            };
            
            try {
                const updateResponse = await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedDevice)
                });
                
                if (updateResponse.ok) {
                    alert('Comando actualizado correctamente!');
                    form.reset();
                    getPublicIP(); // ✅ vuelve a poner la IP automáticamente
                    form.onsubmit = addDevice;
                    loadDevices();
                } else {
                    throw new Error('Error al actualizar el dispositivo');
                }
            } catch (error) {
                console.error('Error al actualizar el dispositivo:', error);
                alert('Error al actualizar el comando. Por favor, intenta nuevamente.');
            }
        };
        
        alert('Modifica los campos y envía el formulario para actualizar el comando.');
    } catch (error) {
        console.error('Error al cargar el dispositivo para editar:', error);
        alert('Error al cargar el comando para editar. Por favor, intenta nuevamente.');
    }
}

// Inicializar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    getPublicIP(); // ✅ obtiene IP automáticamente
    loadDevices();
    document.getElementById('deviceForm').addEventListener('submit', addDevice);
    setInterval(loadDevices, 30000);
});
