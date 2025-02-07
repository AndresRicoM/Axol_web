<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BucketActivations extends Model
{
    use HasFactory;
    protected $table = 'bucket_activationsdb';

    protected $fillable = [
        'datetime',
        'mac_add',
    ];

    protected $primaryKey = 'datetime';

    public $timestamps = false;

}
