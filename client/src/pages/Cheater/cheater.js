import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

const cheaterPage = (props) => {
    console.log('props on the cheater page', window.location)
    return (
      <div style={{ borderRadius: '5px', maxWidth: '420px', margin: 'auto'}}>
      <div style={{ backgroundColor: '#32EDAF', border: 'solid white 5px', borderRadius: '5px' }}>
        <h1 style={{ padding: '15px', fontFamily: 'Bangers', color: '#974BFE', textAlign: 'center'}}>Cheater!</h1>
        <h3 style={{ padding: '15px', fontFamily: 'Bangers', color: '#974BFE', textAlign: 'center'}}>Drink till you die.</h3>
      </div>
  </div>
    )
}

export default withRouter(cheaterPage);