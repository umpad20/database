<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MaintenanceRecord extends Model
{
    use HasFactory;

    protected $fillable = [
        'motorcycle_id',
        'user_id',
        'type',
        'description',
        'cost',
        'date',
        'status',
    ];

    public function motorcycle()
    {
        return $this->belongsTo(Motorcycle::class);
    }

    public function admin()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
