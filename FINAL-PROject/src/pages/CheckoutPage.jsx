import React from 'react'
import { useState} from 'react'
import { useCart } from '../constext/CartContext'
import './CheckoutPage.css'

function CheckoutPage() {

    const { cart } = useCart();
    const [orders, setOrders] = useState([]);
    const { clearCart } = useCart();
    const [formData, setFormData] = useState({
    name: '',
    address: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
});


    async function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.address || !formData.cardNumber || !formData.expiry || !formData.cvv) {
        alert('Please fill in all fields');
        return;
    }
    if (!cart || cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const token = localStorage.getItem('token');

    const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            products: cart.map(item => ({
                product: item._id,
                quantity: item.quantity || 1
            })),
            totalPrice: cart.reduce((sum, item) => sum + item.price, 0)
        })
    });

    const data = await res.json();
    if (data._id) {
        clearCart();
        setFormData({ name: '', address: '', cardNumber: '', expiry: '', cvv: '' });
        alert('Order placed successfully!');
    } else {
        alert('Error: ' + data.message);
    }
}

function handleCancel(orderId) {
    setOrders(prev => prev.map(order => 
        order.id === orderId ? { ...order, status: 'Cancelled' } : order
    ))
}




  return (
    <div className="checkout-container">
        <h1>Checkout Page</h1>
        <form className='checkout-form' onSubmit={handleSubmit}>  
            <input className='checkout-input'
                type="text"
                placeholder="Name"
                value={formData.name}   
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <input className='checkout-input'
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />

            <input
            className="checkout-input"
              type="text"
               placeholder="Card Number"
                maxLength={19}
             value={formData.cardNumber}
                  onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, '').slice(0, 16);
                     const formatted = val.match(/.{1,4}/g)?.join(' ') || '';
                     setFormData({ ...formData, cardNumber: formatted });
               }}
                 />
               <div style={{ display: 'flex', gap: '12px' }}>
               <input
                  className="checkout-input"
                     type="text"
                 placeholder="MM / YY"
                    maxLength={5}
                 value={formData.expiry}
                    onChange={(e) => {
                     const val = e.target.value.replace(/\D/g, '').slice(0, 4);
                     const formatted = val.length >= 3 ? val.slice(0,2) + ' / ' + val.slice(2) : val;
                       setFormData({ ...formData, expiry: formatted });
                   }}
                 />
                   <input
                        className="checkout-input"
                        type="password"
                        placeholder="CVV"
                 maxLength={3}
                 value={formData.cvv}
                    onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                    setFormData({ ...formData, cvv: val });
                  }}
                   />
                 </div>
            <button className="checkout-btn" type="submit">Place Order</button>
        </form>
      <div className="order-summary">
        <h2>Order Summary</h2>
        {cart.map(item => (
            <div key={item._id}>
                <h3>{item.name}</h3>
                <p>Price: ${item.price}</p>
            </div>
        ))}</div>
        
        {orders.length > 0 && (
    <div className="order-history">
        <h2>Order History</h2>
        {orders.map(order => (
            <div className="order-card" key={order.id}>
                <div className="order-card-header">
                    <span>Order #{order.id}</span>
                    <span>{order.date}</span>
                    <button 
                        className="cancel-btn" 
                    onClick={() => handleCancel(order.id)}
                     disabled={order.status === 'Cancelled'}
                  >
                {order.status === 'Cancelled' ? 'Cancelled' : 'Cancel Order'}
               </button>
                    <span className="order-status">{order.status}</span>
                </div>
                <div className="order-card-items">
                    {order.items.map((item, i) => (
                        <div className="order-card-item" key={i}>
                            <span>{item.name} x{item.quantity}</span>
                            <span>${item.price}</span>
                        </div>
                    ))}
                </div>
                <div className="order-card-total">
                    <span>Total</span>
                    <span>${order.total}</span>
                </div>
            </div>
        ))}
    </div>
)}

        <div className="order-total">
        <h3>Total: ${cart.reduce((sum, item) => sum + item.price, 0)}</h3>
         </div>

    </div>
  )
}

export default CheckoutPage