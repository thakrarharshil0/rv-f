<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query();

        if ($request->filled('category') && ! in_array($request->category, ['shop', 'new-in', 'all'], true)) {
            $query->whereRaw('lower(category) = ?', [strtolower($request->category)]);
        }

        if ($request->filled('search')) {
            $q = strtolower($request->search);
            $query->where(function ($builder) use ($q) {
                $builder->whereRaw('lower(name) like ?', ["%{$q}%"])
                    ->orWhereRaw('lower(category) like ?', ["%{$q}%"]);
            });
        }

        if ($request->boolean('newOnly')) {
            $query->where('is_new', true);
        }

        if ($request->boolean('featured')) {
            $query->where('is_featured', true);
        }

        $sort = $request->string('sort')->toString();
        if ($sort === 'price_asc') {
            $query->orderBy('price');
        } elseif ($sort === 'price_desc') {
            $query->orderByDesc('price');
        } elseif ($sort === 'newest') {
            $query->orderByDesc('created_at');
        } else {
            $query->orderBy('name');
        }

        $perPage = max(1, min(48, (int) $request->input('perPage', 24)));
        $page = max(1, (int) $request->input('page', 1));
        $paginator = $query->paginate($perPage, ['*'], 'page', $page);

        $items = $paginator->getCollection()->map(function ($p) {
            return [
                'id' => (string) $p->id,
                'name' => $p->name,
                'category' => $p->category,
                'price' => (float) $p->price,
                'originalPrice' => $p->original_price !== null ? (float) $p->original_price : null,
                'quantity' => (int) $p->quantity,
                'image' => $p->image,
                'sku' => $p->sku,
                'description' => $p->description,
                'isNew' => (bool) $p->is_new,
                'isFeatured' => (bool) $p->is_featured,
                'fit' => $p->fit,
                'material' => $p->material,
                'careInstructions' => $p->care_instructions,
                'sizes' => $p->sizes ?: [],
                'colors' => $p->colors ?: [],
                'features' => $p->features ?: [],
                'gallery' => $p->gallery ?: [],
                'ratingAverage' => (float) $p->rating_average,
                'reviewsCount' => (int) $p->reviews_count,
                'displayPrice' => '₹'.number_format((float) $p->price, 0),
                'originalDisplayPrice' => $p->original_price !== null ? '₹'.number_format((float) $p->original_price, 0) : null,
            ];
        });

        return response()->json([
            'items' => $items,
            'meta' => [
                'currentPage' => $paginator->currentPage(),
                'lastPage' => $paginator->lastPage(),
                'perPage' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    public function show(string $id)
    {
        $product = Product::with(['reviews.user' => fn ($query) => $query->select('id', 'name')])->find($id);

        if (! $product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json([
            'item' => [
                'id' => (string) $product->id,
                'name' => $product->name,
                'category' => $product->category,
                'price' => (float) $product->price,
                'originalPrice' => $product->original_price !== null ? (float) $product->original_price : null,
                'quantity' => (int) $product->quantity,
                'image' => $product->image,
                'sku' => $product->sku,
                'description' => $product->description,
                'isNew' => (bool) $product->is_new,
                'isFeatured' => (bool) $product->is_featured,
                'fit' => $product->fit,
                'material' => $product->material,
                'careInstructions' => $product->care_instructions,
                'sizes' => $product->sizes ?: [],
                'colors' => $product->colors ?: [],
                'features' => $product->features ?: [],
                'gallery' => $product->gallery ?: [],
                'ratingAverage' => (float) $product->rating_average,
                'reviewsCount' => (int) $product->reviews_count,
                'displayPrice' => '₹'.number_format((float) $product->price, 0),
                'originalDisplayPrice' => $product->original_price !== null ? '₹'.number_format((float) $product->original_price, 0) : null,
                'reviews' => $product->reviews->map(function ($review) {
                    return [
                        'id' => (string) $review->id,
                        'rating' => (int) $review->rating,
                        'title' => $review->title,
                        'comment' => $review->comment,
                        'user' => [
                            'id' => (string) $review->user->id,
                            'name' => $review->user->name,
                        ],
                        'createdAt' => $review->created_at,
                    ];
                })->values(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'originalPrice' => 'nullable|numeric|min:0',
            'quantity' => 'nullable|integer|min:0',
            'image' => 'nullable|string',
            'sku' => 'nullable|string',
            'description' => 'nullable|string',
            'fit' => 'nullable|string|max:255',
            'material' => 'nullable|string|max:255',
            'careInstructions' => 'nullable|string',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|array',
            'features' => 'nullable|array',
            'gallery' => 'nullable|array',
            'isNew' => 'nullable|boolean',
            'isFeatured' => 'nullable|boolean',
        ]);

        $product = Product::create([
            'name' => $data['name'],
            'category' => $data['category'],
            'price' => $data['price'],
            'original_price' => $data['originalPrice'] ?? null,
            'quantity' => $data['quantity'] ?? 0,
            'image' => $data['image'] ?? null,
            'sku' => $data['sku'] ?? null,
            'description' => $data['description'] ?? null,
            'fit' => $data['fit'] ?? null,
            'material' => $data['material'] ?? null,
            'care_instructions' => $data['careInstructions'] ?? null,
            'sizes' => $data['sizes'] ?? [],
            'colors' => $data['colors'] ?? [],
            'features' => $data['features'] ?? [],
            'gallery' => $data['gallery'] ?? [],
            'is_new' => (bool) ($data['isNew'] ?? false),
            'is_featured' => (bool) ($data['isFeatured'] ?? false),
        ]);

        return response()->json(['item' => $product], 201);
    }

    public function update(Request $request, string $id)
    {
        $product = Product::find($id);

        if (! $product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'originalPrice' => 'nullable|numeric|min:0',
            'quantity' => 'sometimes|integer|min:0',
            'image' => 'nullable|string',
            'sku' => 'nullable|string',
            'description' => 'nullable|string',
            'fit' => 'nullable|string|max:255',
            'material' => 'nullable|string|max:255',
            'careInstructions' => 'nullable|string',
            'sizes' => 'nullable|array',
            'colors' => 'nullable|array',
            'features' => 'nullable|array',
            'gallery' => 'nullable|array',
            'isNew' => 'nullable|boolean',
            'isFeatured' => 'nullable|boolean',
        ]);

        $product->fill([
            'name' => $data['name'] ?? $product->name,
            'category' => $data['category'] ?? $product->category,
            'price' => $data['price'] ?? $product->price,
            'original_price' => array_key_exists('originalPrice', $data) ? $data['originalPrice'] : $product->original_price,
            'quantity' => $data['quantity'] ?? $product->quantity,
            'image' => $data['image'] ?? $product->image,
            'sku' => $data['sku'] ?? $product->sku,
            'description' => $data['description'] ?? $product->description,
            'fit' => $data['fit'] ?? $product->fit,
            'material' => $data['material'] ?? $product->material,
            'care_instructions' => $data['careInstructions'] ?? $product->care_instructions,
            'sizes' => $data['sizes'] ?? $product->sizes,
            'colors' => $data['colors'] ?? $product->colors,
            'features' => $data['features'] ?? $product->features,
            'gallery' => $data['gallery'] ?? $product->gallery,
            'is_new' => array_key_exists('isNew', $data) ? (bool) $data['isNew'] : $product->is_new,
            'is_featured' => array_key_exists('isFeatured', $data) ? (bool) $data['isFeatured'] : $product->is_featured,
        ]);

        $product->save();

        return response()->json(['item' => $product]);
    }

    public function destroy(string $id)
    {
        $product = Product::find($id);

        if (! $product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        $deletedId = (string) $product->id;

        $product->delete();

        return response()->json(['message' => 'Product deleted']);
    }
}
