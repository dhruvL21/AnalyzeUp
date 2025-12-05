import { config } from 'dotenv';
config();

import '@/ai/flows/low-stock-alerts.ts';
import '@/ai/flows/generate-product-description.ts';
import '@/ai/flows/business-strategy-suggester.ts';
