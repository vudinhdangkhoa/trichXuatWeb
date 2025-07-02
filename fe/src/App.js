import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(''); // Thêm state cho URL input

  // Hàm gọi API với POST method
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

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData(url);
  };

  // Render kết quả trích xuất
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
        padding: '20px', 
        backgroundColor: '#282c34', 
        borderRadius: '10px',
        border: '1px solid #444',
        maxWidth: '900px',
        width: '100%'
      }}>
        <h2 style={{ color: '#61dafb', marginBottom: '15px' }}>
           Kết quả trích xuất
        </h2>
        
        {/* Thông tin tổng quan */}
        <div style={{ 
          backgroundColor: '#1e2124', 
          padding: '15px', 
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#ffffff' }}> Tổng số file:</span>
            <span style={{ color: '#4ade80', fontWeight: 'bold' }}>{totalFiles}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ color: '#ffffff' }}> URL đã trích xuất:</span>
            <span style={{ color: '#60a5fa', fontSize: '12px', maxWidth: '400px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {url}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#ffffff' }}> Trạng thái:</span>
            <span style={{ color: '#4ade80', fontWeight: 'bold' }}>
              {data.success ? 'Thành công' : 'Thất bại'}
            </span>
          </div>
        </div>

        {/* Thống kê theo loại file */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px', 
          marginBottom: '20px' 
        }}>
          <div style={{ backgroundColor: '#1e2124', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ color: '#f59e0b', fontSize: '24px', marginBottom: '5px' }}>ảnh</div>
            <div style={{ color: '#ffffff', fontSize: '14px' }}>Hình ảnh</div>
            <div style={{ color: '#f59e0b', fontSize: '20px', fontWeight: 'bold' }}>{images.length}</div>
          </div>
          <div style={{ backgroundColor: '#1e2124', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ color: '#ef4444', fontSize: '24px', marginBottom: '5px' }}>video</div>
            <div style={{ color: '#ffffff', fontSize: '14px' }}>Video</div>
            <div style={{ color: '#ef4444', fontSize: '20px', fontWeight: 'bold' }}>{videos.length}</div>
          </div>
          <div style={{ backgroundColor: '#1e2124', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ color: '#8b5cf6', fontSize: '24px', marginBottom: '5px' }}>âm thanh</div>
            <div style={{ color: '#ffffff', fontSize: '14px' }}>Âm thanh</div>
            <div style={{ color: '#8b5cf6', fontSize: '20px', fontWeight: 'bold' }}>{audios.length}</div>
          </div>
          <div style={{ backgroundColor: '#1e2124', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ color: '#10b981', fontSize: '24px', marginBottom: '5px' }}>văn bản</div>
            <div style={{ color: '#ffffff', fontSize: '14px' }}>Văn bản</div>
            <div style={{ color: '#10b981', fontSize: '20px', fontWeight: 'bold' }}>{texts.length}</div>
          </div>
        </div>

        {/* Danh sách file chi tiết */}
        <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
          {/* Hình ảnh */}
          {images.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#f59e0b', marginBottom: '10px' }}> Hình ảnh ({images.length})</h3>
              {images.map((filename, index) => (
                <div key={`img-${index}`} style={{
                  backgroundColor: '#1e2124',
                  padding: '10px',
                  marginBottom: '5px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#ffffff', fontSize: '14px' }}> {filename}</span>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: '#059669', 
                    color: 'white', 
                    fontSize: '12px' 
                  }}>
                     Thành công
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Video */}
          {videos.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>🎥 Video ({videos.length})</h3>
              {videos.map((filename, index) => (
                <div key={`vid-${index}`} style={{
                  backgroundColor: '#1e2124',
                  padding: '10px',
                  marginBottom: '5px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#ffffff', fontSize: '14px' }}>📎 {filename}</span>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: '#059669', 
                    color: 'white', 
                    fontSize: '12px' 
                  }}>
                     Thành công
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Âm thanh */}
          {audios.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#8b5cf6', marginBottom: '10px' }}> Âm thanh ({audios.length})</h3>
              {audios.map((filename, index) => (
                <div key={`aud-${index}`} style={{
                  backgroundColor: '#1e2124',
                  padding: '10px',
                  marginBottom: '5px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#ffffff', fontSize: '14px' }}> {filename}</span>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: '#059669', 
                    color: 'white', 
                    fontSize: '12px' 
                  }}>
                     Thành công
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Văn bản */}
          {texts.length > 0 && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#10b981', marginBottom: '10px' }}> Văn bản ({texts.length})</h3>
              {texts.map((filename, index) => (
                <div key={`txt-${index}`} style={{
                  backgroundColor: '#1e2124',
                  padding: '10px',
                  marginBottom: '5px',
                  borderRadius: '6px',
                  border: '1px solid #444',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ color: '#ffffff', fontSize: '14px' }}>📎 {filename}</span>
                  <span style={{ 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    backgroundColor: '#059669', 
                    color: 'white', 
                    fontSize: '12px' 
                  }}>
                     Thành công
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Message từ server */}
        {data.message && (
          <div style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: '#065f46',
            borderRadius: '6px',
            color: '#ffffff'
          }}>
             {data.message}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        
        <h1 style={{ marginBottom: '30px', color: '#61dafb' }}>
           Công cụ trích xuất nội dung Web
        </h1>
        
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <div style={{ 
            marginBottom: '20px',
            padding: '20px',
            backgroundColor: '#282c34',
            borderRadius: '10px',
            border: '1px solid #444'
          }}>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder=" Nhập URL cần trích xuất (vd: https://example.com)"
              style={{
                padding: '12px 16px',
                width: '400px',
                marginRight: '10px',
                color: 'black',
                border: '2px solid #61dafb',
                borderRadius: '6px',
                fontSize: '14px'
              }}
              required
            />
            <button 
              type="submit" 
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? '#666' : '#61dafb',
                color: loading ? '#ccc' : '#000',
                border: 'none',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? ' Đang xử lý...' : ' Trích xuất'}
            </button>
          </div>
        </form>
        
        {loading && (
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#1e3a8a', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0, color: '#ffffff' }}> Đang tải dữ liệu...</p>
          </div>
        )}
        
        {error && (
          <div style={{ 
            padding: '20px', 
            backgroundColor: '#dc2626', 
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0, color: '#ffffff' }}> Lỗi: {error}</p>
          </div>
        )}
        
        {renderResults()}
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: '40px', display: 'inline-block' }}
        >
          khoa
        </a>
      </header>
    </div>
  );
}

export default App;