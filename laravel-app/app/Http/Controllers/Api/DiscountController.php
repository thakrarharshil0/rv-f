<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Discount;
use Illuminate\Http\Request;

class DiscountController extends Controller
{
    private function serializeDiscount(Discount $discount, float $subtotal = 0.0): array
    {
        $amount = $discount->calculateDiscountAmount($subtotal);

        return [
            'id' => (string) $discount->id,
            'code' => $discount->code,
            'name' => $discount->name,
            'type' => $discount->type,
            'value' => (float) $discount->value,
            'minimumOrderTotal' => (float) $discount->minimum_order_total,
            'usageLimit' => $discount->usage_limit,
            'usageCount' => (int) $discount->usage_count,
            'discountAmount' => $amount,
            'finalTotal' => max(0, $subtotal - $amount),
            'isActive' => $discount->isActive(),
            'startsAt' => $discount->starts_at,
            'endsAt' => $discount->ends_at,
        ];
    }

    public function validateCode(Request $request)
    {
        $data = $request->validate([
            'code' => 'required|string|max:64',
            'subtotal' => 'nullable|numeric|min:0',
        ]);

        $discount = Discount::whereRaw('upper(code) = ?', [strtoupper($data['code'])])->first();

        if (! $discount || ! $discount->isActive()) {
            return response()->json(['message' => 'Discount code is invalid or expired'], 404);
        }

        $subtotal = (float) ($data['subtotal'] ?? 0);
        if ($subtotal > 0 && ! $discount->canBeUsedBy(null, $subtotal)) {
            return response()->json(['message' => 'Discount does not apply to this subtotal'], 422);
        }

        return response()->json(['discount' => $this->serializeDiscount($discount, $subtotal)]);
    }

    public function show(string $code)
    {
        $discount = Discount::whereRaw('upper(code) = ?', [strtoupper($code)])->first();

        if (! $discount) {
            return response()->json(['message' => 'Discount not found'], 404);
        }

        return response()->json(['discount' => $this->serializeDiscount($discount)]);
    }
}
