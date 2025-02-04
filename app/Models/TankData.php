<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TankData extends Model
{
    use HasFactory;

    protected $table = 'stored_waterdb_practice_ui';

    protected $fillable = [
        'mac_add',
        'water_distance',
        'datetime'
    ];
    
    protected $casts = [
        'mac_add' => 'string',
        'water_distance'=> 'float',
        'datetime'=> 'datetime'

    ];

    protected $primaryKey = 'mac_add';

    public $timestamps = false;
}
