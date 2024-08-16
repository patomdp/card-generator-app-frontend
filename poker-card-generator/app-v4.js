// Characteristics of the suits
const suiteCharacteristics = {
  "♠️": {
    name: "Spades",
    color: "black",
    traits: "elegant, noble, mysterious",
    palette: "dark tones, black, gray, silver",
  },
  "♦️": {
    name: "Diamonds",
    color: "red",
    traits: "luxurious, bright, valuable",
    palette: "red, gold, white",
  },
  "♣️": {
    name: "Clubs",
    color: "black",
    traits: "natural, lucky, earthy",
    palette: "dark green, brown, black",
  },
  "♥️": {
    name: "Hearts",
    color: "red",
    traits: "passionate, emotional, warm",
    palette: "red, pink, white",
  },
  Joker: {
    name: "Joker",
    color: "multicolor",
    traits: "chaotic, unpredictable, playful",
    palette: "multicolor, vibrant",
  },
};


// Rangos de las cartas
const cardRanks = {
  1: "As",
  J: "Jack",
  Q: "Queen",
  K: "King",
  Joker: "Joker",
};

// Elementos del DOM
const suiteSelect = document.getElementById("suiteSelect");
const valueSelect = document.getElementById("valueSelect");
const generateBtn = document.getElementById("generateBtn");
const cardValue = document.getElementById("cardValue");
const cardImage = document.getElementById("cardImage");
const cardSuite = document.getElementById("cardSuite");
const promptUsed = document.getElementById("promptUsed");
// Export
const exportBtnCardComplete = document.getElementById('exportBtnCardComplete');
const cardElement = document.querySelector('.card');
// Backend
const backendUrl = "https://image-generator-backend-obj1.onrender.com";
const imageGeneratorAPI = "/api/image-generator";

// Función para generar una semilla aleatoria
function generateRandomSeed() {
  return Math.floor(Math.random() * 1000000);
}

// Función para generar el prompt
function generatePrompt(suite, value) {
  const suiteInfo = suiteCharacteristics[suite];
  let rank = cardRanks[value] || value;
  let basePrompt = `Character that represents the Poker Card ${rank} of ${suiteInfo.name}, ${suiteInfo.traits}, in the style of ${suiteInfo.color} with ${suiteInfo.palette}`;
  // let basePrompt = `Personaje que representa a la Carta de póker ${rank} de ${suiteInfo.name}, ${suiteInfo.traits}, en estilo ${suiteInfo.color} con ${suiteInfo.palette}`;

  if (rank === "King" || rank === "Queen" || rank === "Jack") {
    basePrompt += `, royal figure with an elaborated clothing and symbols of ${suiteInfo.name}`;
    // basePrompt += `, figura real con atuendo elaborado y símbolos de ${suiteInfo.name}`;
  } else if (rank === "As") {
    // basePrompt += `, diseño elegante centrado en un gran símbolo de ${suiteInfo.name}`;
    basePrompt += `,  elegant design centered on a large symbol of ${suiteInfo.name}`;
  } else if (rank === "Joker") {
    basePrompt += `, burlesque and chaotic figure with elements of all suits`;
    // basePrompt += `, figura burlesca y caótica con elementos de todos los palos`;
  } else {
    basePrompt += `, ${value} symbols of ${suiteInfo.name} arranged artistically`;
    // basePrompt += `, ${value} símbolos de ${suiteInfo.name} dispuestos de manera artística`;
  }

  return basePrompt + ", transparent background";
  // return basePrompt + ", fondo transparente";
}

// Función para generar la imagen usando la API de Segmind
async function generateImage(prompt, api) {
  console.log('backendUrl + api: ', backendUrl + api);
  try {
    const response = await axios.post(
      backendUrl + api,
      {
        prompt: prompt + ", full body character, transparent background, high quality, detailed",
        negative_prompt: "background, multiple characters, blurry, low quality, clothing covering symbolic elements",
        samples: 1,
        scheduler: "UniPC",
        numInferenceSteps: 30,
        guidanceScale: 8,
        seed: generateRandomSeed(),
        width: 512,
        height: 768,
      },
      {
        responseType: "arraybuffer",
      }
    );
    // width: 512,
    // height: 768,

    console.log('Response status:', response.status);
    const blob = new Blob([response.data], { type: "image/png" });
    const imageUrl = URL.createObjectURL(blob);
    console.log('Image URL:', imageUrl);
    return imageUrl;  // Devolvemos la URL de la imagen
  } catch (error) {
    console.error("Error:", error);
    throw error;  // Lanzamos el error para manejarlo en el llamador
  }
}

// Evento para generar la carta
generateBtn.addEventListener("click", async () => {
  const suite = suiteSelect.value;
  const value = valueSelect.value;

  // Seleccionar todos los elementos con la clase card-value y card-suite
  const cardValues = document.querySelectorAll('.card-value');
  const cardSuites = document.querySelectorAll('.card-suite');

  // Actualizar la visualización de la carta
  cardValues.forEach(cardValue => {
    cardValue.textContent = value;
  });
  cardSuites.forEach(cardSuite => {
    cardSuite.textContent = suite;
  });
  
  // Cambiar de color si es corazones o diamantes
  const color = (suite === '♥️' || suite === '♦️') ? 'red' : 'black';
  cardValues.forEach(cardValue => {
    cardValue.style.color = color;
  });
  cardSuites.forEach(cardSuite => {
    cardSuite.style.color = color;
  });

  // Mostrar estado de carga
  const cardImage = document.querySelector('.card-image');
  cardImage.style.backgroundImage = "none";
  cardImage.textContent = "Generating...";

  // Generar y mostrar el prompt
  const prompt = generatePrompt(suite, value);
  promptUsed.textContent = `Prompt: ${prompt}`;

  try {
    // Generar y mostrar la imagen
    const imageUrl = await generateImage(prompt, imageGeneratorAPI);
    if (imageUrl) {
      const img = new Image();
      img.onload = () => {
        cardImage.style.backgroundImage = `url(${imageUrl})`;
        cardImage.textContent = "";
      };
      img.onerror = () => {
        throw new Error("Failed to load image");
      };
      img.src = imageUrl;
      cardImage.style.borderRadius = '1em';
    } else {
      throw new Error("No image URL returned");
    }
  } catch (error) {
    console.error("Error al generar la imagen:", error);
    cardImage.textContent = "Error al generar la imagen";
  }
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
