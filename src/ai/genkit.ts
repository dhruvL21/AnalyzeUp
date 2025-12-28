// import {genkit} from 'genkit';
// import {googleAI} from '@genkit-ai/google-genai';

// export const ai = genkit({
//   plugins: [googleAI()],
//   model: 'googleai/gemini-pro',
// });
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY!,
      apiVersion: 'v1beta',
    }),
  ],
});
