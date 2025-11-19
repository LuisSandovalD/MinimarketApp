<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    protected $table = 'customers';
    public $timestamps = true;

    protected $fillable = [
        'name', 
        'dni_ruc', 
        'phone', 
        'address', 
        'email', 
        'active',
    ];

    // Relationships
    public function sales()
    {
        return $this->hasMany(Sale::class, 'customer_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class, 'customer_id');
    }
}
