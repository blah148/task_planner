import React from 'react';
import './loader.css';

function Loader ({ isLoading }) {
  
  return (
  <div className="loaderContainer">
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
