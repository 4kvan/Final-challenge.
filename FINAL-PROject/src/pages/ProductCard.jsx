import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import ProductPage from './ProductPage';

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="product-card" onClick={() => navigate(`/product/${product._id}`)} style={{ cursor: 'pointer' }}>
      <h2>{product.name}</h2>
      <img src={`http://localhost:5000${product.image}`} alt={product.name} />
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
}

export default ProductCard