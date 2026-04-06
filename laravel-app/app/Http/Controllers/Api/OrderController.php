<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Discount;
use App\Models\DiscountRedemption;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->attributes->get('auth_user');

        $data = $request->validate([
            'customerDetails' => 'required|array',
            'shippingAddress' => 'required|array',
            'billingDetails' => 'nullable|array',
            'shippingOption' => 'nullable|string',
            'paymentMethod' => 'nullable|string',
            'discountCode' => 'nullable|string|max:64',
        ]);

        $cartItems = Cart::where('user_id', $user->id)->get();
        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 400);
        }

        $productsById = Product::whereIn('id', $cartItems->pluck('product_id'))->get()->keyBy('id');
        foreach ($cartItems as $item) {
            $product = $productsById->get($item->product_id);
            if (! $product) {
                return response()->json(['message' => 'Product not found in catalog'], 422);
            }

            if ((int) $item->quantity > (int) $product->quantity) {
                return response()->json(['message' => "Insufficient stock for {$product->name}"], 422);
            }
        }

        $subtotal = $cartItems->sum(fn ($item) => ((float) $item->price) * ((int) $item->quantity));
        $shippingOption = $data['shippingOption'] ?? 'standard';
        $shippingCost = $shippingOption === 'express' ? 15 : ($shippingOption === 'overnight' ? 35 : 0);
        $discount = null;
        $discountAmount = 0.0;

        if (! empty($data['discountCode'])) {
            $discount = Discount::whereRaw('upper(code) = ?', [strtoupper($data['discountCode'])])->first();
            if (! $discount || ! $discount->isActive() || ! $discount->canBeUsedBy($user, $subtotal)) {
                return response()->json(['message' => 'Invalid or expired discount code'], 422);
            }

            $discountAmount = $discount->calculateDiscountAmount($subtotal);
        }

        $total = max(0, $subtotal + $shippingCost - $discountAmount);

        $order = DB::transaction(function () use ($data, $user, $cartItems, $subtotal, $shippingCost, $shippingOption, $discount, $discountAmount, $total, $productsById) {
            $order = Order::create([
                'user_id' => $user->id,
                'customer_details' => $data['customerDetails'],
                'shipping_address' => $data['shippingAddress'],
                'billing_details' => $data['billingDetails'] ?? null,
                'shipping_option' => $shippingOption,
                'payment_method' => $data['paymentMethod'] ?? 'card',
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'discount_code' => $discount?->code,
                'discount_amount' => $discountAmount,
                'total' => $total,
                'status' => 'placed',
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'name' => $item->name,
                    'price' => $item->price,
                    'image' => $item->image,
                    'size' => $item->size,
                    'color' => $item->color,
                    'quantity' => $item->quantity,
                ]);

                Product::whereKey($item->product_id)->decrement('quantity', (int) $item->quantity);
            }

            if ($discount) {
                $discount->increment('usage_count');
                DiscountRedemption::create([
                    'discount_id' => $discount->id,
                    'user_id' => $user->id,
                    'order_id' => $order->id,
                ]);
            }

            OrderStatusHistory::create([
                'order_id' => $order->id,
                'status' => 'placed',
                'changed_by_user_id' => $user->id,
                'meta' => ['source' => 'checkout'],
            ]);

            Cart::where('user_id', $user->id)->delete();

            return $order;
        });

        return response()->json([
            'orderId' => (string) $order->id,
            'total' => (float) $order->total,
            'discountAmount' => (float) $order->discount_amount,
            'message' => 'Order placed successfully',
        ], 201);
    }

    public function index(Request $request)
    {
        $user = $request->attributes->get('auth_user');

        $items = Order::where('user_id', $user->id)
            ->latest()
            ->withCount('items')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => (string) $order->id,
                    'subtotal' => (float) $order->subtotal,
                    'shippingCost' => (float) $order->shipping_cost,
                    'discountAmount' => (float) $order->discount_amount,
                    'total' => (float) $order->total,
                    'status' => $order->status,
                    'itemsCount' => (int) $order->items_count,
                    'createdAt' => $order->created_at,
                ];
            });

        return response()->json(['items' => $items]);
    }

    public function show(Request $request, string $id)
    {
        $user = $request->attributes->get('auth_user');
        $order = Order::with(['items', 'statusHistories'])->where('user_id', $user->id)->find($id);

        if (! $order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        return response()->json([
            'item' => [
                'id' => (string) $order->id,
                'customerDetails' => $order->customer_details,
                'shippingAddress' => $order->shipping_address,
                'billingDetails' => $order->billing_details,
                'shippingOption' => $order->shipping_option,
                'paymentMethod' => $order->payment_method,
                'subtotal' => (float) $order->subtotal,
                'shippingCost' => (float) $order->shipping_cost,
                'discountCode' => $order->discount_code,
                'discountAmount' => (float) $order->discount_amount,
                'total' => (float) $order->total,
                'status' => $order->status,
                'createdAt' => $order->created_at,
                'items' => $order->items->map(fn ($item) => [
                    'id' => (string) $item->id,
                    'productId' => $item->product_id ? (string) $item->product_id : null,
                    'name' => $item->name,
                    'price' => (float) $item->price,
                    'image' => $item->image,
                    'size' => $item->size,
                    'color' => $item->color,
                    'quantity' => (int) $item->quantity,
                ])->values(),
                'history' => $order->statusHistories->map(fn ($entry) => [
                    'id' => (string) $entry->id,
                    'status' => $entry->status,
                    'meta' => $entry->meta,
                    'createdAt' => $entry->created_at,
                ])->values(),
            ],
        ]);
    }
}
