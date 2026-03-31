import { useState,useEffect } from 'react'
import React from 'react'
import ProductCard from '../pages/ProductCard'
import './Home.css'





function Home() {

    
 
     const [ProductList, setProductList] = useState([])
     const [featured, setFeatured] = useState([]);
     const [current, setCurrent] = useState(0);

     useEffect(() => {
            fetch('http://localhost:5000/api/products/featured')
            .then(res => res.json())
            .then(data => setFeatured(data));
          }, []);

     useEffect(() => {
         if (featured.length === 0) return;
         const timer = setInterval(() => {
           setCurrent(prev => (prev + 1) % featured.length);
              }, 8000);  
             return () => clearInterval(timer);
           }, [featured]);
     

    useEffect(() => {
      
      const res = fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => setProductList(data));


    
      return () => {
          setProductList([])
      }
    }, [])
    

        useEffect(() => {
           if (window.location.hash === '#about') {
            setTimeout(() => {
              document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
         }
        if (window.location.hash === '#contact') {
            setTimeout(() => {
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
             }, 100);
         }
           }, []);



    const handleNext = () => {
        setCurrent(prev => (prev + 1) % featured.length);
        };

    const handlePrev = () => {
        setCurrent(prev => (prev - 1 + featured.length) % featured.length);
         };
   

  return (

    
  <div className="home" style={{padding: '0 8%' }}>

    

    <h1>Between dusk and desire — this is where we live.</h1>
    {featured.length > 0 && (
      <div className="heroSection">
        <div className="heroFrame">

         

          <video
            className="heroVideo"
            src={`http://localhost:5000${featured[current].video}`}
            autoPlay
            muted
            loop
            key={featured[current]._id}
          />

         
          <div className="heroOverlay" />

          
          <div className="heroBottle">
            <img src={`http://localhost:5000${featured[current].image}`} alt={featured[current].name} />
          </div>

         
          <div className="heroInfo">
            <span className="heroCategory">{featured[current].category}</span>
            <h2 className="heroName">{featured[current].name}</h2>
            <p className="heroPrice">${featured[current].price}.00</p>
          </div>

        
          <button className="arrowLeft" onClick={handlePrev}>&#8592;</button>
          <button className="arrowRight" onClick={handleNext}>&#8594;</button>

          
          <div className="heroDots">
            {featured.map((_, i) => (
              <span key={i} className={`dot ${i === current ? 'activeDot' : ''}`} onClick={() => setCurrent(i)} />
            ))}
          </div>

        </div>
      </div>
    )}

    
<div className="valuesSection">
  <h2 className="valuesTitle">OUR VALUES</h2>
  
  <div className="valuesGrid">

    <div className="valueItem valueTop">
      <span className="valueEmoji">🕯️</span>
      <div className="valueText">
        <h3>Craftsmanship</h3>
        <p>Every bottle is a deliberate act. We obsess over every note, every curve, every detail until it is exactly right.</p>
      </div>
    </div>

    <div className="valueItem valueBottom">
      <span className="valueEmoji">🌿</span>
      <div className="valueText">
        <h3>Authenticity</h3>
        <p>No shortcuts. No compromises. Only raw, honest ingredients that tell a story worth wearing.</p>
      </div>
    </div>

    <div className="valueItem valueTop">
      <span className="valueEmoji">♾️</span>
      <div className="valueText">
        <h3>Legacy</h3>
        <p>We build for those who understand that true luxury is not consumed — it is inherited.</p>
      </div>
    </div>

    <div className="valueItem valueBottom">
      <span className="valueEmoji">🖤</span>
      <div className="valueText">
        <h3>Boldness</h3>
        <p>We do not follow trends. We set the tone for those who dare to be remembered.</p>
      </div>
    </div>

  </div>
</div>

    
    <div className="productsSection">
      <h2 className="productsTitle">Our Collection</h2>
      <div className="product-list">
        {ProductList.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
    
<div className="aboutSection" id='about'>
  <div className="aboutQuote">
    <span>"</span>
    Luxury is not about what you wear. It is about what you leave behind.
    <span>"</span>
  </div>

  <div className="aboutContent">
    <div className="aboutLeft">
      <h2 className="aboutTitle">MAISON 2MD</h2>
      <p className="aboutSub">The Story</p>
    </div>

    <div className="aboutRight">
      <p>Born from a desire to capture the untameable — the raw edge of midnight air, the warmth of aged wood, the whisper of smoke against cold stone — Maison 2MD was founded with a single obsession: to bottle what words cannot describe.</p>
      <p>It began not in a laboratory, but in a library. Two friends, surrounded by old books and older whiskey, asked themselves a simple question: what does power smell like? What does silence smell like?</p>
      <p>The answer became <strong>2md Elixire</strong> — dark, deliberate, and uncompromising. A scent built for the man who walks into a room and changes its temperature.</p>
      <p>The second answer became <strong>2md Perfume</strong> — softer in its confidence, sharper in its intent. A fragrance that lingers not just on skin, but in memory.</p>
      <p className="aboutTagline">We are not a fashion house. We are not chasing trends. We are building a legacy, one bottle at a time.</p>
    </div>
  </div>
</div>

<div className="contactSection" id="contact">
  <div className="contactContent">
    
    <div className="contactLeft">
      <h2 className="contactTitle">GET IN TOUCH</h2>
      <p className="contactSub">We'd love to hear from you</p>
    </div>

    <div className="contactRight">
      <div className="contactItem">
        <span className="contactLabel">Email</span>
        <a href="mailto:2md@luxury.com">2md@luxury.com</a>
      </div>
      <div className="contactItem">
        <span className="contactLabel">Phone</span>
        <a href="tel:xxxxxxxxx">xxx-xxx-xx4</a>
      </div>
      <div className="contactItem">
        <span className="contactLabel">Location</span>
        <span>Algeria, Algiers</span>
      </div>
      <div className="contactItem">
        <span className="contactLabel">X (Twitter)</span>
        <a href="https://twitter.com/maison2md" target="_blank" rel="noreferrer">@maison2md</a>
      </div>
    </div>

  </div>

  <div className="contactFooter">
    <p>© 2026 Maison 2MD. All rights reserved.</p>
  </div>
</div>

  </div>
);}

export default Home