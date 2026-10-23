# Lekhan — Everyday Creative storefront

A React + TypeScript frontend prototype based on the selected second design direction: pale blue, navy, warm yellow, friendly typography, photographic stationery, and a complete simulated shopping journey.

## Start

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 4173
```

Open the local development address printed by Vite. Node 20+ recommended.

```bash
npx tsc --noEmit
npm run build
npm run test:sites
```

The production build is in `dist/client`. The included worker and metadata support future Sites hosting. This prototype has not been published.

## Screens

All URLs use a hash route after the host, e.g. `/#/shop`.

| Screen | Route | Interactions |
| --- | --- | --- |
| Homepage | `/#/` | Hero edits, categories, featured products, demo newsletter |
| All categories | `/#/categories` | Category cards and subcategory links |
| Collection | `/#/shop?category=0` | Six categories (0–5), subcategories, price filter, availability, sorting, pagination |
| All products | `/#/shop` | 36 reference products |
| Search | `/#/search?q=sketch` | Header suggestions, results, no-results recovery |
| Product details | `/#/product/college-hustle-kit` | Product photo and close-up crop, variants where applicable, quantity, wishlist, cart, delivery estimate, details, related products |
| Wishlist | `/#/wishlist` | Save/remove, add individual or available saved products to cart |
| Cart | `/#/cart` | Quantity changes, remove, coupon, subtotal and shipping |
| Login / registration | `/#/auth` | Toggle sign-in/create account, demo reset, one-click demo account |
| Address management | `/#/addresses` | Create/edit/delete, choose default |
| Checkout | `/#/checkout` | Address, standard/express shipping, UPI/card/COD simulation, loading, retryable payment failure |
| Confirmation | `/#/confirmation` | Most recent order, purchase summary, order details |
| Customer account | `/#/account` | Demo profile update, order/address/wishlist navigation |
| Orders | `/#/orders` | Simulated order history |
| Order details | `/#/order` | Item quantities, delivery address, order progress, payment and total |
| Help | `/#/help` | Shipping, returns, bulk-order context, prototype information |

## Try the full journey

1. Pick a notebook, select Ruled or Plain, choose a quantity, and add to cart.
2. Add favourites using the heart. Explore Wishlist from the header.
3. In Cart, try `WELCOME10` for a 10% discount rounded to whole rupees.
4. Continue to checkout. Enter fictional delivery details and save the address.
5. Standard delivery is free for subtotals ₹499 and above, otherwise ₹49. Express is ₹99.
6. Pick UPI, Card, or Cash on Delivery. No real financial details are requested.
7. Optionally open “Explore a payment error” and enable the failure simulation; place the demo order, then disable it and retry.
8. View confirmation, order history, and order details.
9. Use “Explore with a demo account” on the auth screen to try profile editing without credentials.

## Persistence and scope

Cart, wishlist, fictional addresses, profile, coupon, and simulated orders persist in this browser's localStorage using the `lekhan-` prefix. Passwords are never stored. Clear this origin's site data to reset the demo.

There is no backend, authentication service, payment gateway, email delivery, stock reservation, or real shipment tracking. Mock accounts are frontend simulations and should use fictional details only. The portfolio bag is marked sold out to demonstrate availability states. Product gallery thumbnails use the original view and a close-up crop, not additional physical product angles. Notebook paper variants are illustrative.

## Sources and assets

- Reference inspected: https://lekhan.e-comtag.com/ — desktop homepage, collection pages and product details.
- Product names, prices, categories, and photos were read from the reference catalog. Source URLs are retained in `src/catalog.json`. Reference product photos are copied locally for prototype reliability and require appropriate permission before production reuse.
- Three new hero/editorial photographs were generated to match the selected visual direction. See `public/assets/hero.png`, `college.png`, and `art.png`.
- Icons: Phosphor React. Fonts: Manrope and DM Sans (Google Fonts, with local fallback stacks).
- Responsive CSS covers desktop, tablet and phone sizes. Main prototype screens were checked inside browser frames of 390px and 834px. Native mobile/touch device testing and mobile reference inspection remain pending, as agreed.

## Structure

- `src/App.tsx`: typed app, shared product cards, image fallback, quantity controls, address form, order summary, and page components.
- `src/catalog.json`: reference product data.
- `src/styles.css`: consistent design tokens, layouts, states and responsive rules.
- `public/assets`: actual catalog photos and generated editorial images.
- `public/review.html`: internal viewport frame for visual QA; not part of customer navigation.
- `design-qa.md`: verification findings and evidence references.

Validated with TypeScript, the production build, four hosting-worker checks, and browser interaction testing of the purchase journey.
