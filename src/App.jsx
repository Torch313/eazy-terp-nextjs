import { useState } from 'react'
import './App.css'

function App() {
  const [screen, setScreen] = useState('home');
  const [moodType, setMoodType] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentMoods = [
    'Angry', 'Anxious', 'Tired', 'Depressed'
  ];

  const targetMoods = [
    'Romantic', 'Silly', 'Focus', 'Healing', 'Pain Relief', 
    'Social', 'Sleepy', 'Energized', 'Comforted', 'Restorative'
  ];

  const moodOptions = moodType === 'current' ? currentMoods : targetMoods;

  const handleMoodTypeSelect = (type) => {
    setMoodType(type);
    setScreen('moodSelect');
  };

  const handleMoodSubmit = async () => {
    if (!selectedMood) return;
    setLoading(true);
    setScreen('loading'); // Show loading screen
    
    try {
      const response = await fetch('https://n8n.eazyterp.com/webhook/terpene-mood-intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: selectedMood, moodType: moodType }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        setResults(data);
        setScreen('results');
      }
    } catch (error) {
      console.error('Error:', error);
      setScreen('moodSelect'); // Go back on error
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    setScreen('home');
    setMoodType('');
    setSelectedMood('');
    setResults(null);
  };

  const getMascotMood = () => {
    if (!selectedMood) return 'neutral';
    if (currentMoods.includes(selectedMood)) {
      if (['Angry', 'Irritable'].includes(selectedMood)) return 'angry';
      if (['Anxious', 'Stressed', 'Overwhelmed', 'Tense', 'Restless'].includes(selectedMood)) return 'anxious';
      return 'stressed';
    }
    if (['Happy', 'Uplifted', 'Social'].includes(selectedMood)) return 'happy';
    if (['Relaxed', 'Calm', 'Peaceful'].includes(selectedMood)) return 'relaxed';
    return 'neutral';
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #6b21a8 0%, #7c3aed 50%, #6b21a8 100%)',
      padding: '1rem'
    },
    maxWidth: {
      maxWidth: '64rem',
      margin: '0 auto'
    },
    homeScreen: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '0.5rem'
    },
    mascotContainer: {
      width: '100%',
      maxWidth: '28rem',
      display: 'flex',
      justifyContent: 'center'
    },
    mascotImage: {
      width: '100%',
      height: 'auto',
      maxWidth: '400px',
      filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.3))'
    },
    mascotMini: {
      width: '4rem',
      height: 'auto',
      flexShrink: 0
    },
    heading: {
      textAlign: 'center',
      marginTop: '0',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '3.75rem',
      fontWeight: 'bold',
      color: '#fde047',
      textShadow: '0 4px 6px rgba(0,0,0,0.3)',
      fontFamily: 'Impact, sans-serif',
      letterSpacing: '0.05em'
    },
    subtitle: {
      fontSize: '1.5rem',
      color: 'white',
      fontWeight: '300',
      fontStyle: 'italic',
      marginTop: '0.5rem'
    },
    buttonContainer: {
      display: 'flex',
      gap: '1.5rem',
      width: '100%',
      maxWidth: '28rem',
      flexDirection: 'row'
    },
    buttonRed: {
      flex: 1,
      backgroundColor: '#ef4444',
      color: 'white',
      fontWeight: 'bold',
      padding: '1.5rem 2rem',
      borderRadius: '0.75rem',
      fontSize: '1.25rem',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      transition: 'transform 0.2s, background-color 0.2s'
    },
    buttonGreen: {
      flex: 1,
      backgroundColor: '#22c55e',
      color: 'white',
      fontWeight: 'bold',
      padding: '1.5rem 2rem',
      borderRadius: '0.75rem',
      fontSize: '1.25rem',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      transition: 'transform 0.2s, background-color 0.2s'
    },
    card: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      width: '100%',
      maxWidth: '28rem'
    },
    cardTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '1.5rem',
      textAlign: 'center'
    },
    select: {
      width: '100%',
      padding: '1rem',
      fontSize: '1.125rem',
      borderRadius: '0.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      color: '#1f2937',
      fontWeight: '500',
      border: 'none',
      marginBottom: '1.5rem',
      cursor: 'pointer'
    },
    buttonYellow: {
      width: '100%',
      backgroundColor: '#facc15',
      color: '#1f2937',
      fontWeight: 'bold',
      padding: '1rem 2rem',
      borderRadius: '0.5rem',
      fontSize: '1.25rem',
      border: 'none',
      cursor: 'pointer',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
      transition: 'transform 0.2s, background-color 0.2s'
    },
    link: {
      width: '100%',
      marginTop: '1rem',
      color: 'white',
      textAlign: 'center',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'color 0.2s'
    },
    resultsHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      marginTop: '2rem'
    },
    resultsLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    resultsTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#facc15'
    },
    resultsText: {
      color: 'white',
      fontSize: '1.125rem'
    },
    resultsCard: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      marginTop: '1.5rem'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#facc15',
      marginBottom: '0.75rem'
    },
    sectionText: {
      color: 'white',
      fontSize: '1.125rem',
      lineHeight: '1.75'
    },
    section: {
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      paddingBottom: '1.5rem',
      marginBottom: '1.5rem'
    },
    budtenderCard: {
      background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
      borderRadius: '1rem',
      padding: '2rem',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      border: '4px solid #ca8a04',
      marginTop: '2rem'
    },
    budtenderHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      marginBottom: '1.5rem',
      paddingBottom: '1rem',
      borderBottom: '2px solid #ca8a04'
    },
    budtenderTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    budtenderSubtitle: {
      color: '#374151',
      fontWeight: '500'
    },
    budtenderSection: {
      marginBottom: '1.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      borderRadius: '0.5rem',
      padding: '1rem'
    },
    budtenderLabel: {
      fontSize: '0.875rem',
      color: '#374151',
      fontWeight: '500',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    budtenderValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#1f2937'
    },
    budtenderFooter: {
      marginTop: '1.5rem',
      paddingTop: '1rem',
      borderTop: '2px solid #ca8a04',
      textAlign: 'center'
    },
    backButtons: {
      display: 'flex',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    backButton: {
      flex: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(12px)',
      color: 'white',
      fontWeight: 'bold',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        
        {/* HOME SCREEN */}
        {screen === 'home' && (
          <div style={styles.homeScreen}>
            <div style={styles.mascotContainer}>
              <img 
                src="/eazy-terp-full.png" 
                alt="Eazy Terp Mascot" 
                style={styles.mascotImage}
              />
            </div>

            <div style={styles.heading}>
              <p style={styles.subtitle}>Your terpene mood matchmaker</p>
            </div>

            <div style={styles.buttonContainer}>
              <button
                onClick={() => handleMoodTypeSelect('current')}
                style={styles.buttonRed}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Current Mood
              </button>
              <button
                onClick={() => handleMoodTypeSelect('target')}
                style={styles.buttonGreen}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              >
                Mood Target
              </button>
            </div>
          </div>
        )}

        {/* MOOD SELECTION SCREEN */}
        {screen === 'moodSelect' && (
          <div style={{
            ...styles.homeScreen,
            position: 'relative'
          }}>
            {/* Background Mascot */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              maxWidth: '50rem',
              opacity: 0.15,
              pointerEvents: 'none',
              zIndex: 0
            }}>
              <img 
                src="/eazy-terp-peace.png" 
                alt="Eazy Terp" 
                style={{
                  width: '100%',
                  height: 'auto'
                }}
              />
            </div>

            {/* Content Card (on top) */}
            <div style={{ ...styles.card, position: 'relative', zIndex: 1 }}>
              <h2 style={styles.cardTitle}>
                {moodType === 'current' ? 'How are you feeling?' : 'What mood are you aiming for?'}
              </h2>

              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                style={styles.select}
              >
                <option value="">Select a mood...</option>
                {moodOptions.map((mood) => (
                  <option key={mood} value={mood}>{mood}</option>
                ))}
              </select>

              <button
                onClick={handleMoodSubmit}
                disabled={!selectedMood || loading}
                style={{
                  ...styles.buttonYellow,
                  opacity: (!selectedMood || loading) ? 0.6 : 1,
                  cursor: (!selectedMood || loading) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? 'Finding your match...' : 'Get My Recommendation'}
              </button>

              <div 
                onClick={handleBackToHome}
                style={styles.link}
              >
                ← Back to Home
              </div>
            </div>
          </div>
        )}

        {/* LOADING SCREEN */}
        {screen === 'loading' && (
          <div style={styles.homeScreen}>
            <div style={{ 
              textAlign: 'center',
              animation: 'fadeIn 0.5s ease-in'
            }}>
              <div style={{
                width: '100%',
                maxWidth: '20rem',
                margin: '0 auto',
                animation: 'pulse 2s ease-in-out infinite'
              }}>
                <img 
                  src="/eazy-terp-full.png" 
                  alt="Eazy Terp" 
                  style={{
                    width: '100%',
                    height: 'auto',
                    filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.3))'
                  }}
                />
              </div>
              
              <div style={{
                marginTop: '2rem',
                color: 'white',
                fontSize: '1.5rem',
                fontWeight: '600',
                animation: 'fadeIn 1s ease-in-out infinite alternate'
              }}>
                🎵 Mixing your perfect blend...
              </div>
              
              <div style={{
                marginTop: '1rem',
                color: '#fde047',
                fontSize: '1.125rem',
                fontStyle: 'italic'
              }}>
                Let the rhythm flow, your match is coming soon 🌿
              </div>

              <div style={{
                marginTop: '3rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: '#fde047',
                      animation: `bounce 1.4s ease-in-out ${i * 0.16}s infinite`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* RESULTS SCREEN */}
        {screen === 'results' && results && (
          <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div style={styles.resultsHeader}>
              <div style={styles.resultsLeft}>
                <img 
                  src="/eazy-terp-full.png" 
                  alt="Eazy Terp" 
                  style={styles.mascotMini}
                />
                <div>
                  <h2 style={styles.resultsTitle}>Your Match</h2>
                  <p style={styles.resultsText}>
                    {moodType === 'current' ? 'Feeling' : 'Targeting'}: <span style={{ fontWeight: '600' }}>{selectedMood}</span>
                  </p>
                </div>
              </div>
              <div onClick={handleBackToHome} style={{ ...styles.link, width: 'auto', marginTop: 0, cursor: 'pointer' }}>
                ← Home
              </div>
            </div>

            <div style={styles.resultsCard}>
              {results.terpene && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>🌿 Primary Terpene</h3>
                  <p style={{ ...styles.sectionText, fontWeight: '600', fontSize: '1.25rem' }}>{results.terpene}</p>
                </div>
              )}

              {results.description && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>Get to Know Your Terpene</h3>
                  <p style={styles.sectionText}>{results.description}</p>
                </div>
              )}

              {results.primaryEffects && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>✨ Special Effects</h3>
                  <p style={styles.sectionText}>{results.primaryEffects}</p>
                </div>
              )}

              {results.vibeEnhancers && (
                <div style={styles.section}>
                  <h3 style={styles.sectionTitle}>💫 Vibe Enhancers</h3>
                  <p style={styles.sectionText}>{results.vibeEnhancers}</p>
                </div>
              )}

              {results.affirmation && (
                <div style={{
                  backgroundColor: 'rgba(250, 204, 21, 0.15)',
                  borderLeft: '4px solid #facc15',
                  borderRadius: '0.5rem',
                  padding: '1.5rem',
                  marginTop: '1.5rem'
                }}>
                  <h3 style={{...styles.sectionTitle, marginBottom: '0.75rem'}}>🎵 Your Affirmation</h3>
                  <p style={{
                    ...styles.sectionText,
                    fontStyle: 'italic',
                    fontSize: '1.25rem',
                    fontWeight: '500'
                  }}>"{results.affirmation}"</p>
                </div>
              )}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => setScreen('budtenderCard')}
                style={styles.buttonGreen}
              >
                📋 Show Budtender Card
              </button>

              <button
                onClick={() => {
                  if (results.recommendedStrains) {
                    let strains = [];
                    
                    if (Array.isArray(results.recommendedStrains)) {
                      strains = results.recommendedStrains.slice(0, 3);
                    } else if (typeof results.recommendedStrains === 'string') {
                      strains = results.recommendedStrains.split(',').map(s => s.trim()).slice(0, 3);
                    }
                    
                    const query = `${strains.join(' OR ')} dispensary near me`;
                    window.open(`https://www.google.com/maps/search/${encodeURIComponent(query)}`, '_blank');
                  }
                }}
                style={{
                  ...styles.buttonGreen,
                  backgroundColor: '#3b82f6',
                  boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.4)'
                }}
              >
                🗺️ Find Near Me
              </button>
            </div>
          </div>
        )}

        {/* BUDTENDER CARD SCREEN */}
        {screen === 'budtenderCard' && results && (
          <div style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
            <div style={styles.budtenderCard}>
              <div style={styles.budtenderHeader}>
                <img 
                  src="/eazy-terp-full.png" 
                  alt="Eazy Terp" 
                  style={styles.mascotMini}
                />
                <div>
                  <h2 style={styles.budtenderTitle}>EAZY TERP</h2>
                  <p style={styles.budtenderSubtitle}>Budtender Quick Card</p>
                </div>
              </div>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                fontStyle: 'italic',
                color: '#1f2937',
                fontSize: '1.125rem',
                lineHeight: '1.6'
              }}>
                "Hello, Budtender! My name is Eazy Terp. Our friend is looking for one of these strains or a member of the family. Keep it smooth, keep it jazzy. Peace and balance! 🌿✌️"
              </div>

              {results.terpene && (
                <div style={styles.budtenderSection}>
                  <p style={styles.budtenderLabel}>Primary Terpene Profile</p>
                  <p style={{ ...styles.budtenderValue, fontSize: '1.875rem' }}>{results.terpene}</p>
                </div>
              )}

              {results.recommendedStrains && (
                <div style={styles.budtenderSection}>
                  <p style={{ ...styles.budtenderLabel, marginBottom: '0.75rem' }}>Recommended Strains</p>
                  <div style={{ 
                    color: '#1f2937', 
                    fontSize: '1.125rem',
                    lineHeight: '2'
                  }}>
                    {(() => {
                      console.log('Raw strains data:', results.recommendedStrains);
                      
                      // Handle different formats
                      let strainList = [];
                      
                      if (Array.isArray(results.recommendedStrains)) {
                        strainList = results.recommendedStrains;
                      } else if (typeof results.recommendedStrains === 'string') {
                        // Split by various delimiters
                        strainList = results.recommendedStrains
                          .split(/[\n,\r]+/)
                          .map(s => s.trim())
                          .filter(s => s && s.length > 2 && !s.includes('similar'));
                      }
                      
                      console.log('Parsed strains:', strainList);
                      
                      if (strainList.length === 0) {
                        return <div style={{ fontWeight: '600' }}>• Ask budtender for {results.terpene || 'terpene'}-rich strains</div>;
                      }
                      
                      return strainList.slice(0, 5).map((strain, index) => (
                        <div key={index} style={{ 
                          marginBottom: '0.5rem',
                          fontWeight: '600'
                        }}>
                          • {strain}
                        </div>
                      ));
                    })()}
                  </div>
                </div>
              )}

              <div style={styles.budtenderFooter}>
                <p style={styles.budtenderLabel}>Your terpene mood matchmaker 🎵</p>
              </div>
            </div>

            <div style={styles.backButtons}>
              <button
                onClick={() => setScreen('results')}
                style={styles.backButton}
              >
                ← Back to Full Results
              </button>
              <button
                onClick={handleBackToHome}
                style={styles.backButton}
              >
                🏠 Back to Home
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;