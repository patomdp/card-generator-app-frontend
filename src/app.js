// Función para hacer peticiones al servidor
// Asegúrate de incluir Axios en tu HTML
// <script src="https://unpkg.com/axios/dist/axios.min.js"></script>

const backendUrl = "http://localhost:3000"; // Ajusta esto si tu backend está en un puerto diferente

// Función para hacer peticiones al servidor usando Axios
async function fetchFromServer(url, method, data) {
  console.log(`Sending ${method} request to ${url}`, data);
  try {
    const response = await axios({
      method: method,
      url: `${backendUrl}${url}`,
      data: data
    });
    console.log(`Received response from ${url}:`, response.data);
    return response.data;
  } catch (error) {
    console.error('Error in fetchFromServer:', error);
    throw error;
  }
}

// Generar imagen
document.getElementById('generate-image').addEventListener('click', async () => {
  const description = document.getElementById('description').value;
  if (!description) {
    alert('Please enter a description for the image.');
    return;
  }
  try {
    console.log('Generating image with description:', description);
    const data = await fetchFromServer('/generate-image', 'post', { description });
    if (data && data.imageUrl) {
      document.getElementById('card-image').src = data.imageUrl;
      console.log('Image generated successfully:', data.imageUrl);
    } else {
      throw new Error('Failed to generate image');
    }
  } catch (error) {
    console.error('Error generating image:', error);
    alert('Failed to generate image. Please try again.');
  }
});

// Generar texto
document.getElementById('generate-text').addEventListener('click', async () => {
  const description = document.getElementById('description').value;
  if (!description) {
    alert('Please enter a description for the text.');
    return;
  }
  try {
    console.log('Generating text with description:', description);
    const data = await fetchFromServer('/generate-text', 'post', { inputText: description });
    if (data && data.generatedText) {
      document.getElementById('card-text').textContent = data.generatedText;
      console.log('Text generated successfully:', data.generatedText);
    } else {
      throw new Error('Failed to generate text');
    }
  } catch (error) {
    console.error('Error generating text:', error);
    alert('Failed to generate text. Please try again.');
  }
});

// Guardar carta
document.getElementById('save-card').addEventListener('click', async () => {
  const title = "Card Title"; // Puedes agregar un campo para el título si lo deseas
  const description = document.getElementById('description').value;
  const imageUrl = document.getElementById('card-image').src;
  console.log('Saving card:', { title, description, imageUrl });
  const data = await fetchFromServer('/save-card', 'post', { title, description, imageUrl });
  if (data && data.success) {
    console.log('Card saved successfully:', data);
    alert('Card saved successfully!');
  } else {
    console.error('Failed to save card:', data);
    alert('Something went wrong!');
  }
});

// El código para exportar como imagen y PDF permanece igual
// Exportar como imagen
document.getElementById("export-image").addEventListener("click", () => {
  const card = document.getElementById("card");
  html2canvas(card).then((canvas) => {
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "card.png";
    link.click();
  });
});

// Exportar como PDF
document.getElementById("export-pdf").addEventListener("click", () => {
  const card = document.getElementById("card");
  html2canvas(card).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jspdf.jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10);
    pdf.save("card.pdf");
  });
});
