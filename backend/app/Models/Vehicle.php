<?php

namespace App\Models;

use App\Casts\Json;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    protected $casts = [
        'vehicle_features' => Json::class,
        'vehicle_financial' => Json::class,
    ];

    protected $fillable = ['user_id'];

    public function vehicle_photos()
    {
        return $this->hasMany('App\Models\Vehicle_photos', 'vehicle_id', 'id')->orderBy('order', 'ASC');
    }
}
