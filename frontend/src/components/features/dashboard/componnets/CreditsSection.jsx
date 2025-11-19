// src/components/dashboard/CreditsSection.jsx

export default function CreditsSection({ data }) {
    if (!data?.credits) return null;

    const creditStats = [
        { title: "Total Créditos", value: data.credits.total, color: "blue", description: "Créditos registrados" },
        { title: "Activos", value: data.credits.activos, color: "yellow", description: "En curso o pendientes" },
        { title: "Pagados", value: data.credits.pagados, color: "green", description: "Créditos completados" },
    ];

    const getColorClasses = (color) => {
        switch (color) {
            case 'yellow':
                return { border: "border-yellow-200", bg: "bg-yellow-50", textMain: "text-yellow-800", textSub: "text-yellow-700" };
            case 'green':
                return { border: "border-green-200", bg: "bg-green-50", textMain: "text-green-800", textSub: "text-green-700" };
            case 'blue': default:
                return { border: "border-blue-200", bg: "bg-blue-50", textMain: "text-blue-800", textSub: "text-blue-700" };
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                Gestión de Créditos
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {creditStats.map((stat, index) => {
                    const classes = getColorClasses(stat.color);

                    return (
                        <div
                            key={index}
                            className={`bg-white rounded-xl p-6 border ${classes.border} shadow-sm hover:shadow-md transition-all`}
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className={`${classes.textSub} text-sm font-medium mb-1`}>
                                        {stat.title}
                                    </p>
                                    <p className={`text-3xl font-bold ${classes.textMain}`}>
                                        {stat.value}
                                    </p>
                                    <p className={`text-xs ${classes.textSub} mt-1`}>
                                        {stat.description}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
