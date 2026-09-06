/**
 * Replaces the FormatCoins(int) static method duplicated near-identically
 * across Assets/Scripts/Inherit/{CoinsController,GemsController,CoinsGemsController}.cs
 * and re-declared again locally in CollectionController.cs - same logic,
 * copy-pasted at least four times in the Unity source. One function here.
 *
 * Matches the exact behavior of C#'s coins.ToString("0.##"): up to 2 decimal
 * places, trailing zeros trimmed (1.50 -> "1.5", 1.00 -> "1").
 */
export function formatCurrency(amount: number): string {
    if (amount >= 1_000_000) {
        return trimDecimal(amount / 1_000_000) + 'M';
    }
    if (amount >= 1_000) {
        return trimDecimal(amount / 1_000) + 'k';
    }
    return String(amount);
}

function trimDecimal(value: number): string {
    return (Math.round(value * 100) / 100).toString();
}
