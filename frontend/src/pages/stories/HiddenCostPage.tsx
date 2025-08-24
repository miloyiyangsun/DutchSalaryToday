// Hidden Labor Cost Page - Story 5 Detail Page
// 隐形人力成本详情页 - 故事5详情页面

import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../../types/routes";
import "../../SuperDesign.css";

function HiddenCostPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <header>
        <h1>💰 Hidden Labor Costs - Detailed Analysis</h1>
        <p>Story 5: Employer Social Contribution Insights in Netherlands</p>
      </header>

      {/* Under Development Notice */}
      <section style={{ 
        marginTop: '2rem', 
        padding: '2rem', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#6c757d', marginBottom: '1rem' }}>🚧 Under Development</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#6c757d' }}>
          This detailed analysis page is currently under development.<br />
          <strong>Three Big Numbers</strong> are already available on the homepage.
        </p>
        
        <div style={{ marginTop: '1.5rem', marginBottom: '1.5rem' }}>
          <p style={{ color: '#28a745', fontWeight: 'bold' }}>✅ Available Data:</p>
          <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
            <li>🧾 Benefit Burden: 22.8% employer social contribution level</li>
            <li>💸 Industry Gap: 6.6x disparity between highest and lowest sectors</li>
            <li>📈 Cost Growth: +85.8% absolute increase (€256B → €476B)</li>
          </ul>
        </div>

        <p style={{ marginBottom: '1.5rem', color: '#6c757d' }}>
          For now, you can explore our <strong>completed Story 1</strong> with full interactive charts and analysis.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button 
            onClick={() => navigate(ROUTES.HOME)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            ← Back to Homepage
          </button>
          
          <button 
            onClick={() => navigate(ROUTES.ICE_AND_FIRE)}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            🔥 Explore Story 1 (Complete)
          </button>
        </div>
      </section>

      {/* Quick Data Preview */}
      <section style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', color: '#374151' }}>📊 Quick Data Preview</h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '1rem' 
        }}>
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#fff3cd', 
            borderRadius: '6px',
            border: '1px solid #ffeaa7'
          }}>
            <h4>🧾 Benefit Burden Level</h4>
            <p>Netherlands employers pay <strong>€22.8</strong> in social contributions for every €100 in total compensation (2024)</p>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#d1ecf1', 
            borderRadius: '6px',
            border: '1px solid #bee5eb'
          }}>
            <h4>💸 Industry Gap Multiple</h4>
            <p>Benefit burden varies: <strong>6.6x difference</strong> between highest (30.3%) and lowest (4.6%) industries</p>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#d4edda', 
            borderRadius: '6px',
            border: '1px solid #c3e6cb'
          }}>
            <h4>📈 Absolute Cost Growth</h4>
            <p><strong>+85.8% increase</strong> in total social contributions (€256B → €476B, 2010-2024)</p>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '3rem' }}>
        <p>Story 5 Data Source: CBS Netherlands Statistics | Hidden Labor Cost Analysis</p>
      </footer>
    </div>
  );
}

export default HiddenCostPage;