<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class Task extends Model
{
    protected $fillable = [
        'title',
        'description',
        'status',
        'user_id',
    ];

    // Relationship: a task belongs to a user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
