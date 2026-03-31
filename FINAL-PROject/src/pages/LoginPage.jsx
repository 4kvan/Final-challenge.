import React, { useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../constext/AuthContext'
import { useToast } from '../constext/ToastContext';
import './Login.css'

function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [password, setPassword] = useState('')
    const [Email, setEmail] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault();

        const res = await fetch('http://localhost:5000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: Email, password })
        });

        const data = await res.json();

        if (data.token) {
            login(data, data.token);
            if (data.isAdmin) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            showToast('Error occurred', 'error');
        }
    };

    const images = [
  { src: '/nature.jpg', caption: 'Forged in silence, worn with intent.' },
  { src: '/man.jpg', caption: 'Where botanicals meet the midnight hour.' },
  { src: '/flower.jpg', caption: 'Grasse, France — the birthplace of desire.' },
];

const [currentImg, setCurrentImg] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    setCurrentImg(prev => (prev + 1) % images.length);
  }, 4000);
  return () => clearInterval(timer);
}, []);

return (
  <div className="authWrapper">

    
    <div className="authImagePanel">
      {images.map((img, i) => (
        <div
          key={i}
          className={`authImage ${i === currentImg ? 'active' : ''}`}
          style={{ backgroundImage: `url(${img.src})` }}
        />
      ))}
      <div className="authImageOverlay" />
      <div className="authImageContent">
        <span className="authImageEyebrow">L'Élixir de Minuit</span>
        <p className="authImageCaption">{images[currentImg].caption}</p>
        <div className="authImageDots">
          {images.map((_, i) => (
            <span
              key={i}
              className={`authDot ${i === currentImg ? 'activeDot' : ''}`}
              onClick={() => setCurrentImg(i)}
            />
          ))}
        </div>
      </div>
    </div>

    
    <div className="authFormPanel">
      <div className="authFormInner">
        <span className="authEyebrow">Welcome back</span>
        <h1 className="authTitle">Sign In</h1>
        <p className="authSub">Don't have an account? <a href="/register" className="authLink">Create one</a></p>

        <div className="authSocials">
          <button className="authSocialBtn">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" width="18" />
            Continue with Google
          </button>
          <button className="authSocialBtn">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 814 1000">
        <path fill="currentColor" d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663 0 541.8c0-207.3 135.3-317 268.4-317 71.2 0 130.4 46.9 175 46.9 42.8 0 109.6-49.9 190.5-49.9zm-234-181.5c31.1-36.9 53.1-88.1 53.1-139.3 0-7.1-.6-14.3-1.9-20.1-50.6 1.9-110.8 33.7-147.1 75.8-28.5 32.4-55.1 83.6-55.1 135.5 0 7.8 1.3 15.6 1.9 18.1 3.2.6 8.4 1.3 13.6 1.3 45.4 0 102.5-30.4 135.5-71.3z"/>
         </svg>
            Continue with Apple
          </button>
        </div>

        <div className="authDivider"><span>or</span></div>

        <form className="authForm" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email address" value={Email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="authSubmit">Sign In</button>
        </form>
      </div>
    </div>

  </div>
);}

export default LoginPage