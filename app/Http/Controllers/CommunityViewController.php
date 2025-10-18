<?php

namespace App\Http\Controllers;

use App\Models\CommunityView;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommunityViewController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $userId = auth()->id();
        $datosComunidad = CommunityView::where('user_id', $userId)->get();

        return Inertia::render('Community', [
            'datosComunidad' => $datosComunidad,
            'user' => auth()->user()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(CommunityView $communityView)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CommunityView $communityView)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CommunityView $communityView)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CommunityView $communityView)
    {
        //
    }
}
