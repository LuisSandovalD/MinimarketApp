<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DocumentType;

class DocumentTypeController extends Controller
{
    /**
     * Mostrar todos los tipos de documento
     */
    public function index()
    {
        $documentTypes = DocumentType::all();
        return response()->json($documentTypes);
    }

    /**
     * Crear un nuevo tipo de documento
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:document_types,code',
            'requires_vat' => 'required|boolean',
        ]);

        $documentType = DocumentType::create($validated);

        return response()->json([
            'message' => 'Tipo de documento creado correctamente',
            'documentType' => $documentType
        ], 201);
    }

    /**
     * Actualizar un tipo de documento
     */
    public function update($id, Request $request)
    {
        $documentType = DocumentType::find($id);

        if (!$documentType) {
            return response()->json(['message' => 'Tipo de documento no encontrado'], 404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => "required|string|max:50|unique:document_types,code,{$id}",
            'requires_vat' => 'required|boolean',
        ]);

        $documentType->update($validated);

        return response()->json([
            'message' => 'Tipo de documento actualizado correctamente',
            'documentType' => $documentType
        ]);
    }

    /**
     * Eliminar un tipo de documento
     */
    public function destroy($id)
    {
        $documentType = DocumentType::find($id);

        if (!$documentType) {
            return response()->json(['message' => 'Tipo de documento no encontrado'], 404);
        }

        $documentType->delete();

        return response()->json(['message' => 'Tipo de documento eliminado correctamente']);
    }
}
