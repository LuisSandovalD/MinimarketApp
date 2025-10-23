import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, Maximize2 } from "lucide-react";
import fondo from "../../assets/img/Home/home.jpg";

export default function Home() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [showHint, setShowHint] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const hintTimer = setTimeout(() => {
      setShowHint(true);
    }, 2000);

    const handleInteraction = () => {
      navigate("/login");
    };
    
    window.addEventListener("click", handleInteraction);
    window.addEventListener("keydown", handleInteraction);
    
    return () => {
      clearTimeout(hintTimer);
      window.removeEventListener("click", handleInteraction);
      window.removeEventListener("keydown", handleInteraction);
    };
  }, [navigate]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async (e) => {
    e.stopPropagation();
    
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error al cambiar modo pantalla completa:', err);
    }
  };

  const formattedTime = time.toLocaleTimeString("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const formattedDate = time.toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div 
      className="relative flex flex-col items-center justify-start min-h-screen bg-cover bg-center text-white overflow-hidden select-none cursor-pointer"
      style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: 'times-roman',
      }}
    >
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
      
      <button
        onClick={toggleFullscreen}
        className="absolute top-6 right-6 z-50 p-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110"
        title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
      >
        <Maximize2 className="w-5 h-5" strokeWidth={1.5} />
      </button>

      <div className="relative z-10 flex flex-col items-center pt-24 space-y-6 px-6">
        <div className="text-center rounded-3xl p-12">
          <h1 className="text-9xl font-bold tracking-wider mb-4 drop-shadow-2xl">
            {formattedTime}
          </h1>
          <p className="text-3xl font-thin capitalize tracking-wide">
            {formattedDate}
          </p>
        </div>

        <div 
          className={`transition-all duration-1000 mt-32 ${
            showHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="flex flex-col items-center space-y-4 rounded-2xl px-8 py-6">
            <ChevronUp className="w-8 h-8 animate-bounce opacity-70" strokeWidth={1.5} />
            <p 
              className=" font-light tracking-wide opacity-85 text-3x1"
            >
              Haz clic en cualquier lugar para continuar
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10 backdrop-blur-md bg-black/20 rounded-full px-6 py-3 border border-white/10">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-sm font-light opacity-80">
            Sistema bloqueado
          </span>
        </div>
      </div>
    </div>
  );
}