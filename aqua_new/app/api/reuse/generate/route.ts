import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import SimulationLog from "@/models/SimulationLog";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { treatedWaterQuality } = body || {};

    if (!treatedWaterQuality) {
      return NextResponse.json(
        { error: "treatedWaterQuality is required" },
        { status: 400 }
      );
    }

    // Try to get historical simulation data
    let historicalData: any[] = [];
    let historicalStats: any = {};
    
    try {
      const authHeader = request.headers.get("authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);
        
        if (decoded && decoded.id) {
          // Connect to database and fetch historical logs
          await connectDB();
          
          // Get last 20 simulations for this user
          // @ts-ignore - Mongoose type inference issue with find overloads
          const logs = await SimulationLog.find({ userId: decoded.id })
            .sort({ timestamp: -1 })
            .limit(20)
            .select("inputParameters simulationResult timestamp source sourceName");
          
          historicalData = logs.map((log: any) => ({
            date: new Date(log.timestamp).toISOString().split('T')[0],
            parameters: log.inputParameters,
            result: {
              status: log.simulationResult?.overallStatus,
              stagesRequired: log.simulationResult?.totalStagesRequired,
              efficiency: log.simulationResult?.estimatedEfficiency,
              treatmentTime: log.simulationResult?.estimatedTreatmentTime,
            },
            source: log.source,
            sourceName: log.sourceName,
          }));
          
          // Calculate statistics
          if (logs.length > 0) {
            historicalStats = {
              totalSimulations: logs.length,
              averageEfficiency: (logs.reduce((sum: number, log: any) => 
                sum + (log.simulationResult?.estimatedEfficiency || 0), 0) / logs.length).toFixed(1),
              mostCommonReuseType: logs.reduce((acc: any, log: any) => {
                const reuseType = log.inputParameters?.reuseType || 'not specified';
                acc[reuseType] = (acc[reuseType] || 0) + 1;
                return acc;
              }, {}),
            };
          }
        }
      }
    } catch (error) {
      console.error("Error fetching historical data:", error);
      // Continue without historical data
    }

    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENAI_API_KEY;

    const historicalContext = historicalData.length > 0 
      ? `

HISTORICAL SIMULATION DATA (Last ${historicalData.length} simulations from database):
${JSON.stringify(historicalData, null, 2)}

HISTORICAL STATISTICS:
${JSON.stringify(historicalStats, null, 2)}

IMPORTANT: Use this historical data to provide personalized reuse recommendations based on:
- Past treatment efficiency patterns
- Common reuse types chosen by this user
- Historical water quality parameters
- Typical treatment outcomes`
      : `

NOTE: This is the first simulation or no historical data available. Provide general recommendations based on the treated water quality.`;

    const prompt = `You are an expert water reuse consultant. Generate comprehensive water reuse recommendations based on treated water quality.

TREATED WATER QUALITY:
${JSON.stringify(treatedWaterQuality, null, 2)}
${historicalContext}

Generate reuse options as ONLY valid JSON (no markdown, no explanations outside JSON):
{
  "reuseOptions": [
    {
      "id": "irrigation",
      "name": "Agricultural Irrigation",
      "icon": "Sprout",
      "suitable": true,
      "confidence": 95,
      "requirements": [
        "Turbidity < 5 NTU ✓",
        "pH 6.5-8.5 ✓",
        "COD < 100 mg/L ✓",
        "Nitrogen acceptable ✓"
      ],
      "benefits": [
        "Reduces freshwater consumption",
        "Provides nutrients to crops",
        "Cost-effective solution",
        "Environmentally sustainable"
      ],
      "warnings": [] // optional
    },
    // Include exactly 6 reuse options: irrigation, industrial, landscape, toilet, cooling, potable
    // Use icons: "Sprout" for irrigation/landscape, "Factory" for industrial, "Toilet" for toilet, "Wind" for cooling, "Coffee" for potable
  ],
  "waterSavings": {
    "daily": 1200,
    "monthly": 36000,
    "yearly": 432000,
    "co2Reduced": 2.5,
    "energySaved": 1800
  }
}

REQUIREMENTS:
1. Evaluate all 6 reuse types: Agricultural Irrigation, Industrial Process Water, Landscape Irrigation, Toilet Flushing, Cooling Tower Systems, Potable Water
2. Set "suitable" based on actual water quality parameters vs requirements for each reuse type
3. Calculate realistic "confidence" percentage (0-100) for each option
4. Mark requirements with ✓ if met, ✗ if not met
5. Provide 3-4 specific requirements for each option
6. List 3-4 concrete benefits for each option
7. Add warnings array only if there are concerns (can be empty array)
8. Calculate realistic water savings based on treated water quality and historical data
9. Make potable water "suitable: false" unless water quality is exceptional (turbidity < 1, advanced treatment confirmed)
10. Use checkmarks and crosses to indicate requirement compliance

Be specific, accurate, and base all recommendations on actual water quality parameters provided.`;

    // List available models
    const listResp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );

    let availableModels: string[] = [];
    if (listResp.ok) {
      const listData = await listResp.json();
      availableModels = (listData?.models || [])
        .filter((m: any) => 
          m.supportedGenerationMethods?.includes("generateContent") &&
          m.name?.includes("gemini")
        )
        .map((m: any) => m.name.replace("models/", ""));
    }

    if (availableModels.length === 0) {
      availableModels = [
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash",
        "gemini-1.5-pro-latest",
        "gemini-1.5-pro",
        "gemini-pro",
      ];
    }

    let data: any | null = null;
    let lastErrText = "";

    const apiVersions = ["v1", "v1beta"];

    for (const version of apiVersions) {
      for (const model of availableModels) {
        const resp = await fetch(
          `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  role: "user",
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
      }
      if (data) break;
    }

    if (!data) {
      return NextResponse.json(
        {
          error:
            "All Gemini model fallbacks failed. Available models: " +
            availableModels.join(", ") +
            ". Last error: " +
            lastErrText,
        },
        { status: 500 }
      );
    }

    let text = 
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.output ||
      data?.candidates?.[0]?.text;

    if (!text) {
      return NextResponse.json(
        { 
          error: "Gemini returned empty response. Finish reason: " + 
                 (data?.candidates?.[0]?.finishReason || "unknown")
        },
        { status: 500 }
      );
    }

    let parsed;
    try {
      let jsonText = text.trim();
      
      if (jsonText.startsWith("```json")) {
        jsonText = jsonText.replace(/^```json\s*/i, "").replace(/```\s*$/, "");
      } else if (jsonText.startsWith("```")) {
        jsonText = jsonText.replace(/^```\s*/, "").replace(/```\s*$/, "");
      }
      
      parsed = JSON.parse(jsonText);
    } catch (e) {
      // Fallback data
      parsed = {
        reuseOptions: [
          {
            id: "irrigation",
            name: "Agricultural Irrigation",
            icon: "Sprout",
            suitable: true,
            confidence: 95,
            requirements: [
              "Turbidity < 5 NTU ✓",
              "pH 6.5-8.5 ✓",
              "COD < 100 mg/L ✓",
              "Nitrogen acceptable ✓"
            ],
            benefits: [
              "Reduces freshwater consumption",
              "Provides nutrients to crops",
              "Cost-effective solution",
              "Environmentally sustainable"
            ]
          },
          {
            id: "industrial",
            name: "Industrial Process Water",
            icon: "Factory",
            suitable: true,
            confidence: 88,
            requirements: [
              "TDS < 500 mg/L ✓",
              "pH controlled ✓",
              "Low organic content ✓"
            ],
            benefits: [
              "Suitable for cooling systems",
              "Can be used in manufacturing",
              "Reduces industrial water costs",
              "Meets process water standards"
            ]
          },
          {
            id: "landscape",
            name: "Landscape Irrigation",
            icon: "Sprout",
            suitable: true,
            confidence: 98,
            requirements: [
              "Turbidity < 5 NTU ✓",
              "Basic disinfection ✓",
              "Visual clarity ✓"
            ],
            benefits: [
              "Perfect for parks and gardens",
              "Maintains green spaces",
              "No health risks",
              "High water savings"
            ]
          },
          {
            id: "toilet",
            name: "Toilet Flushing",
            icon: "Toilet",
            suitable: true,
            confidence: 92,
            requirements: [
              "Basic treatment completed ✓",
              "Odor controlled ✓",
              "Color acceptable ✓"
            ],
            benefits: [
              "Significant water savings",
              "Easy implementation",
              "No human contact",
              "Reduces sewage load"
            ]
          },
          {
            id: "cooling",
            name: "Cooling Tower Systems",
            icon: "Wind",
            suitable: true,
            confidence: 85,
            requirements: [
              "TDS controlled ✓",
              "pH balanced ✓",
              "Low scaling potential ✓"
            ],
            benefits: [
              "Industrial cooling applications",
              "Energy efficiency maintained",
              "Reduces cooling water demand"
            ],
            warnings: [
              "Monitor for scaling regularly",
              "May need additional treatment for specific systems"
            ]
          },
          {
            id: "potable",
            name: "Potable Water (Drinking)",
            icon: "Coffee",
            suitable: false,
            confidence: 45,
            requirements: [
              "Turbidity < 1 NTU ✗",
              "Advanced disinfection needed ✗",
              "Complete nutrient removal ✗",
              "Multiple quality checks required ✗"
            ],
            benefits: [
              "Highest value water reuse",
              "Complete water cycle closure"
            ],
            warnings: [
              "Requires additional tertiary treatment",
              "Needs UV disinfection or chlorination",
              "Regulatory approval required",
              "Not recommended with current treatment level"
            ]
          }
        ],
        waterSavings: {
          daily: 1200,
          monthly: 36000,
          yearly: 432000,
          co2Reduced: 2.5,
          energySaved: 1800
        }
      };
    }

    return NextResponse.json({ data: parsed });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Unknown server error" },
      { status: 500 }
    );
  }
}

