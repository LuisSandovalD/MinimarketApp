<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shopping;
use App\Models\ShoppingDetail;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShoppingController extends Controller
{
    public function index()
    {
        $shopping = Shopping::with(['user', 'supplier', 'details.product'])->get();
        return response()->json($shopping, 200);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'shopping_number' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'notes' => 'nullable|string',
            'details' => 'required|array|min:1',
            'details.*.product_id' => 'nullable|integer',
            'details.*.product_name' => 'nullable|string|max:255',
            'details.*.code' => 'nullable|string|max:50',
            'details.*.price' => 'nullable|numeric|min:0',
            'details.*.quantity' => 'required|numeric|min:1',
            'details.*.unit_price' => 'required|numeric|min:0',
            'details.*.category_id' => 'nullable|integer|exists:categories,id',
        ]);

        DB::beginTransaction();

        try {
            $subtotal = 0;
            foreach ($validatedData['details'] as $detail) {
                $subtotal += $detail['quantity'] * $detail['unit_price'];
            }

            $vat = round($subtotal * 0.18, 2);
            $total = round($subtotal + $vat, 2);

            $shopping = Shopping::create([
                'shopping_number' => $validatedData['shopping_number'],
                'user_id' => $validatedData['user_id'],
                'supplier_id' => $validatedData['supplier_id'],
                'date' => now(),
                'subtotal' => $subtotal,
                'vat' => $vat,
                'total' => $total,
                'notes' => $validatedData['notes'] ?? null,
            ]);

            foreach ($validatedData['details'] as $detail) {
                $product = null;

                if (!empty($detail['product_id'])) {
                    $product = Product::find($detail['product_id']);
                } elseif (!empty($detail['code'])) {
                    $product = Product::where('code', $detail['code'])->first();
                } elseif (!empty($detail['product_name'])) {
                    $product = Product::where('name', $detail['product_name'])->first();
                }

                if (!$product) {
                    $product = Product::create([
                        'code' => $detail['code'] ?? 'AUTO-' . strtoupper(substr(uniqid(), -5)),
                        'name' => $detail['product_name'] ?? 'Producto sin nombre',
                        'price' => $detail['unit_price'],
                        'stock_current' => 0,
                        'stock_minimum' => 1,
                        'category_id' => $detail['category_id'] ?? 1,
                        'active' => 1,
                    ]);
                } else {
                    if (!empty($detail['category_id'])) {
                        $product->category_id = $detail['category_id'];
                    }

                    // 🟢 Actualizar precio del producto
                    if (isset($detail['unit_price'])) {
                        $product->price = $detail['unit_price'];
                    }

                    $product->save();
                }

                ShoppingDetail::create([
                    'shopping_id' => $shopping->id,
                    'product_id' => $product->id,
                    'quantity' => $detail['quantity'],
                    'unit_price' => $detail['unit_price'],
                    'subtotal' => $detail['quantity'] * $detail['unit_price'],
                ]);

                $product->stock_current += $detail['quantity'];
                $product->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Compra registrada correctamente',
                'data' => $shopping->load(['user', 'supplier', 'details.product']),
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al registrar la compra',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'shopping_number' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
            'supplier_id' => 'required|exists:suppliers,id',
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'details' => 'required|array|min:1',
            'details.*.product_id' => 'nullable|integer',
            'details.*.product_name' => 'nullable|string|max:255',
            'details.*.code' => 'nullable|string|max:50',
            'details.*.price' => 'nullable|numeric|min:0',
            'details.*.quantity' => 'required|numeric|min:1',
            'details.*.unit_price' => 'required|numeric|min:0',
            'details.*.category_id' => 'nullable|integer|exists:categories,id',
        ]);

        DB::beginTransaction();

        try {
            $shopping = Shopping::findOrFail($id);

            // 🧮 Restar stock anterior
            foreach ($shopping->details as $oldDetail) {
                $product = Product::find($oldDetail->product_id);
                if ($product) {
                    $product->stock_current -= $oldDetail->quantity;
                    $product->save();
                }
            }

            ShoppingDetail::where('shopping_id', $shopping->id)->delete();

            $subtotal = 0;
            foreach ($validatedData['details'] as $detail) {
                $subtotal += $detail['quantity'] * $detail['unit_price'];
            }

            $vat = round($subtotal * 0.18, 2);
            $total = round($subtotal + $vat, 2);

            $shopping->update([
                'shopping_number' => $validatedData['shopping_number'],
                'user_id' => $validatedData['user_id'],
                'supplier_id' => $validatedData['supplier_id'],
                'date' => $validatedData['date'],
                'subtotal' => $subtotal,
                'vat' => $vat,
                'total' => $total,
                'notes' => $validatedData['notes'] ?? null,
            ]);

            foreach ($validatedData['details'] as $detail) {
                $product = null;

                if (!empty($detail['product_id'])) {
                    $product = Product::find($detail['product_id']);
                } elseif (!empty($detail['code'])) {
                    $product = Product::where('code', $detail['code'])->first();
                } elseif (!empty($detail['product_name'])) {
                    $product = Product::where('name', $detail['product_name'])->first();
                }

                if (!$product) {
                    $product = Product::create([
                        'code' => $detail['code'] ?? 'AUTO-' . strtoupper(substr(uniqid(), -5)),
                        'name' => $detail['product_name'] ?? 'Producto sin nombre',
                        'price' => $detail['unit_price'],
                        'stock_current' => 0,
                        'stock_minimum' => 1,
                        'category_id' => $detail['category_id'] ?? 1,
                        'active' => 1,
                    ]);
                } else {
                    if (!empty($detail['category_id'])) {
                        $product->category_id = $detail['category_id'];
                    }

                    // 🟢 Actualizar precio del producto si cambia
                    if (isset($detail['unit_price'])) {
                        $product->price = $detail['unit_price'];
                    }

                    $product->save();
                }

                ShoppingDetail::create([
                    'shopping_id' => $shopping->id,
                    'product_id' => $product->id,
                    'quantity' => $detail['quantity'],
                    'unit_price' => $detail['unit_price'],
                    'subtotal' => $detail['quantity'] * $detail['unit_price'],
                ]);

                $product->stock_current += $detail['quantity'];
                $product->save();
            }

            DB::commit();

            return response()->json([
                'message' => 'Compra actualizada correctamente',
                'data' => $shopping->load(['user', 'supplier', 'details.product']),
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al actualizar la compra',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
