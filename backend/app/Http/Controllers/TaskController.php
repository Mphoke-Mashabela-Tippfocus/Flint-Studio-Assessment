<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Events\TaskUpdated; //  Import the event

class TaskController extends Controller
{
    /**
     * Display a listing of tasks.
     */
    public function index()
    {
        return Task::with('user')->get();
    }

    /**
     * Store a newly created task in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:todo,doing,done',
        ]);

        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'todo',
            'user_id' => auth()->id(),
        ]);

        // Broadcast the new task
        event(new TaskUpdated($task));

        return response()->json($task, 201);
    }

    /**
     * Display the specified task.
     */
    public function show(Task $task)
    {
        return $task;
    }

    /**
     * Update the specified task in storage.
     */
    public function update(Request $request, Task $task)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'in:todo,doing,done',
        ]);

        $task->update($request->only(['title', 'description', 'status']));

        // Broadcast the updated task
        event(new TaskUpdated($task));

        return response()->json($task);
    }

    /**
     * Remove the specified task from storage.
     */
    public function destroy(Task $task)
    {
        $task->delete();

        // Broadcast the deleted task (optional)
        event(new TaskUpdated($task));

        return response()->json(['message' => 'Task deleted']);
    }
}
