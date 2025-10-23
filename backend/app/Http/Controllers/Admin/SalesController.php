<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Credit;
use App\Models\Product;
use App\Models\Document;
use App\Models\DocumentType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SalesController extends Controller
{
   
    public function index()
    {
        $sales = Sale::with(['customer', 'user', 'details.product', 'paymentMethod', 'credit'])
            ->orderBy('date', 'desc')
            ->get();

        return response()->json($sales);
    }

   
    public function products()
    {
        $products = Product::select('id', 'name', 'price', 'stock_current', 'code')
            ->where('stock_current', '>', 0)
            ->orderBy('name')
            ->get();

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'sale_number' => 'required|string|max:255',
            'customer_id' => 'required|exists:customers,id',
            'payment_method_id' => 'required|exists:payment_methods,id',
            'user_id' => 'required|exists:users,id',
            'date' => 'required|date',
            'details' => 'required|array|min:1',
            'details.*.product_id' => 'required|exists:products,id',
            'details.*.quantity' => 'required|numeric|min:1',
            'notes' => 'nullable|string',
            'is_credit' => 'required|boolean',
            'interest_rate' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date|after_or_equal:date'
        ]);

        DB::beginTransaction();

        try {
            // Calcular subtotal
            $subtotal = 0;
            foreach ($validated['details'] as $detail) {
                $product = Product::findOrFail($detail['product_id']);
                
                // Verificar stock ANTES de calcular
                if ($product->stock_current < $detail['quantity']) {
                    throw new \Exception("Stock insuficiente para el producto: {$product->name}. Disponible: {$product->stock_current}, Solicitado: {$detail['quantity']}");
                }
                
                $subtotal += $detail['quantity'] * $product->price;
            }

            $vat = round($subtotal * 0.18, 2);
            $total = round($subtotal + $vat, 2);

            // Crear venta
            $sale = Sale::create([
                'sale_number' => $validated['sale_number'],
                'customer_id' => $validated['customer_id'],
                'user_id' => $validated['user_id'],
                'payment_method_id' => $validated['payment_method_id'],
                'date' => $validated['date'],
                'subtotal' => $subtotal,
                'vat' => $vat,
                'total' => $total,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Detalles de la venta y actualizar stock
            foreach ($validated['details'] as $detail) {
                $product = Product::findOrFail($detail['product_id']);

                SaleDetail::create([
                    'sale_id' => $sale->id,
                    'product_id' => $product->id,
                    'quantity' => $detail['quantity'],
                    'unit_price' => $product->price,
                    'subtotal' => $detail['quantity'] * $product->price,
                ]);

                $product->decrement('stock_current', $detail['quantity']);
            }

            // Si es crédito, crear registro
            if ($validated['is_credit']) {
                $interest = ($total * ($validated['interest_rate'] ?? 0)) / 100;
                $totalWithInterest = $total + $interest;

                Credit::create([
                    'sale_id' => $sale->id,
                    'total_amount' => $total,
                    'interest_rate' => $validated['interest_rate'] ?? 0,
                    'interest_amount' => $interest,
                    'total_with_interest' => $totalWithInterest,
                    'due_date' => $validated['due_date'] ?? now()->addMonth(),
                    'status' => 'pendiente',
                ]);
            }

            // Crear documento automáticamente
            $documentTypeId = DocumentType::where('code', 'BOL')->value('id') ?? 1;
            $lastDocument = Document::where('document_type_id', $documentTypeId)->latest('id')->first();
            $nextNumber = $lastDocument ? $lastDocument->number + 1 : 1;

            Document::create([
                'sale_id' => $sale->id,
                'document_type_id' => $documentTypeId,
                'series' => 'B001',
                'number' => str_pad($nextNumber, 8, '0', STR_PAD_LEFT),
                'issue_date' => now(),
                'subtotal' => $subtotal,
                'vat' => $vat,
                'total' => $total,
            ]);

            DB::commit();

            return response()->json([
                'message' => $validated['is_credit']
                    ? 'Venta registrada como crédito y documento generado correctamente'
                    : 'Venta registrada correctamente con documento generado',
                'data' => $sale->load(['customer', 'user', 'details.product', 'credit', 'document']),
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Error al registrar venta: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'message' => 'Error al registrar la venta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $sale = Sale::findOrFail($id);

        $validated = $request->validate([
            'sale_number' => 'sometimes|string|max:255',
            'customer_id' => 'sometimes|exists:customers,id',
            'user_id' => 'sometimes|exists:users,id',
            'payment_method_id' => 'sometimes|exists:payment_methods,id',
            'date' => 'sometimes|date',
            'details' => 'sometimes|array|min:1',
            'details.*.product_id' => 'required_with:details|exists:products,id',
            'details.*.quantity' => 'required_with:details|numeric|min:1',
            'notes' => 'nullable|string',
            'is_credit' => 'sometimes|boolean',
            'interest_rate' => 'nullable|numeric|min:0',
            'due_date' => 'nullable|date'
        ]);

        DB::beginTransaction();

        try {
            // Actualizar datos básicos de la venta
            $sale->update([
                'sale_number' => $validated['sale_number'] ?? $sale->sale_number,
                'customer_id' => $validated['customer_id'] ?? $sale->customer_id,
                'user_id' => $validated['user_id'] ?? $sale->user_id,
                'payment_method_id' => $validated['payment_method_id'] ?? $sale->payment_method_id,
                'date' => $validated['date'] ?? $sale->date,
                'notes' => $validated['notes'] ?? $sale->notes,
            ]);

            // Si se actualizan los detalles
            if (isset($validated['details'])) {
                // Restaurar stock de productos anteriores
                foreach ($sale->details as $detail) {
                    $product = Product::find($detail->product_id);
                    if ($product) {
                        $product->increment('stock_current', $detail->quantity);
                    }
                }

                // Eliminar detalles anteriores
                $sale->details()->delete();

                // Crear nuevos detalles y calcular totales
                $subtotal = 0;
                foreach ($validated['details'] as $detail) {
                    $product = Product::find($detail['product_id']);
                    
                    if ($product->stock_current < $detail['quantity']) {
                        throw new \Exception("Stock insuficiente para el producto: {$product->name}");
                    }

                    $subtotal += $detail['quantity'] * $product->price;

                    SaleDetail::create([
                        'sale_id' => $sale->id,
                        'product_id' => $product->id,
                        'quantity' => $detail['quantity'],
                        'unit_price' => $product->price,
                        'subtotal' => $detail['quantity'] * $product->price,
                    ]);

                    $product->decrement('stock_current', $detail['quantity']);
                }

                // Actualizar totales de la venta
                $vat = round($subtotal * 0.18, 2);
                $total = round($subtotal + $vat, 2);

                $sale->update([
                    'subtotal' => $subtotal,
                    'vat' => $vat,
                    'total' => $total,
                ]);

                if (isset($validated['is_credit'])) {
                    if ($validated['is_credit']) {
                        $interest = ($total * ($validated['interest_rate'] ?? 0)) / 100;
                        $totalWithInterest = $total + $interest;

                        // Actualizar o crear registro de crédito
                        $sale->credit()->updateOrCreate(
                            ['sale_id' => $sale->id],
                            [
                                'total_amount' => $total,
                                'interest_rate' => $validated['interest_rate'] ?? 0,
                                'interest_amount' => $interest,
                                'total_with_interest' => $totalWithInterest,
                                'due_date' => $validated['due_date'] ?? now()->addMonth(),
                                'status' => $sale->credit->status ?? 'pendiente', // Mantener estado si existe
                            ]
                        );
                    } else {
                        // Si ya no es crédito, eliminar el registro
                        $sale->credit()->delete();
                    }
                }
            } else {
                // Si no se actualizan los detalles pero sí el crédito
                if (isset($validated['is_credit'])) {
                    $total = $sale->total;
                    
                    if ($validated['is_credit']) {
                        $interest = ($total * ($validated['interest_rate'] ?? 0)) / 100;
                        $totalWithInterest = $total + $interest;

                        $sale->credit()->updateOrCreate(
                            ['sale_id' => $sale->id],
                            [
                                'total_amount' => $total,
                                'interest_rate' => $validated['interest_rate'] ?? 0,
                                'interest_amount' => $interest,
                                'total_with_interest' => $totalWithInterest,
                                'due_date' => $validated['due_date'] ?? now()->addMonth(),
                                'status' => $sale->credit->status ?? 'pendiente',
                            ]
                        );
                    } else {
                        $sale->credit()->delete();
                    }
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Venta actualizada correctamente',
                'data' => $sale->load(['customer', 'user', 'details.product', 'credit']),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al actualizar la venta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();

        try {
            $sale = Sale::with(['details', 'credit'])->findOrFail($id);

            // Restaurar el stock de cada producto
            foreach ($sale->details as $detail) {
                $product = Product::find($detail->product_id);
                if ($product) {
                    $product->increment('stock_current', $detail->quantity);
                }
            }

            // Eliminar crédito si existe
            if ($sale->credit) {
                $sale->credit()->delete();
            }

            // Eliminar los detalles y luego la venta
            $sale->details()->delete();
            $sale->delete();

            DB::commit();

            return response()->json(['message' => 'Venta eliminada correctamente']);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error al eliminar la venta',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}