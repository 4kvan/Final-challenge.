import React, { useState, useEffect } from 'react';

function InventorySection() {
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    const res = await fetch('http://localhost:5000/api/products');
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Out of Stock', class: 'badgeRed' };
    if (stock <= 10) return { label: 'Low Stock', class: 'badgeYellow' };
    return { label: 'In Stock', class: 'badgeGreen' };
  };

  const outOfStock = products.filter(p => p.stock === 0).length;
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const inStock = products.filter(p => p.stock > 10).length;

  return (
    <div>
      <div className="sectionHeader">
        <h2>Inventory</h2>
      </div>

      {/* Stock Summary */}
      <div className="statsGrid">
        <div className="statCard">
          <span className="statLabel">In Stock</span>
          <span className="statValue" style={{ color: '#2e7d32' }}>{inStock}</span>
        </div>
        <div className="statCard">
          <span className="statLabel">Low Stock</span>
          <span className="statValue" style={{ color: '#f57f17' }}>{lowStock}</span>
        </div>
        <div className="statCard">
          <span className="statLabel">Out of Stock</span>
          <span className="statValue" style={{ color: '#c62828' }}>{outOfStock}</span>
        </div>
      </div>

      {/* Products Table */}
      <table className="productsTable">
        <thead>
          <tr>
            <th>Image</th>
            <th>Product</th>
            <th>Category</th>
            <th>Stock</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {products
            .sort((a, b) => a.stock - b.stock) // show low stock first
            .map(p => {
              const status = getStockStatus(p.stock);
              return (
                <tr key={p._id}>
                  <td><img src={`http://localhost:5000${p.image}`} alt={p.name} /></td>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.stock}</td>
                  <td><span className={`badge ${status.class}`}>{status.label}</span></td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default InventorySection;