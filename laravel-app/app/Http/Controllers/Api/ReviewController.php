<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductReview;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    private function recalculateProductStats(Product $product): void
    {
        $stats = ProductReview::where('product_id', $product->id)
            ->where('is_approved', true)
            ->selectRaw('count(*) as review_count, avg(rating) as average_rating')
            ->first();

        $product->reviews_count = (int) ($stats->review_count ?? 0);
        $product->rating_average = (float) ($stats->average_rating ?? 0);
        $product->save();
    }

    public function index(string $id)
    {
        $product = Product::find($id);
        if (! $product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $items = ProductReview::with('user')
            ->where('product_id', $product->id)
            ->where('is_approved', true)
            ->latest()
            ->get()
            ->map(fn ($review) => [
                'id' => (string) $review->id,
                'rating' => (int) $review->rating,
                'title' => $review->title,
                'comment' => $review->comment,
                'user' => [
                    'id' => (string) $review->user->id,
                    'name' => $review->user->name,
                ],
                'createdAt' => $review->created_at,
            ]);

        return response()->json([
            'items' => $items,
            'meta' => [
                'ratingAverage' => (float) $product->rating_average,
                'reviewsCount' => (int) $product->reviews_count,
            ],
        ]);
    }

    public function store(Request $request, string $id)
    {
        $user = $request->attributes->get('auth_user');
        $product = Product::find($id);

        if (! $product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $data = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|min:3|max:2000',
        ]);

        $review = DB::transaction(function () use ($user, $product, $data) {
            $review = ProductReview::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'product_id' => $product->id,
                ],
                [
                    'rating' => $data['rating'],
                    'title' => $data['title'] ?? null,
                    'comment' => $data['comment'],
                    'is_approved' => true,
                    'approved_at' => now(),
                ]
            );

            $this->recalculateProductStats($product);

            return $review;
        });

        return response()->json([
            'item' => [
                'id' => (string) $review->id,
                'rating' => (int) $review->rating,
                'title' => $review->title,
                'comment' => $review->comment,
                'createdAt' => $review->created_at,
            ],
        ], 201);
    }
}
