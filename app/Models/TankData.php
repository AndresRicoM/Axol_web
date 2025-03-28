<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TankData extends Model
{
    use HasFactory;

    protected $table = 'stored_waterdb';

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
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    public function tankSensor(): BelongsTo
    {
        return $this->belongsTo(Tank::class, 'mac_add', 'mac_add');
    }
}
