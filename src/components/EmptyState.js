// src/components/EmptyState.js
export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="text-7xl mb-6 animate-bounce">🚀</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Nayi Shuruat Karein!</h3>
      <p className="text-gray-500 max-w-xs mx-auto">
        Aapne abhi tak koi habit add nahi ki hai. Niche diye gaye button par click karein aur apna routine banayein.
      </p>
    </div>
  );
}