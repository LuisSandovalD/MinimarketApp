<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentType extends Model
{
    protected $table = 'document_types';
    public $timestamps = true;

    protected $fillable = [
        'name', 
        'code', 
        'requires_vat'];

    public function documents()
    {
        return $this->hasMany(Document::class, 'document_type_id');
    }
}
