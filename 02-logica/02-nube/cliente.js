import { createClient } from '@supabase/supabase-js';
import { cloudConfig } from '../../01-datos/nube.js';

// Client boundary: el SDK oficial mantiene y renueva la sesión en este dispositivo.
export const cloud = cloudConfig.url && cloudConfig.publishableKey
  ? createClient(cloudConfig.url, cloudConfig.publishableKey)
  : null;
