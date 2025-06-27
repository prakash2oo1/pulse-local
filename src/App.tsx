import React, { useState, useEffect } from 'react';
import { Zap, Menu, X, BarChart3, Clock, Map } from 'lucide-react';
import PulseMap from './components/PulseMap';
import SubmissionForm from './components/SubmissionForm';
import PulseStats from './components/PulseStats';
import RecentPulses from './components/RecentPulses';
import { Submission, TopicCluster } from './types';
import { mockSubmissions } from './data/mockData';

type ViewMode = 'map' | 'stats' | 'recent';

function App() {
  const [submissions, setSubmissions] = useState<Submission[]>(mockSubmissions);
  const [clusters, setClusters] = useState<TopicCluster[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSubmit = async (text: string) => {
    setIsSubmitting(true);
    
    try {
      // Removed geolocation
      const fallbackSubmission: Submission = {
        id: `local-${Date.now()}`,
        text,
        latitude: 0,
        longitude: 0,
        timestamp: new Date(),
        sentiment: { score: 0, magnitude: 0.5, label: 'neutral' },
        topics: [],
      };
      
      setSubmissions(prev => [fallbackSubmission, ...prev]);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMobileView = () => {
    switch (viewMode) {
      case 'stats':
        return <PulseStats submissions={submissions} clusters={clusters} />;
      case 'recent':
        return <RecentPulses submissions={submissions} />;
      default:
        return (
          <div className="h-full relative">
            <div className="absolute inset-0">
              <PulseMap
                submissions={submissions}
                clusters={clusters}
                userLocation={null} // Removed geolocation
              />
            </div>
            <div className="absolute bottom-4 left-4 right-4 z-10">
              <SubmissionForm
                userLocation={null} // Removed geolocation
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Local Pulse</h1>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'map' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Map className="w-4 h-4" />
                <span>Map</span>
              </button>
              <button
                onClick={() => setViewMode('stats')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'stats' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span>Stats</span>
              </button>
              <button
                onClick={() => setViewMode('recent')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                  viewMode === 'recent' ? 'bg-purple-100 text-purple-700' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Recent</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    setViewMode('map');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'map' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
                  }`}
                >
                  <Map className="w-4 h-4" />
                  <span>Map View</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('stats');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'stats' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Statistics</span>
                </button>
                <button
                  onClick={() => {
                    setViewMode('recent');
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    viewMode === 'recent' ? 'bg-purple-100 text-purple-700' : 'text-gray-600'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>Recent Pulses</span>
                </button>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Mobile View */}
        <div className="md:hidden h-[calc(100vh-120px)]">
          {renderMobileView()}
        </div>

        {/* Desktop View */}
        <div className="hidden md:grid md:grid-cols-4 gap-6 h-[calc(100vh-120px)]">
          {/* Left Sidebar */}
          <div className="space-y-6 overflow-y-auto">
            <SubmissionForm
              userLocation={null} // Removed geolocation
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
            />
            <PulseStats submissions={submissions} clusters={clusters} />
          </div>

          {/* Map */}
          <div className="col-span-2 relative">
            <div className="absolute inset-0 rounded-2xl overflow-hidden border border-gray-200 shadow-xl">
              <PulseMap
                submissions={submissions}
                clusters={clusters}
                userLocation={null} // Removed geolocation
              />
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="overflow-y-auto">
            <RecentPulses submissions={submissions} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;