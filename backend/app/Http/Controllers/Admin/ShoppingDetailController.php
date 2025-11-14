<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ShoppingDetail;
use App\Models\Shopping;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShoppingDetailController extends Controller
{
 
    public function index(Request $request)
    {
        $details = ShoppingDetail::with(['product.category', 'shopping'])->get();
        return response()->json($details, 200);

    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'shopping_id' => 'required|exists:shoppings,id',
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.01',
            'unit_price' => 'required|numeric|min:0',
        ]);

        $validated['subtotal'] = round($validated['quantity'] * $validated['unit_price'], 2);

        DB::beginTransaction();
        try {
            // Crear detalle
            $detail = ShoppingDetail::create($validated);

            // Actualizar totales de la compra
            $shopping = Shopping::find($validated['shopping_id']);
            $shopping->subtotal += $validated['subtotal'];
            $shopping->vat = round($shopping->subtotal * 0.18, 2);
            $shopping->total = round($shopping->subtotal + $shopping->vat, 2);
            $shopping->save();

            // Actualizar stock del producto
            $product = Product::find($validated['product_id']);
            $product->stock_actual += $validated['quantity'];
            $product->save();

            DB::commit();

            return response()->json([
                'message' => 'Detalle agregado correctamente',
                'data' => $detail
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al registrar detalle: ' . $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $detail = ShoppingDetail::find($id);

        if (!$detail) {
            return response()->json(['message' => 'Detalle no encontrado'], 404);
        }

        $validated = $request->validate([
            'quantity' => 'sometimes|numeric|min:0.01',
            'unit_price' => 'sometimes|numeric|min:0',
        ]);

        DB::beginTransaction();
        try {
            $oldSubtotal = $detail->subtotal;
            $oldQuantity = $detail->quantity;

            $quantity = $validated['quantity'] ?? $detail->quantity;
            $unit_price = $validated['unit_price'] ?? $detail->unit_price;
            $validated['subtotal'] = round($quantity * $unit_price, 2);

            $detail->update($validated);

            // Actualizar totales de la compra
            $shopping = Shopping::find($detail->shopping_id);
            $shopping->subtotal = $shopping->subtotal - $oldSubtotal + $detail->subtotal;
            $shopping->vat = round($shopping->subtotal * 0.18, 2);
            $shopping->total = round($shopping->subtotal + $shopping->vat, 2);
            $shopping->save();

            // Ajustar stock del producto
            $product = Product::find($detail->product_id);
            $difference = $quantity - $oldQuantity;
            $product->stock_actual += $difference;
            $product->save();

            DB::commit();

            return response()->json([
                'message' => 'Detalle actualizado correctamente',
                'data' => $detail
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al actualizar detalle: ' . $e->getMessage()], 500);
        }
    }


    public function destroy($id)
    {
        $detail = ShoppingDetail::find($id);

        if (!$detail) {
            return response()->json(['message' => 'Detalle no encontrado'], 404);
        }

        DB::beginTransaction();
        try {
            $shopping = Shopping::find($detail->shopping_id);

            // Restar subtotal del total general
            $shopping->subtotal -= $detail->subtotal;
            $shopping->vat = round($shopping->subtotal * 0.18, 2);
            $shopping->total = round($shopping->subtotal + $shopping->vat, 2);
            $shopping->save();

            // Devolver stock del producto
            $product = Product::find($detail->product_id);
            $product->stock_actual -= $detail->quantity;
            $product->save();

            $detail->delete();

            DB::commit();

            return response()->json(['message' => 'Detalle eliminado correctamente'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al eliminar detalle: ' . $e->getMessage()], 500);
        }
    }
}
