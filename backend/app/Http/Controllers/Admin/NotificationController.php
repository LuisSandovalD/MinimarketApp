<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function notification(Request $request)
    {
        $notifications = []; 

        $alertsProduct = Product::where('stock_current', '<=', 2)->get(['id', 'name', 'stock_current']);

        foreach ($alertsProduct as $product) {
            $notifications[] = [
                'type' => 'stock',
                'message' => "El producto {$product->name} tiene bajo stock ({$product->stock_current} unidades).",
            ];
        }

        return response()->json([
            'total' => count($notifications),
            'notifications' => $notifications,
        ]);
    }
}
