// const selectedStyle = "Low Poly style, minimalistic yet detailed";
// Modern playing card design featuring stylized characters,
const selectedStyle = "minimalist and geometric shapes, vector art";
// const selectedStyle = "Vintage, detailed and ornate, featuring royal figures with elaborate crowns and robes, rich colors, intricate patterns, old parchment background, traditional artistic style, symbols of suits like hearts, spades, diamonds, and clubs.";
// const selectedStyle = "Universe, cosmic, magical, spiritual, ethereal, mystical, astrological, stars";

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

// Prompt: Character that represents the Poker Card 🎭 of Jester, chaotic, unpredictable, playful, in the style of multicolor with multicolor, vibrant, 🎭 symbols of Jester arranged artistically, transparent background
function generatePrompt(suite, value) {
  const suiteInfo = suiteCharacteristics[suite];
  let rank = cardRanks[value] || value;
  // let rank = value;
  // let rank = cardRanks[value];
  console.log('rank or value: ', rank);
  // clg
  // Character that represents the
  let basePrompt = `${rank} of ${suiteInfo.name}, ${suiteInfo.traits}, ${suiteInfo.style} with ${suiteInfo.palette} bold and simple colors, high-contrast color palette, hd, fully detailed`;
  // let basePrompt = `Personaje que representa a la Carta de póker ${rank} de ${suiteInfo.name}, ${suiteInfo.traits}, en estilo ${suiteInfo.color} con ${suiteInfo.palette}`;

  if (rank === "King" || rank === "Queen" || rank === "Jack") {
    basePrompt += `, unique fantasy-themed character in dynamic pose upper body, royal figure with an elaborated clothing and symbols of ${suiteInfo.name} prominently displayed`; // determined look
    // basePrompt += `, figura real con atuendo elaborado y símbolos de ${suiteInfo.name}`;
  } else if (rank === "As") {
    // basePrompt += `, diseño elegante centrado en un gran símbolo de ${suiteInfo.name}`;
    basePrompt += `,  elegant design centered on a large symbol of ${suiteInfo.name}`;
  } else if (rank === "🎭") {
    basePrompt += `, full body character, burlesque and chaotic figure with elements of all suits, using a masks, determined look`;
    // basePrompt += `, figura burlesca y caótica con elementos de todos los palos`;
  } else {
    basePrompt += `, ${value} symbols of ${suiteInfo.name} arranged artistically, symbols of suits such as ${suiteInfo.name} prominently displayed`;
    // basePrompt += `, ${value} símbolos de ${suiteInfo.name} dispuestos de manera artística`;
  }

  return basePrompt + ", clean white background behind the figure"; //sharp features, heroic
  // return basePrompt + ", transparent background"; //sharp features, heroic
  // return basePrompt + ", fondo transparente";
}

// Función para generar la imagen usando la API de Segmind
async function generateImage(prompt, api) {
  try {
    const response = await axios.post(
      backendUrl + api,
      {
        prompt: prompt + ", high quality, detailed",
        // negative_prompt: "background, multiple characters, blurry, low quality, clothing covering symbolic elements",
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
      // link.href = canvas.toDataURL('image/png'); // Exporta como PNG de alta calidad
      link.download = `${suiteSelect.value}_${valueSelect.value}.png`;
      link.click();
  });
});


// Consejos adicionales:
// Calidad en JPEG: Si decides exportar en JPEG (por ejemplo, canvas.toDataURL('image/jpeg', 0.95)), puedes ajustar la calidad con un valor entre 0 y 1. Para una calidad casi sin pérdidas, utiliza un valor cercano a 1.

// Tamaño del archivo: Ten en cuenta que aumentar la escala puede generar archivos más grandes. Esto mejora la calidad pero también puede ralentizar la exportación, especialmente si la imagen tiene muchos detalles.