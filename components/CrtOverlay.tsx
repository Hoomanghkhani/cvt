import React from 'react';

const CrtOverlay: React.FC = () => {
  return (
    <>
      {/* Scanlines */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none h-full w-full opacity-20"
        style={{
            background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
            backgroundSize: '100% 2px, 3px 100%'
        }} 
      />
      {/* Vignette */}
      <div 
        className="fixed inset-0 z-40 pointer-events-none h-full w-full"
        style={{
            background: 'radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%)'
        }}
      />
    </>
  );
};

export default CrtOverlay;
