<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CreditPayment;
use Illuminate\Http\Request;

class CreditPaymentController extends Controller
{
     public function index()
    {
        $creditPayment = CreditPayment::with(['credit', 'user'])->get();
        return response()->json($creditPayment, 200);
    }
}
