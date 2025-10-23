<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Notification;
use Carbon\Carbon;
use Twilio\Rest\Client;

class WhatsAppController extends Controller
{
    public function sendMessage(Request $request)
    {
        // ✅ Validar los datos que vienen desde React
        $validated = $request->validate([
            'to' => 'required|string',          // número completo con +51
            'name' => 'nullable|string',        // nombre del cliente
            'total' => 'nullable|numeric',      // monto total
            'fecha' => 'nullable|string',       // fecha del comprobante
            'customer_id' => 'nullable|integer',
            'user_id' => 'nullable|integer',
        ]);

        // 🟢 Crear el texto del mensaje
        $message = "Hola {$validated['name']}, su compra del {$validated['fecha']} tiene un total de S/{$validated['total']}. ¡Gracias por su preferencia! 🛒";

        // 🔍 Verificar si ya se envió el mismo mensaje hoy
        $existingNotification = Notification::where('customer_id', $validated['customer_id'] ?? null)
            ->where('user_id', $validated['user_id'] ?? null)
            ->where('message', $message)
            ->whereDate('scheduled_date', Carbon::today())
            ->first();

        if ($existingNotification) {
            $existingNotification->increment('attempts');

            return response()->json([
                'success' => true,
                'message' => 'Ya se envió este mensaje hoy. Intento incrementado ⚠️',
                'data' => $existingNotification,
            ], 200);
        }

        // ⚙️ Configurar Twilio
        $sid = env('TWILIO_SID');
        $token = env('TWILIO_AUTH_TOKEN');
        $from = env('TWILIO_WHATSAPP_FROM'); // ej. whatsapp:+14155238886

        $client = new Client($sid, $token);

        try {
            // 🚀 Enviar mensaje
            $twilioMessage = $client->messages->create(
                "whatsapp:" . $validated['to'], // destino
                [
                    'from' => $from,
                    'body' => $message,
                ]
            );

            // 💾 Registrar notificación en BD
            $notification = Notification::create([
                'user_id' => $validated['user_id'] ?? null,
                'customer_id' => $validated['customer_id'] ?? null,
                'message' => $message,
                'scheduled_date' => now(),
                'sent_date' => now(),
                'attempts' => 1,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Mensaje enviado correctamente ✅',
                'sid' => $twilioMessage->sid,
                'data' => $notification,
            ], 200);
        } catch (\Exception $e) {
            // ⚠️ Manejar error de Twilio
            return response()->json([
                'success' => false,
                'message' => 'Error al enviar el mensaje ❌',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
