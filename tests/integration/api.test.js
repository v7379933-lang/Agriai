import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../../server/src/app.js';

describe('API Integration Test Suite', () => {
  let server;
  let baseUrl;

  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, '127.0.0.1', () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  it('GET /health - should return HEALTHY status', async () => {
    const res = await fetch(`${baseUrl}/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'HEALTHY');
    assert.equal(data.service, 'AgriSmart AI Engine');
  });

  it('GET /api/v1/profile - should return authenticated farmer profile', async () => {
    const res = await fetch(`${baseUrl}/api/v1/profile`, {
      headers: { Authorization: 'Bearer demo-farmer-token' }
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.district);
  });

  it('GET /api/v1/crops - should return master agricultural crop catalog', async () => {
    const res = await fetch(`${baseUrl}/api/v1/crops`, {
      headers: { Authorization: 'Bearer demo-farmer-token' }
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length >= 5);
  });

  it('POST /api/v1/ai/crop-recommendation - should generate structured suitability plan', async () => {
    const payload = {
      district: 'Guntur',
      state: 'Andhra Pradesh',
      season: 'kharif',
      soilType: 'black_cotton',
      soilPh: 7.2,
      landArea: 3.5,
      irrigationAvailability: 'assured',
      farmingObjective: 'maximum_yield'
    };

    const res = await fetch(`${baseUrl}/api/v1/ai/crop-recommendation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo-farmer-token'
      },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.result.recommendations.length > 0);
    assert.ok(body.data.result.recommendations[0].suitability_score >= 0);
  });

  it('POST /api/v1/ai/fertilizer-advisory - should calculate split nutrient schedule', async () => {
    const payload = {
      cropName: 'Rice (Paddy)',
      growthStage: 'vegetative',
      landArea: 2.0,
      soilType: 'clay',
      soilPh: 6.8,
      nitrogenLevel: 'medium',
      phosphorusLevel: 'medium',
      potassiumLevel: 'medium',
      irrigationMethod: 'borewell'
    };

    const res = await fetch(`${baseUrl}/api/v1/ai/fertilizer-advisory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo-farmer-token'
      },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.result.recommendations.length > 0);
  });

  it('POST /api/v1/ai/irrigation-advisory - should return weather-adjusted watering advice', async () => {
    const payload = {
      cropName: 'Cotton',
      growthStage: 'flowering',
      soilType: 'black_cotton',
      irrigationMethod: 'drip',
      waterAvailability: 'adequate',
      lastIrrigationDaysAgo: 4,
      recentRainfallMm: 0
    };

    const res = await fetch(`${baseUrl}/api/v1/ai/irrigation-advisory`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo-farmer-token'
      },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.result.recommendations.length > 0);
  });

  it('POST /api/v1/ai/chat - should answer agricultural questions with context', async () => {
    const res = await fetch(`${baseUrl}/api/v1/ai/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo-farmer-token'
      },
      body: JSON.stringify({
        message: 'Why are rice leaves turning yellow?',
        language: 'en',
        cropContext: 'Rice'
      })
    });

    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.response.answer.length > 20);
  });

  it('GET /api/v1/weather/forecast - should return agrometeorology with alerts', async () => {
    const res = await fetch(`${baseUrl}/api/v1/weather/forecast?lat=16.30&lon=80.43`, {
      headers: { Authorization: 'Bearer demo-farmer-token' }
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.current);
    assert.ok(Array.isArray(body.data.daily));
  });

  it('GET /api/v1/guides - should return searchable cultivation guides', async () => {
    const res = await fetch(`${baseUrl}/api/v1/guides`, {
      headers: { Authorization: 'Bearer demo-farmer-token' }
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.success, true);
    assert.ok(body.data.length >= 3);
  });

  it('GET /api/v1/admin/dashboard - should enforce admin role permissions', async () => {
    // 1. Farmer token should be rejected with 403 Forbidden
    const farmerRes = await fetch(`${baseUrl}/api/v1/admin/dashboard`, {
      headers: { Authorization: 'Bearer demo-farmer-token' }
    });
    assert.equal(farmerRes.status, 403);

    // 2. Admin token should succeed with 200 OK
    const adminRes = await fetch(`${baseUrl}/api/v1/admin/dashboard`, {
      headers: { Authorization: 'Bearer demo-admin-token' }
    });
    assert.equal(adminRes.status, 200);
    const body = await adminRes.json();
    assert.equal(body.success, true);
    assert.ok(body.data.totalRegisteredFarmers > 0);
  });
});
