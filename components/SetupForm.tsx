import React, { useState } from 'react';
import { UserPreferences, AVAILABLE_TOPICS } from '../types';
import ChatAssistant from './ChatAssistant';

interface SetupFormProps {
  onSubmit: (prefs: UserPreferences) => void;
  isLoading: boolean;
}

const SetupForm: React.FC<SetupFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [age, setAge] = useState(6);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<'Fácil' | 'Medio' | 'Difícil'>('Medio');

  const MAX_TOPICS = 5;

  const toggleTopic = (topic: string) => {
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(prev => prev.filter(t => t !== topic));
    } else {
      if (selectedTopics.length < MAX_TOPICS) {
        setSelectedTopics(prev => [...prev, topic]);
      }
    }
  };

  const addTopicFromAI = (topic: string) => {
    if (!selectedTopics.includes(topic) && selectedTopics.length < MAX_TOPICS) {
      setSelectedTopics(prev => [...prev, topic]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTopics.length === 0) return;
    onSubmit({
      childName: name || 'Explorador',
      age,
      topics: selectedTopics,
      difficulty
    });
  };

  return (
    <div className="relative">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border-4 border-blue-100">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">¡Crea tu Aventura!</h1>
          <p className="text-gray-500">Diseña un libro único para aprender jugando.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Child Name */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">¿Cómo se llama el niño/a?</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Sofía"
              className="w-full p-4 rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none text-lg transition-colors"
            />
          </div>

          {/* Age Slider */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Edad: <span className="text-blue-600 text-2xl">{age}</span> años</label>
            <input
              type="range"
              min="3"
              max="12"
              value={age}
              onChange={(e) => setAge(parseInt(e.target.value))}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>3 años</span>
              <span>12 años</span>
            </div>
          </div>

          {/* Topics Selection */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              Elige hasta {MAX_TOPICS} temas favoritos:
            </label>
            
            {/* Selected Topics Area */}
            <div className="mb-4 p-4 bg-blue-50 rounded-xl min-h-[60px] border-2 border-dashed border-blue-200 flex flex-wrap gap-2 items-center">
               {selectedTopics.length === 0 ? (
                 <span className="text-gray-400 italic text-sm w-full text-center">
                   Selecciona temas abajo o pide ayuda al chat mágico ✨
                 </span>
               ) : (
                 selectedTopics.map((topic) => (
                   <div key={topic} className="bg-blue-500 text-white px-3 py-1 rounded-full font-semibold flex items-center gap-2 shadow-sm animate-fade-in-up">
                     <span>{topic}</span>
                     <button
                       type="button"
                       onClick={() => toggleTopic(topic)}
                       className="hover:bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                     >✕</button>
                   </div>
                 ))
               )}
            </div>
            
            <p className="text-xs text-gray-500 mb-2 font-bold uppercase tracking-wider">Sugerencias populares:</p>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_TOPICS.map((topic) => {
                const isSelected = selectedTopics.includes(topic);
                if (isSelected) return null; // Already shown in the box above
                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => toggleTopic(topic)}
                    disabled={selectedTopics.length >= MAX_TOPICS}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                       selectedTopics.length >= MAX_TOPICS
                       ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                       : 'bg-gray-100 text-gray-600 hover:bg-blue-100 hover:text-blue-600'
                    }`}
                  >
                    + {topic}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">Nivel de Desafío:</label>
            <div className="flex gap-4">
              {['Fácil', 'Medio', 'Difícil'].map((level) => (
                <label key={level} className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="difficulty"
                    value={level}
                    checked={difficulty === level}
                    onChange={() => setDifficulty(level as any)}
                    className="peer sr-only"
                  />
                  <div className="text-center py-3 rounded-xl border-2 border-gray-200 peer-checked:border-green-500 peer-checked:bg-green-50 peer-checked:text-green-700 font-bold transition-all">
                    {level}
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || selectedTopics.length === 0}
            className={`w-full py-4 rounded-xl text-xl font-bold text-white shadow-lg transition-all transform active:scale-95 ${
              isLoading || selectedTopics.length === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:shadow-xl hover:from-blue-600 hover:to-indigo-700'
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creando Magia...
              </span>
            ) : (
              '✨ Generar Libro ✨'
            )}
          </button>
        </form>
      </div>
      
      {/* Floating Chat Assistant */}
      <ChatAssistant onAddTopic={addTopicFromAI} selectedTopics={selectedTopics} />
      
      <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SetupForm;