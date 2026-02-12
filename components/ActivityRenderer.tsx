import React, { useState } from 'react';
import { BookPage, ActivityType } from '../types';

interface ActivityRendererProps {
  page: BookPage;
}

const ActivityRenderer: React.FC<ActivityRendererProps> = ({ page }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Text to Speech Function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES'; // Spanish
      utterance.rate = 0.9; // Slightly slower for kids
      utterance.pitch = 1.1; // Slightly higher pitch
      
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Tu navegador no soporta lectura en voz alta.");
    }
  };

  const renderContent = () => {
    switch (page.type) {
      case ActivityType.STORY:
        return (
          <div className="relative">
            <div className="prose prose-xl text-gray-800 mx-auto leading-loose font-medium">
               <button 
                  onClick={() => speakText(page.content)}
                  className={`float-right ml-6 mb-4 w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-lg border-4 transition-all hover:scale-110 ${isSpeaking ? 'bg-red-100 border-red-400 animate-pulse' : 'bg-yellow-100 border-yellow-400'}`}
                  title={isSpeaking ? "Detener lectura" : "Leer en voz alta"}
               >
                  {isSpeaking ? '🤫' : '🗣️'}
               </button>
               <p className="whitespace-pre-line">{page.content}</p>
            </div>
          </div>
        );

      case ActivityType.MATH:
        return (
          <div className="flex flex-col items-center justify-center py-8">
             <div className="bg-blue-50 p-10 rounded-[3rem] border-8 border-blue-200 mb-8 w-full text-center shadow-xl transform rotate-1">
                <div className="inline-block bg-white px-6 py-2 rounded-full text-blue-500 font-black text-xl mb-4 shadow-sm border border-blue-100 tracking-wider">
                   RETOS MATEMÁTICOS
                </div>
                <p className="text-4xl md:text-5xl text-blue-900 font-black font-mono tracking-wide">{page.content}</p>
             </div>
             
             <div className="w-full max-w-md bg-white p-2 rounded-2xl border-4 border-gray-200 flex gap-2 shadow-inner">
                <div className="flex-1 h-16 border-b-4 border-gray-300 flex items-center justify-center text-gray-400 font-mono text-2xl">
                   ?
                </div>
                <div className="bg-gray-100 rounded-xl px-4 flex items-center justify-center text-3xl">
                   ✏️
                </div>
             </div>
             <p className="text-gray-400 mt-2 text-sm">¡Usa un papel para resolverlo!</p>
          </div>
        );

      case ActivityType.QUIZ:
        return (
          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="bg-indigo-50 p-6 rounded-3xl border-l-8 border-indigo-400 shadow-sm">
               <p className="text-2xl font-bold text-indigo-900 leading-snug">{page.content}</p>
            </div>
            
            <div className="grid gap-4">
              {page.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                     if (!showAnswer) {
                        setSelectedOption(idx);
                        // Optional: Play sound effect here if implemented
                     }
                  }}
                  className={`w-full text-left p-6 rounded-2xl border-b-4 transition-all transform flex justify-between items-center group relative overflow-hidden ${
                    showAnswer
                      ? option.isCorrect
                        ? 'bg-green-100 border-green-500 text-green-900 scale-105 shadow-lg'
                        : selectedOption === idx
                        ? 'bg-red-100 border-red-500 text-red-900 opacity-80'
                        : 'bg-gray-50 border-gray-200 opacity-50'
                      : selectedOption === idx
                      ? 'bg-indigo-100 border-indigo-500 shadow-md translate-y-1 border-b-2'
                      : 'bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 hover:-translate-y-1 hover:shadow-md'
                  }`}
                >
                  <span className="font-bold text-xl relative z-10 flex items-center gap-3">
                     <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 ${showAnswer && option.isCorrect ? 'bg-green-500 text-white border-green-600' : 'bg-white text-gray-500 border-gray-200'}`}>
                        {String.fromCharCode(65 + idx)}
                     </span>
                     {option.text}
                  </span>
                  
                  {showAnswer && option.isCorrect && <span className="text-3xl animate-bounce">🌟</span>}
                  {showAnswer && !option.isCorrect && selectedOption === idx && <span className="text-3xl">🙈</span>}
                </button>
              ))}
            </div>

            {selectedOption !== null && !showAnswer && (
              <div className="text-center mt-6">
                 <button
                   onClick={() => setShowAnswer(true)}
                   className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-10 py-4 rounded-full font-black text-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all animate-pulse"
                 >
                   ✨ Comprobar Respuesta ✨
                 </button>
              </div>
            )}
            
            {showAnswer && (
               <div className={`text-center p-4 rounded-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 ${page.options?.[selectedOption!]?.isCorrect ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                 <p className="text-xl font-bold">
                    {page.options?.[selectedOption!]?.isCorrect ? "¡GENIAL! ¡Eres increíble! 🎉" : "¡Casi! Inténtalo otra vez. 💪"}
                 </p>
               </div>
            )}
          </div>
        );

      case ActivityType.DRAWING:
        return (
          <div className="h-full flex flex-col items-center">
            <div className="bg-yellow-50 px-6 py-4 rounded-full border-2 border-yellow-200 mb-6 shadow-sm transform -rotate-1">
               <p className="text-xl text-yellow-900 font-bold italic">"{page.content}"</p>
            </div>
            
            <div className="w-full flex-grow border-8 border-gray-800 rounded-3xl bg-white relative group min-h-[400px] shadow-2xl overflow-hidden">
               {/* Drawing Paper Texture */}
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]"></div>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 pointer-events-none group-hover:opacity-50 transition-opacity">
                <span className="text-8xl mb-4 transform group-hover:scale-110 transition-transform duration-500">🎨</span>
                <span className="text-2xl font-handwriting transform -rotate-6">¡Tu obra maestra aquí!</span>
              </div>
              
              {/* Fake UI tools */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 opacity-50">
                 {['🔴', '🔵', '🟢', '🟡', '⚫️'].map((c, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gray-100 border shadow-sm flex items-center justify-center text-xs">{c}</div>
                 ))}
              </div>
            </div>
          </div>
        );

      case ActivityType.VOCABULARY:
          return (
              <div className="grid gap-6">
                  <div className="bg-orange-100 p-8 rounded-[2rem] border-4 border-orange-300 relative">
                      <div className="absolute -top-5 -left-5 bg-orange-500 text-white p-3 rounded-xl shadow-lg text-2xl transform -rotate-12">
                         📝
                      </div>
                      <p className="text-2xl text-orange-900 font-bold text-center leading-loose">{page.content}</p>
                  </div>
                  
                  <div className="mt-4 text-center bg-white p-6 rounded-3xl border-2 border-dashed border-gray-300">
                      <p className="text-gray-500 mb-4 font-bold uppercase tracking-widest text-xs">Zona de Práctica</p>
                      <p className="text-xl text-gray-700 mb-4">¡Intenta usar estas palabras en una frase súper divertida!</p>
                      <div className="h-32 w-full bg-blue-50 rounded-xl border-b-4 border-blue-100"></div>
                  </div>
              </div>
          )

      default:
        return <p className="text-xl">{page.content}</p>;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
      
      {page.hint && (
        <div className="mt-8 mx-auto max-w-lg cursor-pointer group perspective">
           <div className="relative transform transition-transform duration-500 preserve-3d group-hover:rotate-x-12">
              <div className="bg-yellow-100 p-4 rounded-2xl text-yellow-800 flex items-center gap-4 border-2 border-yellow-300 shadow-lg">
                <span className="text-4xl animate-bounce">💡</span>
                <div>
                   <p className="font-black uppercase text-xs text-yellow-600 mb-1">Pista Secreta</p>
                   <p className="font-medium text-lg">{page.hint}</p>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ActivityRenderer;