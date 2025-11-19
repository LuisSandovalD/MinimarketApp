<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;

class CustomerSeeder extends Seeder
{
    public function run(): void
    {
        $names = [
        'Cliente sin registrar',
        'María Fernanda López García',
        'Carlos Alberto Ruiz Pérez',
        'Lucía Ramírez Torres',
        'José Miguel Herrera Castillo',
        'Ana Sofía Delgado Mendoza',
        'Pedro Luis Vargas Sánchez',
        'Sandra Milagros Torres Vega',
        'Ricardo Javier Campos Flores',
        'Paola Andrea Soto León',
        'Luis Fernando Paredes Quispe',
        'Rosa Elena Gutiérrez Huamán',
        'Héctor Manuel Salazar Rojas',
        'Camila Beatriz Medina Ortiz',
        'Diego Alejandro Quispe Huerta',
        'Daniela Patricia Ramos Gallardo',
        'Andrés Felipe Castillo Poma',
        'Gabriela Torres Valdez',
        'Sergio Antonio Flores Aguilar',
        'Alejandra Montalvo Díaz',
        'Javier Nicolás Romero Peña',
        'Valeria Jiménez Cruz',
        'Bruno Sebastián García Polo',
        'Mónica Isabel Cárdenas Ruiz',
        'Óscar Eduardo León Tapia',
        'Patricia Lorena Vásquez Reyes',
        'Raúl Esteban Morales Calderón',
        'Verónica Susana Navarro Paredes',
        'Esteban Rodrigo Huanca Chávez',
        'Lorena Patricia Silva Ramos',
        'Gonzalo Andrés Peña Soto',
        'Elena Mariela Calderón Rios',
        'Marco Antonio Delgado Silva',
        'Yolanda Beatriz Torres Luna',
        'Fabián Ernesto Mendoza Gamarra',
        'Natalia Jimena Ponce Quispe',
        'Jorge Luis Alvarado Rojas',
        'Claudia Marcela Huamán Flores',
        'Nelson Iván Castillo Revilla',
        'Mirella Andrea Escobar Vidal',
        'Raquel Teresa Paredes León',
        'Hugo César Vásquez Medina',
        'Cecilia Pilar Aguirre Saldaña',
        'Milton Andrés Sifuentes Polo',
        'Julia Estefanía Ramos Huertas',
        'Renzo Alejandro Valdivia Cruz',
        'Karla Daniela Cornejo Tapia',
        'Adrián Sebastián Ortiz Acosta',
        'Yessenia Roxana Quispe Mamani',
        'Fabricio Iván Rojas León',
        'Danae Mariana Montoya Herrera',
        'Wilfredo Javier Castañeda Ruiz',
        'Grecia Antonella Poma Soto',
        'Nicolás Samuel Chávez Flores',
        'Priscila Judith Huerta Vega',
        'Ernesto Manuel Paredes Torres',
        'Marina Teresa López Sarmiento',
        'César Augusto Silva Peña',
        'Jimena Alicia Torres Galarza',
        'Félix Mariano Fuentes Ordoñez',
        'Denisse Valeria Marquina Tapia',
        'Rubén Darío Loayza Salazar',
        'Anahí Dayana Merino Collantes',
        'Gustavo Enrique Hidalgo Quispe',
        'Solange Patricia Cueva Ramos',
        'Brenda Michelle Carpio Ruiz',
        'Waldo Roberto Córdova Salas',
        'Evelyn Paola Vásquez Montoya',
        'Iván Ricardo Poma Vidal',
        'Marisol Cristina Rojas Herrera',
        'Patricio Augusto Céspedes León',
        'Noelia Andrea Huertas Ponce',
        'Tomas Alejandro Sosa Murillo',
        'Ivette Mariela Guzmán Flores',
        // Nombres nuevos agregados
        'Fernando Javier Cordero Salinas',
        'Liliana Mercedes Ramos Pineda',
        'Rodrigo Esteban Bravo Cáceres',
        'Jessica Carolina Montalvo Ruiz',
        'Pablo Andrés Chacón Gutiérrez',
        'Cynthia Paola Salas Herrera',
        'Mauricio Leónidas Paredes Pinto',
        'Lucero Mariana Campos Quispe',
        'Cristian Eduardo Ramírez Soto',
        'Katherine Lucía Rivas López',
        'Germán Alberto Carrillo Vega',
        'Marta Elena Fuentes Castillo',
        'Hernán David Cornejo Morales',
        'Berenice Alejandra Lozano Ortiz',
        'Felipe Alonso Vargas Cáceres',
        'Melissa Daniela Chávez Medina',
        'Ángel Mauricio Torres Gamarra',
        'Soledad Karina Alarcón Flores',
        'Diego Armando López Tapia',
        'Marina Beatriz Acuña Ramos',
        'Ricardo Tomás Bravo Poma',
        'Isabel Cristina Sosa Aguilar',
        'David Leonardo Vega Huerta',
        'Tania Fernanda Ramos Díaz',
        'Martín Sebastián Ortiz Paredes',
        'Patricia Alejandra Luján Torres',
        'Emanuel Andrés Quispe Rojas',
        'Laura Beatriz Campos Tapia',
        'Sebastián Ignacio Herrera León',
        'Adriana Valeria Castro Gálvez',
        'Felipe Nicolás Guzmán Rivera',
        'María José Cáceres Torres',
        'Estela Rocío Flores Poma',
        'Antonio Luis Medina Cabrera',
        'Ximena Carolina Díaz Soto',
        'Oscar René López Huamán',
        'Bianca Estefanía Vargas Torres',
        'Jaime Alejandro Rivera Castillo',
        'Nicole Antonella Torres García',
        'Julio César Quispe Ramos',
        'Carmen Elisa Flores Alvarado',
        'Hugo Martín Castillo Peña',
        'Pamela Verónica Valdez Huerta',
        'Ignacio Tomás Ríos Mendoza',
        'Eliana Rocío Fernández Vega',
        'Santiago Andrés Guzmán Torres',
        'Milagros Alejandra Poma Gutiérrez',
        'Leonardo Esteban Cabrera Soto',
        'Cinthia Marisol Aguilar Ramos',
        'Víctor Hugo Lozano Herrera',
        'Alejandra Sofía Reyes Tapia',
        'Manuel Ricardo Sánchez Gamarra',
        'Natalia Eugenia Córdova Flores',
        'José Antonio Medina Ramos',
        'Luisa Fernanda Valdez Cruz',
        'Camilo Sebastián Morales Vega',
        'Daniel Ricardo Tapia Huamán',
        'Cecilia Alejandra Paredes Soto',
        'Álvaro Tomás Delgado León',
        'Luciana Belén Romero Aguilar',
        'Raúl Antonio Cáceres Medina',
        'Rocío Daniela Vargas Huerta',
        'Matías Ignacio Rojas Quispe',
        'Julieta Teresa Poma Valdez',
        'Elmer Jesús Aguirre Campos',
        'Silvana Milagros Fernández Torres',
        'Arturo Damián Gutiérrez Alarcón',
        'Tatiana Isabel Ramos Peña',
        'Mauricio Esteban Flores Gamarra',
        'Ariana Jimena López Díaz',
        'Gustavo Alfredo Torres Ramos',
        'Nathaly Carolina Ponce Salazar',
        'Darío Javier Quispe Aguilar',
        'Maritza Luciana Huamán Vega',
        'Christian David Romero Tapia',
        'Andrea Soledad Valdivia León',
        'Juan Carlos Salazar Castaño',
        'Beatriz Elena Rojas Navarro',
        'Miguel Ángel Castillo Tapia',
        'Tatiana Milena Cruz Torres',
        'Fernando Nicolás Huerta Vega',
        'Carolina Alejandra Ramos Soto',
        'Luis Adrián Guzmán Huamán',
        'Gabriela Fernanda Salas Torres',
        'Alexis Manuel Rivas Paredes',
        'Sofía Mariana Torres Alarcón',
        'Piero Alejandro Mendoza Gutiérrez',
        'Marisol Teresa Poma Ramos',
        'Andrés David Quispe Soto',
        'Viviana Lucía Herrera Paredes',
        'Héctor Alonso Rojas Tapia',
        'Paola Andrea García Valdez',
        'Matilde Carmen Morales Flores',
        'Renato Emilio Vargas León',
        'Rosa Patricia Delgado Huerta',
        'Cristina Daniela Ramírez Torres',
        'Nicolás Gabriel Fuentes Poma',
        'Leticia Adriana Campos Cruz',
        'Tomás Mauricio Salazar Vega',
        'Alicia Verónica Gamarra Paredes',
        'Ignacio Felipe Quispe Alvarado',
        'Elisa Rocío Torres Medina',
        'Ramiro Sebastián Cáceres Quispe',
        'Melina Isabel Vargas Tapia',
        'Gerson Alberto López Herrera'
    ];


       
        $dniBase = 10000001;
        $phoneBase = 900000000; // sumaremos el índice para crear variaciones

        foreach ($names as $index => $fullName) {
            $i = $index + 1; // 1..80
            $dni = str_pad((string)($dniBase + $index), 8, '0', STR_PAD_LEFT);
            // Generar teléfono: 9 + 8 dígitos a partir de phoneBase + index
            $phoneNumber = (string)($phoneBase + $index); // ya tiene 9 dígitos
            // Generar email "nombre.apellidoN@gmai.com" simplificando acentos y espacios
            $normalized = strtolower($fullName);
            // Remplazar acentos y caracteres no alfanuméricos básicos
            $normalized = str_replace(
                ['á','é','í','ó','ú','ñ','Á','É','Í','Ó','Ú','Ñ',' '],
                ['a','e','i','o','u','n','a','e','i','o','u','n','.'],
                $normalized
            );
            // Solo mantener letras, números y puntos
            $normalized = preg_replace('/[^a-z0-9\.]/', '', $normalized);
            // Añadir un sufijo numérico para garantizar unicidad en emails repetidos
            $email = $normalized . $i . '@gmai.com';

            // Direcciones plausibles
            $address = match (true) {
                $i % 10 === 1 => "Av. Peru " . (100 + $i),
                $i % 10 === 2 => "Jr. Los Olivos " . (200 + $i),
                $i % 10 === 3 => "Av. La Marina " . (300 + $i),
                $i % 10 === 4 => "Calle Los Pinos " . (400 + $i),
                $i % 10 === 5 => "Jr. San Martin " . (500 + $i),
                $i % 10 === 6 => "Av. Arequipa " . (600 + $i),
                $i % 10 === 7 => "Calle Primavera " . (700 + $i),
                $i % 10 === 8 => "Jr. Tacna " . (800 + $i),
                $i % 10 === 9 => "Av. Universitaria " . (900 + $i),
                default => "Jr. Los Sauces " . (1000 + $i),
            };

            $data = [
                'name' => $fullName,
                'dni_ruc' => $dni,
                'phone' => $phoneNumber,
                'address' => $address . ", Lima",
                'email' => $email,
                'active' => 1,
            ];

            Customer::firstOrCreate(
                ['email' => $data['email']],
                $data
            );
        }

    }
}
