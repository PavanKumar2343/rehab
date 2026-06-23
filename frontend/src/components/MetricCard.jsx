import React from 'react';

const MetricCard = ({ title, value, icon: Icon, description, trendColor = 'text-muted' }) => {
  return (
    <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '220px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {title}
        </span>
        {Icon && (
          <div style={{ padding: '8px', borderRadius: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)', color: 'var(--primary)' }}>
            <Icon size={18} />
          </div>
        )}
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: '700', fontFamily: 'var(--font-display)', color: 'var(--text-main)' }}>
        {value}
      </div>
      {description && (
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {description}
        </span>
      )}
    </div>
  );
};

export default MetricCard;
