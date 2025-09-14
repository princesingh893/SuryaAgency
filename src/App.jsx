import React, { useEffect, useState } from "react";
import "./index.css";
import logo from "./assets/logo.png";

// ---------- SVG Icons ----------
const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
  </svg>
);

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.568 17.568 0 0 0 4.168 6.608 17.569 17.569 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.678.678 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.678.678 0 0 0-.122-.58L3.654 1.328z" />
  </svg>
);

const GSTIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
    <path d="M1.5 0A1.5 1.5 0 0 0 0 1.5v13A1.5 1.5 0 0 0 1.5 16h13a1.5 1.5 0 0 0 1.5-1.5v-13A1.5 1.5 0 0 0 14.5 0h-13zM2 1.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 .5.5v13a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-13z" />
  </svg>
);

// ---------- Storage Keys ----------
const LS_PRODUCTS = "shop_products_v2";
const LS_ORDERS = "shop_orders_v2";

// ---------- Seed Products ----------
const seedProducts = () => [
  { id: 1, name: "Tea Powder" },
  { id: 2, name: "Sugar" },
  { id: 3, name: "Wheat Flour" },
];

const saveToLS = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const loadFromLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export default function App() {
  const [products, setProducts] = useState(() => loadFromLS(LS_PRODUCTS, seedProducts()));
  const [orders, setOrders] = useState(() => loadFromLS(LS_ORDERS, []));
  const [cart, setCart] = useState([]);
  const [adminMode, setAdminMode] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "" });
  const [search, setSearch] = useState("");

  useEffect(() => saveToLS(LS_PRODUCTS, products), [products]);
  useEffect(() => saveToLS(LS_ORDERS, orders), [orders]);

  // ---------- Filter ----------
  const filteredProducts = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  // ---------- Cart ----------
  const addToCart = (product) => {
    const found = cart.find((c) => c.product.id === product.id);
    if (found) return;
    setCart([...cart, { product, cpp: "", qty: "" }]);
  };

  const removeFromCart = (id) => setCart(cart.filter((c) => c.product.id !== id));

  const updateCartField = (id, field, value) => {
    setCart(cart.map((c) => (c.product.id === id ? { ...c, [field]: value } : c)));
  };

  // ---------- Checkout ----------
  const checkout = () => {
    if (cart.length === 0) return alert("Cart is empty");

    const customerName = prompt("Customer name:", "Guest");
    if (!customerName) return;
    const address = prompt("Address:", "-") || "-";

    const order = {
      id: Date.now(),
      customerName,
      address,
      items: cart,
      status: "Placed",
      createdAt: new Date().toLocaleString(),
    };

    setOrders([order, ...orders]);
    setCart([]);
    alert(`Order placed! Order #${order.id}`);
  };

  const toggleAdminMode = () => {
    if (!adminMode) {
      const pass = prompt("Enter admin password:", "");
      if (pass !== "admin123") return alert("Wrong password (hint: admin123)");
    }
    setAdminMode(!adminMode);
  };

  const addProduct = () => {
    if (!newProduct.name.trim()) return alert("Enter product name");
    const product = { id: Date.now(), name: newProduct.name };
    const next = [product, ...products];
    setProducts(next);
    saveToLS(LS_PRODUCTS, next);
    setNewProduct({ name: "" });
  };

  // ---------- JSX ----------
  return (
    <div className="app">
      {/* Agency Card */}
      <div className="agency-card">
        <div className="info-section">
          <div className="agency-header">
            <img src={logo} alt="Surya Agency Logo" className="logo" />
          </div>
        </div>

        <div>
          <div className="agency-title">
            <h2 className="agency-name">SURYA AGENCY</h2>
            <p className="agency-location">
              <LocationIcon /> Laxman Sahay Lane, Gaya, Bihar
            </p>
          </div>
          <div className="contact-details">
            <div className="contact-item">
              <PhoneIcon />
              <span>+91 98765 43210</span>
            </div>
            <div className="contact-item">
              <GSTIcon />
              <span>GSTIN: 10ABCDE1234F1Z5</span>
            </div>
          </div>
        </div>

        <div className="action-section">
          <button className="admin-button" onClick={toggleAdminMode}>
            {adminMode ? "Switch to Shop" : "Admin Panel"}
          </button>
        </div>
      </div>

      <main>
        {/* ---------- Shop Mode ---------- */}
        {!adminMode ? (
          <div className="shop">
            <h2>Invoice Table</h2>

            {/* Search */}
            <input
              type="text"
              placeholder="🔍 Search product..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            {/* Invoice Table */}
            <table className="invoice-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>CPP</th>
                  <th>Qty/pcs</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((c) => (
                  <tr key={c.product.id}>
                    <td>{c.product.name}</td>
                    <td>
                      <input
                        type="number"
                        placeholder="Enter CPP"
                        value={c.cpp}
                        onChange={(e) => updateCartField(c.product.id, "cpp", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        placeholder="Enter Qty"
                        value={c.qty}
                        onChange={(e) => updateCartField(c.product.id, "qty", e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => removeFromCart(c.product.id)}>❌</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {cart.length > 0 && (
              <div className="checkout-row">
                <button onClick={checkout}>Place Order</button>
              </div>
            )}

            {/* Product List */}
            <h3>Products</h3>
            <div className="product-list">
              {filteredProducts.map((p) => (
                <div key={p.id} className="product-card">
                  <div className="pname">{p.name}</div>
                  <button onClick={() => addToCart(p)}>Add</button>
                </div>
              ))}

              {filteredProducts.length === 0 && <p className="no-product">❌ No products found</p>}
            </div>
          </div>
        ) : (
          /* ---------- Admin Mode ---------- */
          <div className="admin">
            <div className="admin-products">
              <h3>Add Product</h3>
              <input
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Product name"
              />
              <button onClick={addProduct}>Add Product</button>

              <h4>Products</h4>
              {products.map((p) => (
                <div key={p.id} className="admin-product">
                  {p.name}
                </div>
              ))}
            </div>

            <div className="admin-orders">
              <h3>Orders</h3>
              {orders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                orders.map((o) => (
                  <div key={o.id} className="order">
                    <div>
                      <b>Order #{o.id}</b> <br />
                      <b>Date:</b> {o.createdAt} <br />
                      <b>Customer:</b> {o.customerName} <br />
                      <b>Address:</b> {o.address}
                    </div>
                    <div className="order-items">
                      {o.items.map((it) => (
                        <div key={it.product.id}>
                          {it.product.name} | CPP: {it.cpp} | Qty: {it.qty}
                        </div>
                      ))}
                    </div>
                    <span className="status">{o.status}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="footer">✨ Clean & Simple Billing UI • LocalStorage Powered</footer>
    </div>
  );
}
