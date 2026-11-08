<?php

namespace Database\Seeders;

use App\Models\Resident;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@barangay.test'],
            [
                'name' => 'System Admin',
                'password' => Hash::make('password'),
            ],
        );

        $seed = [
            ['Santos, Maria Cruz', 34, 'Farmer', 'Yes', 'Given', ''],
            ['Reyes, Juan Dela Pena', 51, 'Fisherman', 'No', 'Pending', 'Medical'],
            ['Garcia, Ana Lopez', 29, 'Public school teacher', 'Yes', 'Pending', 'Food Pack'],
            ['Bautista, Pedro Ramos', 63, 'Sari-sari store owner', 'No', 'Given', ''],
            ['Mendoza, Rosa Flores', 45, 'Tricycle driver', 'No', 'Pending', 'Food Pack'],
            ['Villanueva, Jose Aquino', 38, 'Carpenter', 'Yes', 'Given', ''],
            ['Castillo, Liza Navarro', 57, 'Nurse', 'No', 'Pending', 'Medical'],
            ['Torres, Miguel Santiago', 42, 'Tailor', 'Yes', 'Given', ''],
            ['Dizon, Carmen Pascual', 60, 'Electrician', 'No', 'Pending', ''],
            ['Ramos, Antonio Cruz', 26, 'Senior high student', 'No', 'Given', ''],
        ];

        Resident::query()->delete();

        $timestamp = now();

        foreach ($seed as $index => [$name, $age, $job, $pwd, $assistance, $need]) {
            $birthday = sprintf(
                '%d-%02d-%02d',
                2026 - $age,
                ($index % 10) + 1,
                (($index * 2) % 27) + 1,
            );

            Resident::query()->create([
                'code' => 'R-'.str_pad((string) ($index + 1), 3, '0', STR_PAD_LEFT),
                'name' => $name,
                'age' => $age,
                'birthday' => $birthday,
                'age_year' => 2026,
                'sex' => $index % 2 === 0 ? 'Female' : 'Male',
                'job' => $job,
                'purok' => 'Purok '.(($index % 5) + 1),
                'pwd' => $pwd === 'Yes',
                'assistance' => $assistance,
                'need' => $need ?: null,
                'remarks' => null,
                'created_at' => $timestamp,
                'updated_at' => $timestamp,
            ]);
        }
    }
}
