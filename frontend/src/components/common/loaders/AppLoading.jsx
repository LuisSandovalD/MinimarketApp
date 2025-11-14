export default function AppLoading({ page = "sección" }) {
  const formattedPage = page.charAt(0).toUpperCase() + page.slice(1);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 w-screen h-screen overflow-hidden">
      <div className="relative z-10 text-center px-6">
        {/* Spinner triple minimalista */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          {/* Círculo exterior */}
          <div className="absolute inset-0 border-[3px] border-slate-300/50 border-t-blue-500 rounded-full animate-spin"></div>

          {/* Círculo medio */}
          <div
            className="absolute inset-4 border-[3px] border-slate-400/40 border-t-blue-400 rounded-full animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.2s",
            }}
          ></div>

          {/* Círculo interior */}
          <div
            className="absolute inset-8 border-[3px] border-slate-300/30 border-t-blue-300 rounded-full animate-spin"
            style={{
              animationDuration: "0.8s",
            }}
          ></div>

          {/* Punto central */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse shadow-lg shadow-blue-300/40"></div>
          </div>
        </div>

        {/* Texto descriptivo */}
        <div className="space-y-3">
          <p className="text-slate-800 font-bold text-2xl tracking-tight">
            Cargando {formattedPage}
          </p>
          <p className="text-slate-600 text-base font-medium">
            Preparando información de {page.toLowerCase()}
          </p>

          {/* Barra de progreso */}
          <div className="max-w-xs mx-auto mt-6">
            <div className="h-1.5 bg-slate-300/40 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-300 rounded-full animate-progress shadow-lg shadow-blue-300/30"></div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Animaciones */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.05);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.95);
          }
        }

        @keyframes progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
