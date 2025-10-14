import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

// System context about PunarJal
const SYSTEM_CONTEXT = `You are AI AGOS, an intelligent assistant for PunarJal - a Smart Wastewater Treatment System. 

## About PunarJal:
PunarJal is an advanced wastewater treatment platform that combines IoT sensors, AI-driven analytics, and automated treatment processes to transform wastewater treatment from a costly necessity into a sustainable resource recovery system.

## Key Features:
1. **Three-Stage Treatment Process:**
   - Primary Treatment: Physical screening and sedimentation to remove suspended solids (TSS) and reduce turbidity
   - Secondary Treatment: Biological treatment (aerobic/anaerobic digestion) to reduce COD and BOD levels
   - Tertiary Treatment: Advanced treatment for nutrient removal (nitrogen, phosphorus) and pH adjustment

2. **Treatment Thresholds:**
   - Primary: Turbidity > 50 NTU, TSS > 100 mg/L
   - Secondary: COD > 150 mg/L, BOD > 30 mg/L
   - Tertiary: Nitrogen > 10 mg/L, Phosphorus > 1 mg/L, pH outside 6.5-8.5 range

3. **Performance Metrics:**
   - 95% Water Recovery Rate
   - 60% Energy Savings
   - 24/7 Monitoring
   - 99.9% System Uptime

4. **IoT Sensors Integration:**
   Real-time monitoring of water quality parameters including turbidity, COD, BOD, nitrogen, phosphorus, pH, TSS, and TDS.

5. **Smart Simulation:**
   Organizations can simulate their wastewater treatment requirements based on their specific parameters and receive customized treatment recommendations.

6. **Water Reuse Recommendations:**
   The system provides intelligent recommendations for water reuse applications based on treated water quality.

7. **Analytics Dashboard:**
   Comprehensive analytics for tracking treatment efficiency, resource usage, and environmental impact.

## Organization Types Supported:
Hospitals, Hotels, Restaurants, Manufacturing Industries, IT/Tech Companies, Educational Institutions, Shopping Malls, Residential Complexes, Commercial Complexes, Food Processing Units, Pharmaceutical Companies, Textile Industries, and more.

## Your Role:
- Answer questions about wastewater treatment processes
- Explain water quality parameters and their significance
- Help users understand simulation results
- Provide guidance on IoT sensor data interpretation
- Suggest water reuse opportunities
- Explain treatment stages and their purposes
- Assist with system navigation and features

## Important Guidelines:
1. Only answer questions related to PunarJal, water treatment, water quality, environmental sustainability, and related topics.
2. For questions outside this scope, politely redirect users to ask about PunarJal's features.
3. Be conversational, helpful, and informative.
4. Provide specific, actionable information when possible.
5. Use water quality standards and scientific knowledge in your explanations.
6. Format your responses clearly with proper paragraphs, bullet points when helpful.
7. If analyzing images of water or water quality reports, provide detailed insights.

## Response Formatting:
- Respond in plain text only (NO markdown formatting)
- Use clear paragraphs separated by line breaks
- Use simple dashes (-) or numbers for lists if needed
- Do NOT use **bold**, *italic*, or any markdown syntax
- Be conversational and easy to read
- Include relevant metrics and thresholds when discussing water quality
- Write in a natural, flowing manner without special formatting`;

