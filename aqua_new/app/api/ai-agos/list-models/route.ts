import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function GET(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // List available models
    const models = await genAI.listModels();
    
    const modelList = models.map((model: any) => ({
      name: model.name,
      displayName: model.displayName,
      supportedGenerationMethods: model.supportedGenerationMethods,
    }));

    return NextResponse.json({
      models: modelList,
      count: modelList.length,
    });
  } catch (error: any) {
    console.error("Error listing models:", error);
    return NextResponse.json(
      {
        error: "Failed to list models",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

