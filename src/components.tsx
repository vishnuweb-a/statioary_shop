import React, { useState } from "react";
import {
  ArrowRight,
  Check,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  WarningCircle,
} from "@phosphor-icons/react";
import {
  type Address,
  type Product,
  INDIAN_STATES,
  categories,
  discountPct,
  isSoldOut,
  money,
} from "./data";

export function Link({
  to,
  children,
  ...props
}: {
  to: string;
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <a href={"#" + to} {...props}>
      {children}
    </a>
  );
}

export function Photo({ src, alt, ...props }: { src: string; alt: string; [key: string]: any }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <div className="image-error">
      <WarningCircle size={24} />
      <span>Image unavailable</span>
      <button onClick={() => setFailed(false)}>Retry image</button>
    </div>
  ) : (
    <img src={src} alt={alt} onError={() => setFailed(true)} {...props} />
  );
}
export function Quantity({
  value,
  onChange,
  max = 20,
}: {
  value: number;
  onChange: (v: number) => void;
  max?: number;
}) {
  return (
    <div className="quantity">
      <button
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
      >
        <Minus size={15} />
      </button>
      <span>{value}</span>
      <button
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
      >
        <Plus size={15} />
      </button>
    </div>
  );
}
export function Empty({
  icon: Icon,
  title,
  text,
  action = "Explore stationery",
  to = "/shop",
}: {
  icon: any;
  title: string;
  text: string;
  action?: string;
  to?: string;
}) {
  return (
    <div className="empty">
      <Icon size={44} weight="light" />
      <h2>{title}</h2>
      <p>{text}</p>
      <Link className="button" to={to}>
        {action}
        <ArrowRight size={18} />
      </Link>
    </div>
  );
}
export function AddressForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Address;
  onSave: (a: Address) => void;
  onCancel: () => void;
}) {
  return (
    <form
      className="address-form"
      onSubmit={(e) => {
        e.preventDefault();
        const d = new FormData(e.currentTarget);
        onSave({
          id: initial?.id || "address-" + Date.now() + "-" + Math.random().toString(36).slice(2, 8),
          name: String(d.get("name")),
          phone: String(d.get("phone")),
          street: String(d.get("street")),
          city: String(d.get("city")),
          state: String(d.get("state")),
          pin: String(d.get("pin")),
          label: String(d.get("label")),
        });
      }}
    >
      <h2>{initial ? "Edit address" : "Add a delivery address"}</h2>
      <div className="form-grid">
        <label>
          Full name
          <input
            name="name"
            required
            defaultValue={initial?.name}
            autoComplete="name"
            placeholder="Your full name"
          />
        </label>
        <label>
          Mobile number
          <input
            name="phone"
            required
            pattern="[6-9][0-9]{9}"
            title="Enter a 10-digit Indian mobile number"
            maxLength={10}
            defaultValue={initial?.phone}
            placeholder="10-digit mobile number"
          />
        </label>
        <label className="wide">
          Address
          <input
            name="street"
            required
            defaultValue={initial?.street}
            placeholder="House number, street, locality"
          />
        </label>
        <label>
          City
          <input name="city" required defaultValue={initial?.city} placeholder="City" />
        </label>
        <label>
          State
          <select name="state" required defaultValue={initial?.state || ""}>
            <option value="" disabled>
              Select state / territory
            </option>
            {INDIAN_STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </label>
        <label>
          PIN code
          <input
            name="pin"
            required
            pattern="[1-9][0-9]{5}"
            maxLength={6}
            defaultValue={initial?.pin}
            placeholder="6-digit PIN code"
          />
        </label>
        <label>
          Save as
          <select name="label" defaultValue={initial?.label || "Home"}>
            <option>Home</option>
            <option>Work</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <div className="actions">
        <button className="button" type="submit">
          Save address
          <Check size={17} />
        </button>
        <button className="secondary" type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}

export function Card({
  p,
  wished,
  onWish,
  onAdd,
}: {
  p: Product;
  wished: boolean;
  onWish: (id: string) => void;
  onAdd: (p: Product) => void;
}) {
  const sold = isSoldOut(p);
  return (
    <article className="product-card">
      <div className="product-image">
        <Link to={"/product/" + p.id}>
          <Photo src={p.image} alt={p.name} loading="lazy" decoding="async" />
        </Link>
        <span className="badge">{sold ? "Sold out" : `${discountPct(p)}% off`}</span>
        <button
          className={"wish " + (wished ? "active" : "")}
          aria-label={(wished ? "Remove from" : "Save to") + " wishlist: " + p.name}
          onClick={() => onWish(p.id)}
        >
          <Heart weight={wished ? "fill" : "regular"} size={21} />
        </button>
      </div>
      <div className="product-copy">
        <small>{categories[p.category].short}</small>
        <Link to={"/product/" + p.id}>
          <h3>{p.name}</h3>
        </Link>
        <div className="price-row">
          <div>
            <strong>{money(p.price)}</strong>
            <del>{money(p.mrp)}</del>
          </div>
          <button
            disabled={sold}
            className="add-small"
            aria-label={"Add to cart: " + p.name}
            onClick={() => onAdd(p)}
          >
            <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </article>
  );
}

export function SectionTitle({
  title,
  subtitle,
  to,
  label = "View all products",
}: {
  title: string;
  subtitle?: string;
  to?: string;
  label?: string;
}) {
  return (
    <div className="section-title">
      <div>
        <h2>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {to && (
        <Link to={to}>
          {label}
          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
