/**
 * @fileoverview This file initializes the Genkit AI instance with the Google AI plugin.
 * It exports a single `ai` object that is used throughout the application to
 * define and run AI flows.
 */

import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      model: "gemini-1.5-flash"
    }),
  ],
  logLevel: 'debug',
  enableTracing: true,
});
