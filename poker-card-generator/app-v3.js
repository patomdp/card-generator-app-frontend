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
// const resultDiv = document.getElementById('result');
// const loadingDiv = document.getElementById("loading");
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

// Función para generar la imagen usando la API de Segmind
async function generateImage(prompt, container, api) {
  console.log('backendUrl + api: ', backendUrl + api);
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

    console.log('Response data:', response.data);
    // INICIAL
    // const blob = new Blob([response.data], { type: "image/png" });
    // const imageUrl = URL.createObjectURL(blob);
    // const img = document.createElement("img");
    // img.src = imageUrl;
    // container.innerHTML = "";
    // container.appendChild(img);


    // OTRA OPCION
    // const imageUrl = `data:image/png;base64,${response.data}`;
    // const img = document.createElement("img");
    // img.src = imageUrl;
    // container.innerHTML = "";
    // container.appendChild(img);

    // Convierte el ArrayBuffer a Base64
    const base64Image = btoa(
      new Uint8Array(response.data)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    const imageUrl = `data:image/png;base64,${base64Image}`;
    const img = document.createElement("img");
    img.src = imageUrl;
    container.innerHTML = "";
    container.appendChild(img);   
  } catch (error) {
    console.error("Error al generar la imagen:", error);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
      console.error("Response headers:", error.response.headers);
    } else if (error.request) {
      console.error("Request data:", error.request);
    } else {
      console.error("General error:", error.message);
    }
    container.innerHTML = "Error al generar la imagen.";
  }
}

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

  // TEST SI FUNCIONA
  // loadingDiv.style.display = "block";
  // resultDiv.innerHTML = "";
  // const imageContainer = document.createElement("div");
  // imageContainer.className = "image-container";
  // imageContainer.innerHTML = `
  //         <div>
  //             <div class="spinner"></div>
  //             <div class="generating-text">Generando</div>
  //         </div>
  //     `;
  // resultDiv.appendChild(imageContainer);


  // Generar y mostrar la imagen
  const imageUrl = await generateImage(prompt, cardImage, imageGeneratorAPI);
  if (imageUrl) {
    cardImage.style.backgroundImage = `url(${imageUrl})`;
    cardImage.textContent = "";
  } else {
    cardImage.textContent = "Error al generar la imagen";
  }

  // const enhancedPrompt = enhancePrompt(userPrompt, i);
  // generateImage(prompt, imageContainer, imageGeneratorAPI);
  // loadingDiv.style.display = "none";
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
