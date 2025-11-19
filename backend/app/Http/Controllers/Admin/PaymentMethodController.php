<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    /**
     * Mostrar todos los métodos de pago.
     */
    public function index()
    {
        $payment = PaymentMethod::orderBy('id', 'desc')->get();
        return response()->json($payment);
    }

    /**
     * Crear un nuevo método de pago.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'        => 'required|string|max:100|unique:payment_methods,name',
            'description' => 'nullable|string|max:255',
            'active'      => 'boolean',
        ]);

        $payment = PaymentMethod::create($validated);

        return response()->json([
            'message' => 'Método de pago creado correctamente.',
            'data'    => $payment
        ], 201);
    }

    /**
     * Mostrar un método de pago específico.
     */
    public function show($id)
    {
        $payment = PaymentMethod::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Método de pago no encontrado.'], 404);
        }

        return response()->json($payment);
    }

    /**
     * Actualizar un método de pago.
     */
    public function update(Request $request, $id)
    {
        $payment = PaymentMethod::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Método de pago no encontrado.'], 404);
        }

        $validated = $request->validate([
            'name'        => 'required|string|max:100|unique:payment_methods,name,' . $id,
            'description' => 'nullable|string|max:255',
            'active'      => 'boolean',
        ]);

        $payment->update($validated);

        return response()->json([
            'message' => 'Método de pago actualizado correctamente.',
            'data'    => $payment
        ]);
    }

    /**
     * Eliminar un método de pago.
     */
    public function destroy($id)
    {
        $payment = PaymentMethod::find($id);

        if (!$payment) {
            return response()->json(['message' => 'Método de pago no encontrado.'], 404);
        }

        $payment->delete();

        return response()->json(['message' => 'Método de pago eliminado correctamente.']);
    }
}
