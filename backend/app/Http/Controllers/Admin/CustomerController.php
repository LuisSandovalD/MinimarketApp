<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;
use Illuminate\Support\Facades\DB;

class CustomerController extends Controller
{
    /**
     * Lista todos los clientes
     */
    public function index(Request $request)
    {
        try {
            $customers = Customer::all();

            return response()->json($customers, 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Error al obtener los clientes',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Registra un nuevo cliente
     */
    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'dni_ruc' => 'required|string|max:20|unique:customers',
                'phone' => 'required|string|max:15',
                'address' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:customers',
                'active' => 'required|boolean',
            ]);

            $customer = Customer::create($validated);

            DB::commit();

            return response()->json([
                'message' => 'Cliente registrado correctamente',
                'customer' => $customer,
            ], 201);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al registrar el cliente',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Actualiza los datos de un cliente existente
     */
    public function update($id, Request $request)
    {
        DB::beginTransaction();
        try {
            $customer = Customer::find($id);

            if (!$customer) {
                return response()->json(['message' => 'Cliente no encontrado'], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'dni_ruc' => 'sometimes|required|string|max:20|unique:customers,dni_ruc,' . $id,
                'phone' => 'sometimes|required|string|max:15',
                'address' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:customers,email,' . $id,
                'active' => 'sometimes|required|boolean',
            ]);

            $customer->update($validated);

            DB::commit();

            return response()->json([
                'message' => 'Cliente actualizado correctamente',
                'customer' => $customer,
            ]);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al actualizar el cliente',
                'error' => $th->getMessage(),
            ], 500);
        }
    }

    /**
     * Elimina un cliente
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        try {
            $customer = Customer::find($id);

            if (!$customer) {
                return response()->json(['message' => 'Cliente no encontrado'], 404);
            }

            $customer->delete();

            DB::commit();

            return response()->json(['message' => 'Cliente eliminado correctamente']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return response()->json([
                'message' => 'Error al eliminar el cliente',
                'error' => $th->getMessage(),
            ], 500);
        }
    }
}
