<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        try {
            $categories = Category::with('unit')->get();

            return response()->json($categories);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al obtener las categorías',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'description' => 'required|string|max:255',
                'unit_id' => 'required|exists:units,id',
                'active' => 'required|boolean',
            ]);

            $category = Category::create($validated);

            DB::commit();

            return response()->json([
                'message' => 'Categoría registrada correctamente',
                'data' => $category,
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al registrar la categoría',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function update($id, Request $request)
    {
        DB::beginTransaction();
        try {
            $category = Category::find($id);

            if (!$category) {
                return response()->json(['message' => 'Categoría no encontrada'], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string|max:255',
                'unit_id' => 'sometimes|required|exists:units,id',
                'active' => 'sometimes|required|boolean',
            ]);

            $category->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Categoría actualizada correctamente',
                'data' => $category,
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al actualizar la categoría',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $category = Category::find($id);

            if (!$category) {
                return response()->json(['message' => 'Categoría no encontrada'], 404);
            }

            $category->delete();

            DB::commit();

            return response()->json(['message' => 'Categoría eliminada correctamente']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al eliminar la categoría',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
