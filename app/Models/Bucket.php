<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bucket extends Model
{
    use HasFactory;

    protected $table = 'bucket_sensorsdb';

    protected $fillable = [
        'mac_add',
        'paired_with',
        'buck_capacity',
        'use'
    ];

    #define the real primatykey
    protected $primaryKey = 'mac_add';

    #the primary has´nt a incrementing
    public $incrementing = false;

    #the data type is string
    protected $keyType = 'string';

    #we don´t need a timestamp
    public $timestamps = false;

    #its belongs to because is only one homehub for buckets
    public function homehub(): BelongsTo
    {
        return $this->belongsTo(Homehub::class, 'paired_with', 'mac_add');
    }   
    public function logs(): HasMany
    {
        return $this->hasMany(BucketActivations::class, 'mac_add', 'mac_add');
    }
}
