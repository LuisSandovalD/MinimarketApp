import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricCard({
  title,
  value,
  icon: Icon,
  trend,
  trendValue,
  iconBg,
  iconColor,
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {trendValue !== undefined && (
            <div className="flex items-center mt-2">
              {trend === 'up' ? (
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trendValue > 0 ? '+' : ''}{trendValue}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs período anterior</span>
            </div>
          )}
        </div>
        <div className={`${iconBg} p-3 rounded-full`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

