import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../constext/AuthContext'
import { useToast } from '../constext/ToastContext';

const COUNTRIES = [
  { code: '+213', name: 'Algeria', maxLength: 9 },
  { code: '+1', name: 'USA/Canada', maxLength: 10 },
  { code: '+44', name: 'UK', maxLength: 10 },
  { code: '+33', name: 'France', maxLength: 9 },
  { code: '+49', name: 'Germany', maxLength: 11 },
  { code: '+39', name: 'Italy', maxLength: 10 },
  { code: '+34', name: 'Spain', maxLength: 9 },
  { code: '+971', name: 'UAE', maxLength: 9 },
  { code: '+966', name: 'Saudi Arabia', maxLength: 9 },
  { code: '+20', name: 'Egypt', maxLength: 10 },
  { code: '+212', name: 'Morocco', maxLength: 9 },
  { code: '+216', name: 'Tunisia', maxLength: 8 },
  { code: '+90', name: 'Turkey', maxLength: 10 },
  { code: '+91', name: 'India', maxLength: 10 },
  { code: '+86', name: 'China', maxLength: 11 },
  { code: '+81', name: 'Japan', maxLength: 10 },
  { code: '+82', name: 'South Korea', maxLength: 10 },
  { code: '+55', name: 'Brazil', maxLength: 11 },
  { code: '+52', name: 'Mexico', maxLength: 10 },
  { code: '+7', name: 'Russia', maxLength: 10 },
  { code: '+27', name: 'South Africa', maxLength: 9 },
  { code: '+234', name: 'Nigeria', maxLength: 10 },
  { code: '+254', name: 'Kenya', maxLength: 9 },
  { code: '+31', name: 'Netherlands', maxLength: 9 },
  { code: '+32', name: 'Belgium', maxLength: 9 },
  { code: '+41', name: 'Switzerland', maxLength: 9 },
  { code: '+46', name: 'Sweden', maxLength: 9 },
  { code: '+47', name: 'Norway', maxLength: 8 },
  { code: '+45', name: 'Denmark', maxLength: 8 },
  { code: '+358', name: 'Finland', maxLength: 9 },
  { code: '+48', name: 'Poland', maxLength: 9 },
  { code: '+351', name: 'Portugal', maxLength: 9 },
  { code: '+30', name: 'Greece', maxLength: 10 },
  { code: '+420', name: 'Czech Republic', maxLength: 9 },
  { code: '+36', name: 'Hungary', maxLength: 9 },
  { code: '+40', name: 'Romania', maxLength: 9 },
  { code: '+380', name: 'Ukraine', maxLength: 9 },
  { code: '+92', name: 'Pakistan', maxLength: 10 },
  { code: '+880', name: 'Bangladesh', maxLength: 10 },
  { code: '+94', name: 'Sri Lanka', maxLength: 9 },
  { code: '+62', name: 'Indonesia', maxLength: 12 },
  { code: '+60', name: 'Malaysia', maxLength: 9 },
  { code: '+65', name: 'Singapore', maxLength: 8 },
  { code: '+63', name: 'Philippines', maxLength: 10 },
  { code: '+66', name: 'Thailand', maxLength: 9 },
  { code: '+84', name: 'Vietnam', maxLength: 10 },
  { code: '+98', name: 'Iran', maxLength: 10 },
  { code: '+964', name: 'Iraq', maxLength: 10 },
  { code: '+961', name: 'Lebanon', maxLength: 8 },
  { code: '+962', name: 'Jordan', maxLength: 9 },
  { code: '+972', name: 'Israel', maxLength: 9 },
  { code: '+20', name: 'Egypt', maxLength: 10 },
  { code: '+249', name: 'Sudan', maxLength: 9 },
  { code: '+251', name: 'Ethiopia', maxLength: 9 },
  { code: '+255', name: 'Tanzania', maxLength: 9 },
  { code: '+256', name: 'Uganda', maxLength: 9 },
  { code: '+233', name: 'Ghana', maxLength: 9 },
  { code: '+225', name: 'Ivory Coast', maxLength: 10 },
  { code: '+237', name: 'Cameroon', maxLength: 9 },
];

function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [UserName, setUserName] = useState('');
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [Phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    // Name: must have two parts
    const nameParts = UserName.trim().split(/\s+/);
    if (nameParts.length < 2 || nameParts[1] === '') {
      newErrors.name = 'Please enter your first and last name.';
    }

    // Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Phone: digits only, correct length
    const digitsOnly = /^\d+$/;
    if (!digitsOnly.test(Phone)) {
      newErrors.phone = 'Phone number must contain digits only.';
    } else if (Phone.length !== selectedCountry.maxLength) {
      newErrors.phone = `Phone number for ${selectedCountry.name} must be exactly ${selectedCountry.maxLength} digits.`;
    }

    // Password
    if (Password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, ''); // strip non-digits
    if (val.length <= selectedCountry.maxLength) {
      setPhone(val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const fullPhone = `${selectedCountry.code}${Phone}`;

    const res = await fetch('http://localhost:5000/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: UserName, email: Email, password: Password, phone: fullPhone })
    });

    const data = await res.json();

    if (data.token) {
      login(data, data.token);
      navigate('/');
    } else {
      showToast(data.message || 'Error occurred', 'error');
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
          <div key={i} className={`authImage ${i === currentImg ? 'active' : ''}`}
            style={{ backgroundImage: `url(${img.src})` }} />
        ))}
        <div className="authImageOverlay" />
        <div className="authImageContent">
          <span className="authImageEyebrow">L'Élixir de Minuit</span>
          <p className="authImageCaption">{images[currentImg].caption}</p>
          <div className="authImageDots">
            {images.map((_, i) => (
              <span key={i} className={`authDot ${i === currentImg ? 'activeDot' : ''}`}
                onClick={() => setCurrentImg(i)} />
            ))}
          </div>
        </div>
      </div>

      <div className="authFormPanel">
        <div className="authFormInner">
          <span className="authEyebrow">Join the house</span>
          <h1 className="authTitle">Create Account</h1>
          <p className="authSub">Already have an account? <a href="/login" className="authLink">Sign in</a></p>

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
            <div>
              <input type="text" placeholder="Full name (First Last)" value={UserName}
                onChange={e => setUserName(e.target.value)} />
              {errors.name && <span className="authError">{errors.name}</span>}
            </div>

            <div>
              <input type="email" placeholder="Email address" value={Email}
                onChange={e => setEmail(e.target.value)} />
              {errors.email && <span className="authError">{errors.email}</span>}
            </div>

            <div>
              <div className="phoneRow">
                <select className="countrySelect"
                  value={selectedCountry.code + selectedCountry.name}
                  onChange={e => {
                    const found = COUNTRIES.find(c => c.code + c.name === e.target.value);
                    setSelectedCountry(found);
                    setPhone('');
                  }}>
                  {COUNTRIES.map((c, i) => (
                    <option key={i} value={c.code + c.name}>
                      {c.code} {c.name}
                    </option>
                  ))}
                </select>
                <input type="tel" placeholder={`${selectedCountry.maxLength} digits`}
                  value={Phone} onChange={handlePhoneChange} className="phoneInput" />
              </div>
              {errors.phone && <span className="authError">{errors.phone}</span>}
            </div>

            <div>
              <input type="password" placeholder="Password" value={Password}
                onChange={e => setPassword(e.target.value)} />
              {errors.password && <span className="authError">{errors.password}</span>}
            </div>

            <button type="submit" className="authSubmit">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;