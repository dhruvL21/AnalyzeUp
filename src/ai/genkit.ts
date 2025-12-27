/**
 * @fileoverview This file initializes the Genkit AI plugin.
 *
 * It is not necessary to edit this file to get started.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      // The API key is defined in the .env file.
      // You can get a key at https://aistudio.google.com/app/apikey
      apiKey: process.env.GOOGLE_API_KEY,
      model: 'gemini-1.5-flash',
    }),
  ],
});
