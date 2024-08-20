const selectedStyle = "minimalist and geometric shapes, vector art";
// bold and simple colors, high-contrast color palette,

// Characteristics of the suits
const suiteCharacteristics = {
  "♠️": {
    name: "♠️ Pikes (spades)", // Spades
    color: "black",
    traits: "elegant, noble, mysterious",
    palette: "dark tones, black, gray, silver",
    style: selectedStyle,
  },
  "♦️": {
    name: "♦️ Tiles (diamonds)", // DIamonds
    color: "red",
    traits: "luxurious, bright, valuable",
    palette: "blue, gold, white",
    style: selectedStyle,
  },
  "♣️": {
    name: "♣️ Clovers (clubs)", // Clubs
    color: "black",
    traits: "natural, lucky, earthy",
    palette: "dark green, brown, black",
    style: selectedStyle,
  },
  "♥️": {
    name: "♥️ Hearts",
    color: "red",
    traits: "passionate, emotional, warm",
    palette: "red, pink, white, feathers",
    style: selectedStyle,
  },
  "🎭": {
    name: "Jester (joker)",
    color: "multicolor",
    traits: "chaotic, unpredictable, playful, sad, funny, happy",
    palette: "blue, yellow, gold, vibrant",
    style: selectedStyle,
  },
};

// Rangos de las cartas
const cardRanks = {
  1: "Ace", // As
  J: "Jack",
  Q: "Queen",
  K: "King",
  Jester: "Jester",
};

// Elementos del DOM
const suiteSelect = document.getElementById("suiteSelect");
const valueSelect = document.getElementById("valueSelect");
const generateBtn = document.getElementById("generateBtn");
const generateBtnPrompt = document.getElementById("generateBtnPrompt");
const generateBtnFlux = document.getElementById("generateBtnFlux");
const cardValue = document.getElementById("cardValue");
const cardImage = document.getElementById("cardImage");
const cardSuite = document.getElementById("cardSuite");
const promptUsed = document.getElementById("promptUsed");
// Export
const exportBtnCardComplete = document.getElementById("exportBtnCardComplete");
const cardElement = document.querySelector(".card");
// Backend
const backendUrl = "https://image-generator-backend-obj1.onrender.com";
const backendUrlFlux = "https://card-generator-app-backend.onrender.com";
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
  console.log("rank or value: ", rank);
  let basePrompt = `${rank} of ${suiteInfo.name}, ${suiteInfo.traits}`;

 switch (rank) {
  case "King" || "Queen":
    basePrompt += `, adult unique fantasy-themed character in dynamic pose, looking at the camera with determined look, full body, with an elaborated clothing and symbols of ${suiteInfo.name} prominently displayed`; // determined look
    break;
  case "Jack":
    basePrompt += `, adult knight fierce fantasy-themed character in dynamic pose, looking at the camera with determined look, full body, with an elaborated armor and helmet and symbols of ${suiteInfo.name} prominently displayed`; // determined look
    break;
  case "Ace":
    basePrompt += `,  elegant design centered on a large symbol of ${suiteInfo.name}`;
    break;
  case "🎭":
    basePrompt += `, grown adult, full body character, burlesque mascarade man, dagger in his hand, symbols of ♥️ ♦️ ♣️ ♠️, using a masks, determined look, serious, mysterious`;
    break;
  default:
    basePrompt += `, only ${value} symbols of ${suiteInfo.name} arranged artistically and prominently displayed`;
    break;
 }
  // // close-up half upper body
  // if (rank === "King" || rank === "Queen") {
  //   basePrompt += `, adult unique fantasy-themed character in dynamic pose, looking at the camera with determined look, full body, with an elaborated clothing and symbols of ${suiteInfo.name} prominently displayed`; // determined look
  // } else if (rank === "Jack") {
  //   basePrompt += `, adult knight fierce fantasy-themed character in dynamic pose, looking at the camera with determined look, full body, with an elaborated armor and helmet and symbols of ${suiteInfo.name} prominently displayed`; // determined look
  // } else if (rank === "Ace") {
  //   basePrompt += `,  elegant design centered on a large symbol of ${suiteInfo.name}`;
  // } else if (rank === "🎭") {
  //   basePrompt += `, grown adult, full body character, burlesque mascarade man, dagger in his hand, symbols of ♥️ ♦️ ♣️ ♠️, using a masks, determined look, serious, mysterious`;
  // } else {
  //   basePrompt += `, only ${value} symbols of ${suiteInfo.name} arranged artistically and prominently displayed`;
  // }

  return (
    basePrompt +
    ` with ${suiteInfo.palette}, clean white background, hd, realistic style, fully detailed`
  ); //sharp features, heroic
}

