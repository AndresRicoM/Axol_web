<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bucket extends Model
{
    use HasFactory;

    protected $table = 'bucket_sensorsdb_practice';

    protected $fillable = [
        'mac_add',
        'paired_with',
        'buck_capacity',
        'use'
    ];

    protected $primaryKey = 'mac_add';

    public $timestamps = false;
}
