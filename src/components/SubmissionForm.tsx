import React, { useState } from 'react';
import { Send, MapPin, Loader2, Zap } from 'lucide-react';
import { UserLocation } from '../types';

interface SubmissionFormProps {
  userLocation: UserLocation | null;
  onSubmit: (text: string) => void;
  isSubmitting?: boolean;
}

const SubmissionForm: React.FC<SubmissionFormProps> = ({ 
  userLocation, 
  onSubmit, 
  isSubmitting = false 
}) => {
  const [text, setText] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && userLocation) {
      onSubmit(text.trim());
      setText('');
      setIsExpanded(false);
    }
  };

  const placeholders = [
    "What's the vibe here right now?",
    "Share what you're experiencing...",
    "How does this place feel?",
    "What's happening around you?",
    "Describe the energy here...",
  ];

  const randomPlaceholder = placeholders[Math.floor(Math.random() * placeholders.length)];

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-2xl shadow-xl p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">Share the Pulse</h3>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin className="w-3 h-3" />
              <span>
                {userLocation ? 'Location detected' : 'Getting location...'}
              </span>
            </div>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onFocus={() => setIsExpanded(true)}
            placeholder={randomPlaceholder}
            className={`w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ${
              isExpanded ? 'min-h-[120px]' : 'min-h-[60px]'
            }`}
            maxLength={280}
            disabled={!userLocation || isSubmitting}
          />
          
          <div className="absolute bottom-3 right-3 flex items-center gap-2">
            <span className={`text-xs ${text.length > 250 ? 'text-red-500' : 'text-gray-400'}`}>
              {text.length}/280
            </span>
            <button
              type="submit"
              disabled={!text.trim() || !userLocation || isSubmitting}
              className="w-8 h-8 bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white rounded-full flex items-center justify-center transition-colors duration-200"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {!userLocation && (
          <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Getting your location to share the local pulse...</span>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 leading-relaxed">
          Your submission is completely anonymous. We only use your location to map the collective vibe of the area.
        </div>
      </form>
    </div>
  );
};

export default SubmissionForm;