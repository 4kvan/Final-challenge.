import React, { useState, useEffect } from 'react';

function AnalyticsSection() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/orders')
      .then(res => res.json())
      .then(data => setOrders(data));

    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter(o => o.isDelivered).length;
  const pendingOrders = orders.filter(o => !o.isDelivered).length;
  const paidOrders = orders.filter(o => o.isPaid).length;

 
  const productSales = {};
  orders.forEach(order => {
    order.products?.forEach(p => {
      if (p.product) {
        const id = p.product._id;
        if (!productSales[id]) {
          productSales[id] = { name: p.product.name, image: p.product.image, total: 0, revenue: 0 };
        }
        productSales[id].total += p.quantity;
        productSales[id].revenue += p.product.price * p.quantity;
      }
    });
  });
  const bestSellers = Object.values(productSales).sort((a, b) => b.total - a.total);

  return (
    <div>
      <div className="sectionHeader">
        <h2>Analytics</h2>
      </div>

      {/* Stats Cards */}
      <div className="statsGrid">
        <div className="statCard">
          <span className="statLabel">Total Revenue</span>
          <span className="statValue">${totalRevenue.toLocaleString()}</span>
        </div>
        <div className="statCard">
          <span className="statLabel">Total Orders</span>
          <span className="statValue">{totalOrders}</span>
        </div>
        <div className="statCard">
          <span className="statLabel">Delivered</span>
          <span className="statValue">{deliveredOrders}</span>
        </div>
        <div className="statCard">
          <span className="statLabel">Pending</span>
          <span className="statValue">{pendingOrders}</span>
        </div>
        <div className="statCard">
          <span className="statLabel">Paid Orders</span>
          <span className="statValue">{paidOrders}</span>
        </div>
        <div className="statCard">
          <span className="statLabel">Total Products</span>
          <span className="statValue">{products.length}</span>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="bestSellers">
        <h3>Best Sellers</h3>
        <table className="productsTable">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Units Sold</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {bestSellers.map((p, i) => (
              <tr key={i}>
                <td><img src={`http://localhost:5000${p.image}`} alt={p.name} /></td>
                <td>{p.name}</td>
                <td>{p.total} units</td>
                <td>${p.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {bestSellers.length === 0 && <div className="emptyState">No sales data yet</div>}
      </div>
    </div>
  );
}

export default AnalyticsSection;