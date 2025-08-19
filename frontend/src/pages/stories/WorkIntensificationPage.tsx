// Work Intensification Page - Story 4 Detail Page
// 工作密集化详情页 - 故事4详情页面

import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../../types/routes";
import "../../App.css";

function WorkIntensificationPage() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <header>
        <h1>🏭 Work Intensification Revolution - Detailed Analysis</h1>
        <p>Story 4: Non-Standard Work Arrangements in Netherlands</p>
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
            <li>⚖️ Work Distribution: 23.5% non-standard arrangements</li>
            <li>📈 Intensification Index: +1.1pp work intensification trend</li>
            <li>🏭 Industry Rankings: 98 industries workload analysis</li>
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
            <h4>⚖️ Work Distribution</h4>
            <p>Netherlands has <strong>23.5%</strong> of workforce in non-standard arrangements (2024)</p>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#d1ecf1', 
            borderRadius: '6px',
            border: '1px solid #bee5eb'
          }}>
            <h4>📈 Intensification Index</h4>
            <p>Work intensification trend: <strong>+1.1 percentage points</strong> (2010-2024)</p>
          </div>
          
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#d4edda', 
            borderRadius: '6px',
            border: '1px solid #c3e6cb'
          }}>
            <h4>🏭 Industry Coverage</h4>
            <p><strong>98 industries</strong> analyzed for workload patterns and trends</p>
          </div>
        </div>
      </section>

      <footer style={{ marginTop: '3rem' }}>
        <p>Story 4 Data Source: CBS Netherlands Statistics | Work Intensification Analysis</p>
      </footer>
    </div>
  );
}

export default WorkIntensificationPage;