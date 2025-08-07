<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DebugSensorData extends Model
{
    use HasFactory;

    protected $table;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = config('services.tables.debug_data');
    }

    protected $fillable = [
        'mac_add',
        'water_distance',
        'tds',
        'water_temp',
        'humidity',
        'datetime'
    ];

    protected $casts = [
        'mac_add' => 'string',
        'water_distance' => 'float',
        'datetime' => 'datetime'

    ];

    protected $primaryKey = 'mac_add';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;
}
