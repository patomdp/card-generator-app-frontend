document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('drawioFrame');
    const fileInput = document.getElementById('fileInput');
    const importBtn = document.getElementById('importBtn');
    const exportBtn = document.getElementById('exportBtn');

    // Función para importar un diagrama desde un archivo XML
    importBtn.addEventListener('click', () => {
        const file = fileInput.files[0];
        if (file ) {
            // && file.type === 'text/xml' || file.type === ''
            const reader = new FileReader();
            reader.onload = (e) => {
                const diagramXml = e.target.result;
                const message = {
                    action: 'load',
                    xml: diagramXml,
                    title: 'Diagrama Importado'
                };
                iframe.contentWindow.postMessage(JSON.stringify(message), '*');
            };
            reader.readAsText(file);
        } else {
            alert('Por favor selecciona un archivo XML válido.');
        }
    });

    // Función para exportar el diagrama como imagen
    exportBtn.addEventListener('click', () => {
        const message = {
            action: 'export',
            format: 'png',
            xml: 1
        };

        window.addEventListener('message', (event) => {
            if (event.data && event.data.startsWith('data:image/')) {
                const link = document.createElement('a');
                link.href = event.data;
                link.download = 'diagrama.png';
                link.click();
            }
        }, { once: true });

        iframe.contentWindow.postMessage(JSON.stringify(message), '*');
    });
});
