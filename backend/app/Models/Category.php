<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $table = 'categories';
    public $timestamps = true;

    protected $fillable = ['name', 'description', 'unit_id', 'active'];

    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unit_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class, 'category_id');
    }
}
