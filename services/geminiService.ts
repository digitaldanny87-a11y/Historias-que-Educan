import { GoogleGenAI, Type, Schema, Chat } from "@google/genai";
import { GeneratedBook, UserPreferences, ActivityType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const bookSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Un título creativo para el libro." },
    description: { type: Type.STRING, description: "Una breve introducción motivadora para el niño." },
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
          content: { type: Type.STRING, description: "El contenido principal: el texto de la historia, la pregunta matemática, o las instrucciones de dibujo." },
          hint: { type: Type.STRING, description: "Una pista pequeña y útil para el niño." },
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
  required: ["title", "description", "pages"]
};

export const generateBook = async (prefs: UserPreferences): Promise<GeneratedBook> => {
  const modelId = 'gemini-3-flash-preview';
  
  const prompt = `
    Crea un libro de actividades didácticas para un niño llamado ${prefs.childName} de ${prefs.age} años.
    El nivel de dificultad debe ser: ${prefs.difficulty}.
    Los temas seleccionados son: ${prefs.topics.join(', ')}.
    
    El libro debe contener exactamente 6 páginas variadas.
    
    Instrucciones por tipo de página:
    - STORY: Una historia muy corta (max 100 palabras) que incluya al niño como protagonista y los temas.
    - QUIZ: Una pregunta relacionada con lo aprendido o cultura general acorde a la edad.
    - MATH: Un problema matemático divertido adaptado a su edad (${prefs.age} años).
    - DRAWING: Instrucciones creativas para que el niño dibuje algo en el espacio en blanco.
    - VOCABULARY: 3 palabras relacionadas con el tema con sus definiciones simples.
    
    Asegúrate de que el tono sea animado, educativo y alentador.
    Responde estrictamente en formato JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: bookSchema,
        temperature: 0.7
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as GeneratedBook;
    }
    throw new Error("No se pudo generar el contenido.");
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
      systemInstruction: `Eres un asistente experto en literatura infantil y educación para la app "EduBook AI".
Tu objetivo es ayudar a los padres o maestros a elegir temas creativos para un libro de actividades personalizado.
1. Pregunta por los intereses del niño si no los conoces.
2. Basándote en la descripción, sugiere temas originales y divertidos (ej. "Dinosaurios Cocineros", "Viaje a Marte", "Matemáticas en la Selva").
3. Si sugieres temas concretos para el libro, DEBES incluirlos al final de tu respuesta en un bloque de código JSON válido, así:
\`\`\`json
["Tema Sugerido 1", "Tema Sugerido 2"]
\`\`\`
Mantén un tono alegre y servicial.`
    }
  });
};