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
            ['name' => 'María Fernanda López', 'email' => 'maria.lopez@gmail.com'],
            ['name' => 'Carlos Alberto Ruiz', 'email' => 'carlos.ruiz@gmail.com'],
            ['name' => 'Lucía Ramírez Torres', 'email' => 'lucia.ramirez@gmail.com'],
            ['name' => 'José Miguel Herrera', 'email' => 'jose.herrera@gmail.com'],
            ['name' => 'Ana Sofía Delgado', 'email' => 'ana.delgado@gmail.com'],
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
