<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            RolesAndPermissionsSeeder::class,
            DocumentTypeSeeder::class,
            UnitSeeder::class,
            CategorySeeder::class,
            SupplierSeeder::class,
            CustomerSeeder::class,
            PaymentMethodSeeder::class,
            ShoppingSeeder::class,
            SaleSeeder::class
        ]);
    }
}
