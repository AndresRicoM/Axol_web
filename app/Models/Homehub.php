<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Homehub extends Model
{
    use HasFactory;

    protected $table = 'homehub_devices_practice';

    // Define las columnas que se pueden llenar masivamente
    protected $fillable = [
        'user_id',
        'mac_add',
        'lat',
        'lon',
        'name',
    ];

    protected $casts = [
        'mac_add' => 'string'
    ];

    protected $primaryKey = 'mac_add';
    public $incrementing = false;
    protected $keyType = 'string';

    public $timestamps = false;

    public function qualitySensors(): HasMany
    {
        return $this->hasMany(Quality::class, 'paired_with', 'mac_add');
    }

    public function bucketSensors(): HasMany
    {
        return $this->hasMany(Bucket::class, 'paired_with', 'mac_add');
    }

    public function tankSensors(): HasMany
    {
        return $this->hasMany(Tank::class, 'paired_with', 'mac_add');
    }
}
