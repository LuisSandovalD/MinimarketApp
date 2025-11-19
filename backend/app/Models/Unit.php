<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    protected $table = 'units';
    public $timestamps = true;

    protected $fillable = ['name', 'abbreviation'];

    public function categories()
    {
        return $this->hasMany(Category::class, 'unit_id');
    }
}
