import React from 'react';
import { Clock, MapPin, Heart, Frown, Meh } from 'lucide-react';
import { Submission } from '../types';

interface RecentPulsesProps {
  submissions: Submission[];
  limit?: number;
}

const RecentPulses: React.FC<RecentPulsesProps> = ({ submissions, limit = 10 }) => {
  const recentSubmissions = submissions
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, limit);

  const getSentimentIcon = (label: string) => {
    switch (label) {
      case 'positive': return Heart;
      case 'negative': return Frown;
      default: return Meh;
    }
  };

  const getSentimentColor = (label: string) => {
    switch (label) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date().getTime();
    const diff = now - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  if (recentSubmissions.length === 0) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Pulses</h3>
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-8 h-8 mx-auto mb-3 text-gray-400" />
          <p>No pulses yet in this area</p>
          <p className="text-sm">Be the first to share the vibe!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-800">Recent Pulses</h3>
      </div>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {recentSubmissions.map((submission) => {
          const SentimentIcon = getSentimentIcon(submission.sentiment.label);
          
          return (
            <div key={submission.id} className="border-l-4 border-gray-200 pl-4 py-2 hover:border-purple-400 transition-colors duration-200">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <SentimentIcon className={`w-4 h-4 ${getSentimentColor(submission.sentiment.label)}`} />
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {submission.sentiment.label}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(submission.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-gray-700 mb-2 leading-relaxed">
                {submission.text}
              </p>
              
              {submission.topics && submission.topics.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {submission.topics.map((topic) => (
                    <span
                      key={topic}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              )}
              
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>
                  {submission.latitude.toFixed(4)}, {submission.longitude.toFixed(4)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentPulses;