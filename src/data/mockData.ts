import { Submission, TopicCluster } from '../types';
import { analyzeSentiment, extractTopics } from '../utils/aiProcessing';

// Generate mock submissions for demonstration
const generateMockSubmissions = (): Submission[] => {
  const mockTexts = [
    "Amazing street musician playing jazz here, the whole block feels alive!",
    "Traffic is absolutely terrible right now, been stuck for 20 minutes",
    "The coffee shop here has the most incredible smell of fresh bread",
    "Beautiful sunset over the park, so peaceful and quiet",
    "Crowded but energetic night market, great food everywhere",
    "Police presence is heavy today, feels a bit tense",
    "Local community gathering in the square, really friendly vibes",
    "New boutique opened with amazing fashion, love the local shopping scene",
    "Street food vendor has the best tacos I've ever tasted",
    "Concert in the park tonight, hundreds of people dancing",
    "Rush hour chaos but the energy is infectious",
    "Quiet corner cafe perfect for working, great atmosphere",
    "Farmers market buzzing with activity and fresh produce",
    "Late night food trucks creating a party atmosphere",
    "Morning joggers everywhere, healthy community vibe"
  ];

  // NYC area coordinates (around Manhattan)
  const baseLocation = { lat: 40.7128, lng: -74.0060 };
  const submissions: Submission[] = [];

  mockTexts.forEach((text, index) => {
    // Add some randomness to coordinates
    const lat = baseLocation.lat + (Math.random() - 0.5) * 0.02;
    const lng = baseLocation.lng + (Math.random() - 0.5) * 0.02;
    
    // Generate timestamps over the last 4 hours
    const hoursAgo = Math.random() * 4;
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000);
    
    const sentiment = analyzeSentiment(text);
    const topics = extractTopics(text);
    
    submissions.push({
      id: `mock-${index}`,
      text,
      latitude: lat,
      longitude: lng,
      timestamp,
      sentiment,
      topics,
    });
  });

  return submissions;
};

// Generate additional submissions over time
export const generateNewSubmission = (): Submission => {
  const dynamicTexts = [
    "Just discovered this hidden gem of a bookstore",
    "The energy here is electric tonight!",
    "Peaceful morning walk, birds chirping everywhere",
    "Food truck festival is amazing, so many options",
    "Construction noise is really disrupting the peace",
    "Street art exhibition transformed this whole block",
    "Local band playing covers, drawing a crowd",
    "Early morning yoga class in the park",
    "Weekend market has incredible local crafts",
    "Late night study session at the 24/7 cafe",
  ];
  
  const text = dynamicTexts[Math.floor(Math.random() * dynamicTexts.length)];
  const baseLocation = { lat: 40.7128, lng: -74.0060 };
  const lat = baseLocation.lat + (Math.random() - 0.5) * 0.02;
  const lng = baseLocation.lng + (Math.random() - 0.5) * 0.02;
  
  const sentiment = analyzeSentiment(text);
  const topics = extractTopics(text);
  
  return {
    id: `dynamic-${Date.now()}-${Math.random()}`,
    text,
    latitude: lat,
    longitude: lng,
    timestamp: new Date(),
    sentiment,
    topics,
  };
};

export const mockSubmissions = generateMockSubmissions();