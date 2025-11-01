import React from 'react'
import Navbar from '@/components/Navbar';
import WelcomeSection from '@/components/voice/WelcomeSection';
import FeatureCards from '@/components/voice/FeatureCards';
import Widget from '../../components/voice/Widget';


function VoicePage() {
  return (
      <div className="min-h-screen bg-background">
          <Navbar />

          <div className="max-w-7xl mx-auto px-6 py-8 pt-24">
              <WelcomeSection />
              <FeatureCards />
              <Widget/>
          </div>
          
    </div>
  )
}

export default VoicePage