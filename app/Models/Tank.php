<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tank extends Model
{
    use HasFactory;

    protected $table = 'tank_sensorsdb';

    protected $fillable = [
        'mac_add',
        'paired_with',
        'tank_capacity',
        'use',
        'tank_area',
        'max_height'
    ];

    protected $casts = [
        'mac_add' => 'string',
        'paired_with' => 'string',
        'tank_capacity' => 'float',
        'use' => 'string',
        'tank_area' => 'float',
        'max_height' => 'integer'
    ];

    protected $primaryKey = 'mac_add';

    public $timestamps = false;


    // Define a relationship with the TankData model
    public function tankData()
    {
        return $this->hasMany(TankData::class, 'mac_add', 'mac_add');
    }
}
