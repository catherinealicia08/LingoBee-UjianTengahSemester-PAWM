import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from '../components/LeftSidebar';
import RightSidebar from '../components/RightSidebar';
import TopHeader from '../components/TopHeader/TopHeader'; // ✅ Import component
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFeatured, setCurrentFeatured] = useState(0);

  const [featuredNews] = useState([
    {
      id: 1,
      title: '1001 Ways to Master your IELTS Test',
      description: 'Pernahkah anda merangga menketiga ujian IELTS bagan untuk meningkatkan skon tujuan IELTS, Ini terlaku tricour writing, articol dll membangun catto langkah danni untuk gesalt age mean uslu monay dengan percpan dil',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400'
    },
    {
      id: 2,
      title: 'Master English Grammar in 30 Days',
      description: 'Comprehensive guide to improve your grammar skills with daily exercises and practice tests. Perfect for beginners to advanced learners.',
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400'
    },
    {
      id: 3,
      title: 'TOEFL Speaking Strategies',
      description: 'Learn proven strategies to ace your TOEFL speaking section with confidence. Includes sample answers and expert tips.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'
    },
  ]);

  const [materials] = useState([
    { id: 1, title: 'Mastering Simple Present: Dairy...', level: 'Introduce to simple...', date: 'Minggu, 22 April 2025' },
    { id: 2, title: 'Action Verbs & Phrasal Verbs for...', level: 'cut, business & media...', date: 'Rabu, 10 Juni 2025' },
    { id: 3, title: 'Understanding Simple Past Tense...', level: 'talking the past', date: 'Minggu, 3 Agustus 2025' },
    { id: 4, title: 'Reading a Travel Blog: My Worst...', level: 'n4 cycle fom...', date: 'Minggu, 22 April 2025' },
    { id: 5, title: 'Prepositions of Place: In, On, At...', level: 'position & direction...', date: 'Minggu, 22 September 2025' },
    { id: 6, title: 'Listening to Product Reviews and ...', level: 'Comparing a two b study...', date: 'Minggu, 17 Agustus 2025' },
    { id: 7, title: 'Reading Simple Public Notices a...', level: 'Introduced b simple...', date: 'Minggu, 22 April 2025' },
    { id: 8, title: 'Describing Your Weekend: Using ...', level: 'cut b business & media...', date: 'Rabu, 18 Juni 2025' },
    { id: 9, title: 'Listening to Historical Facts and ...', level: 'talking the past', date: 'Rabu, 18 Juni 2025' },
  ]);

  function nextFeatured() {
    setCurrentFeatured((prev) => (prev + 1) % featuredNews.length);
  }

  function prevFeatured() {
    setCurrentFeatured((prev) => (prev - 1 + featuredNews.length) % featuredNews.length);
  }

  return (
    <div className="home-root">
      <LeftSidebar activePage="dashboard" />

      <main className="main-content">
        {/* ✅ Gunakan TopHeader component */}
        <TopHeader />

        <h1 className="page-title">Dashboard</h1>

        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Cari Sesuatu..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <div className="featured-carousel">
          <button className="carousel-btn prev" onClick={prevFeatured}>
            ‹
          </button>
          
          <div className="featured-card">
            <div className="featured-image" style={{ 
              backgroundImage: `url(${featuredNews[currentFeatured].image})` 
            }}></div>
            <div className="featured-content">
              <h2>{featuredNews[currentFeatured].title}</h2>
              <p>{featuredNews[currentFeatured].description}</p>
              <button className="read-btn">Read</button>
            </div>
          </div>

          <button className="carousel-btn next" onClick={nextFeatured}>
            ›
          </button>

          <div className="carousel-indicators">
            {featuredNews.map((_, index) => (
              <button 
                key={index}
                className={`indicator ${index === currentFeatured ? 'active' : ''}`}
                onClick={() => setCurrentFeatured(index)}
              />
            ))}
          </div>
        </div>

        <section className="materi-section">
          <h2>Materi</h2>
          
          <div className="materi-filters">
            <select className="filter-select">
              <option>Bab</option>
            </select>
            <select className="filter-select">
              <option>Keterampilan</option>
            </select>
            <select className="filter-select">
              <option>Select an Option</option>
            </select>
            <button className="search-btn">🔍</button>
          </div>

          <div className="materi-grid">
            {materials.map(material => (
              <div key={material.id} className="materi-card">
                <div className="materi-image"></div>
                <div className="materi-info">
                  <h3>{material.title}</h3>
                  <p className="materi-level">{material.level}</p>
                  <p className="materi-date">{material.date}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <RightSidebar />
    </div>
  );
}