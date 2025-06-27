import { Submission, TopicCluster } from '../types';

// Simulated AI sentiment analysis
export const analyzeSentiment = (text: string) => {
  // Simple sentiment analysis simulation
  const positiveWords = ['amazing', 'great', 'love', 'beautiful', 'incredible', 'wonderful', 'awesome', 'fantastic', 'perfect', 'happy', 'joy', 'excited'];
  const negativeWords = ['terrible', 'awful', 'hate', 'bad', 'horrible', 'frustrating', 'annoying', 'disgusting', 'angry', 'sad', 'disappointed'];
  
  const words = text.toLowerCase().split(/\s+/);
  let sentimentScore = 0;
  let magnitude = 0;
  
  words.forEach(word => {
    if (positiveWords.some(pw => word.includes(pw))) {
      sentimentScore += 0.3;
      magnitude += 0.2;
    }
    if (negativeWords.some(nw => word.includes(nw))) {
      sentimentScore -= 0.3;
      magnitude += 0.2;
    }
  });
  
  // Add some randomness to make it more realistic
  sentimentScore += (Math.random() - 0.5) * 0.4;
  magnitude = Math.max(0.1, Math.min(1, magnitude + Math.random() * 0.3));
  
  const label = sentimentScore > 0.1 ? 'positive' : sentimentScore < -0.1 ? 'negative' : 'neutral';
  
  return {
    score: Math.max(-1, Math.min(1, sentimentScore)),
    magnitude,
    label: label as 'positive' | 'negative' | 'neutral',
  };
};

// Simulated topic extraction
export const extractTopics = (text: string): string[] => {
  const topicKeywords = {
    'Street Food': ['food', 'restaurant', 'eating', 'delicious', 'taste', 'hungry', 'cafe', 'bakery', 'smell'],
    'Live Music': ['music', 'band', 'concert', 'singing', 'guitar', 'jazz', 'performance', 'sound'],
    'Traffic & Transit': ['traffic', 'car', 'bus', 'subway', 'driving', 'parking', 'rush', 'commute'],
    'Shopping': ['shopping', 'store', 'buy', 'market', 'sale', 'retail', 'boutique'],
    'Parks & Nature': ['park', 'tree', 'garden', 'nature', 'peaceful', 'quiet', 'green', 'bird'],
    'Nightlife': ['bar', 'club', 'party', 'drinks', 'night', 'dancing', 'crowd'],
    'Safety': ['police', 'safe', 'dangerous', 'security', 'crime', 'officer'],
    'Community': ['people', 'friendly', 'neighborhood', 'community', 'local', 'gathering'],
  };
  
  const topics: string[] = [];
  const lowerText = text.toLowerCase();
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      topics.push(topic);
    }
  });
  
  return topics;
};

// Simulated topic clustering
export const clusterSubmissions = (submissions: Submission[]): TopicCluster[] => {
  const clusters: TopicCluster[] = [];
  const recentSubmissions = submissions.filter(s => 
    Date.now() - s.timestamp.getTime() < 3600000 // Last hour
  );
  
  // Group by geographic proximity and topics
  const gridSize = 0.01; // ~1km
  const grid: { [key: string]: Submission[] } = {};
  
  recentSubmissions.forEach(submission => {
    const gridX = Math.floor(submission.latitude / gridSize);
    const gridY = Math.floor(submission.longitude / gridSize);
    const key = `${gridX},${gridY}`;
    
    if (!grid[key]) grid[key] = [];
    grid[key].push(submission);
  });
  
  Object.entries(grid).forEach(([key, cellSubmissions]) => {
    if (cellSubmissions.length < 3) return; // Need at least 3 submissions
    
    // Find common topics
    const topicCounts: { [topic: string]: number } = {};
    cellSubmissions.forEach(submission => {
      submission.topics?.forEach(topic => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });
    
    const dominantTopic = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (dominantTopic && dominantTopic[1] >= 2) {
      const avgLat = cellSubmissions.reduce((sum, s) => sum + s.latitude, 0) / cellSubmissions.length;
      const avgLng = cellSubmissions.reduce((sum, s) => sum + s.longitude, 0) / cellSubmissions.length;
      
      clusters.push({
        id: `cluster-${key}-${dominantTopic[0]}`,
        label: dominantTopic[0],
        center: [avgLat, avgLng],
        radius: 500, // meters
        submissions: cellSubmissions.filter(s => s.topics?.includes(dominantTopic[0])),
        strength: Math.min(1, dominantTopic[1] / 5),
        emergent: dominantTopic[1] >= 3,
      });
    }
  });
  
  return clusters;
};