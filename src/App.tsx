import { useEffect, useState } from "react";
import {
  MagnifyingGlass,
  Heart,
  User,
  ShoppingCart,
  ArrowRight,
  Truck,
  SealCheck,
  Package,
  ArrowLeft,
  Plus,
  Trash,
  Check,
  MapPin,
  CreditCard,
  LockKey,
  SignOut,
  SlidersHorizontal,
  X,
  CaretRight,
  Star,
  List,
  ArrowCounterClockwise,
  Envelope,
  Phone,
  Clock,
  WarningCircle,
  CheckCircle,
  Leaf,
  Gift,
  Headset,
  Sparkle,
  Play,
} from "@phosphor-icons/react";
import {
  type Address,
  type Line,
  type Order,
  type Product,
  categories,
  catImage,
  company,
  discountPct,
  find,
  isSoldOut,
  money,
  products,
} from "./data";
import { infoPages } from "./policies";
import { AddressForm, Card, Empty, Link, Photo, Quantity, SectionTitle } from "./components";

function useSaved<T>(key: string, initial: T) {
  const [v, set] = useState<T>(() => {
    try {
      return JSON.parse(localStorage.getItem("lekhan-" + key) || "null") ?? initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("lekhan-" + key, JSON.stringify(v));
    } catch {
      // Storage blocked or full (e.g. private mode): keep working in memory.
    }
  }, [key, v]);
  return [v, set] as const;
}
const baseTitle = document.title;
function go(path: string) {
  location.hash = path;
}
export function App() {
  const [route, setRoute] = useState(location.hash.slice(1) || "/");
  useEffect(() => {
    const f = () => {
      setRoute(location.hash.slice(1) || "/");
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  const [path, query = ""] = route.split("?");
  const params = new URLSearchParams(query);
  const info = infoPages[path];
  const [cart, setCart] = useSaved<Line[]>("cart", []),
    [wishlist, setWishlist] = useSaved<string[]>("wishlist", []),
    [addresses, setAddresses] = useSaved<Address[]>("addresses", []),
    [orders, setOrders] = useSaved<Order[]>("orders", []),
    [customer, setCustomer] = useSaved<{ name: string; email: string } | null>("customer", null);
  const [toast, setToast] = useState(""),
    [search, setSearch] = useState(""),
    [searchOpen, setSearchOpen] = useState(false),
    [menu, setMenu] = useState(false),
    [coupon, setCoupon] = useSaved("coupon", ""),
    [couponInput, setCouponInput] = useState(""),
    [couponError, setCouponError] = useState(""),
    [filters, setFilters] = useState(false),
    [maxPrice, setMaxPrice] = useState(1500),
    [onlyStock, setOnlyStock] = useState(false),
    [sort, setSort] = useState("featured"),
    [page, setPage] = useState(1),
    [sub, setSub] = useState(""),
    [busy, setBusy] = useState(false),
    [variant, setVariant] = useState(""),
    [qty, setQty] = useState(1),
    [gallery, setGallery] = useState("front"),
    [authMode, setAuthMode] = useState("login"),
    [editAddress, setEditAddress] = useState<Address | null | undefined>(undefined),
    [selectedAddress, setSelectedAddress] = useSaved("selectedAddress", ""),
    [step, setStep] = useState(1),
    [shipping, setShipping] = useState("standard"),
    [payment, setPayment] = useState("UPI"),
    [paymentError, setPaymentError] = useState(""),
    [simulateFailure, setSimulateFailure] = useState(false),
    [newsletter, setNewsletter] = useState(false),
    [homeCategory, setHomeCategory] = useState(-1),
    [trackPin, setTrackPin] = useState(""),
    [delivery, setDelivery] = useState("");
  useEffect(() => {
    setPage(1);
    setSub(new URLSearchParams(route.split("?")[1] || "").get("sub") || "");
    setVariant("");
    setQty(1);
    setGallery("front");
    if (route.startsWith("/checkout")) setStep(1);
    setAuthMode("login");
    setMenu(false);
    setSearchOpen(false);
    setMaxPrice(1500);
    setOnlyStock(false);
  }, [route]);
  useEffect(() => {
    document.title = info ? `${info.title} | ${company.brand}` : baseTitle;
  }, [info]);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 3200);
      return () => clearTimeout(t);
    }
  }, [toast]);
  function add(p: Product, v = "Standard", n = 1) {
    if (isSoldOut(p)) {
      setToast("This item is currently sold out");
      return;
    }
    setCart((c) => {
      const i = c.findIndex((l) => l.id === p.id && l.variant === v);
      return i < 0
        ? [...c, { id: p.id, variant: v, qty: n }]
        : c.map((l, k) => (k === i ? { ...l, qty: Math.min(20, l.qty + n) } : l));
    });
    setToast("Added to your cart");
  }
  function wish(id: string) {
    setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id]));
    setToast(wishlist.includes(id) ? "Removed from wishlist" : "Saved to your wishlist");
  }
  const card = (p: Product) => (
    <Card key={p.id} p={p} wished={wishlist.includes(p.id)} onWish={wish} onAdd={add} />
  );
  const subtotal = cart.reduce((s, l) => s + (find(l.id)?.price || 0) * l.qty, 0),
    discount = coupon === "WELCOME10" ? Math.round(subtotal * 0.1) : 0,
    shippingCost = cart.length ? (shipping === "express" ? 99 : subtotal >= 499 ? 0 : 49) : 0,
    total = subtotal - discount + shippingCost;
  function Summary({ checkout = false }: { checkout?: boolean }) {
    return (
      <aside className="summary">
        <h2>
          Order summary <span>({cart.reduce((s, l) => s + l.qty, 0)} items)</span>
        </h2>
        {checkout &&
          cart.map((l, i) => {
            const p = find(l.id)!;
            return (
              <div className="summary-product" key={i}>
                <Photo src={p.image} alt={p.name} />
                <div>
                  <strong>{p.name}</strong>
                  <small>
                    {l.variant} · Qty {l.qty}
                  </small>
                </div>
                <span>{money(p.price * l.qty)}</span>
              </div>
            );
          })}
        <div className="totals">
          <p>
            <span>Subtotal</span>
            <span>{money(subtotal)}</span>
          </p>
          <p>
            <span>Shipping</span>
            <span>{shippingCost ? money(shippingCost) : <b className="green">Free</b>}</span>
          </p>
          {discount > 0 && (
            <p className="green">
              <span>Welcome discount</span>
              <span>−{money(discount)}</span>
            </p>
          )}
          <p className="total">
            <strong>Total</strong>
            <strong>{money(total)}</strong>
          </p>
          <small>Inclusive of all applicable taxes</small>
        </div>
        {!checkout && (
          <>
            <form
              className="coupon"
              onSubmit={(e) => {
                e.preventDefault();
                if (couponInput.trim().toUpperCase() === "WELCOME10") {
                  setCoupon("WELCOME10");
                  setCouponError("");
                  setToast("10% welcome discount applied");
                } else setCouponError("That code is not valid. Try WELCOME10.");
              }}
            >
              <label htmlFor="coupon">Have a coupon?</label>
              <div>
                <input
                  id="coupon"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter coupon code"
                />
                <button className="secondary">Apply</button>
              </div>
              <small>Enjoy 10% off with WELCOME10</small>
              {couponError && (
                <p role="alert" className="error">
                  {couponError}
                </p>
              )}
            </form>
            {coupon && (
              <button
                className="text-button"
                onClick={() => {
                  setCoupon("");
                  setCouponInput("");
                }}
              >
                Remove WELCOME10
              </button>
            )}
            <Link className="button full" to="/checkout">
              Continue to checkout
              <ArrowRight size={18} />
            </Link>
          </>
        )}
        <p className="secure">
          <LockKey size={16} />{" "}
          {checkout
            ? "Simulated checkout · No payment collected"
            : "Safe, simple, and thoughtfully packed"}
        </p>
      </aside>
    );
  }
  function saveAddress(a: Address) {
    setAddresses((list) =>
      list.some((x) => x.id === a.id) ? list.map((x) => (x.id === a.id ? a : x)) : [...list, a],
    );
    setSelectedAddress(a.id);
    setEditAddress(undefined);
    setToast("Address saved");
  }
  function addressCards(selectable: boolean) {
    return (
      <div className="address-grid">
        {addresses.map((a) => (
          <article
            className={"address-card " + (selectedAddress === a.id ? "selected" : "")}
            key={a.id}
          >
            {selectable && (
              <label className="select-address">
                <input
                  type="radio"
                  name="address"
                  checked={selectedAddress === a.id}
                  onChange={() => setSelectedAddress(a.id)}
                />{" "}
                Deliver here
              </label>
            )}
            <div className="row">
              <h3>{a.name}</h3>
              <span className="pill">{a.label}</span>
            </div>
            <p>
              {a.street}
              <br />
              {a.city}, {a.state} – {a.pin}
            </p>
            <p>{a.phone}</p>
            <div className="actions">
              <button className="text-button" onClick={() => setEditAddress(a)}>
                Edit
              </button>
              {!selectable && (
                <>
                  <button
                    className="text-button"
                    onClick={() => {
                      setAddresses((list) => list.filter((x) => x.id !== a.id));
                      if (a.id === selectedAddress) setSelectedAddress("");
                      setToast("Address removed");
                    }}
                  >
                    Remove
                  </button>
                  <button
                    className="text-button"
                    onClick={() => {
                      setSelectedAddress(a.id);
                      setToast("Default address updated");
                    }}
                  >
                    {selectedAddress === a.id ? "Default address" : "Set as default"}
                  </button>
                </>
              )}
            </div>
          </article>
        ))}
      </div>
    );
  }
  const selectedProduct = path.startsWith("/product/") ? find(path.split("/")[2]) : undefined;
  function variants(p: Product) {
    return p.category === 0 ? ["Ruled", "Plain"] : ["Standard"];
  }
  function ProductDetail({ p }: { p: Product }) {
    const v = variant || variants(p)[0],
      unitMultiplier = v === "Pack of 2" ? 2 : 1;
    return (
      <>
        <div className="product-detail">
          <div className="gallery">
            <div className={"gallery-main " + (gallery === "detail" ? "zoom" : "")}>
              <Photo src={p.image} alt={p.name + (gallery === "detail" ? " close-up" : "")} />
              <span className="badge">{discountPct(p)}% off</span>
            </div>
            <div className="thumbs">
              <button
                className={gallery === "front" ? "selected" : ""}
                onClick={() => setGallery("front")}
                aria-label="View product"
              >
                <Photo src={p.image} alt="Product view" />
              </button>
              <button
                className={gallery === "detail" ? "selected" : ""}
                onClick={() => setGallery("detail")}
                aria-label="View close-up"
              >
                <Photo src={p.image} alt="Close-up crop" />
              </button>
              <small>Tap a thumbnail to explore the details</small>
            </div>
          </div>
          <div className="detail-copy">
            <small className="eyebrow">{categories[p.category].name}</small>
            <h1>{p.name}</h1>
            <p className="rating">
              <Star weight="fill" size={16} /> 4.8 <span>· Sample customer rating</span>
            </p>
            <div className="detail-price">
              <strong>{money(p.price * unitMultiplier)}</strong>
              <del>{money(p.mrp * unitMultiplier)}</del>
              <span>Save {money((p.mrp - p.price) * unitMultiplier)}</span>
            </div>
            <small className="muted">Inclusive of all taxes</small>
            <p className="description">
              {p.id === "college-hustle-kit"
                ? "Everything for your next chapter. A thoughtfully curated kit of notebook, pens, highlighters, sticky notes, and a portfolio folder for college days that do more."
                : `${p.name.split(" — ")[0]}, chosen for the little details that make a difference. A practical companion for ${p.category === 2 ? "creative exploration" : "everyday ideas, plans, and projects"}.`}
            </p>
            <p className={isSoldOut(p) ? "error" : "green"}>
              {isSoldOut(p) ? "Currently out of stock" : "In stock · Ready for your desk"}
            </p>
            <label className="variant-label">
              {p.category === 0 ? "Paper style" : "Choose a pack"}
              <span>{v}</span>
            </label>
            <div className="variants">
              {variants(p).map((s) => (
                <button key={s} className={v === s ? "selected" : ""} onClick={() => setVariant(s)}>
                  {s}
                </button>
              ))}
            </div>
            <div className="buy-row">
              <Quantity value={qty} max={v === "Pack of 2" ? 10 : 20} onChange={setQty} />
              <button
                className="button"
                disabled={isSoldOut(p)}
                onClick={() => add(p, v, qty * unitMultiplier)}
              >
                <ShoppingCart size={21} />
                Add to cart
              </button>
              <button
                className="secondary square"
                aria-label="Save product to wishlist"
                onClick={() => wish(p.id)}
              >
                <Heart weight={wishlist.includes(p.id) ? "fill" : "regular"} size={22} />
              </button>
            </div>
            <div className="delivery-check">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setDelivery("Delivery available · Estimated 4–6 business days");
                }}
              >
                <label htmlFor="pin">Check delivery availability</label>
                <div>
                  <MapPin size={19} />
                  <input
                    id="pin"
                    value={trackPin}
                    onChange={(e) => {
                      setTrackPin(e.target.value);
                      setDelivery("");
                    }}
                    required
                    pattern="[1-9][0-9]{5}"
                    maxLength={6}
                    placeholder="Enter PIN code"
                  />
                  <button className="text-button">Check</button>
                </div>
              </form>
              {delivery && (
                <p className="green" role="status">
                  {delivery}
                </p>
              )}
            </div>
            <div className="detail-perks">
              <span>
                <Truck size={20} />
                Free delivery above ₹499
              </span>
              <span>
                <ArrowCounterClockwise size={20} />
                7-day returns · Unused, original packaging
              </span>
              <span>
                <SealCheck size={20} />
                Quality you can count on
              </span>
            </div>
          </div>
        </div>
        <div className="product-info">
          <details open>
            <summary>Made for your everyday</summary>
            <p>
              {p.name}. Thoughtfully selected stationery for students, artists, and professionals.
              Product photos and prices are based on the reference catalog. Variant selections are
              illustrative for this prototype.
            </p>
            <div className="specs">
              <span>
                Brand <b>{company.brand}</b>
              </span>
              <span>
                Category <b>{categories[p.category].short}</b>
              </span>
              <span>
                Pack <b>{p.category === 4 ? "1 kit" : "1 unit"}</b>
              </span>
            </div>
          </details>
          <details>
            <summary>Shipping & returns</summary>
            <p>
              Standard shipping: 4–6 business days. Free on orders ₹499 and above; ₹49 otherwise.
              Express: ₹99, 2–3 business days. Unused products in original packaging may be returned
              within 7 days. Delivery estimates are simulated.
            </p>
          </details>
        </div>
        <SectionTitle
          title="A little more inspiration"
          subtitle="Good company for your next great idea."
        />
        <div className="product-grid">
          {products
            .filter((x) => x.category === p.category && x.id !== p.id)
            .slice(0, 4)
            .map((x) => card(x))}
        </div>
      </>
    );
  }
  const category = Number(params.get("category") ?? -1),
    q = params.get("q") || "",
    isSearch = path === "/search";
  let filtered = products.filter(
    (p) =>
      (category < 0 || p.category === category) &&
      (!q ||
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        categories[p.category].short.toLowerCase().includes(q.toLowerCase())) &&
      p.price <= maxPrice &&
      (!onlyStock || !isSoldOut(p)) &&
      (!sub || p.name.toLowerCase().includes(sub.toLowerCase())),
  );
  if (sort === "low") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high") filtered.sort((a, b) => b.price - a.price);
  if (sort === "az") filtered.sort((a, b) => a.name.localeCompare(b.name));
  const count = cart.reduce((s, l) => s + l.qty, 0),
    order = orders.find((o) => o.id === params.get("id")) || orders[0];
  async function place() {
    const a = addresses.find((a) => a.id === selectedAddress);
    if (!a) {
      setStep(1);
      setPaymentError("Select a delivery address first");
      return;
    }
    setBusy(true);
    setPaymentError("");
    await new Promise((r) => setTimeout(r, 1100));
    setBusy(false);
    if (simulateFailure) {
      setPaymentError(
        "The simulated payment could not be completed. Choose another method or turn off the failure simulation and retry.",
      );
      return;
    }
    const o: Order = {
      id: "LK-" + Date.now().toString().slice(-7),
      date: new Date().toISOString(),
      items: cart,
      total,
      address: a,
      payment,
      shipping,
    };
    setOrders((list) => [o, ...list]);
    setCart([]);
    setCoupon("");
    setStep(1);
    go("/confirmation?id=" + o.id);
  }
  return (
    <>
      <a
        className="skip"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
          document.getElementById("main")?.scrollIntoView();
        }}
      >
        Skip to content
      </a>
      <header>
        <div className="announcement">
          <span>
            A little inspiration for your everyday <i /> Free shipping above ₹499 <i /> 7-day
            returns
          </span>
          <span>
            <Link to="/help">Bulk orders for schools & institutions</Link>
            <i />
            <Link to="/help">Need help?</Link>
          </span>
        </div>
        <div className="header-main container">
          <button
            className="mobile-menu icon-button"
            aria-label="Toggle navigation"
            onClick={() => setMenu(!menu)}
          >
            {menu ? <X /> : <List />}
          </button>
          <Link to="/" className="brand" aria-label="StationeryBazaar home">
            Stationery<span>Bazaar</span>
          </Link>
          <form
            className="header-search"
            onSubmit={(e) => {
              e.preventDefault();
              go("/search?q=" + encodeURIComponent(search));
              setSearchOpen(false);
            }}
          >
            <MagnifyingGlass size={21} />
            <input
              aria-label="Search stationery"
              value={search}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearch(e.target.value);
                setSearchOpen(true);
              }}
              placeholder="Search notebooks, pens, art supplies…"
            />
            <button aria-label="Search" type="submit">
              <ArrowRight size={19} />
            </button>
            {searchOpen && (
              <div className="suggestions">
                <div className="row">
                  <small>{search ? "Suggested products" : "A little inspiration"}</small>
                  <button
                    type="button"
                    aria-label="Close search suggestions"
                    onClick={() => setSearchOpen(false)}
                  >
                    <X size={18} />
                  </button>
                </div>
                {(search
                  ? products
                      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
                      .slice(0, 4)
                  : products.filter((p) =>
                      [categories[0].image, "college-hustle-kit", "my-sketch-book-a4"].includes(
                        p.id,
                      ),
                    )
                ).map((p) => (
                  <Link to={"/product/" + p.id} key={p.id}>
                    <Photo src={p.image} alt="" />
                    <span>{p.name}</span>
                    <b>{money(p.price)}</b>
                  </Link>
                ))}
                {search &&
                  !products.some((p) => p.name.toLowerCase().includes(search.toLowerCase())) && (
                    <p>No suggestions yet. Search to explore all results.</p>
                  )}
                <button type="submit" className="text-button">
                  {search ? "See all results" : "Browse all stationery"}
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </form>
          <div className="header-actions">
            <Link to="/wishlist" aria-label="Wishlist">
              <Heart size={24} />
              <span>Wishlist</span>
              {wishlist.length > 0 && <b>{wishlist.length}</b>}
            </Link>
            <Link to={customer ? "/account" : "/auth"} aria-label="Account">
              <User size={24} />
              <span>Account</span>
            </Link>
            <Link to="/cart" aria-label={"Cart, " + count + " items"}>
              <ShoppingCart size={25} />
              <span>Cart</span>
              <b>{count}</b>
            </Link>
          </div>
        </div>
        <nav className={menu ? "open" : ""} aria-label="Shop categories">
          <div className="container">
            <Link to="/categories" className="mobile-all">
              All categories
            </Link>
            {categories.map((c, i) => (
              <Link
                className={category === i ? "current" : ""}
                key={c.name}
                to={"/shop?category=" + i}
              >
                {c.name}
              </Link>
            ))}
            <Link className="all-products" to="/shop">
              All Products
              <ArrowRight size={16} />
            </Link>
          </div>
        </nav>
      </header>
      {path === "/" ? (
        <main id="main" tabIndex={-1} className="warm-home">
          <section className="inspired-hero">
            <Photo
              src="/assets/hero-warm.webp"
              alt="Sage and blush notebooks, pens and thoughtful desk essentials in soft sunlight"
            />
            <div className="container">
              <div className="inspired-copy">
                <small className="eyebrow">WRITE · PLAN · CREATE · GROW</small>
                <h1>
                  Stationery
                  <br />
                  for a More
                  <br />
                  <em>Inspired You.</em>
                </h1>
                <p>
                  Thoughtfully chosen stationery to help you
                  <br className="desktop" /> stay organised, productive, and creative
                  <br className="desktop" /> every single day.
                </p>
                <div className="actions">
                  <Link className="button" to="/shop">
                    Shop bestsellers
                    <ArrowRight size={18} />
                  </Link>
                  <Link className="story-link" to="/help">
                    <span>
                      <Play size={14} weight="fill" />
                    </span>
                    Our little story
                  </Link>
                </div>
                <div className="hero-promises">
                  <div>
                    <Truck size={25} />
                    <small>
                      Free shipping
                      <br />
                      above ₹499
                    </small>
                  </div>
                  <div>
                    <Leaf size={25} />
                    <small>
                      Thoughtfully
                      <br />
                      chosen
                    </small>
                  </div>
                  <div>
                    <Gift size={25} />
                    <small>
                      Little gifts,
                      <br />
                      big smiles
                    </small>
                  </div>
                  <div>
                    <SealCheck size={25} />
                    <small>
                      Quality
                      <br />
                      you can feel
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <div className="container">
            <div className="shop-category-heading">
              <small className="eyebrow">SHOP BY CATEGORY</small>
              <Link to="/categories">
                View all categories
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="warm-categories">
              {categories.map((c, i) => (
                <Link key={c.name} to={"/shop?category=" + i}>
                  <div>
                    <Photo src={catImage(i)!} alt={c.name} />
                  </div>
                  <strong>{c.name}</strong>
                </Link>
              ))}
            </div>
            <section className="warm-promos">
              <Link className="warm-promo" to="/shop?category=0">
                <Photo
                  src="/assets/planner-warm.webp"
                  alt="Open ivory planner with a blush pen on a sunlit desk"
                />
                <div>
                  <h2>
                    Turn
                    <br />
                    Ideas Into
                    <br />
                    <em>Action.</em>
                  </h2>
                  <p>
                    Pages for plans, little dreams,
                    <br />
                    and everything in between.
                  </p>
                  <span className="button">
                    Explore notebooks
                    <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
              <Link className="warm-promo" to="/shop?category=4">
                <Photo
                  src="/assets/creative-warm.webp"
                  alt="Pastel notebooks and colorful pencils arranged on a warm desk"
                />
                <div>
                  <h2>
                    Cute stationery.
                    <br />
                    Happier days.
                  </h2>
                  <p>
                    A little colour for your desk.
                    <br />A little joy for your everyday.
                  </p>
                  <span className="button">
                    Shop thoughtful kits
                    <ArrowRight size={15} />
                  </span>
                </div>
              </Link>
            </section>
            <div className="bestseller-heading">
              <h2>Bestselling Products</h2>
              <div className="home-tabs" aria-label="Featured product categories">
                {[
                  [-1, "All"],
                  [0, "Notebooks"],
                  [2, "Art & Drawing"],
                  [4, "Kits"],
                  [5, "Sticky Notes"],
                ].map(([id, name]) => (
                  <button
                    key={id}
                    className={homeCategory === id ? "active" : ""}
                    onClick={() => setHomeCategory(Number(id))}
                  >
                    {name}
                  </button>
                ))}
              </div>
              <Link to="/shop">
                View all
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="product-grid home-best">
              {(homeCategory === -1
                ? [
                    "legacy-notebook-b5",
                    "college-hustle-kit",
                    "my-sketch-book-a4",
                    "sticky-notes-multicolour-3x3",
                    "corporate-diary-planner-kit",
                    "display-book-40-pockets",
                  ]
                    .map((id) => find(id))
                    .filter(Boolean)
                : products.filter((p) => p.category === homeCategory).slice(0, 6)
              ).map((p) => card(p!))}
            </div>
            <section className="why-lekhan">
              <div>
                <h2>
                  Why Choose <br />
                  StationeryBazaar?
                </h2>
                <p>
                  More than just stationery.
                  <br />A part of your everyday journey.
                </p>
              </div>
              {[
                [Sparkle, "Thoughtful details", "For everyday ideas"],
                [Leaf, "Mindfully chosen", "Made to be used and loved"],
                [Heart, "A little more joy", "For your everyday rituals"],
                [Gift, "Perfect for gifting", "Small things, big smiles"],
                [Truck, "Carefully delivered", "Across India"],
                [Headset, "Here to help", "A smoother shopping day"],
              ].map(([Icon, title, desc]) => {
                const I = Icon as any;
                return (
                  <div key={String(title)}>
                    <span>
                      <I size={24} />
                    </span>
                    <strong>{String(title)}</strong>
                    <small>{String(desc)}</small>
                  </div>
                );
              })}
            </section>
            <section className="chapters">
              <div>
                <h2>
                  Stationery <br />
                  for Every Chapter <br />
                  of Your Life.
                </h2>
                <span className="eyebrow">MAKE A LITTLE ROOM FOR YOU</span>
              </div>
              {[
                {
                  title: "For Students",
                  desc: "Stay organised and chase your goals.",
                  image: "/assets/planner-warm.webp",
                  to: "/shop?category=4",
                },
                {
                  title: "For Professionals",
                  desc: "Bring a little clarity to your day.",
                  image: "/assets/planner-warm.webp",
                  to: "/shop?category=1",
                },
                {
                  title: "For Creatives",
                  desc: "Bring those bright ideas to life.",
                  image: "/assets/creative-warm.webp",
                  to: "/shop?category=2",
                },
                {
                  title: "For Gifting",
                  desc: "Little things with a lot of heart.",
                  image: "/assets/creative-warm.webp",
                  to: "/shop?category=4",
                },
              ].map((c) => (
                <Link key={c.title} to={c.to}>
                  <Photo src={c.image} alt={c.title} />
                  <h3>
                    {c.title}
                    <ArrowRight size={13} />
                  </h3>
                  <p>{c.desc}</p>
                </Link>
              ))}
            </section>
          </div>
          <section className="warm-newsletter">
            <div className="container">
              <div>
                <small className="eyebrow">A LITTLE NOTE FROM US</small>
                <h2>
                  A brighter inbox.
                  <br />
                  An inspired everyday.
                </h2>
                <p>Fresh finds, thoughtful ideas, and things we think you'll love.</p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setNewsletter(true);
                }}
              >
                {newsletter ? (
                  <p role="status">
                    <CheckCircle size={23} />
                    You're on the list. Welcome to StationeryBazaar!
                  </p>
                ) : (
                  <>
                    <label htmlFor="newsletter" className="sr-only">
                      Email address
                    </label>
                    <input
                      type="email"
                      id="newsletter"
                      required
                      placeholder="Enter your email address"
                    />
                    <button className="button">
                      Subscribe
                      <ArrowRight size={17} />
                    </button>
                  </>
                )}
                <small>Demo subscription · No email is sent.</small>
              </form>
            </div>
          </section>
        </main>
      ) : (
        <main id="main" tabIndex={-1} className="container page">
          <div className="breadcrumb">
            <Link to="/">Home</Link>
            <CaretRight size={12} />
            <span>
              {path.startsWith("/product")
                ? "Shop"
                : path === "/auth"
                  ? "Account"
                  : info
                    ? info.title
                  : path.slice(1).split("/")[0].replace("-", " ") || "Home"}
            </span>
            {selectedProduct && (
              <>
                <CaretRight size={12} />
                <span>{selectedProduct.name}</span>
              </>
            )}
          </div>
          {path === "/categories" && (
            <>
              <div className="page-intro">
                <small className="eyebrow">A PLACE FOR EVERY IDEA</small>
                <h1>Find your everyday essentials.</h1>
                <p>A little something for every desk, every day, and every kind of creator.</p>
              </div>
              <div className="category-grid">
                {categories.map((c, i) => (
                  <article key={c.name}>
                    <Link to={"/shop?category=" + i}>
                      <Photo src={catImage(i)!} alt={c.name} />
                      <div className="row">
                        <h2>{c.name}</h2>
                        <ArrowRight size={21} />
                      </div>
                    </Link>
                    <p>{c.desc}</p>
                    <div className="sub-links">
                      {c.sub.map((s, j) => (
                        <Link key={s} to={"/shop?category=" + i + (j ? "&sub=" + s : "")}>
                          {s}
                        </Link>
                      ))}
                    </div>
                    <small>
                      {products.filter((p) => p.category === i).length} thoughtfully selected
                      products
                    </small>
                  </article>
                ))}
              </div>
            </>
          )}
          {(path === "/shop" || isSearch) && (
            <>
              <div className="page-intro blue-intro">
                <small className="eyebrow">
                  {isSearch ? "FIND YOUR NEXT FAVOURITE" : "THOUGHTFULLY CURATED"}
                </small>
                <h1>
                  {isSearch
                    ? q
                      ? `Results for “${q}”`
                      : "A world of little possibilities."
                    : category >= 0
                      ? categories[category]?.name
                      : "All stationery."}
                </h1>
                <p>
                  {category >= 0
                    ? categories[category]?.desc
                    : "Everyday essentials for notes, plans, and brilliant ideas."}
                </p>
                {isSearch && (
                  <form
                    className="result-search"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const f = new FormData(e.currentTarget);
                      go("/search?q=" + encodeURIComponent(String(f.get("q"))));
                    }}
                  >
                    <MagnifyingGlass size={20} />
                    <input
                      name="q"
                      aria-label="Search products"
                      defaultValue={q}
                      placeholder="What are you looking for?"
                    />
                    <button className="button">Search</button>
                  </form>
                )}
              </div>
              {category >= 0 && (
                <div className="subcategory-tabs">
                  {categories[category].sub.map((s, j) => (
                    <button
                      className={(!sub && !j) || sub === s ? "selected" : ""}
                      key={s}
                      onClick={() => {
                        setSub(j ? s : "");
                        setPage(1);
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <div className="catalog-toolbar">
                <p>
                  <strong>{filtered.length}</strong> products, plenty of possibilities
                </p>
                <button className="secondary filter-trigger" onClick={() => setFilters(!filters)}>
                  <SlidersHorizontal size={18} />
                  Filters
                </button>
                <label>
                  Sort by{" "}
                  <select
                    aria-label="Sort products"
                    value={sort}
                    onChange={(e) => {
                      setSort(e.target.value);
                      setPage(1);
                    }}
                  >
                    <option value="featured">Featured</option>
                    <option value="low">Price: low to high</option>
                    <option value="high">Price: high to low</option>
                    <option value="az">Name: A–Z</option>
                  </select>
                </label>
              </div>
              <div className="catalog-layout">
                <aside className={"filters " + (filters ? "show" : "")}>
                  <h3>Shop by category</h3>
                  <Link className={category === -1 ? "selected" : ""} to="/shop">
                    All stationery <span>{products.length}</span>
                  </Link>
                  {categories.map((c, i) => (
                    <Link
                      key={c.name}
                      className={category === i ? "selected" : ""}
                      to={"/shop?category=" + i}
                    >
                      {c.name}
                      <span>{products.filter((p) => p.category === i).length}</span>
                    </Link>
                  ))}
                  <h3>Price range</h3>
                  <label htmlFor="maxPrice">Up to {money(maxPrice)}</label>
                  <input
                    id="maxPrice"
                    type="range"
                    min={0}
                    max={1500}
                    step={25}
                    value={maxPrice}
                    onChange={(e) => {
                      setMaxPrice(+e.target.value);
                      setPage(1);
                    }}
                  />
                  <div className="row">
                    <small>₹0</small>
                    <small>₹1,500</small>
                  </div>
                  <h3>Availability</h3>
                  <label className="check-label">
                    <input
                      type="checkbox"
                      checked={onlyStock}
                      onChange={(e) => {
                        setOnlyStock(e.target.checked);
                        setPage(1);
                      }}
                    />{" "}
                    In stock only
                  </label>
                  <button
                    className="text-button reset"
                    onClick={() => {
                      setMaxPrice(1500);
                      setOnlyStock(false);
                      setSub("");
                      setPage(1);
                    }}
                  >
                    Clear filters
                  </button>
                  <div className="filter-note">
                    <Truck size={24} />
                    <h4>A little extra, on us.</h4>
                    <p>Free shipping when your cart reaches ₹499.</p>
                  </div>
                </aside>
                <div>
                  {filtered.length ? (
                    <>
                      <div className="product-grid catalog-grid">
                        {filtered.slice((page - 1) * 9, page * 9).map((p) => card(p))}
                      </div>
                      {filtered.length > 9 && (
                        <div className="pagination">
                          <button
                            aria-label="Previous page"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                          >
                            <ArrowLeft size={18} />
                          </button>
                          {Array.from({ length: Math.ceil(filtered.length / 9) }, (_, i) => (
                            <button
                              aria-current={page === i + 1 ? "page" : undefined}
                              key={i}
                              className={page === i + 1 ? "selected" : ""}
                              onClick={() => {
                                setPage(i + 1);
                                document
                                  .querySelector(".catalog-toolbar")
                                  ?.scrollIntoView({ behavior: "smooth" });
                              }}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            aria-label="Next page"
                            disabled={page === Math.ceil(filtered.length / 9)}
                            onClick={() => setPage(page + 1)}
                          >
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div>
                      <Empty
                        icon={MagnifyingGlass}
                        title="No little wonders found just yet."
                        text="Try a different search or clear your filters to find something you love."
                        action="Browse all stationery"
                      />
                      <button
                        className="secondary empty-reset"
                        onClick={() => {
                          setMaxPrice(1500);
                          setOnlyStock(false);
                          setSub("");
                          setPage(1);
                        }}
                      >
                        Clear filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {path.startsWith("/product/") &&
            (selectedProduct ? (
              ProductDetail({ p: selectedProduct })
            ) : (
              <Empty
                icon={WarningCircle}
                title="This page has turned."
                text="We couldn't find that product. There's plenty more to discover."
              />
            ))}
          {path === "/wishlist" && (
            <>
              <div className="page-intro">
                <small className="eyebrow">KEEP THE GOOD THINGS CLOSE</small>
                <h1>Your wishlist.</h1>
                <p>
                  {wishlist.length
                    ? `${wishlist.length} favourites, waiting for their moment.`
                    : "A little collection of things you love."}
                </p>
              </div>
              {wishlist.length ? (
                <>
                  <div className="row wishlist-toolbar">
                    <span>{wishlist.length} saved products</span>
                    <button
                      className="text-button"
                      onClick={() => {
                        wishlist.forEach((id) => {
                          const p = find(id);
                          if (p) add(p);
                        });
                        setToast("Available wishlist items added to cart");
                      }}
                    >
                      Add available items to cart
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                  <div className="product-grid">
                    {wishlist
                      .map((id) => find(id))
                      .filter(Boolean)
                      .map((p) => card(p!))}
                  </div>
                </>
              ) : (
                <Empty
                  icon={Heart}
                  title="Your favourites belong here."
                  text="Tap the heart on anything you love. We'll keep it right here for you."
                />
              )}
            </>
          )}
          {path === "/cart" && (
            <>
              <div className="page-intro">
                <small className="eyebrow">GOOD CHOICES, ALL IN ONE PLACE</small>
                <h1>
                  Your cart.
                  <span className="title-count">
                    {count} {count === 1 ? "item" : "items"}
                  </span>
                </h1>
                <p>A few little things. A whole lot of possibility.</p>
              </div>
              {cart.length ? (
                <div className="checkout-layout">
                  <div>
                    <div className="shipping-progress">
                      <Truck size={23} />
                      <div>
                        <strong>
                          {subtotal >= 499
                            ? "Your order ships for free!"
                            : `You're ${money(499 - subtotal)} away from free shipping.`}
                        </strong>
                        <progress max={499} value={Math.min(499, subtotal)} />
                      </div>
                    </div>
                    <div className="cart-head">
                      <span>Product</span>
                      <span>Quantity</span>
                      <span>Total</span>
                    </div>
                    {cart.map((l, i) => {
                      const p = find(l.id)!;
                      return (
                        <article className="cart-line" key={l.id + l.variant}>
                          <Link to={"/product/" + p.id}>
                            <Photo src={p.image} alt={p.name} />
                          </Link>
                          <div className="cart-line-info">
                            <small>{categories[p.category].short}</small>
                            <Link to={"/product/" + p.id}>
                              <h3>{p.name}</h3>
                            </Link>
                            <p>
                              {l.variant} · {money(p.price)} each
                            </p>
                            <button
                              className="text-button muted"
                              onClick={() => {
                                setCart((c) => c.filter((_, j) => j !== i));
                                setToast("Product removed");
                              }}
                            >
                              <Trash size={15} />
                              Remove
                            </button>
                          </div>
                          <Quantity
                            value={l.qty}
                            onChange={(n) =>
                              setCart((c) => c.map((x, j) => (i === j ? { ...x, qty: n } : x)))
                            }
                          />
                          <strong>{money(p.price * l.qty)}</strong>
                        </article>
                      );
                    })}
                    <Link to="/shop" className="back-link">
                      <ArrowLeft size={17} />
                      Continue exploring
                    </Link>
                    <div className="packing-note">
                      <Package size={25} />
                      <span>
                        <strong>Little details. Extra care.</strong>
                        <p>Your stationery arrives neatly packed and ready for a fresh start.</p>
                      </span>
                    </div>
                  </div>
                  {Summary({})}
                </div>
              ) : (
                <Empty
                  icon={ShoppingCart}
                  title="Your next idea starts here."
                  text="Your cart is empty. Let's find something for your next chapter."
                />
              )}
            </>
          )}
          {path === "/auth" && (
            <div className="auth-layout">
              <div className="auth-art">
                <Photo src="/assets/planner-warm.webp" alt="Stationery for your next chapter" />
                <div>
                  <small className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</small>
                  <h2>
                    A little more
                    <br />
                    inspiration.
                    <br />A lot more you.
                  </h2>
                  <p>
                    Save your favourites, find your orders,
                    <br />
                    and make room for what comes next.
                  </p>
                </div>
              </div>
              <div className="auth-form">
                <small className="eyebrow">WELCOME TO STATIONERYBAZAAR</small>
                <h1>
                  {authMode === "register"
                    ? "Make yourself at home."
                    : authMode === "reset"
                      ? "A fresh start."
                      : "Good to see you again."}
                </h1>
                <p>
                  {authMode === "register"
                    ? "Create your corner of everyday inspiration."
                    : authMode === "reset"
                      ? "We’ll simulate a password reset for you."
                      : "Sign in to pick up where you left off."}
                </p>
                <div className="auth-tabs">
                  <button
                    className={authMode === "login" ? "selected" : ""}
                    onClick={() => setAuthMode("login")}
                  >
                    Sign in
                  </button>
                  <button
                    className={authMode === "register" ? "selected" : ""}
                    onClick={() => setAuthMode("register")}
                  >
                    Create account
                  </button>
                </div>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const d = new FormData(e.currentTarget);
                    setBusy(true);
                    await new Promise((r) => setTimeout(r, 600));
                    setBusy(false);
                    if (authMode === "reset") {
                      setToast("Demo reset link prepared. No email was sent.");
                      setAuthMode("login");
                      return;
                    }
                    setCustomer({
                      name: String(d.get("name") || String(d.get("email")).split("@")[0]),
                      email: String(d.get("email")),
                    });
                    setToast(
                      authMode === "register" ? "Welcome to your new chapter" : "Welcome back",
                    );
                    go("/account");
                  }}
                >
                  {authMode === "register" && (
                    <label>
                      Full name
                      <input name="name" required placeholder="Your name" />
                    </label>
                  )}
                  <label>
                    Email address
                    <input name="email" type="email" required placeholder="you@example.com" />
                  </label>
                  {authMode !== "reset" && (
                    <label>
                      Password
                      <input
                        name="password"
                        type="password"
                        required
                        minLength={8}
                        placeholder="At least 8 characters"
                        autoComplete={authMode === "login" ? "current-password" : "new-password"}
                      />
                    </label>
                  )}
                  {authMode === "login" && (
                    <button
                      className="text-button"
                      type="button"
                      onClick={() => setAuthMode("reset")}
                    >
                      Forgot password?
                    </button>
                  )}
                  <button className="button full" disabled={busy}>
                    {busy
                      ? "Just a moment…"
                      : authMode === "register"
                        ? "Create account"
                        : authMode === "reset"
                          ? "Send demo reset link"
                          : "Sign in"}
                    <ArrowRight size={18} />
                  </button>
                </form>
                <button
                  className="secondary full demo-account"
                  onClick={() => {
                    setCustomer({ name: "Alex Mehta", email: "alex@example.test" });
                    setToast("Welcome to your demo account");
                    go("/account");
                  }}
                >
                  Explore with a demo account
                </button>
                <div className="demo-note">
                  <LockKey size={18} />
                  <p>
                    Demo account experience. Use fictional details; passwords are never stored or
                    sent.
                  </p>
                </div>
                <Link to="/shop" className="back-link">
                  <ArrowLeft size={16} />
                  Back to shopping
                </Link>
              </div>
            </div>
          )}
          {path === "/addresses" && (
            <>
              <div className="page-intro">
                <small className="eyebrow">YOUR EVERYDAY PLACES</small>
                <h1>Saved addresses.</h1>
                <p>Where should your next idea find you?</p>
              </div>
              <Link className="back-link" to="/account">
                <ArrowLeft size={17} />
                Back to your account
              </Link>
              {editAddress !== undefined ? (
                <AddressForm
                  initial={editAddress || undefined}
                  onSave={saveAddress}
                  onCancel={() => setEditAddress(undefined)}
                />
              ) : (
                <>
                  <div className="section-title">
                    <h2>Your delivery addresses</h2>
                    <button className="secondary" onClick={() => setEditAddress(null)}>
                      <Plus size={18} />
                      Add new address
                    </button>
                  </div>
                  {addresses.length ? (
                    addressCards(false)
                  ) : (
                    <Empty
                      icon={MapPin}
                      title="A place for your next parcel."
                      text="Add an address to make your next checkout a little easier."
                      action="Continue shopping"
                    />
                  )}
                </>
              )}
            </>
          )}
          {path === "/checkout" && (
            <>
              <div className="page-intro">
                <small className="eyebrow">ONE STEP CLOSER TO YOUR NEXT IDEA</small>
                <h1>Make it yours.</h1>
                <p>A smooth little journey from our shelf to your desk.</p>
              </div>
              {!cart.length ? (
                <Empty
                  icon={ShoppingCart}
                  title="Let's add a little inspiration first."
                  text="Choose something you love before heading to checkout."
                />
              ) : (
                <>
                  <div className="checkout-steps">
                    {["Delivery", "Shipping", "Payment"].map((s, i) => (
                      <button
                        key={s}
                        className={step === i + 1 ? "active" : step > i + 1 ? "complete" : ""}
                        disabled={step < i + 1}
                        onClick={() => setStep(i + 1)}
                      >
                        <b>{step > i + 1 ? <Check size={16} /> : i + 1}</b>
                        {s}
                      </button>
                    ))}
                    <span>
                      <LockKey size={16} />
                      Simulated checkout
                    </span>
                  </div>
                  <div className="checkout-layout">
                    <div className="checkout-content">
                      {step === 1 ? (
                        <>
                          <div className="row">
                            <h2>Where shall we send it?</h2>
                            {editAddress === undefined && (
                              <button className="text-button" onClick={() => setEditAddress(null)}>
                                <Plus size={17} />
                                Add address
                              </button>
                            )}
                          </div>
                          <p className="muted">
                            Choose a saved address or add somewhere new. Use fictional details for
                            this demo.
                          </p>
                          {editAddress !== undefined || !addresses.length ? (
                            <AddressForm
                              initial={editAddress || undefined}
                              onSave={saveAddress}
                              onCancel={() => setEditAddress(undefined)}
                            />
                          ) : (
                            addressCards(true)
                          )}
                          <button
                            className="button"
                            disabled={
                              !addresses.some((a) => a.id === selectedAddress) ||
                              editAddress !== undefined
                            }
                            onClick={() => {
                              setStep(2);
                              setPaymentError("");
                            }}
                          >
                            Continue to shipping
                            <ArrowRight size={18} />
                          </button>
                        </>
                      ) : step === 2 ? (
                        <>
                          <h2>A good thing, on its way.</h2>
                          <p className="muted">Pick the delivery that suits your plans.</p>
                          {[
                            [
                              "standard",
                              "Standard delivery",
                              "4–6 business days",
                              subtotal >= 499 ? "Free" : "₹49",
                            ],
                            ["express", "Express delivery", "2–3 business days", "₹99"],
                          ].map(([v, t, d, p]) => (
                            <label
                              className={"option-card " + (shipping === v ? "selected" : "")}
                              key={v}
                            >
                              <input
                                type="radio"
                                name="shipping"
                                checked={shipping === v}
                                onChange={() => setShipping(v)}
                              />
                              <Truck size={24} />
                              <span>
                                <strong>{t}</strong>
                                <small>{d}</small>
                              </span>
                              <b>{p}</b>
                            </label>
                          ))}
                          <div className="actions">
                            <button className="secondary" onClick={() => setStep(1)}>
                              Back
                            </button>
                            <button className="button" onClick={() => setStep(3)}>
                              Continue to payment
                              <ArrowRight size={18} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h2>The final little step.</h2>
                          <p className="muted">
                            Choose how you'd like to pay. This is a simulation—no payment details
                            needed.
                          </p>
                          {[
                            ["UPI", "UPI", "Your favourite UPI app"],
                            ["Card", "Credit / debit card", "Visa, Mastercard and RuPay"],
                            ["COD", "Cash on delivery", "Pay when your parcel arrives"],
                          ].map(([v, t, d]) => (
                            <label
                              className={"option-card " + (payment === v ? "selected" : "")}
                              key={v}
                            >
                              <input
                                type="radio"
                                name="payment"
                                checked={payment === v}
                                onChange={() => {
                                  setPayment(v);
                                  setPaymentError("");
                                }}
                              />
                              <CreditCard size={25} />
                              <span>
                                <strong>{t}</strong>
                                <small>{d}</small>
                              </span>
                            </label>
                          ))}
                          <div className="demo-note">
                            <SealCheck size={22} />
                            <p>
                              {payment === "COD"
                                ? "The demo order will be marked payable on delivery."
                                : "A successful demo payment will be simulated when you place your order."}
                            </p>
                          </div>
                          <details className="test-states">
                            <summary>Explore a payment error</summary>
                            <label className="check-label">
                              <input
                                type="checkbox"
                                checked={simulateFailure}
                                onChange={(e) => setSimulateFailure(e.target.checked)}
                              />
                              Simulate a failed payment
                            </label>
                          </details>
                          {paymentError && (
                            <div className="error-box" role="alert">
                              <WarningCircle size={22} />
                              <p>{paymentError}</p>
                            </div>
                          )}
                          <div className="actions">
                            <button
                              className="secondary"
                              disabled={busy}
                              onClick={() => setStep(2)}
                            >
                              Back
                            </button>
                            <button className="button" disabled={busy} onClick={place}>
                              {busy
                                ? "Placing your demo order…"
                                : `Place demo order · ${money(total)}`}
                              {!busy && <ArrowRight size={18} />}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    {Summary({ checkout: true })}
                  </div>
                </>
              )}
            </>
          )}
          {path === "/confirmation" &&
            (order ? (
              <div className="confirmation">
                <div className="success-icon">
                  <Check size={36} />
                </div>
                <small className="eyebrow">A FRESH CHAPTER IS ON ITS WAY</small>
                <h1>Good things are coming.</h1>
                <p>Your demo order is confirmed. We hope it inspires something wonderful.</p>
                <div className="order-receipt">
                  <div>
                    <small>ORDER NUMBER</small>
                    <strong>{order.id}</strong>
                  </div>
                  <div>
                    <small>ORDER TOTAL</small>
                    <strong>{money(order.total)}</strong>
                  </div>
                  <div>
                    <small>DELIVERY</small>
                    <strong>{order.shipping === "express" ? "2–3" : "4–6"} business days</strong>
                  </div>
                </div>
                <div className="delivery-receipt">
                  <Package size={30} />
                  <div>
                    <h3>A little parcel of possibility.</h3>
                    <p>
                      Delivering to {order.address.name}
                      <br />
                      {order.address.street}, {order.address.city} – {order.address.pin}
                    </p>
                  </div>
                </div>
                <p className="demo-copy">
                  Simulated order ·{" "}
                  {order.payment === "COD"
                    ? "No payment collected. Payable on delivery in this demo."
                    : "Demo payment successful. No real payment was made."}{" "}
                  No confirmation email is sent.
                </p>
                <div className="actions">
                  <Link className="button" to={"/order?id=" + order.id}>
                    View order details
                    <ArrowRight size={18} />
                  </Link>
                  <Link className="secondary" to="/shop">
                    Keep exploring
                  </Link>
                </div>
              </div>
            ) : (
              <Empty
                icon={Package}
                title="Your next chapter is still waiting."
                text="Place a demo order to see your confirmation here."
              />
            ))}
          {(path === "/account" || path === "/orders" || path === "/order") && (
            <>
              <div className="page-intro">
                <small className="eyebrow">YOUR LITTLE CORNER OF STATIONERYBAZAAR</small>
                <h1>
                  {path === "/order"
                    ? "The details, thoughtfully kept."
                    : customer
                      ? `Hello, ${customer.name.split(" ")[0]}.`
                      : "Make yourself at home."}
                </h1>
                <p>Good things, saved in one place.</p>
              </div>
              <div className="account-layout">
                <aside className="account-nav">
                  <Link to="/account" className={path === "/account" ? "selected" : ""}>
                    <User size={20} />
                    My profile
                  </Link>
                  <Link to="/orders" className={path.includes("order") ? "selected" : ""}>
                    <Package size={20} />
                    My orders
                  </Link>
                  <Link to="/addresses">
                    <MapPin size={20} />
                    Saved addresses
                  </Link>
                  <Link to="/wishlist">
                    <Heart size={20} />
                    Wishlist
                  </Link>
                  {customer ? (
                    <button
                      onClick={() => {
                        setCustomer(null);
                        setToast("Signed out of your demo account");
                        go("/auth");
                      }}
                    >
                      <SignOut size={20} />
                      Sign out
                    </button>
                  ) : (
                    <Link to="/auth">
                      <User size={20} />
                      Sign in
                    </Link>
                  )}
                </aside>
                <div className="account-content">
                  {path === "/account" ? (
                    <>
                      {customer ? (
                        <>
                          <h2>Your profile</h2>
                          <p className="muted">A few details to make this space feel like yours.</p>
                          <form
                            className="profile-form"
                            onSubmit={(e) => {
                              e.preventDefault();
                              const d = new FormData(e.currentTarget);
                              setCustomer({
                                name: String(d.get("name")),
                                email: String(d.get("email")),
                              });
                              setToast("Profile updated");
                            }}
                          >
                            <label>
                              Full name
                              <input name="name" defaultValue={customer.name} required />
                            </label>
                            <label>
                              Email address
                              <input
                                name="email"
                                type="email"
                                defaultValue={customer.email}
                                required
                              />
                            </label>
                            <button className="button">
                              Save changes
                              <Check size={17} />
                            </button>
                          </form>
                        </>
                      ) : (
                        <div className="guest-profile">
                          <h2>A place for your favourites.</h2>
                          <p>
                            Sign in to try the customer profile experience, or explore your guest
                            orders and addresses.
                          </p>
                          <Link to="/auth" className="button">
                            Sign in / Create account
                            <ArrowRight size={17} />
                          </Link>
                        </div>
                      )}
                      <div className="account-stats">
                        <Link to="/orders">
                          <Package size={25} />
                          <strong>{orders.length} orders</strong>
                          <span>
                            See your latest finds
                            <ArrowRight size={16} />
                          </span>
                        </Link>
                        <Link to="/addresses">
                          <MapPin size={25} />
                          <strong>{addresses.length} addresses</strong>
                          <span>
                            Your everyday places
                            <ArrowRight size={16} />
                          </span>
                        </Link>
                        <Link to="/wishlist">
                          <Heart size={25} />
                          <strong>{wishlist.length} favourites</strong>
                          <span>
                            A little inspiration
                            <ArrowRight size={16} />
                          </span>
                        </Link>
                      </div>
                    </>
                  ) : path === "/orders" ? (
                    <>
                      <h2>Your orders</h2>
                      <p className="muted">Every new chapter, right here.</p>
                      {orders.length ? (
                        orders.map((o) => (
                          <article className="order-card" key={o.id}>
                            <div className="row">
                              <div>
                                <strong>{o.id}</strong>
                                <p>
                                  {new Date(o.date).toLocaleDateString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })}{" "}
                                  · {o.items.reduce((s, l) => s + l.qty, 0)} items
                                </p>
                              </div>
                              <span className="status">Confirmed · Demo</span>
                            </div>
                            <div className="order-previews">
                              {o.items.slice(0, 3).map((l, i) => (
                                <Photo key={i} src={find(l.id)!.image} alt={find(l.id)!.name} />
                              ))}
                              <strong>{money(o.total)}</strong>
                              <Link className="text-button" to={"/order?id=" + o.id}>
                                View order
                                <ArrowRight size={17} />
                              </Link>
                            </div>
                          </article>
                        ))
                      ) : (
                        <Empty
                          icon={Package}
                          title="A new chapter is waiting."
                          text="Your orders will appear here after your first demo checkout."
                        />
                      )}
                    </>
                  ) : order ? (
                    <>
                      <div className="row">
                        <div>
                          <h2>Order {order.id}</h2>
                          <p className="muted">
                            Placed{" "}
                            {new Date(order.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <span className="status">Confirmed · Demo</span>
                      </div>
                      <div className="order-tracking">
                        <div className="complete">
                          <CheckCircle size={25} />
                          <strong>Confirmed</strong>
                        </div>
                        <div>
                          <Package size={25} />
                          <strong>Packing</strong>
                        </div>
                        <div>
                          <Truck size={25} />
                          <strong>On its way</strong>
                        </div>
                        <div>
                          <MapPin size={25} />
                          <strong>Delivered</strong>
                        </div>
                      </div>
                      {order.items.map((l, i) => {
                        const p = find(l.id)!;
                        return (
                          <div className="order-item" key={i}>
                            <Photo src={p.image} alt={p.name} />
                            <div>
                              <Link to={"/product/" + p.id}>
                                <strong>{p.name}</strong>
                              </Link>
                              <p>
                                {l.variant} · Qty {l.qty}
                              </p>
                            </div>
                            <b>{money(p.price * l.qty)}</b>
                          </div>
                        );
                      })}
                      <div className="order-bottom">
                        <div>
                          <h3>Delivery address</h3>
                          <p>
                            {order.address.name}
                            <br />
                            {order.address.street}
                            <br />
                            {order.address.city}, {order.address.state} – {order.address.pin}
                          </p>
                        </div>
                        <div>
                          <h3>Payment & total</h3>
                          <p>
                            {order.payment} ·{" "}
                            {order.payment === "COD" ? "Pay on delivery" : "Demo payment complete"}
                          </p>
                          <strong>{money(order.total)}</strong>
                          <p>Includes shipping and discounts.</p>
                        </div>
                      </div>
                      <Link to="/orders" className="back-link">
                        <ArrowLeft size={17} />
                        All orders
                      </Link>
                    </>
                  ) : (
                    <Empty
                      icon={Package}
                      title="No order here just yet."
                      text="Your next great idea is a shopping trip away."
                    />
                  )}
                </div>
              </div>
            </>
          )}
          {info && (
            <>
              <div className="page-intro">
                <small className="eyebrow">{info.eyebrow}</small>
                <h1>{info.title}</h1>
                <p>{info.intro}</p>
              </div>
              <div className="help-grid">
                <section>
                  {info.effective && <p className="effective">Effective {info.effective}</p>}
                  {info.sections.map((s) => (
                    <div key={s.h}>
                      <h2>{s.h}</h2>
                      {s.body.map((b, i) =>
                        typeof b === "string" ? (
                          <p key={i}>{b}</p>
                        ) : (
                          <ul key={i}>
                            {b.map((li) => (
                              <li key={li}>{li}</li>
                            ))}
                          </ul>
                        ),
                      )}
                    </div>
                  ))}
                </section>
                <aside className="help-box">
                  <Envelope size={32} />
                  <h2>{path === "/contact" ? "Send us a message." : "Get in touch."}</h2>
                  {path === "/contact" ? (
                    <form
                      className="form-grid contact-form"
                      onSubmit={(e) => {
                        e.preventDefault();
                        const f = new FormData(e.currentTarget);
                        // No backend: hand the message to the shopper's mail app so nothing is silently lost.
                        location.href = `mailto:${company.email}?subject=${encodeURIComponent(
                          `${f.get("subject")}${f.get("order") ? ` (Order ${f.get("order")})` : ""}`,
                        )}&body=${encodeURIComponent(`${f.get("message")}\n\n${f.get("name")}\n${f.get("phone")}`)}`;
                      }}
                    >
                      <label>
                        Name
                        <input name="name" required autoComplete="name" />
                      </label>
                      <label>
                        Phone
                        <input name="phone" type="tel" autoComplete="tel" />
                      </label>
                      <label>
                        Subject
                        <select name="subject" required>
                          <option>Order enquiry</option>
                          <option>Return or refund</option>
                          <option>Bulk order</option>
                          <option>Complaint</option>
                          <option>Other</option>
                        </select>
                      </label>
                      <label>
                        Order ID (optional)
                        <input name="order" />
                      </label>
                      <label className="wide">
                        Message
                        <textarea name="message" required rows={5} />
                      </label>
                      <button className="button" type="submit">
                        Open in email app
                        <ArrowRight size={18} />
                      </button>
                    </form>
                  ) : (
                    <p>
                      <a href={"mailto:" + company.email}>{company.email}</a>
                      <br />
                      <a href={company.phoneHref}>{company.phone}</a>
                      <br />
                      {company.hours}
                    </p>
                  )}
                  <address>
                    {company.legalName}
                    {company.address.map((l) => (
                      <span key={l}>
                        <br />
                        {l}
                      </span>
                    ))}
                  </address>
                  <Link className="button" to="/shop">
                    Back to a little inspiration
                    <ArrowRight size={18} />
                  </Link>
                </aside>
              </div>
            </>
          )}
          {![
            "/categories",
            "/shop",
            "/search",
            "/wishlist",
            "/cart",
            "/auth",
            "/addresses",
            "/checkout",
            "/confirmation",
            "/account",
            "/orders",
            "/order",
          ].includes(path) &&
            !info &&
            !path.startsWith("/product/") && (
              <Empty
                icon={WarningCircle}
                title="This page has turned."
                text="Let's take you back to something inspiring."
                to="/"
                action="Back to home"
              />
            )}
        </main>
      )}
      <footer>
        <div className="container footer-grid">
          <div>
            <Link to="/" className="brand" aria-label="StationeryBazaar home">
              Stationery<span>Bazaar</span>
            </Link>
            <p>
              Thoughtfully chosen stationery for students, artists, and professionals, delivered
              across India.
            </p>
            <span className="footer-perk">
              <SealCheck size={21} />
              Free shipping above ₹499 · 7-day returns
            </span>
          </div>
          <div>
            <h3>Shop</h3>
            <Link to="/shop">All stationery</Link>
            <Link to="/categories">Shop by category</Link>
            <Link to="/shop?category=4">Kits & combos</Link>
            <Link to="/wishlist">Your wishlist</Link>
          </div>
          <div>
            <h3>Customer care</h3>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact us</Link>
            <Link to="/faqs">FAQs</Link>
            <Link to="/orders">Track your order</Link>
          </div>
          <div>
            <h3>Policies</h3>
            <Link to="/shipping-policy">Shipping & delivery</Link>
            <Link to="/refund-policy">Refund & cancellation</Link>
            <Link to="/privacy-policy">Privacy policy</Link>
            <Link to="/terms">Terms & conditions</Link>
          </div>
          <div>
            <h3>Contact us</h3>
            <address className="footer-contact">
              <span>
                <MapPin size={16} />
                <span>
                  {company.address.map((l) => (
                    <span key={l}>
                      {l}
                      <br />
                    </span>
                  ))}
                </span>
              </span>
              <a href={company.phoneHref}>
                <Phone size={16} />
                {company.phone}
              </a>
              <a href={"mailto:" + company.email}>
                <Envelope size={16} />
                {company.email}
              </a>
              <span>
                <Clock size={16} />
                {company.hours}
              </span>
            </address>
          </div>
        </div>
        <div className="container footer-bottom">
          <small>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </small>
          <small>{company.brand} is a brand of {company.legalName}.</small>
        </div>
      </footer>
      {toast && (
        <div role="status" className="toast">
          <CheckCircle weight="fill" size={23} />
          {toast}
          {toast.includes("cart") && (
            <Link to="/cart">
              View cart
              <ArrowRight size={15} />
            </Link>
          )}
          <button aria-label="Dismiss notification" onClick={() => setToast("")}>
            <X size={18} />
          </button>
        </div>
      )}
    </>
  );
}
