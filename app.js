// Verificar si la API de reconocimiento de voz está disponible en el navegador
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'es-ES'; // Establecer el idioma a español
recognition.interimResults = false; // Mostrar solo resultados finales

// Obtener elementos del DOM
const startButton = document.getElementById('start-btn');
const statusText = document.getElementById('status');
const detectedCommand = document.getElementById('detected-command'); // Donde se mostrará el comando

// Manejar la presión y liberación del botón
startButton.addEventListener('mousedown', () => {
    recognition.start(); // Iniciar reconocimiento al presionar el botón
    statusText.innerText = 'Escuchando... Mantén presionado.';
});

startButton.addEventListener('mouseup', () => {
    recognition.stop(); // Detener reconocimiento al soltar el botón
    statusText.innerText = 'Reconocimiento detenido.';
});

// Cuando se obtiene el resultado del reconocimiento
recognition.onresult = function (event) {
    const command = event.results[event.results.length - 1][0].transcript; // Último resultado
    statusText.innerText = `Comando reconocido: ${command}`;
    detectedCommand.innerText = command; // Mostrar el comando en el HTML
    sendCommandToESP32(command); // Enviar el comando al ESP32
};

// Manejar errores del reconocimiento
recognition.onerror = function (event) {
    console.error('Error en reconocimiento de voz:', event.error);
    statusText.innerText = 'Error en reconocimiento. Intenta de nuevo.';
};

// Función para enviar el comando al ESP32
function sendCommandToESP32(command) {
    const esp32Url = 'http://192.168.1.100/comando'; // Cambia la IP del ESP32
    fetch(esp32Url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ command: command }),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Comando enviado al ESP32:', data);
        })
        .catch(error => {
            console.error('Error al enviar el comando:', error);
        });
}
