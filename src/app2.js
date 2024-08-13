// // Guardar carta
// document.getElementById('save-card').addEventListener('click', async () => {
//     const title = "Card Title"; // Puedes agregar un campo para el título si lo deseas
//     const description = document.getElementById('description').value;
//     const imageUrl = document.getElementById('card-image').src;
//     const data = await fetchFromServer('/save-card', 'POST', { title, description, imageUrl });
//     if (data && data.success) {
//       alert('Card saved successfully!');
//     }
//   });
  
//   // Exportar como imagen
//   document.getElementById('export-image').addEventListener('click', () => {
//     const card = document.getElementById('card');
//     html2canvas(card).then(canvas => {
//       const link = document.createElement('a');
//       link.href = canvas.toDataURL('image/png');
//       link.download = 'card.png';
//       link.click();
//     });
//   });
  
//   // Exportar como PDF
//   document.getElementById('export-pdf').addEventListener('click', () => {
//     const card = document.getElementById('card');
//     html2canvas(card).then(canvas => {
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jspdf.jsPDF();
//       pdf.addImage(imgData, 'PNG', 10, 10);
//       pdf.save('card.pdf');
//     });
//   });


//   Usa html2canvas y jsPDF para exportar las cartas

document.getElementById('save-card').addEventListener('click', async () => {
    const response = await fetch('http://localhost:3000/save-card', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: 'Card Title',
        description: 'Card Description',
        imageUrl: 'http://example.com/image.png'
      })
    });
  
    const data = await response.json();
    console.log(data);
  });


  document.getElementById('export-image').addEventListener('click', exportCardAsImage);
document.getElementById('export-pdf').addEventListener('click', exportCardAsPDF);

// Asume que tienes html2canvas para exportar la carta como imagen
document.getElementById('generate-image').addEventListener('click', () => {
    // Este es un ejemplo básico de cómo podrías generar una imagen de la carta
    // Asegúrate de que html2canvas esté correctamente incluido en tu HTML
    exportCardAsImage();
});

document.getElementById('generate-text').addEventListener('click', async () => {
    // Genera un texto ficticio o llamará a una API para obtener el texto
    const textElement = document.getElementById('card-text');
    const description = document.getElementById('description').value;
    
    if (description) {
        textElement.textContent = `Generated text: ${description}`;
    } else {
        textElement.textContent = 'Please enter a description';
    }
});

// Función para exportar la carta como imagen
function exportCardAsImage() {
    const card = document.getElementById('card');
    html2canvas(card).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = 'card.png';
        link.click();
    });
}

// Función para exportar la carta como PDF
function exportCardAsPDF() {
    const card = document.getElementById('card');
    html2canvas(card).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10);
        pdf.save('card.pdf');
    });
}