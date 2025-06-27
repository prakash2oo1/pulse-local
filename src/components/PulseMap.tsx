import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Submission, TopicCluster, UserLocation } from '../types';
import { MapPin, Zap, Users, TrendingUp } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface PulseMapProps {
  submissions: Submission[];
  clusters: TopicCluster[];
  userLocation: UserLocation | null;
  onMapClick?: (lat: number, lng: number) => void;
}

const SentimentCircle: React.FC<{ submission: Submission }> = ({ submission }) => {
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.2) return '#10B981'; // Green for positive
    if (sentiment < -0.2) return '#EF4444'; // Red for negative
    return '#6B7280'; // Gray for neutral
  };

  return (
    <Circle
      center={[submission.latitude, submission.longitude]}
      radius={50 + submission.sentiment.magnitude * 100}
      pathOptions={{
        color: getSentimentColor(submission.sentiment.score),
        fillColor: getSentimentColor(submission.sentiment.score),
        fillOpacity: 0.3 + submission.sentiment.magnitude * 0.4,
        weight: 2,
      }}
    >
      <Popup>
        <div className="p-2 max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: getSentimentColor(submission.sentiment.score) }}
            />
            <span className="text-sm font-medium capitalize">{submission.sentiment.label}</span>
          </div>
          <p className="text-sm text-gray-700 mb-2">{submission.text}</p>
          {submission.topics && submission.topics.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {submission.topics.map(topic => (
                <span key={topic} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                  {topic}
                </span>
              ))}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">
            {submission.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </Popup>
    </Circle>
  );
};

const TopicClusterMarker: React.FC<{ cluster: TopicCluster }> = ({ cluster }) => {
  const getClusterIcon = () => {
    return L.divIcon({
      html: `
        <div class="flex items-center justify-center w-8 h-8 bg-purple-500 text-white rounded-full shadow-lg border-2 border-white ${cluster.emergent ? 'animate-pulse' : ''}">
          <span class="text-xs font-bold">${cluster.submissions.length}</span>
        </div>
      `,
      className: 'custom-cluster-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  return (
    <Marker
      position={cluster.center}
      icon={getClusterIcon()}
    >
      <Popup>
        <div className="p-3 max-w-sm">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            <h3 className="font-semibold text-purple-800">{cluster.label}</h3>
            {cluster.emergent && (
              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded animate-pulse">
                Trending
              </span>
            )}
          </div>
          <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{cluster.submissions.length} posts</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              <span>{Math.round(cluster.strength * 100)}% intensity</span>
            </div>
          </div>
          <div className="space-y-2">
            {cluster.submissions.slice(0, 3).map(submission => (
              <div key={submission.id} className="text-sm p-2 bg-gray-50 rounded">
                "{submission.text.slice(0, 80)}..."
              </div>
            ))}
            {cluster.submissions.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{cluster.submissions.length - 3} more posts
              </div>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const MapEvents: React.FC<{ onMapClick?: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  const map = useMap();

  useEffect(() => {
    if (onMapClick) {
      const handleClick = (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      };

      map.on('click', handleClick);
      return () => {
        map.off('click', handleClick);
      };
    }
  }, [map, onMapClick]);

  return null;
};

const PulseMap: React.FC<PulseMapProps> = ({ 
  submissions, 
  clusters, 
  userLocation, 
  onMapClick 
}) => {
  const defaultCenter: [number, number] = [40.7128, -74.0060]; // NYC
  const center = userLocation ? [userLocation.latitude, userLocation.longitude] as [number, number] : defaultCenter;

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={14}
        className="w-full h-full"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapEvents onMapClick={onMapClick} />
        
        {/* User location */}
        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>
              <div className="flex items-center gap-2 p-1">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium">Your Location</span>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Sentiment circles */}
        {submissions.map(submission => (
          <SentimentCircle key={submission.id} submission={submission} />
        ))}
        
        {/* Topic clusters */}
        {clusters.map(cluster => (
          <TopicClusterMarker key={cluster.id} cluster={cluster} />
        ))}
      </MapContainer>
    </div>
  );
};

export default PulseMap;