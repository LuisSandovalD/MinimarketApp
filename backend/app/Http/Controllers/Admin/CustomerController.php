<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User; 
use App\Models\Customer; 


class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user(); 

        // Traemos a todos los clientes
        $customers = Customer::all();

        return response()->json($customers);
    }

    public function store(Request $request)
    {
        // Validamos los datos de entrada
        $request->validate([
            'name' => 'required|string|max:255',
            'dni_ruc' => 'required|string|max:20|unique:customers',
            'phone' => 'required|string|max:15',
            'address' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customers',
            'active' => 'required|boolean',
        ]);

        // Creamos el cliente
        $customer = Customer::create([
            'name' => $request->name,
            'dni_ruc' => $request->dni_ruc,
            'phone' => $request->phone,
            'address' => $request->address,
            'email' => $request->email,
            'active' => $request->active,
        ]);

        // Retornamos respuesta en JSON
        return response()->json([
            'message' => 'Cliente registrado correctamente',
            'customer' => $customer,
        ], 201);
    }


    public function update($id, Request $request)
    {
        // Seleccionamos el id del cliente
        $customer = Customer::find($id);

        // Si no existe, devolvemos un error 404
        if (!$customer) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        // Actualizamos los datos del cliente
        $customer->update($request->only('name', 'dni_ruc', 'phone', 'address', 'email', 'active'));

        // Devolvemos el cliente actualizado, con un status 200 en postman
        return response()->json($customer);
    }

    public function destroy($id)
    {
        // Seleccionamos el id del cliente
        $customer = Customer::find($id);

        // Si no existe, devolvemos un error 404
        if (!$customer) {
            return response()->json(['message' => 'Cliente no encontrado'], 404);
        }

        // Eliminamos el cliente
        $customer->delete();

        // Devolvemos un mensaje de exito
        return response()->json(['message' => 'Cliente eliminado']);
    }

}
