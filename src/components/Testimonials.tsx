import React, { useState, useEffect } from 'react';
import type { Translations } from '../i18n/translations';

interface UserReview {
  id: string;
  email: string;
  name: string;
  role: string;
  rating: number;
  text: string;
  createdAt: string;
}

interface TestimonialsProps {
  t: Translations;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ t }) => {
  const [userReviews, setUserReviews] = useState<UserReview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Review Form States
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState('ผู้เข้าพักรายวัน');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load saved user reviews from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('custom_user_reviews');
      if (saved) {
        setUserReviews(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load user reviews', e);
    }
  }, []);

  // Helper: Auto-extract display name from Email
  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (val.includes('@')) {
      const usernamePart = val.split('@')[0];
      // Format john.doe or john_doe into "คุณ John Doe"
      const formatted = usernamePart
        .split(/[\._\-]/)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
      setDisplayName(`คุณ ${formatted}`);
    } else if (!val) {
      setDisplayName('');
    }
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !reviewText.trim()) {
      alert('กรุณากรอกอีเมลและข้อความรีวิวให้ครบถ้วนก่อนส่งครับ');
      return;
    }

    const newReview: UserReview = {
      id: Date.now().toString(),
      email,
      name: displayName || 'คุณ ผู้เข้าพัก',
      role,
      rating,
      text: reviewText,
      createdAt: new Date().toLocaleDateString('th-TH')
    };

    const updated = [newReview, ...userReviews];
    setUserReviews(updated);
    try {
      localStorage.setItem('custom_user_reviews', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save user review', e);
    }

    // Reset Form & Close Modal
    setEmail('');
    setDisplayName('');
    setReviewText('');
    setRating(5);
    setIsModalOpen(false);

    // Toast Notification
    setToastMessage('🎉 ขอบคุณสำหรับรีวิวของคุณ! รีวิวได้รับการบันทึกเรียบร้อยแล้ว');
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Combined Review List (User Submitted Reviews first, followed by translation default reviews)
  const defaultReviews = (t.reviewsList || []).map(r => ({
    id: `default-${r.name}`,
    email: '',
    name: r.name,
    role: r.role,
    rating: r.rating || 5,
    text: r.text,
    createdAt: ''
  }));

  const allReviews = [...userReviews, ...defaultReviews];

  return (
    <section id="reviews" className="section" style={{ backgroundColor: 'var(--bg-offset)' }}>
      <div className="container">
        
        {/* Header Section */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '32px'
        }}>
          <h2 className="section-title">{t.reviewsTitle}</h2>
          <p className="section-subtitle">{t.reviewsSubtitle}</p>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-hotel-primary"
            style={{
              marginTop: '16px',
              padding: '12px 28px',
              fontSize: '1rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer'
            }}
          >
            <span>✍️</span>
            <span>เขียนรีวิวของคุณ (Write a Review)</span>
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="alert-toast" style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 999 }}>
            {toastMessage}
          </div>
        )}

        {/* Reviews Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginTop: '20px'
        }}>
          {allReviews.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--white)',
                padding: '28px 24px',
                borderRadius: 'var(--border-radius-md)',
                border: item.email ? '2px solid #3b82f6' : '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative'
              }}
            >
              {item.email && (
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  backgroundColor: '#ebf8ff',
                  color: '#2b6cb0',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '3px 8px',
                  borderRadius: '12px',
                  border: '1px solid #bee3f8'
                }}>
                  ✨ รีวิวจากผู้เข้าพักจริง
                </span>
              )}

              <div>
                <div style={{ color: '#f59e0b', fontSize: '1.2rem', marginBottom: '12px' }}>
                  {'★'.repeat(item.rating || 5)}
                  <span style={{ color: '#cbd5e1' }}>{'★'.repeat(5 - (item.rating || 5))}</span>
                </div>
                <p style={{ color: 'var(--text-color)', fontSize: '0.98rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '20px' }}>
                  "{item.text}"
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', borderTop: '1px solid #edf2f7', paddingTop: '16px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  backgroundColor: item.email ? '#3b82f6' : 'var(--primary-light)',
                  color: item.email ? '#ffffff' : 'var(--primary-color)',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem'
                }}>
                  {item.name.replace(/^คุณ\s*/, '').charAt(0) || 'ค'}
                </div>
                <div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-color)' }}>{item.name}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{item.role} {item.createdAt ? `• ${item.createdAt}` : ''}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Review Modal Dialog */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div className="booking-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '520px' }}>
              
              <div className="booking-modal-header">
                <div className="modal-header-brand">
                  <span className="hotel-badge-pill">✨ @Samutsakorn Mahachai</span>
                  <h3>เขียนรีวิวความประทับใจ</h3>
                </div>
                <button className="modal-close-circle" onClick={() => setIsModalOpen(false)}>✕</button>
              </div>

              <form onSubmit={handleSubmitReview} className="booking-modal-body">
                
                {/* Email Input */}
                <div className="booking-input-group full-width" style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>✉️ อีเมลของคุณ (Email)</label>
                  <input
                    type="email"
                    required
                    placeholder="ตัวอย่าง: somchai@gmail.com"
                    value={email}
                    onChange={e => handleEmailChange(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      marginTop: '4px'
                    }}
                  />
                  <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                    * ระบบจะนำชื่อจากอีเมลมาสร้างชื่อรีวิวให้อัตโนมัติ สามารถแก้ไขชื่อด้านล่างได้
                  </span>
                </div>

                {/* Display Name Input */}
                <div className="booking-input-group full-width" style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>👤 ชื่อที่ต้องการใช้แสดงในรีวิว</label>
                  <input
                    type="text"
                    required
                    placeholder="เช่น คุณ สมชาย ส."
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      marginTop: '4px'
                    }}
                  />
                </div>

                {/* Guest Type Selector */}
                <div className="booking-input-group full-width" style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>🏢 ประเภทผู้เข้าพัก</label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      marginTop: '4px',
                      backgroundColor: '#ffffff'
                    }}
                  >
                    <option value="ผู้เข้าพักรายวัน">🏨 ผู้เข้าพักรายวัน (Daily Guest)</option>
                    <option value="ผู้เช่ารายเดือน">🏢 ผู้เช่ารายเดือน (Monthly Tenant)</option>
                  </select>
                </div>

                {/* Star Rating Interactive Selector */}
                <div className="booking-input-group full-width" style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>⭐ ให้คะแนนความประทับใจ</label>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '1.8rem', cursor: 'pointer' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        style={{
                          color: (hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1',
                          transition: 'color 0.15s ease, transform 0.15s ease',
                          transform: (hoverRating || rating) >= star ? 'scale(1.1)' : 'scale(1)'
                        }}
                      >
                        ★
                      </span>
                    ))}
                    <span style={{ fontSize: '0.9rem', color: '#64748b', alignSelf: 'center', marginLeft: '8px', fontWeight: '600' }}>
                      ({rating}/5 ดาว)
                    </span>
                  </div>
                </div>

                {/* Review Textarea */}
                <div className="booking-input-group full-width" style={{ marginBottom: '20px' }}>
                  <label style={{ fontSize: '0.9rem', fontWeight: '700' }}>💬 ข้อความรีวิวประสบการณ์ของคุณ</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="แบ่งปันความประทับใจเกี่ยวกับการเข้าพัก เช่น ความสะอาด แอร์ ความปลอดภัย หรือการบริการ..."
                    value={reviewText}
                    onChange={e => setReviewText(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      marginTop: '4px',
                      resize: 'vertical',
                      lineHeight: '1.5'
                    }}
                  ></textarea>
                </div>

                {/* Form Buttons */}
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="btn-modal-close"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="btn-hotel-primary"
                    style={{ padding: '10px 24px', fontSize: '0.95rem' }}
                  >
                    ✨ ส่งรีวิวของคุณ
                  </button>
                </div>

              </form>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
