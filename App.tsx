import React from 'react';
import Terminal from './components/Terminal';
import CrtOverlay from './components/CrtOverlay';

const App: React.FC = () => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <CrtOverlay />
      <div className="relative z-10 h-full w-full">
        <Terminal />
      </div>
    </div>
  );
};

export default App;
