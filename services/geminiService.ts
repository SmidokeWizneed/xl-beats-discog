

import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { Badge, IndexedTrack } from '../types';

// Ensure API_KEY is available, otherwise throw an error.
if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const indexTracksWithGemini = async (trackTitles: string[], artistName: string): Promise<IndexedTrack[]> => {
  if (trackTitles.length === 0) return [];
  
  const prompt = `
    Analyze the following list of track titles by the artist or producer "${artistName}".
    For each track, find the official public streaming URL on YouTube, Spotify, and Apple Music.
    Prioritize official artist channels, music videos, or official audio uploads.
    If a valid, official URL cannot be found for a specific platform, return an empty string for that field.
    Track Titles:
    ${trackTitles.join('\n')}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              trackTitle: { type: Type.STRING },
              youtubeUrl: { type: Type.STRING },
              spotifyUrl: { type: Type.STRING },
              appleMusicUrl: { type: Type.STRING },
            },
            required: ['trackTitle'],
          }
        }
      }
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as IndexedTrack[];
  } catch (error) {
    console.error("Error indexing tracks with Gemini:", error);
    // Return a structured error or an empty array
    return trackTitles.map(title => ({
        trackTitle: title,
        youtubeUrl: 'Error fetching',
        spotifyUrl: 'Error fetching',
        appleMusicUrl: 'Error fetching',
    }));
  }
};

export const generateBadgesWithGemini = async (): Promise<Omit<Badge, 'id' | 'earned' | 'icon'>[]> => {
    const prompt = `
        Generate 8 creative achievement badge ideas for a music app for producer XL Beats from Flint, MI.
        The app's aesthetic is a mix of graffiti, blaxploitation, and retro 80s/90s themes.
        For each badge, provide a creative name, a short description for the user of what the badge represents, and the criteria for earning it.
    `;
    
    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            criteria: { type: Type.STRING },
                        },
                        required: ['name', 'description', 'criteria'],
                    }
                }
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);
        return result;

    } catch (error) {
        console.error("Error generating badges with Gemini:", error);
        // Return a default/fallback set of badges
        return [
            { name: "Flint Ambassador", description: "You're repping the 810!", criteria: "Play 10 tracks from XL Beats." },
            { name: "Album Completer", description: "Full spin, no skips.", criteria: "Listen to an entire album from start to finish." },
            { name: "Retro Futurist", description: "Vibing with the classics.", criteria: "Listen to 5 tracks released before 2010." },
        ];
    }
};