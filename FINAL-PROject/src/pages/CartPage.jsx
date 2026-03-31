
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../constext/CartContext'
import './cartPage.css'




const BottleIcon = () => (
  <svg width="36" height="72" viewBox="0 0 36 72" style={{ opacity: 0.85 }}>
    <rect x="14" y="2" width="8" height="8" rx="1" fill="#c8b496" opacity="0.4"/>
    <rect x="12" y="10" width="12" height="4" rx="1" fill="#c8b496" opacity="0.3"/>
    <path d="M8 14 Q6 20 6 28 L6 60 Q6 64 10 64 L26 64 Q30 64 30 60 L30 28 Q30 20 28 14 Z"
      fill="#1a1510" stroke="#c8b496" strokeWidth="0.5" opacity="0.9"/>
    <path d="M10 30 L10 58 Q10 62 14 62 L22 62 Q26 62 26 58 L26 30 Z" fill="#c8b496" opacity="0.06"/>
    <rect x="11" y="35" width="14" height="18" rx="1" fill="none" stroke="#c8b496" strokeWidth="0.3" opacity="0.4"/>
    <text x="18" y="47" textAnchor="middle" fontSize="4" fill="#c8b496" opacity="0.6" fontFamily="serif">EM</text>
  </svg>
)
 
function CartPage() {
  const { cart, removeFromCart } = useCart()
  const navigate = useNavigate()
  const [giftWrap, setGiftWrap] = useState(false)
  const [promoCode, setPromoCode] = useState('')
 
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0)
  const giftWrapFee = giftWrap ? 18 : 0
  const shipping = subtotal >= 350 ? 'Complimentary' : '$25'
  const shippingAmount = subtotal >= 350 ? 0 : 25
  const total = subtotal + giftWrapFee + shippingAmount

  const [showHistory, setShowHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  const fetchOrderHistory = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/orders/myorders', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    setOrderHistory([...data].reverse());
};
 
  return (
    <>
      
      <div className="cart-root">

       <button className="backArrow" onClick={() => navigate(-1)}>&#8592;</button>



{showHistory && (
    <div className="modalOverlay" onClick={() => setShowHistory(false)}>
        <div className="historyModal" onClick={(e) => e.stopPropagation()}>
            <div className="historyHeader">
                <h3>Order History</h3>
                <button onClick={() => setShowHistory(false)}>✕</button>
            </div>
            {orderHistory.length === 0 ? (
                <p>No orders yet</p>
            ) : (
                orderHistory.map(order => (
                    <div key={order._id} className="historyItem">
                        <div className="historyItemHeader">
                            <span>Order #{order._id.slice(-6)}</span>
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                            <span className={`badge ${order.isDelivered ? 'badgeGreen' : 'badgeYellow'}`}>
                                {order.isDelivered ? 'Delivered' : 'Pending'}
                            </span>
                        </div>
                        {order.products?.map((p, i) => (
                            <div key={i} className="historyProduct">
                                <span>{p.product?.name} x{p.quantity}</span>
                                <span>${p.product?.price}</span>
                            </div>
                        ))}
                        <div className="historyTotal">
                            Total: ${order.totalPrice}
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
)}
    
 
        <div className="cart-body">
         
          <div className="cart-left">
            <p className="section-eyebrow">Your Selection</p>
            <h1 className="section-title">Shopping Cart</h1>
            <button className="history-btn" onClick={() => {
           fetchOrderHistory();
            setShowHistory(true);
            }}>
             Order History
         </button>
            {cart.length === 0 ? (
              <div className="empty-state">
                <p className="empty-title">Your cart is empty</p>
                <p className="empty-sub">Discover the collection</p>
                <button className="continue-link" style={{marginTop:'0.5rem'}} onClick={() => navigate('/')}>
                  Explore fragrances
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div className="cart-item" key={item._id}>
                  <div className="item-img">
                    <BottleIcon />
                  </div>
                  <div>
                    <span className="item-collection">Maison Collection</span>
                    <h3 className="item-name">{item.name}</h3>
                    {item.description && (
                      <p className="item-desc">{item.description}</p>
                    )}
                    {item.size && (
                      <span className="item-size">Eau de Parfum — {item.size}</span>
                    )}
                    <button
                      className="item-remove"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="item-price">${item.price}</div>
                </div>
              ))
            )}
 
            {cart.length > 0 && (
              <div className="tag-row">
                <span className="tag">Free shipping over $350</span>
                <span className="tag">Complimentary samples</span>
                <span className="tag">Gift wrapping available</span>
              </div>
            )}
          </div>
 
         
          <div className="cart-right">
            <p className="section-eyebrow">Order Summary</p>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '1.6rem',
              fontWeight: 300,
              color: '#e8e0d5',
              fontStyle: 'italic',
              marginBottom: '1.5rem'
            }}>
              Your Bag
            </h2>
 
            <div className="order-card">
              <div className="promo-row">
                <input
                  className="promo-input"
                  placeholder="Gift code or promotion"
                  value={promoCode}
                  onChange={e => setPromoCode(e.target.value)}
                />
                <button className="promo-btn">Apply</button>
              </div>
 
              <div className="summary-rows">
                <div className="summary-row">
                  <span className="summary-label">Subtotal</span>
                  <span className="summary-val">${subtotal}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Shipping</span>
                  <span className="summary-val">{shipping}</span>
                </div>
                <div className="summary-row">
                  <span className="summary-label">Items</span>
                  <span className="summary-val">{cart.length}</span>
                </div>
              </div>
 
              <div className="summary-total">
                <span className="total-label">Total</span>
                <span className="total-amount">${total}</span>
              </div>
 
              <button
                className="checkout-btn"
                disabled={cart.length === 0}
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
 
              <div className="secure-note">
                <svg width="10" height="12" viewBox="0 0 10 12" fill="none">
                  <path d="M5 0L1 2v4c0 2.5 1.8 4.7 4 5.3C7.2 10.7 9 8.5 9 6V2L5 0z" fill="#4a4035"/>
                </svg>
                <span>Secure encrypted checkout</span>
              </div>
 
              <label className="gift-row">
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={e => setGiftWrap(e.target.checked)}
                  style={{ accentColor: '#c8b496', width: '12px', height: '12px' }}
                />
                <span className="gift-label">Add luxury gift wrapping — $18</span>
              </label>
            </div>
 
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <button className="continue-link" onClick={() => navigate('/')}>
                Continue Shopping
              </button>
            </div>
 
            <div style={{
              marginTop: '2.5rem',
              paddingTop: '1.5rem',
              borderTop: '0.5px solid rgba(200,180,150,0.1)'
            }}>
              <p className="payments-note">
                Accepts Visa · Mastercard · Amex · Apple Pay · PayPal
              </p>
            </div>
          </div>
        </div>



        
      </div>
    </>
  )
}


export default CartPage