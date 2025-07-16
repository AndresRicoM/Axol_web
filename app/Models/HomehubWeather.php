<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HomehubWeather extends Model
{
    use HasFactory;

    // Specify the table name
    protected $table;

    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->table = config('services.tables.homehub_weather');
    }

    // Specify the columns that can be mass assigned
    protected $fillable = [
        'mac_add',
        'temp',
        'min_temp',
        'max_temp',
        'weather_main',
        'weather_description',
        'pressure',
        'humidity',
        'wind_speed',
        'wind_direction',
        'datetime',
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
