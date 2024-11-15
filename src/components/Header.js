import React from 'react';

const Header = () => {

  function showSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'flex';
  }

  function hideSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.style.display = 'none';
  }

  return (
    <header className="header">
      
<h1 className="header-title"></h1>
      <nav className="navbar">
        
        <ul className="sidebar" style={{ display: 'none' }}>
          <li>
            <a href="#" onClick={hideSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
                <path d="m249 849-42-42 231-231-231-231 42-42 231 231 231-231 42 42-231 231 231 231-42 42-231-231-231 231Z" />
              </svg>
            </a>
          </li>
          <li><a href='#'><strong>MANCALA</strong></a></li>
          <li><a href='Instructions.js'><strong>INSTRUCTIONS</strong></a></li>
          <li><a href='GameBoard.js'><strong>GAME SIMULATION</strong></a></li>
        </ul>
        <ul>
          <li><a href='#'><strong>MANCALA</strong></a></li>
          <li class="hideOnMobile"><a href='Instructions.js'><strong>INSTRUCTIONS</strong></a></li>
          <li class="hideOnMobile"><a href='GameBoard.js'><strong>GAME SIMULATION</strong></a></li>
          <li className="menu-button">
            <a href="#" onClick={showSidebar}>
              <svg xmlns="http://www.w3.org/2000/svg" height="48" viewBox="0 96 960 960" width="48">
                <path d="M120 816v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z" />
              </svg>
            </a>
          </li>
        </ul>
      </nav>
   
    </header>
  );
};

export default Header;
