<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;

class UnitController extends Controller
{
     public function index(Request $request){

        $unit = Unit::all();
        return response()->json($unit);

    }

    public function store(Request $request){

        $request->validate([
            'name' => 'required|string|max:255',
            'abbreviation' => 'required|string|max:4',
        ]);

        $unit = Unit::create([
            'name' => $request->name,
            'abbreviation' => $request->abbreviation,
        ]);

        return response()->json([
            'message' => 'Unidad de medida registrado correctamente',
            'Unidad de medida' => $unit,
        ], 201);
    }
    public function update($id, Request $request){
        $unit = Unit::find($id);
        if (!$unit) {
            return response()->json(["message" => "Unidad de medida no encontrado"]);
        }
        $unit->update($request->only('name','abbreviation'));
        return response()->json($unit);

    }
    public function destroy($id){
        $unit = Unit::find($id);
         if (!$unit) {
            return response()->json(['message' => 'Unidad de medida no encontrado'], 404);
        }
        $unit->delete();
        return response()->json(['message' => 'eliminado correctamente']);
    }
}
