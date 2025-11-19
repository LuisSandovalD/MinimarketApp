<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Document;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index(Request $request){
        $documents = Document::with('sale.customer','documentType')->get();
        return response()->json($documents);
    }
}
