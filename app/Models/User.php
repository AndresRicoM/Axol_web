<?php

namespace App\Models;


use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $hidden = [
        'password',
    ]; 

    // Cambia la tabla a tu tabla personalizada
    protected $table = 'users';

    // Define las columnas que se pueden llenar masivamente
    protected $fillable = [
        'username',
        'password',
    ];

    // Laravel espera que la clave primaria sea "id". Si es diferente (por ejemplo, "user_id"), agrega esto:
    protected $primaryKey = 'user_id';

    // Si la clave primaria no es auto-incremental, indica que no usa autoincremento
    public $incrementing = true;

    // Si la clave primaria no es de tipo "int", especifica el tipo
    protected $keyType = 'int';

    // Si tu tabla no tiene las columnas de marcas de tiempo (created_at y updated_at), desactívalas:
    public $timestamps = false;
}
