
/**
 * NOTE: This is an illustrative example of the Firebase Cloud Function code.
 * It would be deployed to Firebase Functions.
 */

/*
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();

const HYTALE_CONFIG = {
  baseUrl: process.env.HYTALE_BASE_URL,
  queryPath: process.env.HYTALE_QUERY_PATH || '/Nitrado/Query',
  metricsPath: process.env.HYTALE_METRICS_PATH || '/ApexHosting/PrometheusExporter/metrics',
  secret: process.env.HYTALE_SHARED_SECRET
};

export const pollHytaleServer = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  try {
    // 1. Fetch Basic Query (JSON)
    const queryRes = await axios.get(`${HYTALE_CONFIG.baseUrl}${HYTALE_CONFIG.queryPath}`, {
      headers: { 'X-API-Key': HYTALE_CONFIG.secret }
    });
    
    // 2. Fetch Metrics (Prometheus Text Format)
    const metricsRes = await axios.get(`${HYTALE_CONFIG.baseUrl}${HYTALE_CONFIG.metricsPath}`);
    const metricsText = metricsRes.data;

    // 3. Basic Prometheus Parser
    const parseMetric = (name: string) => {
      const match = metricsText.match(new RegExp(`^${name}\\s+([\\d.]+)`, 'm'));
      return match ? parseFloat(match[1]) : 0;
    };

    const snapshot = {
      timestamp: Date.now(),
      playersOnline: queryRes.data.player_count || 0,
      tpsAvg60: parseMetric('hytale_server_tps_avg'),
      jvmUsedMem: parseMetric('jvm_memory_bytes_used') / 1024 / 1024,
      jvmMaxMem: parseMetric('jvm_memory_bytes_max') / 1024 / 1024,
      chunksActive: parseMetric('hytale_world_chunks_active'),
      entitiesActive: parseMetric('hytale_world_entities_active'),
      sourceOk: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      rawQueryJson: queryRes.data
    };

    await admin.firestore().collection('serverSnapshots').add(snapshot);
    console.log('Snapshot saved successfully');
  } catch (err) {
    console.error('Failed to poll Hytale server:', err);
    await admin.firestore().collection('serverSnapshots').add({
      timestamp: Date.now(),
      sourceOk: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
});
*/
