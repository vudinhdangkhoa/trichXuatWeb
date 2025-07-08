import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState('');

  
  const canvaColors = {
    primary: '#667eea',
    secondary: '#764ba2', 
    accent: '#ff6b6b',
    success: '#51cf66',
    warning: '#ffd93d',
    error: '#ff6b6b',
    info: '#74c0fc',
    background: 'rgba(255, 255, 255, 0.95)',
    cardBg: 'rgba(255, 255, 255, 0.9)',
    text: '#2d3748',
    textLight: '#4a5568',
    border: 'rgba(255, 255, 255, 0.2)'
  };

  const fetchData = async (urlToExtract) => {
    if (!urlToExtract) {
      setError('Vui lòng nhập URL');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5261/api/TrichXuat/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: urlToExtract
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(url);
  };

  const renderResults = () => {
    if (!data || !data.data) return null;

    const result = data.data;
    const images = result.imageFiles || [];
    const videos = result.videoFiles || [];
    const audios = result.audioFiles || [];
    const texts = result.textFiles || [];
    
    const totalFiles = images.length + videos.length + audios.length + texts.length;

    return (
      <div style={{ 
        marginTop: '20px', 
        padding: '24px', 
        background: canvaColors.cardBg,
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
        border: `1px solid ${canvaColors.border}`,
        backdropFilter: 'blur(10px)',
        maxWidth: '900px',
        width: '100%'
      }}>
        <h2 style={{ color: canvaColors.primary, marginBottom: '20px', fontSize: '28px', fontWeight: '700' }}>
           Kết quả trích xuất
        </h2>
        
       
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px', 
          borderRadius: '12px',
          marginBottom: '24px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '16px' }}> Tổng số file:</span>
            <span style={{ color: canvaColors.warning, fontWeight: 'bold', fontSize: '18px' }}>{totalFiles}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '16px' }}> URL đã trích xuất:</span>
            <span style={{ color: canvaColors.info, fontSize: '12px', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {url}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '16px' }}> Trạng thái:</span>
            <span style={{ color: canvaColors.success, fontWeight: 'bold', fontSize: '16px' }}>
              {data.success ? 'Thành công' : 'Thất bại'}
            </span>
          </div>
        </div>

        {/* Thống kê theo loại file */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '16px', 
          marginBottom: '24px' 
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #ffd93d 0%, #ffb347 100%)',
            padding: '20px', 
            borderRadius: '16px', 
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(255, 217, 61, 0.4)'
          }}>
           
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>Hình ảnh</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{images.length}</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
            padding: '20px', 
            borderRadius: '16px', 
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(255, 107, 107, 0.4)'
          }}>
         
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>Video</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{videos.length}</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
            padding: '20px', 
            borderRadius: '16px', 
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(167, 139, 250, 0.4)'
          }}>
       
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>Âm thanh</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{audios.length}</div>
          </div>
          <div style={{ 
            background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
            padding: '20px', 
            borderRadius: '16px', 
            textAlign: 'center',
            color: 'white',
            boxShadow: '0 4px 15px rgba(81, 207, 102, 0.4)'
          }}>
    
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>Văn bản</div>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{texts.length}</div>
          </div>
        </div>

        {/* Danh sách file chi tiết */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          
          {images.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: canvaColors.warning, marginBottom: '12px', fontSize: '20px' }}> Hình ảnh ({images.length})</h3>
              {images.map((filename, index) => (
                <div key={`img-${index}`} style={{
                  background: canvaColors.background,
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '12px',
                  border: `1px solid ${canvaColors.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <span style={{ color: canvaColors.text, fontSize: '14px' }}> {filename}</span>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '8px', 
                    background: 'linear-gradient(45deg, #51cf66, #40c057)',
                    color: 'white', 
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                     Thành công
                  </span>
                </div>
              ))}
            </div>
          )}

          
          {videos.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: canvaColors.accent, marginBottom: '12px', fontSize: '20px' }}> Video ({videos.length})</h3>
              {videos.map((filename, index) => (
                <div key={`vid-${index}`} style={{
                  background: canvaColors.background,
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '12px',
                  border: `1px solid ${canvaColors.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <span style={{ color: canvaColors.text, fontSize: '14px' }}> {filename}</span>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '8px', 
                    background: 'linear-gradient(45deg, #51cf66, #40c057)',
                    color: 'white', 
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                     Thành công
                  </span>
                </div>
              ))}
            </div>
          )}
          {
            audios.length>0 &&(
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: canvaColors.success, marginBottom: '12px', fontSize: '20px' }}> Âm thanh ({audios.length})</h3>
                {audios.map((filename, index) => (
                  <div key={`audio-${index}`} style={{
                    background: canvaColors.background,
                    padding: '12px',
                    marginBottom: '8px',
                    borderRadius: '12px',
                    border: `1px solid ${canvaColors.border}`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                  }}>
                    <span style={{ color: canvaColors.text, fontSize: '14px' }}> {filename}</span>
                    <span style={{ 
                      padding: '4px 12px', 
                      borderRadius: '8px', 
                      background: 'linear-gradient(45deg, #51cf66, #40c057)',
                      color: 'white', 
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                       Thành công
                    </span>
                  </div>
                ))}
              </div>
            )
          }
          {texts.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: canvaColors.primary, marginBottom: '12px', fontSize: '20px' }}> Văn bản ({texts.length})</h3>
              {texts.map((filename, index) => (
                <div key={`text-${index}`} style={{
                  background: canvaColors.background,
                  padding: '12px',
                  marginBottom: '8px',
                  borderRadius: '12px',
                  border: `1px solid ${canvaColors.border}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                }}>
                  <span style={{ color: canvaColors.text, fontSize: '14px' }}> {filename}</span>
                  <span style={{ 
                    padding: '4px 12px', 
                    borderRadius: '8px', 
                    background: 'linear-gradient(45deg, #51cf66, #40c057)',
                    color: 'white', 
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                     Thành công
                  </span>
                </div>
              ))}
            </div>
          )}
          {/* Audio và Text sections tương tự... */}
        </div>

        {/* Message từ server */}
        {data.message && (
          <div style={{
            marginTop: '20px',
            padding: '16px',
            background: 'linear-gradient(135deg, #51cf66 0%, #40c057 100%)',
            borderRadius: '12px',
            color: 'white',
            boxShadow: '0 4px 15px rgba(81, 207, 102, 0.4)'
          }}>
            💬 {data.message}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <h1 style={{ marginBottom: '40px', color: 'white', fontSize: '36px', fontWeight: '700' }}>
           Công cụ trích xuất nội dung Web
        </h1>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div className="canva-card" style={{ 
            marginBottom: '20px',
            padding: '32px',
            maxWidth: '600px'
          }}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder=" Nhập URL cần trích xuất (vd: https://example.com)"
              className="canva-input"
              style={{
                padding: '16px 20px',
                width: '100%',
                marginBottom: '16px',
                color: canvaColors.text,
                fontSize: '16px',
                border: `2px solid ${canvaColors.border}`,
                borderRadius: '12px'
              }}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              className="canva-button"
              style={{
                padding: '16px 32px',
                fontSize: '16px',
                fontWeight: '600',
                borderRadius: '12px',
                width: '100%'
              }}
            >
              {loading ? ' Đang xử lý...' : ' Trích xuất'}
            </button>
          </div>
        </form>
        
        {loading && (
          <div className="canva-card" style={{ 
            padding: '24px', 
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #74c0fc 0%, #339af0 100%)',
            color: 'white'
          }}>
            <p style={{ margin: 0, fontSize: '16px' }}> Đang tải dữ liệu...</p>
          </div>
        )}
        
        {error && (
          <div className="canva-card" style={{ 
            padding: '24px', 
            marginBottom: '20px',
            background: 'linear-gradient(135deg, #ff6b6b 0%, #ff5252 100%)',
            color: 'white'
          }}>
            <p style={{ margin: 0, fontSize: '16px' }}> Lỗi: {error}</p>
          </div>
        )}
        
        {renderResults()}
      </header>
    </div>
  );
}

export default App;