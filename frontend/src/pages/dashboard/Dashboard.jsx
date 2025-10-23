import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../../api/auth";
import { getDashboardData } from "../../api/dashboard";
import NavBar from "../../components/navbars/NavBarAdmin";
import {
  LogOut,
  Users,
  Wifi,
  ShoppingCart,
  Package,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Calendar,
  Bell,
  Search,
  Download,
  Eye,
  Clock,
  AlertTriangle,
  Activity,
  Sparkles,
} from "lucide-react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

const MetricCard = ({ stat, index }) => {
  const gradients = [
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-blue-500 to-indigo-600",
    "from-purple-500 to-pink-600",
  ];

  return (
    <div className="group relative bg-white rounded-2xl border border-[#E2E8F0] p-6 hover:shadow-2xl hover:border-[#CBD5E1] transition-all duration-500 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[index]} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className={`p-3.5 rounded-xl bg-gradient-to-br ${gradients[index]} shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
            <stat.icon className="text-white" size={24} />
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${stat.trend === "up" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {stat.trend === "up" ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            {stat.change}
          </div>
        </div>

        <h3 className="text-3xl font-black text-[#1E293B] tracking-tight mb-2">{stat.value}</h3>
        <p className="text-sm text-[#64748B] font-semibold">{stat.title}</p>

        <div className="mt-4 h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
          <div className={`h-full bg-gradient-to-r ${gradients[index]} rounded-full transition-all duration-1000`} style={{ width: stat.trend === "up" ? "75%" : "45%" }}></div>
        </div>
      </div>
    </div>
  );
};

const ChartCard = ({ title, subtitle, icon: Icon, children }) => (
  <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-500">
    <div className="p-6 border-b border-[#E2E8F0]">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-[#F8FAFC] to-[#F1F5F9] rounded-xl border border-[#E2E8F0]">
          <Icon className="text-[#64748B]" size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#1E293B]">{title}</h2>
          {subtitle && <p className="text-xs text-[#64748B] mt-1">{subtitle}</p>}
        </div>
      </div>
    </div>
    <div className="p-6">{children}</div>
  </div>
);

const CreditItem = ({ credito, index }) => {
  const colors = [
    "from-orange-400 to-red-500",
    "from-blue-400 to-indigo-500",
    "from-purple-400 to-pink-500",
    "from-green-400 to-emerald-500",
  ];

  return (
    <div className="group bg-gradient-to-br from-white to-[#F8FAFC] rounded-xl border border-[#E2E8F0] p-4 hover:shadow-lg hover:border-[#CBD5E1] transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 bg-gradient-to-br ${colors[index % 4]} rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {credito.cliente?.charAt(0) || "?"}
          </div>
          <div>
            <p className="font-bold text-[#1E293B] text-sm">{credito.cliente || "Cliente desconocido"}</p>
            <div className="flex items-center gap-2 mt-1">
              <Clock size={12} className="text-[#94A3B8]" />
              <p className="text-xs text-[#64748B]">{credito.fecha || "Fecha no disponible"}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-xl text-[#1E293B]">${credito.monto || 0}</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold mt-2">
            <AlertTriangle size={12} />
            Pendiente
          </span>
        </div>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-[#E2E8F0]">
        <p className="font-bold text-[#1E293B] text-sm mb-2">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-[#64748B] text-sm">
            <span className="font-black text-[#1E293B]">${entry.value?.toLocaleString()}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const ActionButton = ({ icon: Icon, label, onClick, variant = "default" }) => {
  const variants = {
    default: "bg-white hover:bg-[#F1F5F9] text-[#1E293B] border-[#E2E8F0]",
    primary: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-transparent shadow-lg",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-transparent shadow-lg",
  };

  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all duration-300 hover:scale-105 ${variants[variant]}`}>
      <Icon size={18} />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
};

// ========== COMPONENTE PRINCIPAL ==========

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });
  const [dashboard, setDashboard] = useState(null);
  const [timeOfDay, setTimeOfDay] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay("Buenos días");
    else if (hour < 18) setTimeOfDay("Buenas tardes");
    else setTimeOfDay("Buenas noches");
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    getUser(token)
      .then((data) => {
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      });

    getDashboardData(token)
      .then((res) => setDashboard(res))
      .catch((err) => console.error("Error cargando dashboard:", err));
  }, [navigate]);

  if (!user || !dashboard) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#F8FAFC]">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#CBD5E1] border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-4 border-[#94A3B8] border-t-transparent rounded-full animate-spin" style={{ animationDirection: "reverse", animationDuration: "1.5s" }}></div>
          </div>
          <p className="text-[#64748B] font-bold text-lg">Cargando Dashboard...</p>
          <p className="text-[#94A3B8] text-sm mt-2">Preparando tus datos</p>
        </div>
      </div>
    );
  }

  const cards = dashboard.cards || {};
  const charts = dashboard.charts || {};
  const creditos = dashboard.creditosPendientes || [];

  const pieData = [
    { name: "Pendientes", value: creditos.length },
    { name: "Pagados", value: 10 },
  ];

  const COLORS = ["#F97316", "#10B981"];

  const stats = [
    {
      title: "Ventas Totales",
      value: `S/. ${cards.totalVentas?.toLocaleString() ?? 0}`,
      change: "+20.1%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Compras Totales",
      value: `S/. ${cards.totalCompras?.toLocaleString() ?? 0}`,
      change: "+12.5%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Clientes Registrados",
      value: cards.totalClientes ?? 0,
      change: "+3",
      trend: "up",
      icon: Users,
    },
    {
      title: "Productos en Stock",
      value: cards.totalProductos ?? 0,
      change: "-2",
      trend: "down",
      icon: Package,
    },
  ];

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <NavBar />

      <main className="flex-1 lg:ml-72 lg:pt-2  p-4 sm:p-8 pt-20 ">
        {/* HEADER */}
        <div className="mb-8 sm:pt-8 sm:pt-8">
          <div className="flex items-center lg:flex-row justify-between lg:items-center gap-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">
                  {user.name?.charAt(0) || "U"}
                </div>
                <div>
                  <p className="text-sm text-[#64748B] font-semibold">{timeOfDay}</p>
                  <h1 className="text-3xl lg:text-4xl font-black text-[#1E293B]">
                    {user.name}
                    <span className="inline-block ml-2">👋</span>
                  </h1>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[#64748B] flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-lg border border-[#E2E8F0]">
                  <Calendar size={16} />
                  <span className="text-sm font-semibold">
                    {new Date().toLocaleDateString("es-ES", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                  <Activity size={16} />
                  <span className="text-sm font-bold">Sistema activo</span>
                </div>
              </div>
            </div>
             <ActionButton
                icon={LogOut}
                label="Salir"
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("user");
                  navigate("/");
                }}
                variant="danger"
              />
          </div>

         
        </div>

        {/* MÉTRICAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <MetricCard key={index} stat={stat} index={index} />
          ))}
        </div>

        {/* GRÁFICOS PRINCIPALES */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <ChartCard title="Evolución de Ventas" subtitle="Rendimiento mensual del último año" icon={TrendingUp}>
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={charts.ventasPorMes}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="mes" stroke="#64748B" style={{ fontSize: "12px", fontWeight: "600" }} />
                <YAxis stroke="#64748B" style={{ fontSize: "12px", fontWeight: "600" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="total" stroke="#3B82F6" strokeWidth={3} fill="url(#colorVentas)" />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Productos" subtitle="Los más vendidos este mes" icon={Package}>
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={charts.productosTop}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#64748B" style={{ fontSize: "12px", fontWeight: "600" }} />
                <YAxis stroke="#64748B" style={{ fontSize: "12px", fontWeight: "600" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="total_vendido" fill="#8B5CF6" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* GRÁFICOS SECUNDARIOS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ChartCard title="Estado de Créditos" subtitle={`${creditos.length} pendientes`} icon={DollarSign}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: "12px", fontWeight: "600" }} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <div className="lg:col-span-2">
            <ChartCard title="Mejores Clientes" subtitle="Por volumen de compras" icon={Users}>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={charts.clientesTop} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis type="number" stroke="#64748B" style={{ fontSize: "12px", fontWeight: "600" }} />
                  <YAxis type="category" dataKey="name" stroke="#64748B" style={{ fontSize: "12px", fontWeight: "600" }} width={120} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="total_compras" fill="#10B981" radius={[0, 12, 12, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>
        </div>

        {/* LISTA DE CRÉDITOS */}
        {creditos.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="p-6 border-b border-[#E2E8F0]">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl">
                    <AlertTriangle className="text-orange-600" size={24} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-[#1E293B]">Créditos Pendientes de Pago</h2>
                    <p className="text-sm text-[#64748B] mt-1">Requieren atención inmediata</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-4 py-2 bg-orange-50 text-orange-700 rounded-xl text-sm font-black border border-orange-200">
                    {creditos.length} {creditos.length === 1 ? "crédito" : "créditos"}
                  </span>
                  <button className="p-2 hover:bg-[#F1F5F9] rounded-lg transition-all">
                    <Search size={20} className="text-[#64748B]" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
                {creditos.map((credito, index) => (
                  <CreditItem key={index} credito={credito} index={index} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}