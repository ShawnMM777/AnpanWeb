import React, { useState, useEffect } from 'react';
import './Homepage.css';
import { useNavigate } from 'react-router-dom';
import mp4bg from '../ASSETS/background.mp4';
import logo from '../ASSETS/pepe.png';

const Homepage = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);

  // Additional sections for scrolling
  const sections = [
    {
      id: 0,
      isMainSection: true,
      title: "Welcome to Anpan",
      hasVideo: true
    },
    {
      id: 1,
      title: "OBJECTIVES",
      subtitle: "OBJECTIVES OF MY TEAM",
      description: "Provide Essential Travel Information, Offer detailed pricing lists for popular Japanese destinations, and include recommended local foods and cultural highlights.",
      icon: "🎯",
      bgColor: '#05e109ff',
    },
     {
      id: 2,
      title: "Innnovation",
      subtitle: "Innovation About In Japan",
      description: "",
      icon: "🎯",
      bgColor: '#fa8e0245',
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      const sectionHeight = window.innerHeight;
      const currentSection = Math.floor(currentScrollY / sectionHeight);

      if (currentSection !== activeSection && currentSection < sections.length) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection, sections.length]);

  const scrollToSection = (index) => {
    const element = document.getElementById(`section-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: '1rem 2rem',
        background: `rgba(0, 0, 0, ${Math.min(scrollY / 300, 0.8)})`,
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s ease'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            color: 'white',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
            
          }}>
          Anpan Web
          </div>
         

        
          <div style={{
            width: '100px',
            height: '4px',
            background: 'rgba(255,255,255,0.3)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>

            <div style={{
              width: `${Math.min((scrollY / (document.body.scrollHeight - window.innerHeight)) * 100, 100)}%`,
              height: '100%',
              background: 'white',
              transition: 'width 0.1s ease'
            }}></div>
          </div>
        </div>
      </nav>
      
      <div style={{
        position: 'fixed',
        right: '2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            style={{
              width: activeSection === index ? '12px' : '8px',
              height: activeSection === index ? '12px' : '8px',
              borderRadius: '50%',
              border: '2px solid white',
              background: activeSection === index ? 'white' : 'transparent',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              opacity: 0.8
            }}
          />
        ))}
      </div>

      <section id="section-0" className="main" style={{
        height: '100vh',
        position: 'relative'
      }}>
        <video autoPlay loop muted className="background-video">
          <source src={mp4bg} type="video/mp4" />
        </video>

        <div className="Content" style={{
          transform: `translateY(${scrollY * 0.5}px)`, // Parallax effect
          opacity: Math.max(1 - scrollY / 800, 0) // Fade out on scroll
        }}>

          <img
            src={logo}
            alt="Logo"
            className="logo-image"
            style={{
              transform: `scale(${Math.max(1 - scrollY / 1000, 0.5)}) rotate(${scrollY * 0.1}deg)`,
              transition: 'transform 0.1s ease-out'
            }}
          />
          <h1 style={{
            transform: `translateY(${scrollY * 0.3}px)`,
            opacity: Math.max(1 - scrollY / 600, 0)
          }}>
            Welcome to Anpan
          </h1>

          <div style={{
            transform: `translateY(${scrollY * 0.2}px)`,
            opacity: Math.max(1 - scrollY / 700, 0)
          }}>
            <button className="btn-53" onClick={() => navigate("/Login")}>
              <div className="original">LOGIN</div>
              <div className="letters">
                <span>L</span>
                <span>O</span>
                <span>G</span>
                <span>I</span>
                <span>N</span>
              </div>
            </button>
            <button className="btn-53" onClick={() => navigate("/Signup")}>
              <div className="original">SIGN UP</div>
              <div className="letters">
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
        const isActive = activeSection === sectionIndex;

        return (
          <section
            key={section.id}
            id={`section-${sectionIndex}`}
            style={{
              height: '100vh',
              background: section.bgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Animated Background Elements */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1
            }}>
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    width: `${4 + i * 2}px`,
                    height: `${4 + i * 2}px`,
                    background: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: '50%',
                    left: `${10 + i * 10}%`,
                    top: `${20 + i * 8}%`,
                    transform: `translateY(${Math.sin(scrollY * 0.002 + i) * 20}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: '1200px',
              width: '100%',
              padding: '0 2rem',
              gap: '4rem'
            }}>
              <div style={{
                flex: 1,
                color: 'white',
                maxWidth: '600px'
              }}>
                <h1 style={{
                  fontSize: '3.5rem',
                  fontWeight: 'bold',
                  margin: '0 0 1rem 0',
                  lineHeight: '1.1',
                  textShadow: '0 2px 10px rgba(0,0,0,0.3)',
                  transform: `translateX(${isActive ? '0' : '-100px'})`,
                  opacity: isActive ? 1 : 0,
                  transition: 'all 1s ease'
                }}>
                  {section.title}
                  <br />
                  <span style={{ fontWeight: '300', fontSize: '0.8em' }}>
                    {section.subtitle}
                  </span>
                </h1>

                <p style={{
                  fontSize: '1.1rem',
                  lineHeight: '1.6',
                  margin: '2rem 0',
                  opacity: 0.9,
                  transform: `translateX(${isActive ? '0' : '-50px'})`,
                  opacity: isActive ? 0.9 : 0,
                  transition: 'all 1s ease 0.3s'
                }}>
                  {section.description}
                </p>
              </div>

              <div style={{
                flex: 1,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{
                  fontSize: '12rem',
                  opacity: 0.8,
                  transform: `scale(${isActive ? 1 : 0.5}) rotate(${scrollY * 0.1}deg)`,
                  transition: 'all 1s ease',
                  filter: 'drop-shadow(0 0 50px rgba(255,255,255,0.3))'
                }}>
                  {section.icon}
                </div>
              </div>
            </div>

            {/* Section Progress */}
            <div style={{
              position: 'absolute',
              bottom: '2rem',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '0.5rem'
            }}>
              {sections.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: activeSection === i ? '2rem' : '0.5rem',
                    height: '0.25rem',
                    background: activeSection === i ? 'white' : 'rgba(255,255,255,0.5)',
                    borderRadius: '2px',
                    transition: 'all 0.3s ease'
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