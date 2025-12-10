<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FileController extends Controller
{
    //
    public function store(Request $request)
{
    $request->validate([
        'file' => 'required|mimes:jpg,png,pdf,docx,zip|max:10240',
    ]);

    $path = $request->file('file')->store('uploads');

    return response()->json([
        'message' => 'Uploaded',
        'path' => $path
    ]);
}

}
