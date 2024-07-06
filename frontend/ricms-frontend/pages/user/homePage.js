import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Link from 'next/link';
import 'bootstrap-icons/font/bootstrap-icons.css';


function Homepage() {
  return (
    <div className="d-flex flex-column font font-monospace" style={{ minHeight: '100vh' }}>
      {/* Navigation Bar */}
      <nav className="navbar navbar-dark bg-dark">
        <Link href="/">
          <a className="navbar-brand mx-2">RICA INSPECTION MANAGEMENT SYSTEM</a>
        </Link>
        <div className="ml-auto">
          <Link href="/user/login">
            <a className="btn btn-primary mx-2">
              <div className='d-flex flex-row'>
              <i class="bi bi-box-arrow-in-right mx-2"></i>
              <span>Login</span>
              </div>
            </a>
          </Link>
          <Link href="/user/signup">
            <a className="btn btn-outline-primary mx-2">
              <div className='d-flex flex-row'>
              <i class="bi bi-archive mx-2"></i>
              <span>Sign up</span>
              </div>
            </a>
          </Link>
        </div>
      </nav>

      {/* Content */}
      <div className="flex-grow-1">
        {/* Jumbotron with Large Image */}
        <div className="jumbotron jumbotron-fluid" style={{ backgroundImage: 'url("/images/image3.jpg")', backgroundSize: 'fit', color: 'white', textAlign: 'center', padding: '160px 0' }}>
          <div className="container">
            <h1 className="display-4">Welcome to RCMS</h1>
            <p className="lead">Explore our services and features.</p>
            <Link href="/user/login">
              <a className="btn btn-primary btn-lg" role="button">
              <div className='d-flex flex-row'>
              <i class="bi bi-box-arrow-in-right mx-2"></i>
              <span>Sign in</span>
              </div>
              </a>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="footer bg-dark text-white text-center py-3">
        <div className="container">
          <p>Kigali,Rwanda</p>
          <p>At RCMS, we specialize in delivering innovative solutions tailored to your needs.
            Our expertise lies in streamlining processes for agro-chemical producers,
            ensuring they obtain product documents swiftly and effortlessly.
            With our commitment to efficiency, we empower agro-chemical producers
            to access crucial documentation promptly, facilitating a seamless
            workflow for their operations.</p>
        </div>
      </div>
      <div className="align-items-center" style={{ height: "60px" }}>
        <div className="copyright text-center text-xl-left text-muted">
          <div
            className="font-weight-bold ml-1 mt-2"
          >
            <p style={{ fontSize: "1.5em", fontStyle: "bold" }}>© RICA-RCMS {new Date().getFullYear()}{" "} - All rights reserved</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