// Language instructions for multilingual support
const LANGUAGE_INSTRUCTIONS: Record<string, string> = {
  en: "Respond in clear, professional English using plain text only (no markdown formatting).",
  hi: "कृपया अपना उत्तर सादे पाठ में हिंदी में दें। कोई मार्कडाउन फ़ॉर्मेटिंग का उपयोग न करें।",
  mr: "कृपया आपले उत्तर साध्या मजकुरात मराठीत द्या. मार्कडाउन फॉरमॅटिंग वापरू नका.",
  kn: "ದಯವಿಟ್ಟು ಸಾದಾ ಪಠ್ಯದಲ್ಲಿ ಕನ್ನಡದಲ್ಲಿ ಉತ್ತರಿಸಿ. ಮಾರ್ಕ್‌ಡೌನ್ ಫಾರ್ಮ್ಯಾಟಿಂಗ್ ಬಳಸಬೇಡಿ.",
  bn: "দয়া করে সরল পাঠ্যে বাংলায় উত্তর দিন। মার্কডাউন ফরম্যাটিং ব্যবহার করবেন না।",
  ur: "براہ کرم سادہ متن میں اردو میں جواب دیں۔ مارک ڈاؤن فارمیٹنگ استعمال نہ کریں۔",
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, image, language = "en", history = [] } = body;

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Get language instruction
    const languageInstruction =
      LANGUAGE_INSTRUCTIONS[language] || LANGUAGE_INSTRUCTIONS.en;

    const apiKey = process.env.GEMINI_API_KEY;

    // First, list available models to find a working one
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

    // Fallback list if listing fails
    if (availableModels.length === 0) {
      availableModels = [
        "gemini-1.5-flash-latest",
        "gemini-1.5-flash",
        "gemini-1.5-pro-latest", 
        "gemini-1.5-pro",
        "gemini-pro",
      ];
    }

    // Build conversation history for context
    let conversationContext = `${SYSTEM_CONTEXT}\n\n${languageInstruction}\n\n`;
    
    // Add recent history (last 5 exchanges)
    const recentHistory = history.slice(-10);
    if (recentHistory.length > 0) {
      conversationContext += "Previous conversation:\n";
      recentHistory.forEach((msg: any) => {
        if (msg.role === "user") {
          conversationContext += `User: ${msg.content}\n`;
        } else if (msg.role === "assistant") {
          conversationContext += `Assistant: ${msg.content}\n`;
        }
      });
      conversationContext += "\n";
    }

    // Prepare the prompt
    let prompt = conversationContext;
    if (message) {
      prompt += `User's current question: ${message}\n\nProvide a helpful, detailed response in PLAIN TEXT only. Do not use any markdown formatting like **bold**, *italic*, bullet points, or headers. Use simple paragraphs and natural language.`;
    }

    // Generate response using direct fetch approach
    let data: any | null = null;
    let lastErrText = "";

    // Try both v1 and v1beta endpoints
    const apiVersions = ["v1", "v1beta"];

    for (const version of apiVersions) {
      for (const model of availableModels) {
        try {
          let requestBody: any;
          
          if (image) {
            // Handle image input
            const imageData = image.split(",")[1]; // Remove data:image/xxx;base64, prefix
            const mimeType = image.substring(
              image.indexOf(":") + 1,
              image.indexOf(";")
            );

            const imagePrompt = message
              ? `${prompt}\n\nThe user has also shared an image. Please analyze it in the context of water quality, treatment processes, or related topics. Respond in PLAIN TEXT only without any markdown formatting.`
              : `${conversationContext}\n\nThe user has shared an image. Please analyze it in the context of water quality, wastewater treatment, or related environmental topics. Provide detailed insights in PLAIN TEXT only without any markdown formatting.`;

            requestBody = {
              contents: [
                {
                  role: "user",
                  parts: [
                    { text: imagePrompt },
                    {
                      inline_data: {
                        mime_type: mimeType,
                        data: imageData,
                      },
                    },
                  ],
                },
              ],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 8192,
              },
            };
          } else {
            // Text-only input
            requestBody = {
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
            };
          }

          const resp = await fetch(
            `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(requestBody),
            }
          );

          if (resp.ok) {
            data = await resp.json();
            break;
          }

          lastErrText = await resp.text();
        } catch (error: any) {
          lastErrText = error.message;
          continue;
        }
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

    // Check multiple possible locations for the response text
    const text = 
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.output ||
      data?.candidates?.[0]?.text;

    return NextResponse.json({
      response: text,
      language,
    });
  } catch (error: any) {
    console.error("Error in AI chat:", error);
    return NextResponse.json(
      {
        error: "Failed to generate response",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

