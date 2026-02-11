import React, { useState } from 'react';
import { GeneratedBook } from '../types';
import ActivityRenderer from './ActivityRenderer';

interface BookViewerProps {
  book: GeneratedBook;
  onReset: () => void;
}

const BookViewer: React.FC<BookViewerProps> = ({ book, onReset }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      {/* Navigation & Tools - Hidden when printing */}
      <div className="no-print flex justify-between items-center mb-6">
        <button
          onClick={onReset}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-bold transition-colors"
        >
          ← Crear otro libro
        </button>
        <div className="flex gap-4">
           <span className="bg-white px-4 py-2 rounded-full shadow text-sm font-bold text-gray-500">
              Página {currentPage + 1} de {book.pages.length}
           </span>
          <button
            onClick={handlePrint}
            className="bg-green-500 text-white px-4 py-2 rounded-full font-bold shadow hover:bg-green-600 transition-transform hover:scale-105 flex items-center gap-2"
          >
            🖨️ Imprimir Libro
          </button>
        </div>
      </div>

      {/* Book Cover (Only visible on first page or print) */}
      <div className={`book-page mb-8 bg-gradient-to-br from-blue-400 to-purple-500 p-12 rounded-3xl shadow-2xl text-white text-center page-break ${currentPage !== 0 ? 'hidden print:block' : ''}`}>
         <div className="border-4 border-white/30 p-8 h-full rounded-2xl flex flex-col justify-center items-center">
            <h1 className="text-6xl font-black mb-6 drop-shadow-md">{book.title}</h1>
            <p className="text-2xl font-light mb-12">{book.description}</p>
            <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-6xl backdrop-blur-sm animate-bounce">
                🚀
            </div>
            <p className="mt-12 text-sm opacity-75">Un libro de actividades generado por EduBook AI</p>
         </div>
      </div>

      {/* Pages Container */}
      <div className="print:block">
        {book.pages.map((page, index) => (
          <div
            key={index}
            className={`book-page bg-white p-8 md:p-12 rounded-3xl shadow-xl min-h-[600px] border relative overflow-hidden transition-all duration-300 page-break mb-8 print:mb-0 print:shadow-none print:border-none print:h-screen
              ${index === currentPage ? 'block' : 'hidden print:block'}`}
            style={{ borderColor: page.colorTheme || '#e5e7eb' }}
          >
            {/* Decorative Corner */}
            <div
                className="absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-full no-print pointer-events-none"
                style={{ backgroundColor: page.colorTheme || '#3b82f6' }}
            ></div>

            {/* Header */}
            <div className="flex justify-between items-center mb-8 border-b-2 border-gray-100 pb-4">
               <h2 className="text-3xl font-bold text-gray-800">{page.title}</h2>
               <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{page.type}</span>
            </div>

            {/* Content */}
            <ActivityRenderer page={page} />

            {/* Footer */}
            <div className="absolute bottom-6 left-0 right-0 text-center text-gray-300 text-sm font-bold">
               - {index + 1} -
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Controls (Bottom) - Hidden on Print */}
      <div className="no-print flex justify-between mt-6">
         <button
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-6 py-3 rounded-full font-bold bg-white shadow hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
         >
            Anterior
         </button>
         <button
            onClick={() => setCurrentPage(p => Math.min(book.pages.length - 1, p + 1))}
            disabled={currentPage === book.pages.length - 1}
            className="px-6 py-3 rounded-full font-bold bg-blue-600 text-white shadow hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
         >
            Siguiente
         </button>
      </div>
    </div>
  );
};

export default BookViewer;