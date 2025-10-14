import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY || ""
);

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get("audio") as Blob;
    const language = (formData.get("language") as string) || "en";

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // Convert Blob to base64
    const arrayBuffer = await audioFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Audio = buffer.toString("base64");

    const languageNames: Record<string, string> = {
      en: "English",
      hi: "Hindi",
      mr: "Marathi",
      kn: "Kannada",
      bn: "Bengali",
      ur: "Urdu",
    };

    const languageName = languageNames[language] || "English";

    const prompt = `Please transcribe the following audio. The audio is likely in ${languageName}. Provide only the transcription text, nothing else.`;

    // First, list available models
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

    let data: any | null = null;
    let lastErrText = "";

    // Try both v1 and v1beta endpoints
    const apiVersions = ["v1", "v1beta"];

    for (const version of apiVersions) {
      for (const model of availableModels) {
        try {
          const requestBody = {
            contents: [
              {
                role: "user",
                parts: [
                  { text: prompt },
                  {
                    inline_data: {
                      mime_type: "audio/webm",
                      data: base64Audio,
                    },
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 1024,
            },
          };

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
          error: "Audio transcription failed with all models: " + lastErrText,
        },
        { status: 500 }
      );
    }

    // Check multiple possible locations for the response text
    const transcription = 
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.output ||
      data?.candidates?.[0]?.text || "";

    const cleanTranscription = transcription.trim();

    return NextResponse.json({
      text: cleanTranscription,
      language,
    });
  } catch (error: any) {
    console.error("Error transcribing audio:", error);
    
    // Return a user-friendly message if transcription fails
    return NextResponse.json(
      {
        error: "Failed to transcribe audio",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

