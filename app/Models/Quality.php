<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Quality extends Model
{
    use HasFactory;

    protected $table = 'quality_sensors';

    protected $fillable = [
        'mac_add',
        'paired_with',
        'use'
    ];

    protected $casts = [
        'mac_add' => 'string',
        'paired_with' => 'string',
        'use' => 'string',
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
        return $this->hasOne(QualityData::class, 'mac_add', 'mac_add')->latest('datetime');
    }
}
