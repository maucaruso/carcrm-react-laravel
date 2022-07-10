<?php

namespace Database\Seeders;

use App\Models\Plans;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $plans = [
            [
                'title' => 'Mensal',
                'price' => (float) '19.90',
                'equivalent' => (float) '19.90',
            ],
            [
                'title' => 'Semestral',
                'price' => (float) '107.40',
                'equivalent' => (float) '17.90',
                'discount' => '-10%'
            ],
            [
                'title' => 'Anual',
                'price' => (float) '179.00',
                'equivalent' => (float) '14.90',
                'discount' => '-25%'
            ]
        ];

        foreach ($plans as $plan) {
            Plans::create($plan);
        }
    }
}
