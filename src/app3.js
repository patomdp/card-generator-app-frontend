// Función para hacer peticiones al servidor

async function fetchFromServer(url, method, body) {
  try {
    const response = await fetch(`http://localhost:3000${url}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}

// Generar imagen
document
  .getElementById("generate-image")
  .addEventListener("click", async () => {
    const description = document.getElementById("description").value;
    if (!description) {
      alert("Please enter a description for the image.");
      return;
    }
    try {
      const data = await fetchFromServer("/generate-image", "POST", {
        description,
      });
      if (data && data.imageUrl) {
        document.getElementById("card-image").src = data.imageUrl;
      } else {
        throw new Error("Failed to generate image");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      alert("Failed to generate image. Please try again.");
    }
  });

// Generar texto
document.getElementById("generate-text").addEventListener("click", async () => {
  const description = document.getElementById("description").value;
  if (!description) {
    alert("Please enter a description for the text.");
    return;
  }
  try {
    const data = await fetchFromServer("/generate-text", "POST", {
      inputText: description,
    });
    if (data && data.generatedText) {
      document.getElementById("card-text").textContent = data.generatedText;
    } else {
      throw new Error("Failed to generate text");
    }
  } catch (error) {
    console.error("Error generating text:", error);
    alert("Failed to generate text. Please try again.");
  }
});

// Guardar carta
document.getElementById("save-card").addEventListener("click", async () => {
  const title = "Card Title"; // Puedes agregar un campo para el título si lo deseas
  const description = document.getElementById("description").value;
  const imageUrl = document.getElementById("card-image").src;
  const data = await fetchFromServer("/save-card", "POST", {
    title,
    description,
    imageUrl,
  });
  if (data && data.success) {
    alert("Card saved successfully!");
  } else {
    alert("Something went wrong!");
  }
});

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
