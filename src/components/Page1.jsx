import React from 'react'
import { Panel } from './Panel';
export const Page1 = () => {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <Panel />
      <div style={{
        flexGrow: 2,
        display: 'flex',
        transition: 'margin-left 0.2s',
      }}>
        <h1>Bienvenido al Sistema de Biblioteca</h1>
      </div>
    </div>
  );
}