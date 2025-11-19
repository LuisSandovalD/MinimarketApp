<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SaleDetail;
use Illuminate\Http\Request;

class SalesDetailController extends Controller
{
    public function index(Request $request){
        $saleDetail = SaleDetail::with('sale','product')->get();
        return response()->json($saleDetail);
    }
}
