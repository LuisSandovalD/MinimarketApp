export default function Loading(){
    return(
        <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#CBD5E1] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-[#94A3B8] border-t-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
          </div>
          <p className="text-[#64748B] font-bold text-lg">Cargando información...</p>
          <p className="text-[#94A3B8] text-sm mt-2">Preparando tus datos</p>
        </div>
      </div>
    );
}