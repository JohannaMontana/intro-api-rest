# Testing de API Públicas - CRUD IoT 🚀

Este proyecto tiene como objetivo es comprender la lógica de comunicación **Cliente/Servidor** en ambientes públicos mediante una **API REST**.  

La aplicación implementa un **CRUD completo** para controlar dispositivos IoT usando **MockAPI** como backend y **Fetch API** con **JavaScript Vanilla** para la comunicación asíncrona. La interfaz se diseñó con **Bootstrap** para una experiencia visual clara y atractiva.

---

## 📌 Objetivo de la actividad
Entender y practicar:
- ¿Qué es una **API** y cómo funciona?
- ¿Qué es una **API REST**?
- Mecanismos de comunicación **asíncrona** en escenarios Cliente/Servidor usando JS.
- Uso de **JSON** como formato de intercambio de datos.
- Métodos **HTTP** (GET, POST, PUT, DELETE).
- Códigos de respuesta HTTP y su interpretación.
- Implementación de un **CRUD real** con MockAPI.
- Publicación en **GitHub Pages**.

---

## ⚙️ Funcionalidades implementadas
- **Visualizar dispositivos IoT** registrados en MockAPI.
- **Ordenar automáticamente** los registros por fecha de creación.
- **Monitoreo en tiempo real**:
  - Una pestaña que muestra los **últimos 5 comandos enviados**.
  - Una pestaña de **monitoreo** que lista los **últimos 10 registros** y muestra el **último estado del dispositivo**.
- **Operaciones CRUD completas**:
  - **Crear** dispositivo con nombre, estado, IP y fecha.
  - **Leer** registros desde la API y mostrarlos en una tabla con estilos de estado (colores).
  - **Actualizar** datos de un dispositivo existente.
  - **Eliminar** dispositivos de la base de datos.
- **Interfaz responsiva y atractiva** con Bootstrap.
- **Validación visual**: los estados cambian de color según su valor (ej. verde para ADELANTE, rojo para DETENER).

---

## 🛠️ Tecnologías utilizadas
- **Frontend**: HTML, CSS, Bootstrap 5.
- **Lógica**: JavaScript Vanilla (Fetch API).
- **Backend simulado**: [MockAPI](https://mockapi.io/)  
- **Control de versiones**: Git + GitHub.  
- **Hosting**: GitHub Pages.

---

## 📂 Estructura del proyecto
intro-api-rest/
│── index.html # Página principal con CRUD
│── monitoring.html # Página de monitoreo (últimos 10 y último estado)
│── css/
│ └── style.css # Estilos personalizados
│── js/
│ └── app.js # Lógica de conexión y CRUD
