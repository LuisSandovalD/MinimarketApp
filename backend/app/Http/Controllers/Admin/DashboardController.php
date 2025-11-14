<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Sale;
use App\Models\Shopping;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Credit;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Devuelve las métricas principales del panel de control del administrador.
     * Permite filtrar por fechas desde el frontend (por ejemplo: ?start=2025-01-01&end=2025-01-31)
     */
    public function index(Request $request)
    {
        // Fechas recibidas desde el frontend (React)
        $start = $request->query('start') ? Carbon::parse($request->query('start'))->startOfDay() : Carbon::now()->startOfMonth();
        $end   = $request->query('end')   ? Carbon::parse($request->query('end'))->endOfDay()   : Carbon::now()->endOfMonth();

        // === MÉTRICAS PRINCIPALES ===
        $totalSales = Sale::whereBetween('date', [$start, $end])->sum('total');
        $totalPurchases = Shopping::whereBetween('date', [$start, $end])->sum('total');
        $totalCustomers = Customer::count();
        $totalProducts = Product::count();

        // === ESTADÍSTICA DE CRÉDITOS ===
        $credits = Credit::whereBetween('created_at', [$start, $end]);
        $totalCredits = $credits->count();
        $activeCredits = Credit::where('status', 'pendiente')->count();
        $paidCredits = Credit::where('status', 'pagado')->count();
        $overdueCredits = Credit::where('status', 'vencido')->count();

        // === VENTAS POR DÍA (para gráficos de línea o barras) ===
        $salesByDay = Sale::select(
                DB::raw('DATE(date) as day'),
                DB::raw('SUM(total) as total')
            )
            ->whereBetween('date', [$start, $end])
            ->groupBy(DB::raw('DATE(date)'))
            ->orderBy('day', 'DESC')
            ->limit(5)
            ->get();

        // === TOP 5 PRODUCTOS MÁS VENDIDOS ===
        $topProducts = DB::table('sales_details as sd')
            ->join('products as p', 'sd.product_id', '=', 'p.id')
            ->select('p.name', DB::raw('SUM(sd.quantity) as total_quantity'))
            ->groupBy('p.name')
            ->orderByDesc('total_quantity')
            ->limit(5)
            ->get();

        // === CLIENTES FRECUENTES ===
        $topCustomers = DB::table('sales as s')
            ->join('customers as c', 's.customer_id', '=', 'c.id')
            ->select('c.name', DB::raw('COUNT(s.id) as total_sales'))
            ->groupBy('c.name')
            ->orderByDesc('total_sales')
            ->limit(5)
            ->get();

        // === BALANCE GENERAL ===
        $profit = $totalSales - $totalPurchases;

        // === DATOS PARA TARJETAS RESUMEN ===
        $summary = [
            'ventas' => [
                'total' => $totalSales,
                'variacion' => $this->compareWithPreviousPeriod(Sale::class, 'total', $start, $end),
            ],
            'compras' => [
                'total' => $totalPurchases,
                'variacion' => $this->compareWithPreviousPeriod(Shopping::class, 'total', $start, $end),
            ],
            'clientes' => [
                'total' => $totalCustomers,
                'variacion' => $this->compareWithPreviousPeriod(Customer::class, 'id', $start, $end),
            ],
            'productos' => [
                'total' => $totalProducts,
            ],
        ];

        // === RESPUESTA JSON (lista para React) ===
        return response()->json([
            'date_range' => [
                'start' => $start->toDateString(),
                'end' => $end->toDateString(),
            ],
            'summary' => $summary,
            'balance' => [
                'ventas' => $totalSales,
                'compras' => $totalPurchases,
                'utilidad' => $profit,
            ],
            'credits' => [
                'total' => $totalCredits,
                'activos' => $activeCredits,
                'pagados' => $paidCredits,
                'vencidos' => $overdueCredits,
            ],
            'charts' => [
                'salesByDay' => $salesByDay,
                'topProducts' => $topProducts,
                'topCustomers' => $topCustomers,
            ],
        ]);
    }

    /**
     * Calcula la variación porcentual con respecto al período anterior
     */
    private function compareWithPreviousPeriod($model, $column, $start, $end)
    {
        $previousStart = $start->copy()->subDays($start->diffInDays($end) + 1);
        $previousEnd = $start->copy()->subDay();

        $currentTotal = $model::whereBetween(
            $model === Customer::class ? 'created_at' : 'date',
            [$start, $end]
        )->sum($column);

        $previousTotal = $model::whereBetween(
            $model === Customer::class ? 'created_at' : 'date',
            [$previousStart, $previousEnd]
        )->sum($column);

        if ($previousTotal == 0) return 100;
        return round((($currentTotal - $previousTotal) / $previousTotal) * 100, 2);
    }
}
