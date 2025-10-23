<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $table = 'documents';
    public $timestamps = true;

    protected $fillable = [
        'sale_id', 
        'document_type_id', 
        'series', 
        'number', 
        'issue_date',
        'subtotal',
        'vat',
        'total',

    ];

    public function sale()
    {
        return $this->belongsTo(Sale::class, 'sale_id');
    }

    public function documentType()
    {
        return $this->belongsTo(DocumentType::class, 'document_type_id');
    }
}
