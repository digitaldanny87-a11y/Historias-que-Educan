import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { GeneratedBook, UserPreferences, ActivityType } from "../types";

// Initialize AI client. process.env.API_KEY is replaced by Vite during build.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const bookSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    cover: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Un título creativo y pegadizo para el libro." },
        subtitle: { type: Type.STRING, description: "Un subtítulo motivador o descriptivo." },
        visualDescription: { type: Type.STRING, description: "Una descripción detallada (prompt de imagen) para la portada basada en el estilo pedido." },
        colorTheme: { type: Type.STRING, description: "Color hexadecimal principal para la portada." }
      },
      required: ["title", "subtitle", "visualDescription", "colorTheme"]
    },
    pages: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          type: {
            type: Type.STRING,
            enum: [
              ActivityType.STORY,
              ActivityType.QUIZ,
              ActivityType.DRAWING,
              ActivityType.VOCABULARY,
              ActivityType.MATH
            ],
            description: "El tipo de actividad de esta página."
          },
          title: { type: Type.STRING, description: "Título de la página/actividad." },
          content: { type: Type.STRING, description: "El contenido principal. SI ES 'STORY', DEBE SEGUIR LAS REGLAS PEDAGÓGICAS ESTRICTAS." },
          hint: { type: Type.STRING, description: "Una pista pequeña y útil para el niño." },
          imageDescription: { type: Type.STRING, description: "Descripción de la ilustración que acompaña a esta página." },
          visualElements: {
            type: Type.OBJECT,
            description: "Elementos visuales clave para reforzar la memoria (Solo para páginas de tipo STORY).",
            properties: {
              personaje: { type: Type.STRING },
              escenario: { type: Type.STRING },
              objeto: { type: Type.STRING },
              emocion: { type: Type.STRING },
              accion: { type: Type.STRING }
            },
            nullable: true
          },
          options: {
            type: Type.ARRAY,
            description: "Opciones para preguntas de tipo QUIZ.",
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                isCorrect: { type: Type.BOOLEAN }
              },
              required: ["text", "isCorrect"]
            }
          },
          colorTheme: { type: Type.STRING, description: "Un color sugerido (en hex) para el borde de la página." }
        },
        required: ["type", "title", "content"]
      }
    }
  },
  required: ["cover", "pages"]
};

// Función auxiliar para generar imagen
async function generateCoverImage(prompt: string, style: string): Promise<string | undefined> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: `Genera una ilustración infantil de alta calidad, estilo ${style}. Descripción: ${prompt}. Sin texto, solo arte.` }
        ]
      }
    });
    
    // Buscar la parte de la imagen en la respuesta
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }
    return undefined;
  } catch (error) {
    console.error("Error generating image:", error);
    return undefined;
  }
}

export const generateBook = async (prefs: UserPreferences): Promise<GeneratedBook> => {
  const modelId = 'gemini-3-flash-preview';
  
  const prompt = `
    Actúa como experto en pedagogía infantil y entrenamiento de memoria para niños.
    Tu tarea es crear un libro JSON estructurado que contenga una historia personalizada y actividades.

    PERFIL DEL NIÑO:
    - Nombre: ${prefs.childName}
    - Edad: ${prefs.age} años
    - Intereses: ${prefs.topics.join(', ')}
    - Misión Especial (Concepto a repetir): ${prefs.learningGoal || "Amistad y Memoria"}
    - Escenario: ${prefs.setting || "Mundo Mágico"}
    - Estilo Visual: ${prefs.visualStyle || "Cartoon"}
    - Idea Portada: ${prefs.coverIdea || "Sorpresa"}

    INSTRUCCIONES OBLIGATORIAS PARA LAS PÁGINAS DE TIPO "STORY":
    1. La historia debe tener entre 200 y 300 palabras en total (distribuidas en las páginas de historia).
    2. Usa el nombre "${prefs.childName}" dentro de la historia.
    3. Repite el concepto principal (${prefs.learningGoal}) al menos 4 veces de forma natural.
    4. Usa frases cortas y vocabulario adecuado para ${prefs.age} años.
    5. No incluyas explicaciones académicas.
    6. Termina la historia con una pregunta sencilla para activar memoria.
    7. Mantén un tono cálido, creativo y motivador.

    ESTRUCTURA DEL JSON (array de 'pages'):
    1. STORY: Introducción pedagógica siguiendo las reglas anteriores. Incluye 'visualElements'.
    2. VOCABULARY: 3 Palabras clave extraídas de la historia.
    3. MATH: Un problema matemático simple integrado en el escenario de la historia.
    4. DRAWING: Pide dibujar el 'objeto' o 'personaje' principal mencionado en 'visualElements'.
    5. QUIZ: Pregunta sobre la historia para verificar atención.
    6. STORY: Conclusión emotiva siguiendo las reglas pedagógicas.

    Responde ESTRICTAMENTE en JSON siguiendo el esquema proporcionado.
  `;

  try {
    // 1. Generar Texto y Estructura
    const textResponse = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: bookSchema,
        temperature: 0.7
      }
    });

    if (!textResponse.text) {
      throw new Error("No se pudo generar el contenido del libro.");
    }

    const bookData = JSON.parse(textResponse.text) as GeneratedBook;

    // 2. Generar Imagen de Portada
    // Usamos la descripción visual generada por el modelo de texto para crear la imagen
    if (bookData.cover.visualDescription) {
      const imageBase64 = await generateCoverImage(
        bookData.cover.visualDescription, 
        prefs.visualStyle || 'Cartoon'
      );
      if (imageBase64) {
        bookData.coverImageBase64 = imageBase64;
      }
    }

    return bookData;

  } catch (error) {
    console.error("Error generating book:", error);
    throw error;
  }
};

export const createTopicChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      temperature: 0.7,
      systemInstruction: `Eres un asistente experto en pedagogía infantil. Ayuda a definir objetivos de aprendizaje claros y sencillos.
      
      IMPORTANTE: Cuando sugieras temas específicos para agregar al perfil del niño, al final de tu respuesta (después de tu mensaje amigable) INCLUYE SIEMPRE un bloque JSON con un array de strings sugiriendo temas cortos (máximo 2 palabras por tema).
      
      Ejemplo de formato de respuesta:
      "¡Claro! A los niños de esa edad les encantan los dinosaurios T-Rex. ¿Te gustaría agregar eso?"
      \`\`\`json
      ["Dinosaurios", "Volcanes", "Fósiles"]
      \`\`\`
      `
    }
  });
};