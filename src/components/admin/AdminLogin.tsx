import React, { useState } from 'react';
import { supabase } from '../../services/supabaseClient';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onClose?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLoginSuccess, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError('อีเมล หรือ รหัสผ่าน ไม่ถูกต้อง! (ลองอีกครั้ง)');
      } else if (data.session) {
        onLoginSuccess();
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อระบบ');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative'
    }}>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            backgroundColor: '#edf2f7',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="กลับไปยังหน้าเว็บไซต์"
        >
          ✕
        </button>
      )}

      <div style={{
        backgroundColor: '#ffffff',
        padding: '36px 32px',
        borderRadius: '16px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '100%',
        maxWidth: '440px',
        border: '1px solid #e2e8f0'
      }}>
        {/* Logo Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <img
            src="/images/logo.png"
            alt="Logo"
            style={{ height: '70px', margin: '0 auto 12px auto', display: 'block', objectFit: 'contain' }}
          />
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#004088',
            lineHeight: '1.3',
            margin: 0
          }}>
            ระบบจัดการเว็บไซต์<br />
            <span style={{ fontSize: '1.1rem', fontWeight: '600', color: '#4a5568' }}>
              แอทสมุทรสาคร (สาขามหาชัย)
            </span>
          </h2>
          <div style={{ fontSize: '0.85rem', color: '#718096', marginTop: '6px', fontWeight: '500' }}>
            Admin Control Panel
          </div>
        </div>

        {error && (
          <div style={{
            backgroundColor: '#fff5f5',
            color: '#e53e3e',
            border: '1px solid #fed7d7',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            textAlign: 'center',
            marginBottom: '20px',
            fontWeight: '500'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div>
            <label style={{ display: 'block', color: '#2d3748', fontWeight: '600', marginBottom: '6px', fontSize: '0.95rem' }}>
              Email (อีเมล)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                border: '1px solid #cbd5e0',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              placeholder="กรอกอีเมลแอดมิน"
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#2d3748', fontWeight: '600', marginBottom: '6px', fontSize: '0.95rem' }}>
              Password (รหัสผ่าน)
            </label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e0',
                  borderRadius: '8px',
                  padding: '10px 42px 10px 14px',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                placeholder="กรอกรหัสผ่าน"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '4px',
                  color: '#4a5568',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  userSelect: 'none'
                }}
                title={showPassword ? 'ซ่อนรหัสผ่าน' : 'แสดงรหัสผ่าน'}
              >
                {showPassword ? '👁️' : '🙈'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              backgroundColor: isLoading ? '#cbd5e0' : '#004088',
              color: isLoading ? '#718096' : '#ffffff',
              fontWeight: 'bold',
              fontSize: '1.05rem',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
              transition: 'background-color 0.2s',
              boxShadow: isLoading ? 'none' : '0 4px 6px -1px rgba(0, 64, 136, 0.3)'
            }}
          >
            {isLoading ? '⏳ กำลังเข้าสู่ระบบ...' : '🔐 เข้าสู่ระบบ (Login)'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', borderTop: '1px solid #edf2f7', paddingTop: '16px' }}>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#4a5568',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              ← กลับไปยังหน้าหลักเว็บไซต์
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
