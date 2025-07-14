<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
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
        'diameter',
        'width',
        'height',
        'depth'
    ];

    protected $casts = [
        'mac_add' => 'string',
        'paired_with' => 'string',
        'tank_capacity' => 'float',
        'use' => 'string',
        'max_height' => 'integer',
        'offset' => 'float',
        'diameter' => 'float',
        'width' => 'float',
        'height' => 'float',
        'depth' => 'float'
    ];

    protected $primaryKey = 'mac_add';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    public function homehub(): BelongsTo
    {
        return $this->belongsTo(Homehub::class, 'paired_with', 'mac_add');
    }

    public function latestLog(): HasOne
    {
        return $this->hasOne(TankData::class, 'mac_add', 'mac_add')->latest('datetime');
    }

    public function logsLast3Years(): HasMany
    {
        $startYear = date('Y') - 3;
        return $this->hasMany(TankData::class, 'mac_add', 'mac_add')
            ->whereBetween('datetime', ["$startYear-01-01", date('Y-m-d')])
            ->orderBy('datetime');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(TankData::class, 'mac_add', 'mac_add')
            ->orderBy('datetime');
    }
}
