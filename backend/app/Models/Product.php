<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $table = 'products';
    public $timestamps = true;

    protected $fillable = [
        'code', 'name', 'description', 'category_id',
        'price', 'stock_current', 'stock_minimum',
        'active'
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'category_id');
    }

    public function shoppingDetail()
    {
        return $this->hasMany(shoppingDetail::class, 'product_id');
    }

    public function saleDetails()
    {
        return $this->hasMany(SaleDetail::class, 'product_id');
    }
}
