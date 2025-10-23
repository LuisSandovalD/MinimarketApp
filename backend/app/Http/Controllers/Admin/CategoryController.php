<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        $categories = Category::with('unit')->get();

        return response()->json($categories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:255',
            'unit_id' => 'required|exists:units,id',
            'active' => 'required|boolean',
        ]);

        $category = Category::create($validated);

        return response()->json([
            'message' => 'Categoría registrada correctamente',
            'data' => $category,
        ], 201);
    }
    public function update($id, Request $request){
         // Seleccionamos el id del proveedor
        $category = Category::find($id);

        // Si no existe, devolvemos un error 404
        if (!$category) {
            return response()->json(['message' => 'Categoria no encontrado'], 404);
        }
        $category->update($request->only('name','description','unit_id','active'));
        return response()->json($category);
    }
    public function destroy($id){
        $category = Category::find($id);
         if (!$category) {
            return response()->json(['message' => 'Categoria no encontrado'], 404);
        }
        $category->delete();
        return response()->json(['message' => 'eliminado correctamente']);
    }
}
