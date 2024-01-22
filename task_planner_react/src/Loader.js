import React from 'react';
import './loader.css';

function Loader ({ isLoading }) {
  

  return (
  <div>
   {isLoading && ( <div className="lds-ellipsis">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
   )}
  </div>
  )
}

export default Loader;
