<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tank extends Model
{
    use HasFactory;

    protected $table = 'tank_sensorsdb_practice_ui';

    protected $fillable = [
        'mac_add',
        'paired_with',
        'tank_capacity',
        'use',
        'max_height',
        'offset',
        'tank_type',
        'diameter',
        'width'

    ];

    protected $casts = [
        'mac_add' => 'string',
        'paired_with' => 'string',
        'tank_capacity' => 'float',
        'use' => 'string',
        'max_height' => 'integer',
        'offset' => 'integer',
        'tank_type' => 'string',
        'diameter' => 'float',
        'width' => 'float'
    ];


    // Laravel expects the primary key to be "id". If it's different (for example, "mac_add';"), add this:
    protected $primaryKey = 'mac_add';

    // If the primary key is not auto-incrementing, specify that it's not
    public $incrementing = false;

    // If the primary key is not an integer, specify the type
    protected $keyType = 'string';

    // Disable the automatic timestamps
    public $timestamps = false;

    // Define a relationship with the TankData model
    public function tankData()
    {
        return $this->hasMany(TankData::class, 'mac_add', 'mac_add');
    }
}
