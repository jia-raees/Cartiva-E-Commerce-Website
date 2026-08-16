// AI-powered recommendation engine.
//
// Runs entirely client-side against the product catalog, using a
// content-based scoring model (category, price proximity, vendor,
// rating, popularity) plus a lightweight personalization signal built
// from the shopper's own recently-viewed history (stored in
// localStorage, no account required).
//
// Every product coming out of the real backend (bazaar-backend) has the
// same shape — category/price/rating/reviews/vendorId — so these
// functions keep working unchanged once the frontend is wired up to
// the API instead of the static data file.

const VIEW_HISTORY_KEY = 'bazaar_view_history';
const MAX_HISTORY = 25;

/** Record that a product was viewed, most-recent-first, deduped. */
export function recordView(productId) {
  if (!productId) return;
  try {
    const history = getRecentlyViewed();
    const next = [productId, ...history.filter((id) => id !== productId)].slice(0, MAX_HISTORY);
    localStorage.setItem(VIEW_HISTORY_KEY, JSON.stringify(next));
  } catch {
    // localStorage unavailable (private browsing, etc.) — recommendations
    // just fall back to non-personalized picks.
  }
}

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(VIEW_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function priceProximityScore(priceA, priceB) {
  const diff = Math.abs(priceA - priceB);
  const scale = Math.max(priceA, priceB, 1);
  return Math.max(0, 1 - diff / scale); // 1 when equal, decays toward 0
}

/** How well `candidate` fits alongside `base`. Higher is more relevant. */
export function similarityScore(base, candidate, { preferVendor = true } = {}) {
  let score = 0;
  if (candidate.category === base.category) score += 3;
  if (preferVendor && candidate.vendorId === base.vendorId) score += 1;
  score += priceProximityScore(base.price, candidate.price) * 1.5;
  score += (Number(candidate.rating) || 0) / 5; // up to +1
  score += (Math.min(Number(candidate.reviews) || 0, 500) / 500) * 0.5; // up to +0.5
  return score;
}

/**
 * "You might also like" — products similar to a single base product.
 * Pass excludeVendorId to surface cross-stall picks (useful next to a
 * "More from this vendor" section so the two don't overlap).
 */
export function getSimilarProducts(
  baseProduct,
  allProducts,
  { excludeIds = [], excludeVendorId = null, limit = 4 } = {}
) {
  const excluded = new Set([baseProduct.id, ...excludeIds]);
  return allProducts
    .filter((p) => !excluded.has(p.id) && (!excludeVendorId || p.vendorId !== excludeVendorId))
    .map((p) => ({ product: p, score: similarityScore(baseProduct, p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.product);
}

/**
 * "You may also like" on the basket — scores the catalog against every
 * item currently in the cart and returns the best cross-cart fits.
 */
export function getRecommendationsForItems(cartItems, allProducts, limit = 4) {
  if (!cartItems || cartItems.length === 0) return [];
  const cartIds = new Set(cartItems.map((i) => i.id));
  const cartProducts = cartItems.map((i) => allProducts.find((p) => p.id === i.id)).filter(Boolean);
  if (cartProducts.length === 0) return [];

  const scores = new Map();
  allProducts.forEach((p) => {
    if (cartIds.has(p.id)) return;
    const total = cartProducts.reduce((sum, base) => sum + similarityScore(base, p, { preferVendor: false }), 0);
    scores.set(p.id, total / cartProducts.length);
  });

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => allProducts.find((p) => p.id === id))
    .filter(Boolean);
}

/**
 * "Recommended for you" — personalized using recently-viewed history,
 * weighted toward the most recent views. Falls back to top-rated
 * products for first-time visitors with no history yet.
 */
export function getPersonalizedRecommendations(allProducts, limit = 4) {
  const history = getRecentlyViewed();
  const viewedProducts = history.map((id) => allProducts.find((p) => p.id === id)).filter(Boolean);

  if (viewedProducts.length === 0) {
    return [...allProducts].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, limit);
  }

  const viewedIds = new Set(viewedProducts.map((p) => p.id));
  const scores = new Map();

  allProducts.forEach((p) => {
    if (viewedIds.has(p.id)) return;
    const total = viewedProducts.reduce((sum, base, idx) => {
      const recencyWeight = 1 - idx / (viewedProducts.length + 2); // more recent view -> more weight
      return sum + similarityScore(base, p) * recencyWeight;
    }, 0);
    scores.set(p.id, total);
  });

  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => allProducts.find((p) => p.id === id))
    .filter(Boolean);
}

/** The category the shopper has viewed most, for a "because you viewed X" label. */
export function getTopViewedCategory(allProducts) {
  const viewedProducts = getRecentlyViewed()
    .map((id) => allProducts.find((p) => p.id === id))
    .filter(Boolean);
  if (viewedProducts.length === 0) return null;

  const counts = {};
  viewedProducts.forEach((p) => {
    counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}
