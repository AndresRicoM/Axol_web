<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

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
        'offset' => 'float',
        'tank_type' => 'string',
        'diameter' => 'float',
        'width' => 'float'
    ];

    protected $primaryKey = 'mac_add';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    public function homehub(): BelongsTo
    {
        return $this->belongsTo(Homehub::class, 'paired_with', 'mac_add');
    }

    public function logs(): HasOne
    {
        return $this->hasOne(TankData::class, 'mac_add', 'mac_add')->latest('datetime');
    }
}
