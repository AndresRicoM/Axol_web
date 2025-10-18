<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityView extends Model
{
    use HasFactory;

    protected $table = 'community_view';  // para que Laravel sepa que es una vista
    public $timestamps = false;
}
