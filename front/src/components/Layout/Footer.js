// components/Footer.js

import React from 'react';
import './Footer.css';
import githubLogo from '../../assets/image/github-logo.png'; // 깃허브 로고 이미지를 적절한 경로에서 불러와주세요.


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
