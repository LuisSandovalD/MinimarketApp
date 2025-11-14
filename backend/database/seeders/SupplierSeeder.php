<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Supplier;

class SupplierSeeder extends Seeder
{
    public function run()
    {
      
        $suppliers = [
            ['name' => 'Distribuidora López SAC', 'ruc' => '20145879631', 'phone' => '987654321', 'address' => 'Av. Los Álamos 123, Lima', 'email' => 'contacto@distribuidoralp.com', 'active' => true],
            ['name' => 'Comercial Torres EIRL', 'ruc' => '20458793210', 'phone' => '945213678', 'address' => 'Jr. Grau 450, Arequipa', 'email' => 'ventas@torreseirl.com', 'active' => true],
            ['name' => 'Importadora Ramírez S.A.', 'ruc' => '20678945213', 'phone' => '954123678', 'address' => 'Av. Mariscal Cáceres 789, Cusco', 'email' => 'info@importadoraramirez.com', 'active' => true],
            ['name' => 'Servicios Generales Vargas EIRL', 'ruc' => '20561487952', 'phone' => '956874123', 'address' => 'Calle Los Pinos 56, Trujillo', 'email' => 'servicios@vargaseirl.com', 'active' => true],
            ['name' => 'Corporación Delgado SAC', 'ruc' => '20147895632', 'phone' => '999874561', 'address' => 'Av. Primavera 432, Lima', 'email' => 'ventas@corpdelgado.com', 'active' => true],
            ['name' => 'Inversiones Torres y Asociados', 'ruc' => '20487563121', 'phone' => '987123654', 'address' => 'Jr. Las Magnolias 234, Piura', 'email' => 'contacto@torresasociados.com', 'active' => true],
            ['name' => 'Proveedora Huamán SAC', 'ruc' => '20587456987', 'phone' => '964587231', 'address' => 'Av. Los Próceres 1021, Lima', 'email' => 'info@proveedorahuaman.com', 'active' => true],
            ['name' => 'Agroindustrias Quispe SRL', 'ruc' => '20658793254', 'phone' => '943587621', 'address' => 'Carretera Central Km 23, Huancayo', 'email' => 'ventas@agroquispe.com', 'active' => true],
            ['name' => 'Ferretería Rojas Hermanos', 'ruc' => '20548796321', 'phone' => '951324687', 'address' => 'Jr. Junín 320, Cajamarca', 'email' => 'ventas@ferreteriaroja.com', 'active' => true],
            ['name' => 'Comercial Medina S.A.C.', 'ruc' => '20169874512', 'phone' => '987451236', 'address' => 'Av. Perú 654, Chiclayo', 'email' => 'info@comercialmedina.com', 'active' => true],
            ['name' => 'Distribuciones Poma EIRL', 'ruc' => '20651487965', 'phone' => '956874321', 'address' => 'Calle Las Flores 124, Cusco', 'email' => 'contacto@pomaeirl.com', 'active' => true],
            ['name' => 'Corporación Gamarra SAC', 'ruc' => '20521458796', 'phone' => '944123698', 'address' => 'Av. La Marina 875, Lima', 'email' => 'ventas@gamarrasac.com', 'active' => true],
            ['name' => 'Importaciones Castillo SRL', 'ruc' => '20485697412', 'phone' => '932654871', 'address' => 'Jr. Bolognesi 678, Tacna', 'email' => 'info@castillosrl.com', 'active' => true],
            ['name' => 'Proveedora Andina SAC', 'ruc' => '20547896325', 'phone' => '945632187', 'address' => 'Av. Arequipa 1050, Lima', 'email' => 'ventas@proveedoraandina.com', 'active' => true],
            ['name' => 'Soluciones Técnicas Peña EIRL', 'ruc' => '20658745123', 'phone' => '998745632', 'address' => 'Calle San Martín 54, Ica', 'email' => 'info@stpeña.com', 'active' => true],
            ['name' => 'Comercial Jiménez SAC', 'ruc' => '20478596321', 'phone' => '987458621', 'address' => 'Av. Panamericana 879, Lima', 'email' => 'contacto@comercialjimenez.com', 'active' => true],
            ['name' => 'Distribuidora Vega SRL', 'ruc' => '20698754123', 'phone' => '985471236', 'address' => 'Jr. Amazonas 456, Arequipa', 'email' => 'info@distribuidoravega.com', 'active' => true],
            ['name' => 'Importadora Ramos SAC', 'ruc' => '20569874126', 'phone' => '951874236', 'address' => 'Av. Garcilaso 231, Cusco', 'email' => 'ventas@importadoraramos.com', 'active' => true],
            ['name' => 'Servicios Industriales Paredes', 'ruc' => '20645897213', 'phone' => '932154876', 'address' => 'Calle Los Tulipanes 452, Huancayo', 'email' => 'info@paredesind.com', 'active' => true],
            ['name' => 'Ferretería Morales y Cía', 'ruc' => '20514789652', 'phone' => '987456231', 'address' => 'Av. Grau 698, Trujillo', 'email' => 'ventas@ferreteriamorales.com', 'active' => true],
            ['name' => 'Corporación Navarro SAC', 'ruc' => '20657841235', 'phone' => '999852147', 'address' => 'Calle Lima 250, Piura', 'email' => 'info@corporacionnavarro.com', 'active' => true],
            ['name' => 'Distribuciones Calderón EIRL', 'ruc' => '20478965213', 'phone' => '964578123', 'address' => 'Av. Universitaria 120, Lima', 'email' => 'contacto@calderoneirl.com', 'active' => true],
            ['name' => 'Inversiones Mendoza SAC', 'ruc' => '20569874125', 'phone' => '945632781', 'address' => 'Jr. San Pedro 670, Cajamarca', 'email' => 'ventas@mendozasac.com', 'active' => true],
            ['name' => 'Importadora Valdez EIRL', 'ruc' => '20458963214', 'phone' => '923654178', 'address' => 'Calle Cuzco 111, Cusco', 'email' => 'info@importadoravaldez.com', 'active' => true],
            ['name' => 'Comercial Ponce SAC', 'ruc' => '20698541236', 'phone' => '985412367', 'address' => 'Av. Colonial 480, Lima', 'email' => 'ventas@comercialponce.com', 'active' => true],
            ['name' => 'Soluciones Huamán EIRL', 'ruc' => '20569874129', 'phone' => '932147586', 'address' => 'Jr. Huallaga 210, Iquitos', 'email' => 'info@solucioneshuaman.com', 'active' => true],
            ['name' => 'Corporación Quispe SAC', 'ruc' => '20654789631', 'phone' => '987412365', 'address' => 'Av. Angamos 980, Lima', 'email' => 'contacto@corpquispe.com', 'active' => true],
            ['name' => 'Importadora Flores SRL', 'ruc' => '20587456321', 'phone' => '941236578', 'address' => 'Jr. Callao 543, Arequipa', 'email' => 'ventas@importadoraflores.com', 'active' => true],
            ['name' => 'Servicios Integrales León SAC', 'ruc' => '20658741236', 'phone' => '995874123', 'address' => 'Av. Bolívar 350, Trujillo', 'email' => 'info@serviciosleon.com', 'active' => true],
            ['name' => 'Distribuidora Tapia SRL', 'ruc' => '20587412369', 'phone' => '987563214', 'address' => 'Av. Universitaria 320, Lima', 'email' => 'ventas@distribuidorapatia.com', 'active' => true],
        ];

        foreach ($suppliers as $supplier) {
            Supplier::create($supplier);
        }
    }
}
