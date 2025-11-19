<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    protected $table = 'notifications';
    public $timestamps = true;

    protected $fillable = [
        'user_id', 
        'customer_id', 
        'credit_id', 
        'message', 
        'scheduled_date', 
        'sent_date', 
        'attempts', 
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }
       public function credit()
    {
        return $this->belongsTo(Credit::class, 'credit_id');
    }
}
