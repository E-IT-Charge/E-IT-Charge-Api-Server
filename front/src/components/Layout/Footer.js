// components/Footer.js

import React from 'react';
import './Footer.css';
import githubLogo from '../../assets/image/github-logo.png'; // 깃허�? 로고 ?��미�??�? ?��?��?�� 경로?��?�� 불러???주세?��.


const Footer = () => {
  return (
    <div className="footer">
      
      <p>E-IT Charge All rights reserved.</p>
      {/* <a href="https://github.com/E-IT-Charge" target="_blank" rel="noreferrer">
        <img src={githubLogo} alt="github" />
      </a> */}
    </div>
  );
};

export default Footer;
