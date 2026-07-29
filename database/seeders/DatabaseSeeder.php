<?php

namespace Database\Seeders;

use App\Models\Employee;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@admin.com'],
            [
                'name' => 'Administrador',
                'password' => Hash::make('12345678'),
            ],
        );

        $employees = [
            'Alex Manoel',
            'João Silva',
            'Maria Oliveira',
            'Carlos Souza',
            'Fernanda Lima',
        ];

        foreach ($employees as $name) {
            Employee::firstOrCreate(
                ['name' => $name],
                ['balance' => 0],
            );
        }
    }
}