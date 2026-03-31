import React, { useState, useEffect } from 'react';

function OrdersSection() {
  const [orders, setOrders] = useState([]);
  
  

  const fetchOrders = async () => {
    const res = await fetch('http://localhost:5000/api/orders');
    const data = await res.json();
    setOrders([...data].reverse());
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (id, status) => {
    await fetch(`http://localhost:5000/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isPaid: status === 'paid', isDelivered: status === 'delivered' })
    });
    fetchOrders();
  };

  return (
    <div>
      <div className="sectionHeader">
        <h2>Orders</h2>
        <span className="orderCount">{orders.length} total orders</span>
      </div>

      <table className="productsTable">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer</th>
            <th>Phone</th>
            <th>Products</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Delivery</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>#{order._id.slice(-6)}</td>
              <td>
                <div>{order.user?.name}</div>
                <div style={{ fontSize: '11px', color: '#888' }}>{order.user?.email}</div>
              </td>
              <td>{order.user?.phone || '—'}</td>
              <td>
                {order.products?.map((p, i) => (
                  <div key={i} style={{ fontSize: '12px' }}>
                    {p.product?.name} x{p.quantity}
                  </div>
                ))}
              </td>
              <td>${order.totalPrice}</td>
              <td>
                <span className={`badge ${order.isPaid ? 'badgeGreen' : 'badgeRed'}`}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </td>
              <td>
                <span className={`badge ${order.isDelivered ? 'badgeGreen' : 'badgeYellow'}`}>
                  {order.isDelivered ? 'Delivered' : 'Pending'}
                </span>
              </td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>
                <select 
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                  defaultValue=""
                  className="statusSelect"
                >
                  <option value="" disabled>Update</option>
                  <option value="paid">Mark Paid</option>
                  <option value="delivered">Mark Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="emptyState">No orders yet</div>
      )}
    </div>
  );
}

export default OrdersSection;