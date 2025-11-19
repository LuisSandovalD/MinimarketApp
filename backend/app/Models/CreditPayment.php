<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CreditPayment extends Model
{
    protected $table = 'credits_payments';
    public $timestamps = true;

    protected $fillable = [
        'payment_date', 
        'amount',
        'user_id', 
        'credit_id',
        'notes',
    ];

    public function credit()
    {
        return $this->belongsTo(Credit::class, 'credit_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
