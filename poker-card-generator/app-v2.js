// Características de los suites
const suiteCharacteristics = {
  "♠️": {
    name: "Picas",
    color: "negro",
    traits: "elegante, noble, misterioso",
    palette: "tonos oscuros, negro, gris, plata",
  },
  "♦️": {
    name: "Diamantes",
    color: "rojo",
    traits: "lujoso, brillante, valioso",
    palette: "rojo, dorado, blanco",
  },
  "♣️": {
    name: "Tréboles",
    color: "negro",
    traits: "natural, afortunado, terrenal",
    palette: "verde oscuro, marrón, negro",
  },
  "♥️": {
    name: "Corazones",
    color: "rojo",
    traits: "apasionado, emocional, cálido",
    palette: "rojo, rosa, blanco",
  },
  Joker: {
    name: "Joker",
    color: "multicolor",
    traits: "caótico, impredecible, bromista",
    palette: "multicolor, vibrante",
  },
};

// Rangos de las cartas
const cardRanks = {
  1: "As",
  J: "Jota",
  Q: "Reina",
  K: "Rey",
  Joker: "Comodín",
};



// Elementos del DOM
const suiteSelect = document.getElementById("suiteSelect");
const valueSelect = document.getElementById("valueSelect");
const generateBtn = document.getElementById("generateBtn");
const cardValue = document.getElementById("cardValue");
const cardImage = document.getElementById("cardImage");
const cardSuite = document.getElementById("cardSuite");
const promptUsed = document.getElementById("promptUsed");
const resultDiv = document.getElementById('result');
const loadingDiv = document.getElementById("loading");
// Export
const exportBtnCardComplete = document.getElementById('exportBtnCardComplete');
const cardElement = document.querySelector('.card');
// Backend
const backendUrl = "https://image-generator-backend-obj1.onrender.com";
const imageGeneratorAPI = "/api/image-generator";

// Función para generar el prompt
function generatePrompt(suite, value) {
  const suiteInfo = suiteCharacteristics[suite];
  let rank = cardRanks[value] || value;
  let basePrompt = `Personaje que representa a la Carta de póker ${rank} de ${suiteInfo.name}, ${suiteInfo.traits}, en estilo ${suiteInfo.color} con ${suiteInfo.palette}`;

  if (rank === "Rey" || rank === "Reina" || rank === "Jota") {
    basePrompt += `, figura real con atuendo elaborado y símbolos de ${suiteInfo.name}`;
  } else if (rank === "As") {
    basePrompt += `, diseño elegante centrado en un gran símbolo de ${suiteInfo.name}`;
  } else if (rank === "Comodín") {
    basePrompt += `, figura burlesca y caótica con elementos de todos los palos`;
  } else {
    basePrompt += `, ${value} símbolos de ${suiteInfo.name} dispuestos de manera artística`;
  }

  return basePrompt + ", fondo transparente";
}

// Función para generar la imagen (simulada)
async function basicImage(prompt) {
  // Aquí se conectaría con la API de generación de imágenes
  // Por ahora, simularemos una respuesta
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula delay de la API
  return `https://via.placeholder.com/200x300?text=${encodeURIComponent(
    prompt
  )}`;
}

