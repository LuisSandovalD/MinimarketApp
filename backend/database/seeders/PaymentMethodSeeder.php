<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PaymentMethodSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $methods = [
            [
                'name' => 'Efectivo',
                'description' => 'Pago realizado con dinero físico en el punto de venta.',
                'active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Yape',
                'description' => 'Pago mediante la aplicación Yape (transferencia instantánea).',
                'active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
            [
                'name' => 'Plin',
                'description' => 'Pago mediante la aplicación Plin (transferencia entre bancos).',
                'active' => true,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ],
        ];

        DB::table('payment_methods')->insert($methods);
    }
}
