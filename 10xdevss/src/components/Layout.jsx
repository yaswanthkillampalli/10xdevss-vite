import React from 'react';
import { Outlet } from 'react-router';
import Navbar from './Navbar';
import '../styles/components/Layout.css';

export default function Layout() {
  return (
    <div className="app-layout min-vh-100 d-flex flex-column">
      <Navbar />

      <main className="app-main flex-grow-1">
        <div className="app-content container-fluid px-3 px-sm-4 px-lg-4 px-xl-5">
          <Outlet />
        </div>
      </main>
    </div>
  );
}