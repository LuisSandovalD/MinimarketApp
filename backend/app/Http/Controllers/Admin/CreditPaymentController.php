<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CreditPayment;
use Illuminate\Http\Request;

class CreditPaymentController extends Controller
{
    public function index()
    {
        try {
            $creditPayments = CreditPayment::with(['credit', 'user'])->get();

            return response()->json($creditPayments, 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al obtener los pagos de créditos',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

}
