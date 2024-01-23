import React, { useState } from 'react';
import './MobileStyling.css'; // Import your stylesheet

const TabComponent = () => {
  const [activeTab, setActiveTab] = useState('tab1');

  return (
    <div className="tab-component">
      <div className="tab-buttons">
        <button onClick={() => setActiveTab('tab1')} className={activeTab === 'tab1' ? 'active' : ''}>2 Dooz</button>
        <button onClick={() => setActiveTab('tab2')} className={activeTab === 'tab2' ? 'active' : ''}>Finished tasks</button>
      </div>
      <div className="tab-content">
        {activeTab === 'tab1' && <div className="content">
        </div>}
        {activeTab === 'tab2' && <div className="content">Content for Tab 2</div>}
      </div>
    </div>
  );
};

export default TabComponent;

