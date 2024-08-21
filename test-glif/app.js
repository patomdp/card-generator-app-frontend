// Inicia la solicitud cuando el documento esté listo o en respuesta a un evento específico
// document.addEventListener('DOMContentLoaded', async () => {
// Elementos del DOM
const suiteSelect = document.getElementById("suiteSelect");
const valueSelect = document.getElementById("valueSelect");
const exportBtnCardComplete = document.getElementById("exportBtnCardComplete");
const cardElement = document.getElementById("cardElement");

// Función simplificada para exportar la carta
exportBtnCardComplete.addEventListener("click", async () => {
    const scaleFactor = 4; // Ajusta el factor de escala para mejorar la calidad

    // Configuración de html2canvas
    const options = {
        scale: scaleFactor,        // Escala el canvas para aumentar la resolución
        useCORS: true,             // Permite cargar imágenes de otros dominios
        backgroundColor: null,     // Mantiene la transparencia de fondo
    };

    try {
        // Crear el canvas usando html2canvas
        const canvas = await html2canvas(document.getElementById("cardElement"), options);

        // Convertir el canvas a un Blob y generar el archivo descargable
        canvas.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${suiteSelect.value}_${valueSelect.value}.png`;
            link.click();
            URL.revokeObjectURL(url);  // Revoca la URL del Blob para liberar memoria
        }, "image/png", 1.0);

    } catch (error) {
        console.error("Error durante la exportación:", error);
        alert("No se pudo exportar la carta. Por favor, intenta de nuevo.");
    }
});

async function generateImageGlif() {
  
    // Obtener los valores seleccionados por el usuario
    const suiteSelect = document.getElementById("suiteSelect");
    const valueSelect = document.getElementById("valueSelect");
    const suite = suiteSelect.value;
    const value = valueSelect.value;
  
    // Crear la data para enviar al backend
    const data = {
      id: "cm03wvd8k0000pu97f7s2fd2c",
      inputs: [value, suite],
    };
  
    const imageContainer = document.getElementById("imageContainer");
    const loadingIndicator = document.getElementById("loadingIndicator");
    const generatedImage = document.getElementById("generatedImage");
  
    // Mostrar el contenedor de imagen y el indicador de carga
    imageContainer.style.display = "block";
    loadingIndicator.style.display = "block";
    generatedImage.style.display = "none";
  
    try {
      const response = await fetch("https://card-generator-app-backend.onrender.com/generate-glif", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
  
      const result = await response.json();
  
      // Ocultar el indicador de carga y mostrar la imagen generada
      loadingIndicator.style.display = "none";
      generatedImage.src = result.imageUrl; // URL de la imagen devuelta por el backend
      generatedImage.style.display = "block";
      generatedImage.style.width = "500px";
    } catch (error) {
      console.error("Error al generar la imagen:", error);
      alert("Hubo un error al generar la imagen. Por favor, inténtalo de nuevo.");
  
      // Ocultar el contenedor de imagen si hay un error
      imageContainer.style.display = "none";
    }
  }
  
  // Añadir el event listener al botón "Generate"
  document.getElementById("generateBtn").addEventListener("click", generateImageGlif);
  
