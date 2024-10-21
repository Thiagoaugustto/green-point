import React from 'react';
import { Link } from 'react-router-dom';

import './styles.css';

import logo from '../../assets/logo.png';

const Home = () => {
  return (
    <div id="page-home">
      <div className="content">
        <header>
          <img className="logo" src={logo} alt="Green Point" />
        </header>

        <main>
          <h1>Seu guia para coleta de resíduos sustentável.</h1>
          <p>Conectamos pessoas a soluções de coleta de resíduos de forma rápida e simples.</p>

          <Link to="/create-point">
            <strong>Cadastre um ponto de coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  )
}

export default Home;