<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shopping extends Model
{
    use HasFactory;

    // 👇 Fuerza el nombre de la tabla correcta
    protected $table = 'shopping'; // o 'compras', según corresponda

    protected $fillable = [
        'shopping_number',
        'user_id',
        'supplier_id',
        'date',
        'subtotal',
        'vat',
        'total',
        'notes',
    ];

    public function details()
    {
        return $this->hasMany(ShoppingDetail::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }
}
