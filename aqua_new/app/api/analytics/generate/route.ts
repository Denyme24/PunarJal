import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import SimulationLog from '@/models/SimulationLog';

// Simple Gemini 1.5 Flash call using fetch to avoid adding SDK dependency
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { parameters, simulationResult } = body || {};

    if (!parameters || !simulationResult) {
      return NextResponse.json(
        { error: 'parameters and simulationResult are required' },
        { status: 400 }
      );
    }

    // Try to get historical simulation data
    let historicalData: any[] = [];
    let historicalStats: any = {};

    try {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        const decoded = verifyToken(token);

        if (decoded && decoded.id) {
          // Connect to database and fetch historical logs
          await connectDB();

          // Get last 20 simulations for this user
          // @ts-ignore - Mongoose type inference issue with find overloads
          const logs = await SimulationLog.find({ userId: decoded.id })
            .sort({ timestamp: -1 })
            .limit(20)
            .select(
              'inputParameters simulationResult timestamp source sourceName'
            );

          historicalData = logs.map((log: any) => ({
            date: new Date(log.timestamp).toISOString().split('T')[0],
            time: new Date(log.timestamp).toLocaleTimeString(),
            parameters: log.inputParameters,
            result: {
              status: log.simulationResult?.overallStatus,
              stagesRequired: log.simulationResult?.totalStagesRequired,
              efficiency: log.simulationResult?.estimatedEfficiency,
              treatmentTime: log.simulationResult?.estimatedTreatmentTime,
              primaryRequired: log.simulationResult?.primaryTreatment?.required,
              secondaryRequired:
                log.simulationResult?.secondaryTreatment?.required,
              tertiaryRequired:
                log.simulationResult?.tertiaryTreatment?.required,
            },
            source: log.source,
            sourceName: log.sourceName,
          }));

          // Calculate statistics from historical data
          if (logs.length > 0) {
            const avgEfficiency =
              logs.reduce(
                (sum: number, log: any) =>
                  sum + (log.simulationResult?.estimatedEfficiency || 0),
                0
              ) / logs.length;
            const avgTreatmentTime =
              logs.reduce(
                (sum: number, log: any) =>
                  sum + (log.simulationResult?.estimatedTreatmentTime || 0),
                0
              ) / logs.length;

            // Calculate average parameters
            const avgParameters = {
              turbidity: (
                logs.reduce(
                  (sum: number, log: any) =>
                    sum + (log.inputParameters?.turbidity || 0),
                  0
                ) / logs.length
              ).toFixed(1),
              pH: (
                logs.reduce(
                  (sum: number, log: any) =>
                    sum + (log.inputParameters?.pH || 0),
                  0
                ) / logs.length
              ).toFixed(2),
              cod: Math.round(
                logs.reduce(
                  (sum: number, log: any) =>
                    sum + (log.inputParameters?.cod || 0),
                  0
                ) / logs.length
              ),
              tds: Math.round(
                logs.reduce(
                  (sum: number, log: any) =>
                    sum + (log.inputParameters?.tds || 0),
                  0
                ) / logs.length
              ),
              nitrogen: (
                logs.reduce(
                  (sum: number, log: any) =>
                    sum + (log.inputParameters?.nitrogen || 0),
                  0
                ) / logs.length
              ).toFixed(1),
              phosphorus: (
                logs.reduce(
                  (sum: number, log: any) =>
                    sum + (log.inputParameters?.phosphorus || 0),
                  0
                ) / logs.length
              ).toFixed(2),
            };

            historicalStats = {
              totalSimulations: logs.length,
              averageEfficiency: avgEfficiency.toFixed(1),
              averageTreatmentTime: avgTreatmentTime.toFixed(1),
              averageParameters: avgParameters,
              statusDistribution: {
                safe: logs.filter(
                  (log: any) => log.simulationResult?.overallStatus === 'safe'
                ).length,
                needsTreatment: logs.filter(
                  (log: any) =>
                    log.simulationResult?.overallStatus === 'needs-treatment'
                ).length,
                critical: logs.filter(
                  (log: any) =>
                    log.simulationResult?.overallStatus === 'critical'
                ).length,
              },
              treatmentStagesFrequency: {
                primary: logs.filter(
                  (log: any) => log.simulationResult?.primaryTreatment?.required
                ).length,
                secondary: logs.filter(
                  (log: any) =>
                    log.simulationResult?.secondaryTreatment?.required
                ).length,
                tertiary: logs.filter(
                  (log: any) =>
                    log.simulationResult?.tertiaryTreatment?.required
                ).length,
              },
              sourceDistribution: {
                simulation_page: logs.filter(
                  (log: any) => log.source === 'simulation_page'
                ).length,
                iot_sensors: logs.filter(
                  (log: any) => log.source === 'iot_sensors'
                ).length,
                map_view: logs.filter((log: any) => log.source === 'map_view')
                  .length,
              },
              dateRange: {
                oldest: new Date(logs[logs.length - 1].timestamp)
                  .toISOString()
                  .split('T')[0],
                newest: new Date(logs[0].timestamp).toISOString().split('T')[0],
              },
            };
          }
        }
      }
    } catch (error) {
      console.error('Error fetching historical data:', error);
      // Continue without historical data
    }

    const apiKey =
      process.env.GEMINI_API_KEY || process.env.GOOGLE_GENAI_API_KEY;

    const historicalContext =
      historicalData.length > 0
        ? `

HISTORICAL SIMULATION DATA (Last ${historicalData.length} simulations from database):
${JSON.stringify(historicalData, null, 2)}

HISTORICAL STATISTICS CALCULATED FROM DATABASE:
${JSON.stringify(historicalStats, null, 2)}

IMPORTANT INSTRUCTIONS FOR USING HISTORICAL DATA:
1. Compare the current simulation's efficiency (${simulationResult.estimatedEfficiency}%) with the historical average efficiency (${historicalStats?.averageEfficiency || 'N/A'}%)
2. Analyze trends: Is water quality improving or degrading over time?
3. Use actual historical dates and efficiency values for the "simulationHistory" array
4. Calculate realistic "treatmentEfficiency" based on the patterns seen in historical data
5. Generate "reuseBreakdown" percentages that align with historical treatment patterns
6. Base "sustainabilityMetrics" on cumulative data from all ${historicalStats?.totalSimulations || 0} simulations
7. Provide personalized recommendations based on the user's historical performance
8. Highlight any anomalies or significant changes from historical patterns
9. Use the source distribution to understand which monitoring methods are most used
10. Compare current parameters with historical averages to identify unusual values

TREND ANALYSIS REQUIRED:
- If current efficiency is better than average: mention improvement
- If current efficiency is worse than average: suggest areas for optimization
- Note which treatment stages are most commonly required based on historical data
- Identify any recurring patterns or issues`
        : `

NOTE: This is the FIRST simulation for this user. No historical data available yet.
- Provide general analytics based on the current simulation only
- Encourage the user to run more simulations to get personalized insights
- Explain that analytics will improve with more data`;

    const prompt = `You are an AI water treatment analytics expert. Generate comprehensive wastewater treatment analytics based on real simulation data.

CURRENT SIMULATION:
Parameters: ${JSON.stringify(parameters, null, 2)}
Result: ${JSON.stringify(simulationResult, null, 2)}
${historicalContext}

Generate analytics as ONLY valid JSON (no markdown, no explanations outside JSON):
{
  "simulationHistory": [5 entries with date, waterSaved, energySaved, efficiency],
  "treatmentEfficiency": {
    "primary": {"removal": 0-100, "avgTime": minutes, "energyUsed": kWh},
    "secondary": {"removal": 0-100, "avgTime": minutes, "energyUsed": kWh},
    "tertiary": {"removal": 0-100, "avgTime": minutes, "energyUsed": kWh}
  },
  "reuseBreakdown": [
    {"type": "Agricultural Irrigation", "percentage": X, "volume": Y},
    {"type": "Industrial Process", "percentage": X, "volume": Y},
    {"type": "Landscape Irrigation", "percentage": X, "volume": Y},
    {"type": "Toilet Flushing", "percentage": X, "volume": Y},
    {"type": "Cooling Systems", "percentage": X, "volume": Y}
  ],
  "sustainabilityMetrics": {
    "totalWaterRecycled": liters,
    "freshwaterSaved": liters,
    "co2Emissions": tonnes,
    "energyEfficiency": 0-100,
    "costSavings": USD,
    "treesEquivalent": number,
    "waterFootprintReduction": 0-100
  },
  "environmentalImpact": {
    "freshwaterConservation": "XXX,XXXL",
    "co2EmissionsAvoided": "X.X Tonnes",
    "treesPlanted": "XXX Trees",
    "waterFootprintReduction": "XX%"
  },
  "economicBenefits": {
    "totalCostSavings": "$XXX,XXX",
    "waterBillReduction": "$XX,XXX",
    "energyCostSavings": "$XX,XXX",
    "paybackPeriod": "X.X Years"
  }
}
Make realistic numbers based on treatment stages required.`;

    // First, list available models to find a working one
    const listResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    let availableModels: string[] = [];
    if (listResp.ok) {
      const listData = await listResp.json();
      availableModels = (listData?.models || [])
        .filter(
          (m: any) =>
            m.supportedGenerationMethods?.includes('generateContent') &&
            m.name?.includes('gemini')
        )
        .map((m: any) => m.name.replace('models/', ''));
    }

    // Fallback list if listing fails
    if (availableModels.length === 0) {
      availableModels = [
        'gemini-1.5-flash-latest',
        'gemini-1.5-flash',
        'gemini-1.5-pro-latest',
        'gemini-1.5-pro',
        'gemini-pro',
      ];
    }

    let data: any | null = null;
    let lastErrText = '';

    // Try both v1 and v1beta endpoints
    const apiVersions = ['v1', 'v1beta'];

    for (const version of apiVersions) {
      for (const model of availableModels) {
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [
                {
                  role: 'user',
                  parts: [{ text: prompt }],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
              },
            }),
          }
        );

        if (resp.ok) {
          data = await resp.json();
          break;
        }

        lastErrText = await resp.text();
        // Continue trying other models
      }
      if (data) break;
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            'All Gemini model fallbacks failed. Available models: ' +
            availableModels.join(', ') +
            '. Last error: ' +
            lastErrText,
        },
        { status: 500 }
      );
    }

    // Check multiple possible locations for the response text
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.output ||
      data?.candidates?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        {
          error:
            'Gemini returned empty response. Finish reason: ' +
            (data?.candidates?.[0]?.finishReason || 'unknown'),
        },
        { status: 500 }
      );
    }

    let parsed;
    try {
      // Try to extract JSON from markdown code blocks if present
      let jsonText = text.trim();

      // Remove markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/i, '').replace(/```\s*$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/```\s*$/, '');
      }

      parsed = JSON.parse(jsonText);
    } catch (e) {
      // If the model didn't return JSON, provide fallback data
      parsed = {
        simulationHistory: [
          {
            date: '2025-10-13',
            waterSaved: 1200,
            energySaved: 180,
            efficiency: 94,
          },
          {
            date: '2025-10-12',
            waterSaved: 1150,
            energySaved: 175,
            efficiency: 92,
          },
          {
            date: '2025-10-11',
            waterSaved: 1300,
            energySaved: 195,
            efficiency: 95,
          },
          {
            date: '2025-10-10',
            waterSaved: 1100,
            energySaved: 165,
            efficiency: 90,
          },
          {
            date: '2025-10-09',
            waterSaved: 1250,
            energySaved: 185,
            efficiency: 93,
          },
        ],
        treatmentEfficiency: {
          primary: { removal: 65, avgTime: 45, energyUsed: 25 },
          secondary: { removal: 85, avgTime: 120, energyUsed: 55 },
          tertiary: { removal: 95, avgTime: 90, energyUsed: 70 },
        },
        reuseBreakdown: [
          { type: 'Agricultural Irrigation', percentage: 35, volume: 420 },
          { type: 'Industrial Process', percentage: 28, volume: 336 },
          { type: 'Landscape Irrigation', percentage: 20, volume: 240 },
          { type: 'Toilet Flushing', percentage: 12, volume: 144 },
          { type: 'Cooling Systems', percentage: 5, volume: 60 },
        ],
        sustainabilityMetrics: {
          totalWaterRecycled: 432000,
          freshwaterSaved: 389000,
          co2Emissions: 2.5,
          energyEfficiency: 88,
          costSavings: 125000,
          treesEquivalent: 115,
          waterFootprintReduction: 47,
        },
        environmentalImpact: {
          freshwaterConservation: '389,000L',
          co2EmissionsAvoided: '2.5 Tonnes',
          treesPlanted: '115 Trees',
          waterFootprintReduction: '47%',
        },
        economicBenefits: {
          totalCostSavings: '$125,000',
          waterBillReduction: '$89,000',
          energyCostSavings: '$36,000',
          paybackPeriod: '2.3 Years',
        },
      };
    }

    return NextResponse.json({ data: parsed });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Unknown server error' },
      { status: 500 }
    );
  }
}
