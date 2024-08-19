const selectedStyle = "minimalist and geometric shapes, vector art";

const hf_apiKey = 'Bearer hf_';

// Characteristics of the suits
const suiteCharacteristics = {
  "♠️": {
    name: "Pikes or Spades",
    color: "black",
    traits: "elegant, noble, mysterious",
    palette: "dark tones, black, gray, silver",
    style: selectedStyle,
  },
  "♦️": {
    name: "Tiles, Diamonds",
    color: "red",
    traits: "luxurious, bright, valuable",
    palette: "red, gold, white",
    style: selectedStyle,
  },
  "♣️": {
    name: "Clubs or clover",
    color: "black",
    traits: "natural, lucky, earthy",
    palette: "dark green, brown, black",
    style: selectedStyle,
  },
  "♥️": {
    name: "Hearts",
    color: "red",
    traits: "passionate, emotional, warm",
    palette: "red, pink, white",
    style: selectedStyle,
  },
  '🎭': {
    name: "Jester",
    color: "multicolor",
    traits: "chaotic, unpredictable, playful",
    palette: "blue, yellow, gold, vibrant",
    style: selectedStyle,
  },
};

// Rangos de las cartas
const cardRanks = {
  1: "As",
  J: "Jack",
  Q: "Queen",
  K: "King",
  Jester: "Jester",
};

// Elementos del DOM
const suiteSelect = document.getElementById("suiteSelect");
const valueSelect = document.getElementById("valueSelect");
const generateBtn = document.getElementById("generateBtn");
const generateBtnFlux = document.getElementById("generateBtnFlux");
const cardValue = document.getElementById("cardValue");
const cardImage = document.getElementById("cardImage");
const cardSuite = document.getElementById("cardSuite");
const promptUsed = document.getElementById("promptUsed");
// Export
const exportBtnCardComplete = document.getElementById('exportBtnCardComplete');
const cardElement = document.querySelector('.card');
// Backend
const backendUrl = "https://image-generator-backend-obj1.onrender.com";
const backendUrlFlux = 'https://card-generator-app-backend.onrender.com';
const imageGeneratorAPI = "/api/image-generator";
const fluxAPI = "/api/generate-image-flux";

// Función para generar una semilla aleatoria
function generateRandomSeed() {
  return Math.floor(Math.random() * 1000000);
}

// Función para generar el prompt

function generatePrompt(suite, value) {
  const suiteInfo = suiteCharacteristics[suite];
  let rank = cardRanks[value] || value;
  console.log('rank or value: ', rank);
  let basePrompt = `${rank} of ${suiteInfo.name}, ${suiteInfo.traits}, ${suiteInfo.style} with ${suiteInfo.palette} bold and simple colors, high-contrast color palette, hd, fully detailed`;

  if (rank === "King" || rank === "Queen" || rank === "Jack") {
    basePrompt += `, unique fantasy-themed character in dynamic pose upper body, royal figure with an elaborated clothing and symbols of ${suiteInfo.name} prominently displayed`; // determined look
  } else if (rank === "As") {
    basePrompt += `,  elegant design centered on a large symbol of ${suiteInfo.name}`;
  } else if (rank === "🎭") {
    basePrompt += `, full body character, burlesque and chaotic figure with elements of all suits, using a masks, determined look`;
  } else {
    basePrompt += `, ${value} symbols of ${suiteInfo.name} arranged artistically, symbols of suits such as ${suiteInfo.name} prominently displayed`;
  }

  return basePrompt + ", clean white background behind the figure"; //sharp features, heroic
}

// Función para generar la imagen usando la API de Segmind
async function generateImage(prompt, api) {
  try {
    const response = await axios.post(
      backendUrl + api,
      {
        prompt: prompt + ", high quality, detailed",
        negative_prompt: "multiple characters, blurry, low quality, clothing covering symbolic elements",
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
    if(suite !== '🎭') {
      cardSuite.textContent = suite;
    } else {
      cardSuite.textContent = '';
    }

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
    console.error("Error generating:", error);
    cardImage.textContent = "Error generating";
  }
});

// Evento para generar la carta
generateBtnFlux.addEventListener("click", async () => {
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
      cardSuite.textContent = suite !== '🎭' ? suite : '';
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
      const imageUrl = await generateImageFlux(prompt);
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
      console.error("Error generating:", error);
      cardImage.textContent = "Error generating";
  }
});

async function generateImageFlux(prompt) {
  const response = await fetch('https://card-generator-app-backend.onrender.com/generate-image-flux', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description: prompt })
  });

  if (!response.ok) {
      throw new Error('Error generating image');
  }

  const data = await response.json();
  return data.imageUrl;
}


// Actualizar las opciones de valor cuando se selecciona Jester
suiteSelect.addEventListener("change", () => {
  if (suiteSelect.value === "🎭") {
    valueSelect.innerHTML = '<option value="🎭">Jester</option>';
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


exportBtnCardComplete.addEventListener('click', (event) => {
  event.preventDefault(); // Previene el comportamiento por defecto, como el envío de un formulario
    event.stopPropagation(); // Detiene la propagación del evento para que no afecte otros elementos

  const scaleFactor = 3; // Aumenta el factor de escala para mejorar la calidad (2 o 3 veces la resolución original)
  
  html2canvas(cardElement, {
      scale: scaleFactor,  // Escala el canvas
      useCORS: true,       // Permite cargar imágenes de otros dominios
      logging: true,       // Muestra información en la consola (opcional)
  }).then((canvas) => {
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/jpeg', 0.95); // Exporta como JPG de alta calidad
      link.download = `${suiteSelect.value}_${valueSelect.value}.png`;
      link.click();
  });
});

