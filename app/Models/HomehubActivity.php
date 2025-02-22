<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomehubActivity extends Model
{
    use HasFactory;

    // Specify the table name
    protected $table = 'homehub_activity_practice';

    // Specify the columns that can be mass assigned
    protected $fillable = [
        'mac_add',
        'datetime',
        'activity',
    ];

    // Laravel expects the primary key to be "id". If it's different (for example, "mac_add';"), add this:
    protected $primaryKey = 'mac_add';

    // If the primary key is not auto-incrementing, specify that it's not
    public $incrementing = false;

    // If the primary key is not an integer, specify the type
    protected $keyType = 'string';

    // Disable the automatic timestamps
    public $timestamps = false;
}
