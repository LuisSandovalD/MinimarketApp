<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Credit extends Model
{
    protected $table = 'credits';
    public $timestamps = true;

    protected $fillable = [
        'sale_id', 
        'total_amount', 
        'interest_rate', 
        'interest_amount',
        'total_with_interest', 
        'due_date',
        'status',
    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class, 'sale_id');
    }

    public function payments()
    {
        return $this->hasMany(CreditPayment::class, 'credit_id');
    }
}
