import React, { useState, useEffect, useRef } from 'react';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';
import mp4bg from '../ASSETS/background.mp4';
import logo from '../ASSETS/pepe.png';
import id2 from '../ASSETS/id2.jpg';
import id3 from '../ASSETS/id3.jpg';

const Homepage = () => {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [videoFailed, setVideoFailed] = useState(false);
  const canObserve = typeof IntersectionObserver !== 'undefined';

  const sections = [
    {
      id: 0,
      isMainSection: true,
      title: 'Welcome to Anpan',
      hasVideo: true,
    },
    {
      id: 1,
      title: 'OBJECTIVES',
      subtitle: 'OBJECTIVES OF MY TEAM',
      description: 'Provide Essential Travel Information, Offer detailed pricing lists for popular Japanese destinations, and include recommended local foods and cultural highlights.',
      image: id2,
      hasImage: true,
    },
    {
      id: 2,
      title: 'CULTURES',
      subtitle: 'CULTURES IN JAPAN',
      description: "Japan's cultures are given full respect in tourist places and rich blend of ancient traditions and hyper-modern innovations, built on a deep social value of harmony, respect, and group unity .",
      image: id3,
      hasImage: true,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = Math.max(window.scrollY, 0);
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollY(currentScrollY);
      setScrollProgress(maxScroll > 0 ? Math.min(currentScrollY / maxScroll, 1) : 0);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!canObserve || !pageRef.current) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(Number(entry.target.dataset.section));
          }
        });
      },
      { threshold: 0.5 }
    );

    pageRef.current
      .querySelectorAll('[data-section]')
      .forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [canObserve]);

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={pageRef} style={{ position: 'relative' }}>
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          padding: '1rem 2rem',
          background: `rgba(0, 0, 0, ${Math.min(scrollY / 300, 0.8)})`,
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div
            style={{
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            Anpan Web
          </div>

          <div
            style={{
              width: '100px',
              height: '4px',
              background: 'rgba(255,255,255,0.3)',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${scrollProgress * 100}%`,
                height: '100%',
                background: 'white',
              }}
            />
          </div>
        </div>
      </nav>

      <nav className="home-side-nav" aria-label="Page sections">
        {sections.map((_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Go to section ${index + 1}`}
            aria-current={activeSection === index ? 'true' : undefined}
            onClick={() => scrollToSection(index)}
            style={{
              width: activeSection === index ? '12px' : '8px',
              height: activeSection === index ? '12px' : '8px',
              borderRadius: '50%',
              border: '2px solid white',
              background: activeSection === index ? 'white' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: 0.8,
            }}
          />
        ))}
      </nav>

      <section id="section-0" data-section={0} className="main">
        {!videoFailed && (
          <video autoPlay loop muted playsInline aria-hidden="true" className="background-video">
            <source src={mp4bg} type="video/mp4" onError={() => setVideoFailed(true)} />
          </video>
        )}

        <div
          className="Content"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            opacity: Math.max(1 - scrollY / 800, 0),
          }}
        >
          <img
            src={logo}
            alt="Anpan logo"
            className="logo-image"
            style={{
              transform: `scale(${Math.max(1 - scrollY / 1000, 0.5)}) rotate(${scrollY * 0.1}deg)`,
            }}
          />
          <h1 style={{ transform: `translateY(${scrollY * 0.3}px)` }}>Welcome to Anpan</h1>

          <div style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
            <button className="btn-53" onClick={() => navigate('/Login')}>
              <div className="original">LOGIN</div>
              <div className="letters" aria-hidden="true">
                <span>L</span>
                <span>O</span>
                <span>G</span>
                <span>I</span>
                <span>N</span>
              </div>
            </button>
            <button className="btn-53" onClick={() => navigate('/Signup')}>
              <div className="original">SIGN UP</div>
              <div className="letters" aria-hidden="true">
                <span>S</span>
                <span>I</span>
                <span>G</span>
                <span>N</span>
                <span>U</span>
                <span>P</span>
              </div>
            </button>
          </div>
        </div>
      </section>

      {sections.slice(1).map((section, index) => {
        const sectionIndex = index + 1;
        const isActive = !canObserve || activeSection === sectionIndex;

        return (
          <section
            key={section.id}
            id={`section-${sectionIndex}`}
            data-section={sectionIndex}
            className="home-panel"
          >
            {section.hasImage && section.image && (
              <img
                src={section.image}
                alt={section.title}
                className="home-panel-background"
              />
            )}

            <div className="home-panel-overlay" />

            <div className="home-panel-dots">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="home-panel-dot"
                  style={{ '--i': i }}
                />
              ))}
            </div>

            <div className="home-panel-content">
              <div className="home-panel-text">
                <h2
                  className="home-panel-title"
                  style={{
                    transform: `translateX(${isActive ? '0' : '-100px'})`,
                    opacity: isActive ? 1 : 0,
                  }}
                >
                  {section.title}
                  <span className="home-panel-subtitle">{section.subtitle}</span>
                </h2>

                <p
                  className="home-panel-body"
                  style={{
                    transform: `translateX(${isActive ? '0' : '-50px'})`,
                    opacity: isActive ? 0.9 : 0,
                  }}
                >
                  {section.description}
                </p>
              </div>

              <div
                className="home-panel-icon"
                aria-hidden="true"
                style={{ transform: `scale(${isActive ? 1 : 0.5})` }}
              >
                <span
                  className="home-panel-emoji"
                  style={{ transform: `rotate(${scrollY * 0.1}deg)` }}
                >
                  {section.icon}
                </span>
              </div>
            </div>

            <div className="home-panel-progress">
              {sections.map((_, i) => (
                <div
                  key={i}
                  className="home-panel-progress-bar"
                  style={{
                    width: activeSection === i ? '2rem' : '0.5rem',
                  }}
                />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default Homepage;