<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index(Request $request)
    {
        $suppliers = Supplier::all();

        return response()->json($suppliers);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'ruc' => 'required|string|max:20|unique:suppliers',
            'phone' => 'required|string|max:15',
            'address' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:suppliers',
            'active' => 'required|boolean',
        ]);

        $supplier = Supplier::create([
            'name' => $request->name,
            'ruc' => $request->ruc,
            'phone' => $request->phone,
            'address' => $request->address,
            'email' => $request->email,
            'active' => $request->active,
        ]);

        return response()->json([
            'message' => 'Proveedor registrado correctamente',
            'supplier' => $supplier,
        ], 201);
    }

    public function update($id, Request $request)
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json(['message' => 'Proveedor no encontrado'], 404);
        }

        $supplier->update($request->only('name', 'ruc', 'phone', 'email', 'address', 'active'));

        return response()->json([
            'message' => 'Proveedor actualizado correctamente',
            'supplier' => $supplier,
        ], 200);
    }

    public function destroy($id)
    {
        $supplier = Supplier::find($id);

        if (!$supplier) {
            return response()->json(['message' => 'Proveedor no encontrado'], 404);
        }

        $supplier->delete();

        return response()->json(['message' => 'Proveedor eliminado correctamente'], 200);
    }
}
