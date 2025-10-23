<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    protected $table = 'suppliers';
    public $timestamps = true;

    protected $fillable = [
        'name', 'ruc', 'phone', 'email', 'address',
        'active'
    ];

    public function shopping()
    {
        return $this->hasMany(Shopping::class, 'supplier_id');
    }
}
