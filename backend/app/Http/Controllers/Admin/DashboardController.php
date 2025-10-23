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
    public function index()
    {
        try {
            // === MÉTRICAS PRINCIPALES ===
            $totalVentas = Sale::sum('total');
            $totalCompras = Shopping::sum('total');
            $totalClientes = Customer::count();
            $totalProductos = Product::count();

            // === RENTABILIDAD GENERAL ===
            $gananciaBruta = $totalVentas - $totalCompras;
            $porcentajeGanancia = $totalVentas > 0 ? round(($gananciaBruta / $totalVentas) * 100, 2) : 0;

            // === VENTAS Y COMPRAS DEL MES ===
            $mesActual = Carbon::now()->month;
            $anioActual = Carbon::now()->year;

            $ventasMes = Sale::whereMonth('date', $mesActual)
                ->whereYear('date', $anioActual)
                ->sum('total');

            $comprasMes = Shopping::whereMonth('date', $mesActual)
                ->whereYear('date', $anioActual)
                ->sum('total');

            // === COMPARACIÓN CON EL MES PASADO ===
            $ventasMesAnterior = Sale::whereMonth('date', $mesActual - 1)
                ->whereYear('date', $anioActual)
                ->sum('total');

            $variacionVentas = $ventasMesAnterior > 0
                ? round((($ventasMes - $ventasMesAnterior) / $ventasMesAnterior) * 100, 2)
                : 0;

            // === VENTAS POR MES (gráfico de líneas) ===
            $ventasPorMes = Sale::select(
                    DB::raw('MONTH(date) as mes'),
                    DB::raw('SUM(total) as total')
                )
                ->whereYear('date', $anioActual)
                ->groupBy('mes')
                ->orderBy('mes')
                ->get()
                ->map(function ($item) {
                    return [
                        'mes' => Carbon::create()->month($item->mes)->translatedFormat('F'),
                        'total' => round($item->total, 2),
                    ];
                });

            // === PRODUCTOS MÁS VENDIDOS ===
            $productosTop = DB::table('sales_details as sd')
                ->join('products as p', 'sd.product_id', '=', 'p.id')
                ->select('p.name', DB::raw('SUM(sd.quantity) as total_vendido'))
                ->groupBy('p.name')
                ->orderByDesc('total_vendido')
                ->limit(5)
                ->get();

            // === CLIENTES CON MÁS COMPRAS ===
            $clientesTop = DB::table('sales')
                ->join('customers', 'sales.customer_id', '=', 'customers.id')
                ->select('customers.name', DB::raw('COUNT(sales.id) as total_compras'))
                ->groupBy('customers.name')
                ->orderByDesc('total_compras')
                ->limit(5)
                ->get();

            // === CRÉDITOS ===
            $creditosPendientes = Credit::where('status', 'pendiente')->count();
            $creditosPagados = Credit::where('status', 'pagado')->count();

            $montoPendiente = Credit::where('status', 'pendiente')->sum('total_with_interest');
            $montoPagado = Credit::where('status', 'pagado')->sum('total_with_interest');

            // === ESTADO DE STOCK ===
            $productosBajoStock = Product::whereColumn('stock_current', '<', 'stock_minimum')->count();

            // === RESPUESTA JSON COMPLETA ===
            return response()->json([
                'cards' => [
                    'totalVentas' => round($totalVentas, 2),
                    'totalCompras' => round($totalCompras, 2),
                    'gananciaBruta' => round($gananciaBruta, 2),
                    'porcentajeGanancia' => $porcentajeGanancia,
                    'totalClientes' => $totalClientes,
                    'totalProductos' => $totalProductos,
                    'ventasMes' => round($ventasMes, 2),
                    'comprasMes' => round($comprasMes, 2),
                    'variacionVentas' => $variacionVentas,
                    'productosBajoStock' => $productosBajoStock,
                ],
                'charts' => [
                    'ventasPorMes' => $ventasPorMes,
                    'productosTop' => $productosTop,
                    'clientesTop' => $clientesTop,
                ],
                'creditos' => [
                    'pendientes' => $creditosPendientes,
                    'pagados' => $creditosPagados,
                    'montoPendiente' => round($montoPendiente, 2),
                    'montoPagado' => round($montoPagado, 2),
                ],
            ]);

        } catch (\Throwable $th) {
            return response()->json([
                'error' => $th->getMessage(),
                'line' => $th->getLine(),
                'file' => $th->getFile(),
            ], 500);
        }
    }
}
