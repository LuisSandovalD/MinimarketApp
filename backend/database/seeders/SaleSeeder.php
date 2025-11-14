<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Sale;
use App\Models\SaleDetail;
use App\Models\Product;
use App\Models\Customer;
use App\Models\User;
use App\Models\PaymentMethod;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Credit;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SaleSeeder extends Seeder
{
    public function run(): void
    {
        DB::transaction(function () {
            $customers = Customer::all();
            $users = User::all();
            $paymentMethods = PaymentMethod::all();
            $docTypes = DocumentType::all();

            // Definimos productos reales con precios basados en mercado
            $productos = [
                ['name' => 'Leche UHT Gloria 1L', 'price' => 5.76],
                ['name' => 'Gaseosa Inca Kola 1L', 'price' => 4.00],
                ['name' => 'Gaseosa Coca Cola 1L', 'price' => 4.00],
                ['name' => 'Mezcla Láctea Ideal 390g', 'price' => 3.90],
                ['name' => 'Detergente Ariel 1kg', 'price' => 12.00],
                ['name' => 'Jabón Bolívar 180g', 'price' => 2.80],
                ['name' => 'Cerveza Cusqueña 620ml', 'price' => 7.80],
                ['name' => 'Pan de Molde Bimbo 600g', 'price' => 8.90],
                ['name' => 'Atún Florida 170g', 'price' => 5.20],
                ['name' => 'Yogur Gloria Fresa 1L', 'price' => 7.50],
            ];

            // Insertar productos base si no existen
            foreach ($productos as $p) {
                Product::firstOrCreate(
                    ['name' => $p['name']],
                    [
                        'code' => 'P-' . strtoupper(substr(md5($p['name']), 0, 6)),
                        'price' => $p['price'],
                        'stock_current' => 100, // stock inicial
                        'stock_minimum' => 5,
                        'category_id' => 1,
                        'active' => 1,
                    ]
                );
            }

            $products = Product::all();

            // Generar 200 ventas reales
            for ($i = 1; $i <= 200; $i++) {
                $customer = $customers->random();
                $user = $users->random();
                $paymentMethod = $paymentMethods->random();

                $isCredit = (rand(1, 100) <= 10); // 10 % serán ventas a crédito

                $selected = $products->random(rand(1, 5));
                $subtotal = 0;
                $details = [];

                foreach ($selected as $product) {
                    if ($product->stock_current <= 0) {
                        continue;
                    }
                    $qty = rand(1, 4);
                    if ($product->stock_current < $qty) {
                        $qty = $product->stock_current;
                    }
                    $line = $product->price * $qty;
                    $subtotal += $line;

                    $details[] = [
                        'product_id' => $product->id,
                        'quantity' => $qty,
                        'unit_price' => $product->price,
                        'subtotal' => $line,
                    ];

                    $product->decrement('stock_current', $qty);
                }

                if (empty($details)) {
                    continue;
                }

                $vat = round($subtotal * 0.18, 2);
                $total = round($subtotal + $vat, 2);

                $date = Carbon::now()->subDays(rand(1, 90));
                $saleNumber = 'V-' . str_pad($i, 5, '0', STR_PAD_LEFT);

                $sale = Sale::create([
                    'sale_number' => $saleNumber,
                    'customer_id' => $customer->id,
                    'user_id' => $user->id,
                    'payment_method_id' => $paymentMethod->id,
                    'date' => $date,
                    'subtotal' => $subtotal,
                    'vat' => $vat,
                    'total' => $total,
                    'notes' => $isCredit ? 'Venta a crédito' : null,
                ]);

                foreach ($details as $d) {
                    SaleDetail::create([
                        'sale_id' => $sale->id,
                        'product_id' => $d['product_id'],
                        'quantity' => $d['quantity'],
                        'unit_price' => $d['unit_price'],
                        'subtotal' => $d['subtotal'],
                    ]);
                }

                if ($isCredit) {
                    $interestRate = [5, 8, 10][array_rand([5, 8, 10])];
                    $interest = round($total * $interestRate / 100, 2);
                    $totalWithInterest = $total + $interest;

                    Credit::create([
                        'sale_id' => $sale->id,
                        'total_amount' => $total,
                        'interest_rate' => $interestRate,
                        'interest_amount' => $interest,
                        'total_with_interest' => $totalWithInterest,
                        'due_date' => $date->copy()->addDays(30),
                        'status' => 'pendiente',
                    ]);
                }

                // Documento
                $useBoleta = (rand(1, 100) <= 70);
                $docType = $useBoleta
                    ? $docTypes->where('code', 'BOL')->first()
                    : $docTypes->where('code', 'FAC')->first();

                $docTypeId = $docType ? $docType->id : $docTypes->first()->id;
                $lastDoc = Document::where('document_type_id', $docTypeId)->latest('id')->first();
                $nextNum = $lastDoc ? $lastDoc->number + 1 : 1;

                Document::create([
                    'sale_id' => $sale->id,
                    'document_type_id' => $docTypeId,
                    'series' => $docType && $docType->code === 'FAC' ? 'F001' : 'B001',
                    'number' => str_pad($nextNum, 8, '0', STR_PAD_LEFT),
                    'issue_date' => $date,
                    'subtotal' => $subtotal,
                    'vat' => $vat,
                    'total' => $total,
                ]);
            }
        });

        $this->command->info("✅ Ventas simuladas con datos reales generadas");
    }
}
