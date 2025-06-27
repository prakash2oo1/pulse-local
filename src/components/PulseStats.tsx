import React from 'react';
import { Heart, Frown, Meh, TrendingUp, Users, Clock } from 'lucide-react';
import { Submission, TopicCluster } from '../types';

interface PulseStatsProps {
  submissions: Submission[];
  clusters: TopicCluster[];
}

const PulseStats: React.FC<PulseStatsProps> = ({ submissions, clusters }) => {
  // Calculate statistics
  const recentSubmissions = submissions.filter(s => 
    Date.now() - s.timestamp.getTime() < 3600000 // Last hour
  );

  const sentimentCounts = {
    positive: submissions.filter(s => s.sentiment.label === 'positive').length,
    negative: submissions.filter(s => s.sentiment.label === 'negative').length,
    neutral: submissions.filter(s => s.sentiment.label === 'neutral').length,
  };

  const totalSentimentScore = submissions.reduce((sum, s) => sum + s.sentiment.score, 0);
  const avgSentiment = submissions.length > 0 ? totalSentimentScore / submissions.length : 0;

  const emergentClusters = clusters.filter(c => c.emergent);
  const topTopics = clusters
    .sort((a, b) => b.submissions.length - a.submissions.length)
    .slice(0, 5);

  const getOverallMood = () => {
    if (avgSentiment > 0.2) return { label: 'Positive', icon: Heart, color: 'text-green-600' };
    if (avgSentiment < -0.2) return { label: 'Negative', icon: Frown, color: 'text-red-600' };
    return { label: 'Neutral', icon: Meh, color: 'text-gray-600' };
  };

  const mood = getOverallMood();
  const MoodIcon = mood.icon;

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-6 space-y-6">
      {/* Overall Mood */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Area Pulse</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center`}>
              <MoodIcon className={`w-6 h-6 ${mood.color}`} />
            </div>
            <div>
              <div className={`text-xl font-bold ${mood.color}`}>{mood.label}</div>
              <div className="text-sm text-gray-600">Overall vibe</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-800">{submissions.length}</div>
            <div className="text-sm text-gray-600">total pulses</div>
          </div>
        </div>
      </div>

      {/* Sentiment Breakdown */}
      <div>
        <h4 className="font-medium text-gray-700 mb-3">Sentiment Breakdown</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-sm text-gray-600">Positive</span>
            </div>
            <span className="text-sm font-medium">{sentimentCounts.positive}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-500"></div>
              <span className="text-sm text-gray-600">Neutral</span>
            </div>
            <span className="text-sm font-medium">{sentimentCounts.neutral}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-600">Negative</span>
            </div>
            <span className="text-sm font-medium">{sentimentCounts.negative}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-gray-600" />
          <h4 className="font-medium text-gray-700">Recent Activity</h4>
        </div>
        <div className="text-2xl font-bold text-purple-600 mb-1">
          {recentSubmissions.length}
        </div>
        <div className="text-sm text-gray-600">pulses in the last hour</div>
      </div>

      {/* Trending Topics */}
      {topTopics.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <h4 className="font-medium text-gray-700">Trending Topics</h4>
          </div>
          <div className="space-y-2">
            {topTopics.map((cluster, index) => (
              <div key={cluster.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-500 w-4">#{index + 1}</span>
                  <span className="text-sm text-gray-700">{cluster.label}</span>
                  {cluster.emergent && (
                    <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded animate-pulse">
                      Hot
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{cluster.submissions.length}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Emergent Clusters Alert */}
      {emergentClusters.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">Emerging Patterns</span>
          </div>
          <div className="text-xs text-yellow-700">
            {emergentClusters.length} new topic{emergentClusters.length > 1 ? 's' : ''} detected in your area
          </div>
        </div>
      )}
    </div>
  );
};

export default PulseStats;