import React from 'react';
import './UIComponents.css';

export const Input = ({ ...props }) => (
  <input className="custom-input" {...props} />
);

export const Button = ({ children, ...props }) => (
  <button className="custom-button" {...props}>
    {children}
  </button>
);