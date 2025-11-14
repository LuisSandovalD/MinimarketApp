<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Shopping;
use App\Models\ShoppingDetail;
use App\Models\Product;
use App\Models\User;
use App\Models\Supplier;
use App\Models\Category;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ShoppingSeeder extends Seeder
{
    public function run()
    {
        $users = User::pluck('id')->toArray();
        $suppliers = Supplier::pluck('id')->toArray();

        // 🔹 Catálogo base de productos reales de minimarket
        $productosReales = [
            ['Leche Gloria Entera 400g', 4.50],
            ['Arroz Costeño Extra 1kg', 3.80],
            ['Azúcar Rubia 1kg', 3.50],
            ['Aceite Primor 1L', 9.50],
            ['Detergente Bolívar 800g', 7.20],
            ['Gaseosa Inca Kola 1.5L', 6.00],
            ['Gaseosa Coca Cola 1.5L', 6.20],
            ['Cerveza Cusqueña 620ml', 7.80],
            ['Cerveza Pilsen 620ml', 6.90],
            ['Galletas Soda Field 170g', 2.30],
            ['Galletas Oreo 108g', 3.00],
            ['Pan de Molde Bimbo 600g', 8.90],
            ['Atún Florida 170g', 5.20],
            ['Mantequilla Gloria 200g', 6.80],
            ['Yogurt Gloria Fresa 1L', 7.50],
            ['Jabón Bolívar 180g', 2.80],
            ['Papel Higiénico Elite 4 und.', 7.90],
            ['Cereal Angel 500g', 8.00],
            ['Agua San Luis 625ml', 1.80],
            ['Café Altomayo 200g', 17.90],
            ['Te McColins 25 und.', 6.50],
            ['Fideos Don Vittorio 500g', 3.60],
            ['Mayonesa Alacena 475g', 10.50],
            ['Kétchup Alacena 475g', 9.50],
            ['Refresco Tang Naranja 25g', 1.00],
            ['Avena Quaker 400g', 5.80],
            ['Leche Evaporada Ideal 400g', 4.60],
            ['Cerveza Corona 355ml', 7.50],
            ['Gaseosa Sprite 1.5L', 6.00],
            ['Arvejas Norte 500g', 5.10],
            ['Lentejas Costeño 500g', 5.00],
            ['Chocolate Sublime 30g', 2.00],
            ['Chicle Trident 8g', 1.50],
            ['Mermelada Fanny 250g', 7.20],
            ['Detergente Ariel 800g', 7.80],
            ['Shampoo Head & Shoulders 375ml', 15.90],
            ['Acondicionador Dove 400ml', 17.50],
            ['Cerveza Cristal 620ml', 6.50],
            ['Cereal Zucaritas 500g', 10.90],
            ['Cereal Chocapic 500g', 10.80],
        ];

        $paymentMethods = ['Efectivo', 'Yape', 'Plin'];

        for ($i = 1; $i <= 30; $i++) {
            DB::beginTransaction();

            try {
                $numItems = rand(3, 5);
                $productosSeleccionados = collect($productosReales)->random($numItems);

                $subtotal = 0;
                $details = [];

                foreach ($productosSeleccionados as $item) {
                    [$nombre, $precio] = $item;
                    $cantidad = rand(2, 10);
                    $subtotal += $precio * $cantidad;

                    // 🔹 Determinar categoría según el nombre
                    $categoryId = $this->getCategoryIdByProductName($nombre);

                    // Buscar si ya existe el producto o crearlo
                    $producto = Product::firstOrCreate(
                        ['name' => $nombre],
                        [
                            'code' => 'P-' . strtoupper(substr(md5($nombre), 0, 6)),
                            'price' => $precio,
                            'stock_current' => 0,
                            'stock_minimum' => 1,
                            'category_id' => $categoryId,
                            'active' => 1,
                        ]
                    );

                    $details[] = [
                        'product_id' => $producto->id,
                        'quantity' => $cantidad,
                        'unit_price' => $precio,
                        'subtotal' => $cantidad * $precio,
                    ];
                }

                $vat = round($subtotal * 0.18, 2);
                $total = round($subtotal + $vat, 2);
                $metodoPago = $paymentMethods[array_rand($paymentMethods)];

                $shopping = Shopping::create([
                    'shopping_number' => 'CMP-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                    'user_id' => $users[array_rand($users)],
                    'supplier_id' => $suppliers[array_rand($suppliers)],
                    'date' => Carbon::now()->subDays(rand(1, 90)),
                    'subtotal' => $subtotal,
                    'vat' => $vat,
                    'total' => $total,
                    'notes' => "Compra en $metodoPago - Proveedor local",
                ]);

                foreach ($details as $detail) {
                    ShoppingDetail::create([
                        'shopping_id' => $shopping->id,
                        'product_id' => $detail['product_id'],
                        'quantity' => $detail['quantity'],
                        'unit_price' => $detail['unit_price'],
                        'subtotal' => $detail['subtotal'],
                    ]);

                    // Actualizar stock
                    $producto = Product::find($detail['product_id']);
                    $producto->stock_current += $detail['quantity'];
                    $producto->save();
                }

                DB::commit();
                $this->command->info("✅ {$shopping->shopping_number} registrada ({$numItems} productos, pago {$metodoPago}).");

            } catch (\Exception $e) {
                DB::rollBack();
                $this->command->error("❌ Error en CMP-{$i}: " . $e->getMessage());
            }
        }
    }

    /**
     * 🔍 Detecta categoría según el nombre del producto
     */
    private function getCategoryIdByProductName($nombre)
    {
        $nombre = strtolower($nombre);

        $mapa = [
            'leche' => 'Leche evaporada',
            'yogurt' => 'Yogures',
            'mantequilla' => 'Mantequilla y margarina',
            'queso' => 'Quesos',
            'huevo' => 'Huevos',
            'gaseosa' => 'Gaseosas',
            'agua' => 'Aguas minerales',
            'jugo' => 'Jugos naturales',
            'cerveza' => 'Cerveza',
            'vino' => 'Vinos',
            'licor' => 'Licores',
            'arroz' => 'Arroz',
            'azúcar' => 'Azúcar',
            'fideo' => 'Fideos',
            'aceite' => 'Aceites',
            'sal' => 'Sal',
            'café' => 'Café',
            'té' => 'Té e infusiones',
            'galleta' => 'Galletas dulces',
            'chocolate' => 'Chocolates',
            'snack' => 'Snacks',
            'pan' => 'Pan de molde',
            'atún' => 'Conservas de pescado',
            'mayonesa' => 'Salsas y condimentos',
            'kétchup' => 'Salsas y condimentos',
            'mermelada' => 'Confituras',
            'detergente' => 'Detergentes',
            'shampoo' => 'Shampoo',
            'acondicionador' => 'Shampoo',
            'papel higiénico' => 'Papel higiénico',
            'jabón' => 'Jabones de baño',
            'cereal' => 'Cereal',
            'lenteja' => 'Legumbres secas',
            'arveja' => 'Legumbres secas',
            'avena' => 'Cereales integrales',
        ];

        foreach ($mapa as $palabra => $categoria) {
            if (str_contains($nombre, $palabra)) {
                return Category::where('name', $categoria)->value('id') ?? 1;
            }
        }

        return Category::where('name', 'Otros')->value('id') ?? 1;
    }
}
