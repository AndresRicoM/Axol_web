<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BucketActivations extends Model
{
    use HasFactory;
    protected $table = 'bucket_activationsdb_practice';

    protected $fillable = [
        'datetime',
        'mac_add',
    ];

    protected $primaryKey = 'mac_add';
    public $incrementing = false;

    protected $keyType = 'string';

    public $timestamps = false;

    
    public function bucketSensors(): BelongsTo
    {
        return $this->belongsTo(Bucket::class, 'mac_add', 'mac_add');
    }
}
