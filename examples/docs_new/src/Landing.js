import React from 'react';
import styled from 'styled-components';
import { Link, storage } from 'react-easy-stack';

const Landing = styled.header`
  max-width: 800px;
  margin: 50px auto;
  padding: 10px;

  h1,
  h3,
  p {
    margin: 0;
    padding: 0;
  }

  .title {
    position: relative;
    text-align: center;

    img {
      width: 300px;
      max-width: 90%;
      margin: 25px 0;
    }

    h1 {
      font-size: 45px;
    }

    h3 {
      font-size: 25.5px;
    }

    .home-link {
      position: absolute;
      top: 160px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 50;
      padding: 22px 17px;
      font-size: 30px;
      font-weight: bold;
      color: white;
      background: rgb(96, 219, 251);
      cursor: pointer;
    }
  }

  .description {
    font-size: 21px;
  }
`;

const onClick = () => (storage.landed = true);

export default () => (
  <Landing>
    <div className="title">
      <h1>React Simple Stack</h1>
      <h3>A solution for practical developers</h3>
      <img src="/assets/logo.svg" />
      <Link to="/home" onClick={onClick} className="home-link">
        GET STARTED
      </Link>
    </div>
    <p className="description">
      A stack, which values product quality before code beauty. Simple Stack
      apps should effortlessly meet subtle user expectations - like browser
      history and URL integration, animated page transitions and routing without
      a cascade of loaders.
    </p>
  </Landing>
);
