import { useEffect, useState } from "react";
import { Maximize2 } from "lucide-react";

export default function FullscreenButton({ className = "" }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
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
      console.error("Error al cambiar modo pantalla completa:", err);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className={`p-3 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 ${className}`}
      title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
    >
      <Maximize2 className="w-5 h-5" strokeWidth={1.5} />
    </button>
  );
}
