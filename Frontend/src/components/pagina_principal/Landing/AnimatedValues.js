import React from 'react';
import '../../../styles/home.css';

function AnimatedValues({ values }) {
  return (
    <div className="values-list">
      {values.map((value, index) => (
        <div key={index} className="value-item">
          <div className="checkmark-placeholder">
            <svg
              className="checkmark"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          <p className="value-text">{value}</p>
        </div>
      ))}
    </div>
  );
}

export default AnimatedValues;