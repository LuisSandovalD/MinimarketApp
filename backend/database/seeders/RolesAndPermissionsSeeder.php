<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolesAndPermissionsSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $permSales = Permission::firstOrCreate(['name' => 'gestionar ventas']);
        $permProducts = Permission::firstOrCreate(['name' => 'gestionar productos']);

        $roleAdmin = Role::firstOrCreate(['name' => 'administrador']);
        $roleCashier = Role::firstOrCreate(['name' => 'cajero']);

        $roleAdmin->givePermissionTo([$permSales, $permProducts]);
        $roleCashier->givePermissionTo([$permSales]);

        $admin = User::firstOrCreate(
            ['email' => 'admin@gmail.com'],
            [
                'name' => 'Administrador General',
                'password' => Hash::make('admin123'),
            ]
        );

        if (!$admin->hasRole('administrador')) {
            $admin->assignRole($roleAdmin);
        }

        // 👥 Lista de cajeros reales
        $cashiers = [
            ['name' => 'YAREN RICARDO FABRICIO SAENZ CHAMORRO', 'email' => '2301010294@undc.edu.pe'],
            ['name' => 'CRISTIAN JOEL VELASQUEZ RAMOS', 'email' => '2301080352@undc.edu.pe'],
            ['name' => 'JEAN PIERRE FARID MOREYRA CAMA', 'email' => '2301010390@undc.edu.pe'],
            ['name' => 'DAYANNA ANTONET ZEVALLOS VALDEZ', 'email' => '2101010396@undc.edu.pe'],
        ];

        foreach ($cashiers as $cashierData) {
            $user = User::firstOrCreate(
                ['email' => $cashierData['email']],
                [
                    'name' => $cashierData['name'],
                    'password' => Hash::make('cajero123'),
                ]
            );

            if (!$user->hasRole('cajero')) {
                $user->assignRole($roleCashier);
            }
        }
    }
}
