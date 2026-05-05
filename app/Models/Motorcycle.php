<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Motorcycle extends Model
{
    /** @use HasFactory<\Database\Factories\MotorcycleFactory> */
    use HasFactory;

    protected $fillable = [
        'brand',
        'model',
        'category_id',
        'daily_rate',
        'status',
        'image_path',
        'plate_number',
        'engine_no',
        'chassis_no',
        'year',
        'color',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
    protected $casts = [
        'daily_rate' => 'decimal:2',
        'year' => 'integer',
    ];

    public function rentals(): HasMany
    {
        return $this->hasMany(Rental::class);
    }
}
