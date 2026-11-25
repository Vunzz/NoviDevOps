import express from 'express';
import { healthCheck } from '../db.js';
const router = express.Router();
// Liveness: HTTP-server reageert, zonder databasecheck.
router.get('/live', (_req, res) => {
 res.status(200).json({
 status: 'alive',
 timestamp: new Date().toISOString(),
 uptime: process.uptime(),
 });
});
// Readiness: databaseverbinding maakt de app bruikbaar.
async function readinessHandler(_req, res) {
 try {
 const dbHealthy = await healthCheck();
 res.status(dbHealthy ? 200 : 503).json({
 status: dbHealthy ? 'healthy' : 'degraded',
 timestamp: new Date().toISOString(),
 uptime: process.uptime(),
 database: dbHealthy ? 'connected' : 'disconnected',
 });
 } catch (error) {
 console.error('Readiness check failed:', error);
 res.status(503).json({
 status: 'unhealthy',
 timestamp: new Date().toISOString(),
 database: 'disconnected',
 });
 }
}
// Bestaande /health blijft bruikbaar als alias.
router.get(['/', '/ready'], readinessHandler);
export default router;
