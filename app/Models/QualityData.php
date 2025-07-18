<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class QualityData extends Model
{
    use HasFactory;

    protected $table;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = config('services.tables.quality_data');
    }

    protected $fillable = [
        'mac_add',
        'tds',
        'water_temp',
        'datetime',
        'humidity',
    ];

    protected $casts = [
        'mac_add' => 'string',
        'tds' => 'float',
        'water_temp' => 'float',
        'datetime' => 'datetime',
        'humidity' => 'float',

    ];

    protected $primaryKey = 'mac_add';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    public function qualitySensor(): BelongsTo
    {
        return $this->belongsTo(Quality::class, 'mac_add', 'mac_add');
    }
}
