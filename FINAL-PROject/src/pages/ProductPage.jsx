import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../constext/AuthContext'; 
import { useCart } from '../constext/CartContext';
import './ProductPage.css';
import { useToast } from '../constext/ToastContext';
import { useNavigate } from 'react-router-dom';



function ProductPage() {
      const navigate = useNavigate();

   const [Products, setProducts] = useState(null)
   const { showToast } = useToast();
    const { addToCart } = useCart();
    const {id} = useParams();
    const { user } = useAuth();
    const [showLoginModal, setShowLoginModal] = useState(false);

    useEffect(() => {
      
      const res = fetch(`http://localhost:5000/api/products/${id}`)
      .then(res => res.json())
      .then(data => setProducts(data));
    
      return () => {
          setProducts(null)
          
      }
    }, [id])
    


   
   if (!Products) return <h2>Loading...</h2>;

return (
  <div className="perfumePage">
  
   <button className="backArrow" onClick={() => navigate(-1)}>&#8592;</button>  
    <div className="perfumeHero">
      <div className="perfumeHeroLeft">
        <span className="perfumeBrand">{Products.category}</span>
        <h1 className="perfumeTitle">{Products.name}</h1>
        <p className="perfumeDesc">{Products.description}</p>
        <p className="perfumePrice">${Products.price}.00</p>
        <button className="perfumeBtn" onClick={() => {
              if (!user) {
               setShowLoginModal(true);
            } else {
             addToCart(Products);
             showToast('Product added!', 'success');
               }
              }}>
                   Add to Cart
                </button>
      </div>

      <div className="perfumeHeroRight">
        <img src={`http://localhost:5000${Products.image}`} alt={Products.name} />
      </div>
    </div>

   
    <div className="notesSection">
      <h2 className="notesTitle">MAIN NOTES</h2>
      <div className="notesGrid">
        {Array.isArray(Products.tastes) && Products.tastes.map(taste => (
  <div key={taste.name} className="noteCard">
    
    <img src={`http://localhost:5000${taste.image}`} alt={taste.name} />
    <span>{taste.name}</span>
    <p>{taste.description}</p>
  </div>
))}
      </div>
    </div>
    <div className="brandStory">
  <div className="brandStoryNoise" />
  
  <div className="brandStoryTop">
    <span className="brandStoryEyebrow">The House & Its Soul</span>
    <div className="brandStoryTopDivider" />
  </div>

  <div className="brandStoryHero">
    <h2 className="brandStoryMainTitle">
      Born From <br />
      <em>Silence & Stone</em>
    </h2>
    <p className="brandStoryLead">
      There are places on this earth where the air itself carries memory —
      where morning fog clings to ancient rock faces and the wind arrives
      carrying the ghosts of a thousand blooms. This is where we began.
    </p>
  </div>

  <div className="brandStoryColumns">
    <div className="brandStoryCol">
      <span className="brandStoryColYear">1987</span>
      <h3 className="brandStoryColTitle">The First Distillation</h3>
      <p className="brandStoryColText">
        In a stone building at the edge of Grasse, a perfumer named Elias Vorn
        spent eleven years learning to listen. Not to people — to petals.
        To the exact moment a rose surrenders its soul to steam. To the silence
        between two notes that makes the third one ache. His first creation
        was never sold. It was kept in a dark drawer, a private language
        between him and the mountain.
      </p>
    </div>

    <div className="brandStoryColDivider" />

    <div className="brandStoryCol">
      <span className="brandStoryColYear">2003</span>
      <h3 className="brandStoryColTitle">A Language Refined</h3>
      <p className="brandStoryColText">
        Sixteen years later, the drawer was opened. What emerged was not a
        fragrance — it was a philosophy. That scent should never announce
        itself. It should be discovered, like a sentence in a letter you
        weren't meant to read. The maison was built around that principle:
        invisibility as luxury. Restraint as power. The space between
        presence and absence as the most expensive real estate in the world.
      </p>
    </div>

    <div className="brandStoryColDivider" />

    <div className="brandStoryCol">
      <span className="brandStoryColYear">Today</span>
      <h3 className="brandStoryColTitle">The Quiet Authority</h3>
      <p className="brandStoryColText">
        Every bottle that leaves our atelier carries the same obsession.
        Every ingredient is sourced from a single harvest. Every formula
        is hand-approved by a nose who has spent decades learning the
        difference between a note and a feeling. We do not make perfumes
        for rooms. We make them for the space between two people —
        that charged, wordless air where everything is decided.
      </p>
    </div>
  </div>

  <div className="brandStoryFooter">
    <div className="brandStoryFooterLine" />
    <p className="brandStoryQuote">
      "A great fragrance does not fill a room. <br />
      It fills the moment just before you speak."
    </p>
    <span className="brandStoryAttribution">— Elias Vorn, Founder</span>
    <div className="brandStoryFooterMeta">
      <span>Est. 1987</span>
      <span className="brandStoryDot">·</span>
      <span>Grasse, France</span>
      <span className="brandStoryDot">·</span>
      <span>Small Batch · Hand Approved</span>
    </div>
  </div>
</div>
  {showLoginModal && (
  <div className="modalOverlay" onClick={() => setShowLoginModal(false)}>
    <div className="modalPanel" onClick={e => e.stopPropagation()}>
      <button className="modalClose" onClick={() => setShowLoginModal(false)}>✕</button>
      <span className="modalEyebrow">Members Only</span>
      <h2 className="modalTitle">Sign in to continue</h2>
      <p className="modalSub">Create an account or sign in to add pieces to your collection.</p>
      <div className="modalActions">
        <a href="/login" className="modalBtnPrimary">Sign In</a>
        <a href="/register" className="modalBtnSecondary">Create Account</a>
      </div>
    </div>
  </div>
)}

  </div>
);
}


export default ProductPage