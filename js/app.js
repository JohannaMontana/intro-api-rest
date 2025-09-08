const API_URL = 'https://68bb0de484055bce63f104ac.mockapi.io/api/v1/dispositivos_IoT';

// Función para obtener la fecha actual en la zona horaria de Ciudad de México
function getMexicoCityTime() {
    const options = {
        timeZone: 'America/Mexico_City',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    
    return new Date().toLocaleString('es-MX', options);
}

// Función para cargar y mostrar los últimos 5 dispositivos
async function loadDevices() {
    try {
        const response = await fetch(API_URL);
        const devices = await response.json();
        
        // Ordenar por fecha (más recientes primero) y tomar los últimos 5
        const sortedDevices = devices.sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastFiveDevices = sortedDevices.slice(0, 5);
        
        const tableBody = document.getElementById('devicesTableBody');
        tableBody.innerHTML = '';
        
        lastFiveDevices.forEach(device => {
            const row = document.createElement('tr');
            
            // Aplicar estilo según el estado
            let statusClass = '';
            if (device.status.includes('ADELANTE')) statusClass = 'bg-success';
            else if (device.status.includes('ATRAS')) statusClass = 'bg-warning';
            else if (device.status === 'DETENER') statusClass = 'bg-danger';
            else statusClass = 'bg-info';
            
            row.innerHTML = `
                <td>${device.name}</td>
                <td><span class="badge ${statusClass} status-badge">${device.status}</span></td>
                <td>${device.ip}</td>
                <td>${new Date(device.date).toLocaleString('es-MX')}</td>
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
        date: getMexicoCityTime()
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

// Función para editar un dispositivo (modal de edición)
async function editDevice(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const device = await response.json();
        
        // Aquí podrías implementar un modal para editar el dispositivo
        // Por simplicidad, lo prellenamos en el formulario principal
        document.getElementById('name').value = device.name;
        document.getElementById('status').value = device.status;
        document.getElementById('ip').value = device.ip;
        
        // Cambiar el comportamiento del formulario para que actualice en lugar de crear
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
                    form.onsubmit = addDevice; // Restaurar el comportamiento original
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
    // Cargar dispositivos al iniciar
    loadDevices();
    
    // Configurar el evento de envío del formulario
    document.getElementById('deviceForm').addEventListener('submit', addDevice);
    
    // Actualizar cada 30 segundos
    setInterval(loadDevices, 30000);
});