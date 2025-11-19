<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SaleDetail extends Model
{
    protected $table = 'sales_details';
    public $timestamps = true;

    protected $fillable = [
        'sale_id', 'product_id', 'quantity',
        'unit_price', 'subtotal'
    ];

    // Relationships
    public function sale()
    {
        return $this->belongsTo(Sale::class, 'sale_id');
    }

    public function product()
    {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
