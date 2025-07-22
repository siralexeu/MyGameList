import React from 'react';
import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-container">
      <header className="landing-header">
        <h1>MyGameList</h1>
        <p>Your ultimate tool to organize and track your gaming progress!</p>
      </header>

      <main className="main-content">
        <div className="sections-grid">
          <section className="section-card">
            <h2 className="section-title">What Is This?</h2>
            <p className="section-paragraph">
              <strong>MyGameList</strong> is a web application designed to help gamers efficiently track and organize their gaming experiences. Built with modern technologies like React, Node.js, and SQLite, it supports seamless collaboration for desktop, mobile devices, and tablets.
            </p>
          </section>

          <section className="section-card">
            <h2 className="section-title">Key Features</h2>
            <ul className="section-list">
              <li>Create and customize your personal game library with detailed information</li>
              <li>Track progress with status markers: Completed, Playing, Plan to Play, Dropped</li>
              <li>Rate games on a 1-10 scale and add personal notes</li>
              <li>Filter and sort by platform, status, or rating</li>
              <li>Explore other users' profiles and discover new games</li>
              <li>Modern, responsive design for all devices</li>
            </ul>
          </section>

          <section className="section-card">
            <h2 className="section-title">How It Works</h2>
            <div className="steps-container">
              <div className="step">
                <div className="step-title">Step 1: Join the Community</div>
                <div className="step-description">Create your free account and secure your gaming profile.</div>
              </div>
              <div className="step">
                <div className="step-title">Step 2: Build Your Library</div>
                <div className="step-description">Add games to your collection and specify platforms, status, and ratings.</div>
              </div>
              <div className="step">
                <div className="step-title">Step 3: Track Your Progress</div>
                <div className="step-description">Update game status and add notes about your experience.</div>
              </div>
              <div className="step">
                <div className="step-title">Step 4: Connect and Discover</div>
                <div className="step-description">Explore other users' profiles and discover new games!</div>
              </div>
            </div>
          </section>

        </div>
      </main>

      <footer className="landing-footer">
        <p>Ready to Start?</p>
        <p>Join thousands of gamers who have already organized their collections and discovered new favorites!</p>
        <div className="button-container">
          <a href="/home" className="landing-button">
            Explore Games
          </a>
          <a href="/login" className="landing-button secondary">
            Get Started
          </a>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;