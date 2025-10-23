<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Credit;
use App\Models\CreditPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CreditController extends Controller
{
    /**
     * Muestra todos los créditos con la información relacionada.
     */
    public function index()
    {
        $credits = Credit::with(['sale.customer', 'payments'])->latest()->get();

        return response()->json($credits);
    }

    /**
     * Actualiza un crédito individual.
     */
    public function update(Request $request, $id)
    {
        $credit = Credit::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|string|in:pendiente,pagado,vencido',
        ]);

        // Si se marca como pagado y antes no lo estaba
        if ($validated['status'] === 'pagado' && $credit->status !== 'pagado') {
            // Registrar automáticamente el pago total
            CreditPayment::create([
                'credit_id' => $credit->id,
                'user_id' => Auth::id() ?? 1, // Si no hay usuario autenticado
                'payment_date' => now(),
                'amount' => $credit->total_with_interest,
                'notes' => 'Pago total registrado automáticamente al marcar el crédito como pagado.',
            ]);
        }

        // Actualizar estado del crédito
        $credit->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Crédito actualizado correctamente.',
            'credit' => $credit->load('payments'),
        ]);
    }

    /**
     * Actualiza múltiples créditos a la vez.
     */
    public function updateMultiple(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'integer|exists:credits,id',
            'status' => 'required|string|in:pendiente,pagado,vencido',
        ]);

        $credits = Credit::whereIn('id', $validated['ids'])->get();

        foreach ($credits as $credit) {
            // Solo registrar pago si se cambia de otro estado a "pagado"
            if ($validated['status'] === 'pagado' && $credit->status !== 'pagado') {
                CreditPayment::create([
                    'credit_id' => $credit->id,
                    'user_id' => Auth::id() ?? 1,
                    'payment_date' => now(),
                    'amount' => $credit->total_with_interest,
                    'notes' => 'Pago total registrado automáticamente al marcar como pagado en lote.',
                ]);
            }

            $credit->update(['status' => $validated['status']]);
        }

        return response()->json([
            'message' => 'Créditos actualizados correctamente.',
            'updated_ids' => $validated['ids'],
        ]);
    }
}
