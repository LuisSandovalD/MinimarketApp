<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Unit;

class UnitSeeder extends Seeder
{
    public function run(): void
    {
        $units = [
            ['name' => 'Kilogramo', 'abbreviation' => 'kg'],
            ['name' => 'Gramo', 'abbreviation' => 'g'],
            ['name' => 'Litro', 'abbreviation' => 'L'],
            ['name' => 'Mililitro', 'abbreviation' => 'mL'],
            ['name' => 'Metro', 'abbreviation' => 'm'],
            ['name' => 'Centímetro', 'abbreviation' => 'cm'],
            ['name' => 'Unidad', 'abbreviation' => 'u'],
            ['name' => 'Caja', 'abbreviation' => 'cj'],
            ['name' => 'Docena', 'abbreviation' => 'dz'],
            ['name' => 'Par', 'abbreviation' => 'pr'],
        ];

        foreach ($units as $unitData) {
            Unit::firstOrCreate(
                ['abbreviation' => $unitData['abbreviation']],
                ['name' => $unitData['name']]
            );
        }

        $this->command->info('✅ Unidades de medida creadas correctamente.');
    }
}
