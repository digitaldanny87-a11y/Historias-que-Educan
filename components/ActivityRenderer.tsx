import React, { useState } from 'react';
import { BookPage, ActivityType } from '../types';

interface ActivityRendererProps {
  page: BookPage;
}

const ActivityRenderer: React.FC<ActivityRendererProps> = ({ page }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  const renderContent = () => {
    switch (page.type) {
      case ActivityType.STORY:
        return (
          <div className="prose prose-lg text-gray-700 mx-auto">
            <div className="float-right ml-4 mb-4 w-32 h-32 bg-yellow-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-4 border-white">
              📖
            </div>
            <p className="whitespace-pre-line leading-relaxed text-xl">{page.content}</p>
          </div>
        );

      case ActivityType.MATH:
        return (
          <div className="flex flex-col items-center justify-center py-8">
             <div className="bg-blue-50 p-8 rounded-3xl border-4 border-dashed border-blue-200 mb-6 w-full text-center">
                <h3 className="text-3xl font-bold text-blue-800 mb-4">¡Reto Matemático!</h3>
                <p className="text-2xl text-gray-800 font-mono">{page.content}</p>
             </div>
             <div className="w-full h-32 border-b-2 border-gray-300 flex items-end pb-2">
                <span className="text-gray-400">Escribe tu respuesta aquí...</span>
             </div>
          </div>
        );

      case ActivityType.QUIZ:
        return (
          <div className="space-y-6">
            <p className="text-xl font-medium text-gray-800 mb-4">{page.content}</p>
            <div className="space-y-3">
              {page.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => !showAnswer && setSelectedOption(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ${
                    showAnswer
                      ? option.isCorrect
                        ? 'bg-green-100 border-green-500 text-green-800'
                        : selectedOption === idx
                        ? 'bg-red-100 border-red-500 text-red-800'
                        : 'border-gray-200 opacity-50'
                      : selectedOption === idx
                      ? 'bg-indigo-50 border-indigo-500 shadow-md'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="font-semibold text-lg">{option.text}</span>
                  {showAnswer && option.isCorrect && <span>✅</span>}
                  {showAnswer && !option.isCorrect && selectedOption === idx && <span>❌</span>}
                </button>
              ))}
            </div>
            {selectedOption !== null && !showAnswer && (
              <button
                onClick={() => setShowAnswer(true)}
                className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded-full font-bold hover:bg-indigo-700 transition-colors"
              >
                Comprobar
              </button>
            )}
            {showAnswer && (
               <p className="text-center text-gray-600 animate-pulse mt-2">
                 {page.options?.[selectedOption!]?.isCorrect ? "¡Excelente trabajo! 🎉" : "¡Inténtalo de nuevo! 💪"}
               </p>
            )}
          </div>
        );

      case ActivityType.DRAWING:
        return (
          <div className="h-full flex flex-col">
            <p className="text-lg text-gray-700 mb-4 italic">"{page.content}"</p>
            <div className="flex-grow border-4 border-gray-200 border-dashed rounded-xl bg-white relative group min-h-[300px]">
              <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
                <span className="text-6xl opacity-20">🎨</span>
              </div>
              <p className="absolute bottom-2 right-4 text-gray-400 text-sm group-hover:text-gray-600 transition-colors">
                Zona de dibujo
              </p>
            </div>
          </div>
        );

      case ActivityType.VOCABULARY:
          return (
              <div className="grid gap-4">
                  <div className="bg-orange-50 p-4 rounded-xl border-l-4 border-orange-400">
                      <p className="text-lg text-gray-800 whitespace-pre-line">{page.content}</p>
                  </div>
                  <div className="mt-4 text-center">
                      <p className="text-gray-500 mb-2">¡Intenta usar estas palabras en una frase!</p>
                      <div className="h-24 border-b border-gray-300 border-dashed w-full"></div>
                  </div>
              </div>
          )

      default:
        return <p>{page.content}</p>;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
      {page.hint && (
        <div className="mt-6 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800 flex items-start gap-2 border border-yellow-200">
          <span>💡</span>
          <p><strong>Pista:</strong> {page.hint}</p>
        </div>
      )}
    </div>
  );
};

export default ActivityRenderer;