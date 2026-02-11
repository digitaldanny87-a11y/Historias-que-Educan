import React, { useState } from 'react';
import SetupForm from './components/SetupForm';
import BookViewer from './components/BookViewer';
import { generateBook } from './services/geminiService';
import { GeneratedBook, UserPreferences } from './types';

const App: React.FC = () => {
  const [book, setBook] = useState<GeneratedBook | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateBook = async (prefs: UserPreferences) => {
    setLoading(true);
    setError(null);
    try {
      const newBook = await generateBook(prefs);
      setBook(newBook);
    } catch (err) {
      setError("Hubo un problema creando el libro. Por favor, verifica tu conexión e inténtalo de nuevo.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetApp = () => {
    setBook(null);
    setError(null);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-8 bg-[#f0f9ff]">
      {/* Background decoration */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <header className="mb-8 text-center no-print flex flex-col items-center">
         <img 
            src="https://bvhbrbidsdytynfarlth.supabase.co/storage/v1/object/public/imagenes/ninos.jpg" 
            alt="Niños explorando y aprendiendo" 
            className="h-48 w-auto rounded-3xl shadow-xl mb-6 border-4 border-white transform hover:scale-105 transition-transform duration-300 object-cover"
         />
         <h1 className="text-4xl font-black text-blue-900 tracking-tight drop-shadow-sm">
            EduBook <span className="text-blue-500">AI</span> 🎓
         </h1>
      </header>

      <main className="container mx-auto">
        {error && (
          <div className="max-w-2xl mx-auto mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded shadow-md flex justify-between items-center">
            <p>{error}</p>
            <button onClick={() => setError(null)} className="font-bold">✕</button>
          </div>
        )}

        {!book ? (
          <SetupForm onSubmit={handleCreateBook} isLoading={loading} />
        ) : (
          <BookViewer book={book} onReset={resetApp} />
        )}
      </main>

      {/* Video Section */}
      <section className="container mx-auto mt-16 mb-8 no-print">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border-4 border-blue-100 transform rotate-1 hover:rotate-0 transition-transform duration-500">
             <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-800 mb-6 flex items-center justify-center gap-3">
               <span>🎥</span> Mira cómo funciona la magia
             </h2>
             <div className="relative rounded-2xl overflow-hidden shadow-inner bg-black aspect-video border-4 border-white">
                <video 
                   controls 
                   className="w-full h-full object-cover"
                >
                   <source src="https://bvhbrbidsdytynfarlth.supabase.co/storage/v1/object/public/videos/2e569989882f6f036bcd2f492e410cd1_720w.mp4" type="video/mp4" />
                   Tu navegador no soporta el elemento de video.
                </video>
             </div>
          </div>
        </div>
      </section>

      <footer className="mt-12 text-center text-gray-400 text-sm no-print">
        <p>Potenciado por Google Gemini API</p>
      </footer>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default App;