<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    protected $table = 'sales';
    public $timestamps = true;

    protected $fillable = [
        'sale_number',
        'customer_id',
        'user_id',
        'date',
        'subtotal',
        'vat',
        'total',
        'payment_method_id',
        'notes',
    ];

    // Cliente que realiza la compra
    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    // Usuario (vendedor o cajero)
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // Método de pago
    public function paymentMethod()
    {
        return $this->belongsTo(PaymentMethod::class, 'payment_method_id');
    }

    // Detalles de la venta
    public function details()
    {
        return $this->hasMany(SaleDetail::class, 'sale_id');
    }

    // Documento relacionado (boleta/factura)
    public function document()
    {
        return $this->hasOne(Document::class, 'sale_id');
    }

    // Crédito asociado (si es venta a crédito)
    public function credit()
    {
        return $this->hasOne(Credit::class, 'sale_id');
    }
}
