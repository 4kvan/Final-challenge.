import React, { useState,useEffect } from 'react'
import { useToast } from '../../constext/ToastContext';

function ProductsSection() {
  const { showToast } = useToast();
  const [Image, setImage] = useState(null)
  const [Video, setVideo] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    stock: '',
    isFeatured: false,
  })
  const [notesModal, setNotesModal] = useState(null); // holds the product
const [noteForm, setNoteForm] = useState({ name: '', description: '' });
const [noteImage, setNoteImage] = useState(null);



const fetchProducts = async () => {
  const res = await fetch('http://localhost:5000/api/products');
  const data = await res.json();
  setProducts([...data].reverse());
  
};

useEffect(() => {
  fetchProducts();
}, []);



const handleDelete = async (id) => {
  await fetch(`http://localhost:5000/api/products/${id}`, {
    method: 'DELETE'
  });
  fetchProducts();
};

  const handleVideoChange = (e) => {
  setVideo(e.target.files[0])
}


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImageChange = (e) => {
    
    setImage(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', form.price);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('stock', form.stock);
    formData.append('isFeatured', form.isFeatured);
    formData.append('image', Image);
    formData.append('video', Video);
    console.log('formData image:', formData.get('image')); 
     
     

     const res = await fetch('http://localhost:5000/api/products', {
  method: 'POST',
  body: formData
        });

   const data = await res.json();      
     
    

if (data._id) {
  showToast('Product added successfully!', 'success');
  fetchProducts();
  setShowModal(false);
} else {
  showToast('Error: ' + data.message, 'error');
}




  };
  const handleToggleFeatured = async (id, currentValue) => {
  await fetch(`http://localhost:5000/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isFeatured: !currentValue })
  });
  fetchProducts();
};

  const handleAddNote = async () => {
    if (!notesModal) return;
    const formData = new FormData();
    formData.append('name', noteForm.name);
    formData.append('description', noteForm.description);
    if (noteImage) formData.append('image', noteImage);

    const res = await fetch(`http://localhost:5000/api/products/${notesModal._id}/notes`, {
        method: 'POST',
        body: formData
    });
    const updated = await res.json();
    setNotesModal(updated); 
    setNoteForm({ name: '', description: '' });
    setNoteImage(null);
    fetchProducts();
};

const handleDeleteNote = async (noteId) => {
    const res = await fetch(`http://localhost:5000/api/products/${notesModal._id}/notes/${noteId}`, {
        method: 'DELETE'
    });
    const updated = await res.json();
    setNotesModal(updated);
    fetchProducts();
};

  return (
  <div>
    
    <div className="sectionHeader">
      <h2>Products</h2>
      <button className="addBtn" onClick={() => setShowModal(true)}>
        + Add Product
      </button>
    </div>

    
    {showModal && (
      <div className="modalOverlay" onClick={() => setShowModal(false)}>
        <div className="modalBox" onClick={(e) => e.stopPropagation()}>
          <div className="modalHeader">
            <h3>Add New Product</h3>
            <button className="closeBtn" onClick={() => setShowModal(false)}>✕</button>
          </div>

          <form onSubmit={handleSubmit}>
            <input name="name" placeholder="Product Name" value={form.name} onChange={handleChange} />
            <input name="price" placeholder="Price" value={form.price} onChange={handleChange} />
            <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
            <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
            <input name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} />
            <label>
              <input type="checkbox" name="isFeatured" onChange={(e) => setForm({...form, isFeatured: e.target.checked})} />
              Featured product
            </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <input type="file" accept="video/*" onChange={handleVideoChange} />

            <button type="submit">Add Product</button>
          </form>
        </div>
      </div>
    )}
     
<div className="productsList">
  <h3>All Products ({products.length})</h3>
  <table className="productsTable">
    <thead>
      <tr>
        <th>Image</th>
        <th>Name</th>
        <th>Price</th>
        <th>Category</th>
        <th>Stock</th>
        <th>Featured</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      {products.map(p => (
        <tr key={p._id}>
          <td><img src={`http://localhost:5000${p.image}`} alt={p.name} /></td>
          <td>{p.name}</td>
          <td>${p.price}</td>
          <td>{p.category}</td>
          <td>{p.stock}</td>
          <td>
           <input
                type="checkbox"
               checked={p.isFeatured}
               onChange={() => handleToggleFeatured(p._id, p.isFeatured)}
             />
           </td>
          <td>

            <button onClick={() => setNotesModal(p)} className="notesBtn">Add Notes</button>
            <button onClick={() => handleDelete(p._id)} className="deleteBtn">Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
{notesModal && (
    <div className="modalOverlay" onClick={() => setNotesModal(null)}>
        <div className="modalBox" onClick={(e) => e.stopPropagation()}>
            <div className="modalHeader">
                <h3>Fragrance Notes — {notesModal.name}</h3>
                <button className="closeBtn" onClick={() => setNotesModal(null)}>✕</button>
            </div>

            <div className="tasteRow">
                <input placeholder="Note name (e.g. Bergamot)" value={noteForm.name}
                    onChange={(e) => setNoteForm({ ...noteForm, name: e.target.value })} />
                <input placeholder="Description" value={noteForm.description}
                    onChange={(e) => setNoteForm({ ...noteForm, description: e.target.value })} />
                <input type="file" accept="image/*"
                    onChange={(e) => setNoteImage(e.target.files[0])} />
                <button type="button" onClick={handleAddNote}>Add Note</button>
            </div>

            <div className="notesList">
                {notesModal.tastes?.map((taste) => (
                    <div key={taste._id} className="noteItem">
                        {taste.image && <img src={`http://localhost:5000${taste.image}`} alt={taste.name} />}
                        <div>
                            <strong>{taste.name}</strong>
                            <p>{taste.description}</p>
                        </div>
                        <button onClick={() => handleDeleteNote(taste._id)} className="removeTasteBtn">✕</button>
                    </div>
                ))}
            </div>
        </div>
    </div>
)}


    </div>
    
  );
}

export default ProductsSection;