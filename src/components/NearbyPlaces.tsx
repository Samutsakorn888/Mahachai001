import React from 'react';
import type { Translations } from '../i18n/translations';

interface NearbyPlacesProps {
  t: Translations;
}

export const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ t }) => {
  return (
    <section id="nearby" className="section" style={{ backgroundColor: 'var(--bg-offset)' }}>
      <div className="container">
        <h2 className="section-title">{t.nearbyTitle}</h2>
        <p className="section-subtitle">{t.nearbySubtitle}</p>

        <div className="nearby-grid">
          {(t.nearbyList || []).map((item, idx) => {
            const nearbyImages = [
              '/images/nearby_bigc.jpg',
              '/images/nearby_hospital.jpg',
              '/images/nearby_central.jpg',
              '/images/nearby_train.jpg'
            ];
            const imgUrl = (item as any).image || nearbyImages[idx];

            return (
              <div key={idx} className="nearby-card">
                <div>
                  <div className="nearby-card-header">
                    <div className="nearby-logo-wrapper">
                      {imgUrl ? (
                        <img src={imgUrl} alt={item.title} className="nearby-logo-img" />
                      ) : (
                        <span style={{ fontSize: '4rem' }}>{item.icon}</span>
                      )}
                    </div>
                    <span className="nearby-badge">{item.distance}</span>
                  </div>
                  <h3 className="nearby-item-title">{item.title}</h3>
                  <p className="nearby-item-desc">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Embedded Interactive Map Card */}
        <div className="interactive-map-card">
          <div className="map-info-header">
            <div>
              <h3>{t.mapHeading || '🗺️ แผนที่ตั้ง แอทสมุทรสาคร สาขามหาชัย'}</h3>
              <p>{t.mapSubheading || t.addressVal || 'ตรงข้าม Big C มหาชัย ถนนเศรษฐกิจ อำเภอเมือง จังหวัดสมุทรสาคร'}</p>
            </div>
            <a
              href="https://maps.app.goo.gl/x2v1CSky2nLNr7gZ9"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-gps"
            >
              {t.openGoogleMapsBtn || 'นำทางด้วย Google Maps'}
            </a>
          </div>

          <div className="map-iframe-wrapper">
            <iframe
              title="Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15513.75485458925!2d100.27014!3d13.54142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e2b9c7e0000001%3A0x1!2zQmlnIEMgTWFoYWNoYWk!5e0!3m2!1sth!2sth!4v1700000000000!5m2!1sth!2sth"
              width="100%"
              height="380"
              style={{ border: 0, borderRadius: '12px' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};