// Función para generar la imagen usando la API de Segmind
async function generateImage(prompt, api) {
  try {
    const response = await axios.post(
      backendUrl + api,
      {
        prompt: prompt + ", high quality, detailed",
        // "multiple characters, blurry, low quality, clothing covering symbolic elements",
        negative_prompt:
          "blurry, low quality, clothing covering symbolic elements",
        samples: 1,
        scheduler: "UniPC",
        numInferenceSteps: 50,
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
    console.log("Image URL:", imageUrl);
    return imageUrl; // Devolvemos la URL de la imagen
  } catch (error) {
    console.error("Error:", error);
    throw error; // Lanzamos el error para manejarlo en el llamador
  }
}

// Evento para generar la carta con Segmind
generateBtn.addEventListener("click", async () => {
  const suite = suiteSelect.value;
  const value = valueSelect.value;

  // Seleccionar todos los elementos con la clase card-value y card-suite
  const cardValues = document.querySelectorAll(".card-value");
  const cardSuites = document.querySelectorAll(".card-suite");

  // Actualizar la visualización de la carta
  cardValues.forEach((cardValue) => {
    cardValue.textContent = value;
  });
  cardSuites.forEach((cardSuite) => {
    if (suite !== "🎭") {
      cardSuite.textContent = suite;
    } else {
      cardSuite.textContent = "";
    }
  });

  // Cambiar de color si es corazones o diamantes
  const color = suite === "♥️" || suite === "♦️" ? "red" : "black";
  cardValues.forEach((cardValue) => {
    cardValue.style.color = color;
  });
  cardSuites.forEach((cardSuite) => {
    cardSuite.style.color = color;
  });

  // Mostrar estado de carga
  const cardImage = document.querySelector(".card-image");
  cardImage.style.backgroundImage = "none";
  cardImage.textContent = "Generating...";

  // Generar y mostrar el prompt
  const prompt = generatePrompt(suite, value);
  promptUsed.textContent = `Prompt: ${prompt}`;

  promptUsed.style.visibility = "visible";
  // promptUsed.style.display = 'block';

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
      cardImage.style.borderRadius = "1em";
      cardImage.style.backgroundSize = "cover";
    } else {
      throw new Error("No image URL returned");
    }
  } catch (error) {
    console.error("Error generating:", error);
    cardImage.textContent = "Error generating";
  }
});

// evento para generar solo el prompt
generateBtnPrompt.addEventListener("click", async () => {
  const suite = suiteSelect.value;
  const value = valueSelect.value;
  // Generar y mostrar el prompt
  const prompt = generatePrompt(suite, value);
  promptUsed.textContent = `Prompt: ${prompt}`;
  promptUsed.style.visibility = "visible";
});

// Evento para generar la carta con Flux
generateBtnFlux.addEventListener("click", async () => {
  const suite = suiteSelect.value;
  const value = valueSelect.value;

  // Seleccionar todos los elementos con la clase card-value y card-suite
  const cardValues = document.querySelectorAll(".card-value");
  const cardSuites = document.querySelectorAll(".card-suite");

  // Actualizar la visualización de la carta
  cardValues.forEach((cardValue) => {
    cardValue.textContent = value;
  });
  cardSuites.forEach((cardSuite) => {
    cardSuite.textContent = suite !== "🎭" ? suite : "";
  });

  // Cambiar de color si es corazones o diamantes
  const color = suite === "♥️" || suite === "♦️" ? "red" : "black";
  cardValues.forEach((cardValue) => {
    cardValue.style.color = color;
  });
  cardSuites.forEach((cardSuite) => {
    cardSuite.style.color = color;
  });

  // Mostrar estado de carga
  const cardImage = document.querySelector(".card-image");
  cardImage.style.backgroundImage = "none";
  cardImage.textContent = "Generating...";

  // Generar y mostrar el prompt
  const prompt = generatePrompt(suite, value);
  promptUsed.textContent = `Prompt: ${prompt}`;
  promptUsed.style.visibility = "visible";

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
      cardImage.style.borderRadius = "1em";
      cardImage.style.backgroundSize = "cover";
      // background-size: contain;
    } else {
      throw new Error("No image URL returned");
    }
  } catch (error) {
    console.error("Error generating:", error);
    cardImage.textContent = "Error generating";
  }
});

async function generateImageFlux(prompt) {
  const response = await fetch(
    "https://card-generator-app-backend.onrender.com/generate-image-flux",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: prompt,
        width: 512,
        height: 718,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Error generating image");
  }

  const data = await response.json();
  return data.imageUrl;
}


// async function generateImage(prompt, api) {
//   try {
//     const response = await axios.post(
//       backendUrl + api,
//       {
//         prompt: prompt + ", high quality, detailed",
//         negative_prompt:
//           "multiple characters, blurry, low quality, clothing covering symbolic elements",
//         samples: 1,
//         scheduler: "UniPC",
//         numInferenceSteps: 30,
//         guidanceScale: 8,
//         seed: generateRandomSeed(),
//         width: 512, // Establece el ancho a 512
//         height: 718, // Establece la altura a 718
//       },
//       {
//         responseType: "arraybuffer",
//       }
//     );
//     const blob = new Blob([response.data], { type: "image/png" });
//     const imageUrl = URL.createObjectURL(blob);
//     console.log("Image URL:", imageUrl);
//     return imageUrl; // Devolvemos la URL de la imagen
//   } catch (error) {
//     console.error("Error:", error);
//     throw error; // Lanzamos el error para manejarlo en el llamador
//   }
// }

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


// Simplified High Quality Card Export Function
exportBtnCardComplete.addEventListener("click", async () => {
  const scaleFactor = 4; // Ajusta este valor según sea necesario para balancear calidad y rendimiento
  
  // Asegurarse de que la imagen de fondo esté completamente cargada
  const cardImage = document.querySelector(".card-image");
  const backgroundImageUrl = cardImage.style.backgroundImage.slice(5, -2); // Extrae la URL de 'url("...")'
  
  await new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.src = backgroundImageUrl;
  });

  // Configuración de html2canvas
  const options = {
    scale: scaleFactor,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    logging: true,
    width: cardElement.offsetWidth,
    height: cardElement.offsetHeight
  };

  try {
    const canvas = await html2canvas(cardElement, options);
    
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${suiteSelect.value}_${valueSelect.value}.png`;
      link.click();
      
      setTimeout(() => URL.revokeObjectURL(url), 100);
    }, 'image/png', 1.0);
  } catch (error) {
    console.error("Error during export:", error);
    alert("Failed to export the card. Please try again.");
  }
});