// Función para generar la imagen usando la API de Segmind
async function generateImage(prompt, container, api) {
  // const apiKey = process.env.segmin;
    // const apiKey = "API_KEY"; // Asegúrate de haber reemplazado esto con tu API key real
  // const apiUrl = "https://api.segmind.com/v1/sdxl1.0-txt2img";

  console.log('backendUrl + api: ', backendUrl + api);

  // const data = {
  //   prompt: prompt,
  //   negative_prompt: "background, multiple characters, blurry, low quality",
  //   samples: 1,
  //   scheduler: "UniPC",
  //   num_inference_steps: 25,
  //   guidance_scale: 7.5,
  //   seed: 0,
  //   img_width: 512,
  //   img_height: 768,
  //   base64: true, // Cambiamos esto a true para recibir la imagen en base64
  // };

  // try {
  //   const response = await fetch(apiUrl, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-api-key": apiKey,
  //     },
  //     body: JSON.stringify(data),
  //   });

  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }

  //   const result = await response.json();
  //   if (result.image) {
  //     // La API devuelve la imagen en base64, la convertimos a una URL de datos
  //     return `data:image/png;base64,${result.image}`;
  //   } else {
  //     throw new Error("No se recibió la imagen en la respuesta");
  //   }
  // } catch (error) {
  //   console.error("Error al generar la imagen:", error);
  //   return null;
  // }
  try {
    const response = await axios.post(
      backendUrl + api,
      {
        prompt: prompt,
        negative_prompt: "background, multiple characters, blurry, low quality",
        samples: 1,
        scheduler: "UniPC",
        numInferenceSteps: 25,
        guidanceScale: 7.5,
        seed: 0,
        width: 512,
        height: 768,
        base64: true, // Cambiamos esto a true para recibir la imagen en base64
      },
      {
        responseType: "arraybuffer",
      }
    );

    const blob = new Blob([response.data], { type: "image/png" });
    const imageUrl = URL.createObjectURL(blob);
    const img = document.createElement("img");
    img.src = imageUrl;
    container.innerHTML = "";
    container.appendChild(img);
  } catch (error) {
    console.error("Error:", error);
    container.innerHTML = "Error al generar la imagen.";
  }
}


// FROM IMG GEN
// async function generateImage(prompt, container, api) {
//   try {
//     const response = await axios.post(
//       backendUrl + api,
//       {
//         prompt: prompt,
//         negative_prompt: negativePromptInput.value,
//         numInferenceSteps: stepsInput.value,
//         guidanceScale: guidanceInput.value,
//         width: widthSelect.value,
//         height: heightSelect.value,
//       },
//       {
//         responseType: "arraybuffer",
//       }
//     );

//     const blob = new Blob([response.data], { type: "image/png" });
//     const imageUrl = URL.createObjectURL(blob);
//     const img = document.createElement("img");
//     img.src = imageUrl;
//     container.innerHTML = "";
//     container.appendChild(img);
//   } catch (error) {
//     console.error("Error:", error);
//     container.innerHTML = "Error al generar la imagen.";
//   }
// }

// Evento para generar la carta
generateBtn.addEventListener("click", async () => {
  const suite = suiteSelect.value;
  const value = valueSelect.value;

  // Actualizar la visualización de la carta
  cardValue.textContent = value;
  cardSuite.textContent = suite;

  // Mostrar estado de carga
  cardImage.style.backgroundImage = "none";
  cardImage.textContent = "Generando...";

  // Generar y mostrar el prompt
  const prompt = generatePrompt(suite, value);
  promptUsed.textContent = `Prompt utilizado: ${prompt}`;

  // Generar y mostrar la imagen
  // const imageUrl = await generateImage(prompt);
  // if (imageUrl) {
  //   cardImage.style.backgroundImage = `url(${imageUrl})`;
  //   cardImage.textContent = "";
  // } else {
  //   cardImage.textContent = "Error al generar la imagen";
  // }

  // TEST SI FUNCIONA
  loadingDiv.style.display = "block";
  resultDiv.innerHTML = "";

  for (let i = 0; i < 4; i++) {
    const imageContainer = document.createElement("div");
    imageContainer.className = "image-container";
    imageContainer.innerHTML = `
            <div>
                <div class="spinner"></div>
                <div class="generating-text">Generando</div>
            </div>
        `;
    resultDiv.appendChild(imageContainer);

    // const enhancedPrompt = enhancePrompt(userPrompt, i);
    generateImage(prompt, imageContainer, imageGeneratorAPI);
  }
  loadingDiv.style.display = "none";
});

// Actualizar las opciones de valor cuando se selecciona Joker
suiteSelect.addEventListener("change", () => {
  if (suiteSelect.value === "Joker") {
    valueSelect.innerHTML = '<option value="Joker">Joker</option>';
  } else {
    valueSelect.innerHTML = `
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
            <option value="J">J</option>
            <option value="Q">Q</option>
            <option value="K">K</option>
        `;
  }
});


// Función para exportar la carta completa como imagen
exportBtnCardComplete.addEventListener('click', () => {
    html2canvas(cardElement).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${valueSelect.value}_${suiteSelect.value}.png`;
        link.click();
    });
});
