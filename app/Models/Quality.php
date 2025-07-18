<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Quality extends Model
{
    use HasFactory;

    protected $table;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = config('services.tables.quality');
    }

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

    public function qualityData(): HasMany
    {
        return $this->hasMany(QualityData::class, 'mac_add', 'mac_add');
    }

    public function latestLog(): HasOne
    {
        return $this->hasOne(QualityData::class, 'mac_add', 'mac_add')->latest('datetime');
    }

    public function logsYear(): HasMany
    {
        return $this->hasMany(QualityData::class, 'mac_add', 'mac_add')
            ->whereYear('datetime', date('Y'))
            ->orderBy('datetime');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(QualityData::class, 'mac_add', 'mac_add')
            ->orderBy('datetime');
    }
}
