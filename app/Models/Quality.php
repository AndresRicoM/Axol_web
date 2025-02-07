<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Quality extends Model
{
    use HasFactory;

    protected $table = 'quality_sensors_practice';

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

    public $timestamps = false;
}
