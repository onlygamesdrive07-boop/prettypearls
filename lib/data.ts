// Product data now lives in Supabase — see lib/products.ts for the fetch
// helpers (getFeaturedProducts, getAllProducts, getProductById) and the
// `products` table migration in supabase/migrations/0001_init.sql.
//
// Everything below (timeline, reviews, Instagram grid) is still static
// editorial content, unrelated to the product catalog, so it stays here.

export const timeline = [
  {
    title: "Choosing the Beads",
    text: "Every bead is held to the light before it earns its place — color, weight, and imperfection all considered.",
  },
  {
    title: "Designing the Piece",
    text: "A pattern is sketched by hand, balancing color and rhythm the way a florist arranges a bouquet.",
  },
  {
    title: "Hand Weaving",
    text: "Cord by cord, knot by knot — no two pieces are woven quite the same way.",
  },
  {
    title: "Quality Inspection",
    text: "Each clasp, knot, and bead is tested by hand before it's allowed to carry the Pretty Pearls name.",
  },
  {
    title: "Packaging",
    text: "Wrapped in tissue and tied with ribbon, as if it were a gift the moment it leaves our hands.",
  },
  {
    title: "Delivery",
    text: "Sent gently into the world, ready to become part of someone else's story.",
  },
];

export const reviews = [
  {
    name: "Amara S.",
    text: "It doesn't feel mass-made — you can tell someone actually sat down and made this for you.",
  },
  {
    name: "Priya K.",
    text: "The packaging alone felt like a gift. The bracelet is even better in person.",
  },
  {
    name: "Devon R.",
    text: "I've bought three keychains now. Each one has its own little imperfections that make it feel real.",
  },
  {
    name: "Lena M.",
    text: "Genuinely the most thoughtful small purchase I've made this year.",
  },
];

export const instagramImages = [
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600721391776-b5cd0e0048f9?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523293182086-7651a899d37f?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611085583191-a3b181a88401?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1520962880247-cfaf541c8724?q=80&w=800&auto=format&fit=crop",
];
