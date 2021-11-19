import { getSeededRandom } from '@visx/mock-data';

const topics = [
    {topic: "topic 1", frequency: 20},
    {topic: "topic 2", frequency: 15},
    {topic: "topic 3", frequency: 9},
    {topic: "topic 4", frequency: 7},
    {topic: "topic 5", frequency: 14},
    {topic: "topic 6", frequency: 2},
    {topic: "topic 7", frequency: 4},
    {topic: "topic 8", frequency: 20},
    {topic: "topic 9", frequency: 15},
    {topic: "topic 10", frequency: 9},
    {topic: "topic 11", frequency: 7},
    {topic: "topic 12", frequency: 14},
    {topic: "topic 13", frequency: 2},
    {topic: "topic 14", frequency: 4},
    {topic: "topic 15", frequency: 20},
    {topic: "topic 16", frequency: 15},
    {topic: "topic 17", frequency: 9},
    {topic: "topic 18", frequency: 7},
    {topic: "topic 19", frequency: 14},
    {topic: "topic 20", frequency: 2},
    {topic: "topic 21", frequency: 4},
]

const pins = [
    {topic: "pin 1", frequency: 20},
    {topic: "pin 2", frequency: 15},
    {topic: "pin 3", frequency: 9},
    {topic: "pin 4", frequency: 7},
    {topic: "pin 5", frequency: 14},
    {topic: "pin 6", frequency: 2},
    {topic: "pin 7", frequency: 4},
    {topic: "pin 8", frequency: 20},
]

export const generateTopicCircles = (width, height) => {
  const radiusRandom = getSeededRandom(0.2);
  const xRandom = getSeededRandom(0.3);
  const yRandom = getSeededRandom(0.4);
  const circles = []
  topics.forEach(d => {
      circles.push( {
        id: d.topic,
        radius: d.frequency,
        x: Math.round(xRandom() * (width - d.frequency * 2) + d.frequency),
        y: Math.round(yRandom() * (height - d.frequency * 2) + d.frequency),
      })
  })

  return circles
};

export const generatePinCircles = (width, height) => {
    const radiusRandom = getSeededRandom(0.2);
    const xRandom = getSeededRandom(0.8);
    const yRandom = getSeededRandom(0.7);
    const circles = []
    pins.forEach(d => {
        circles.push( {
          id: d.topic,
          radius: d.frequency,
          x: Math.round(xRandom() * (width - d.frequency * 2) + d.frequency),
          y: Math.round(yRandom() * (height - d.frequency * 2) + d.frequency),
        })
    })
  
    return circles
};
