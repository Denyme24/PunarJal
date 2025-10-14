import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      );
    }

    // Return available Gemini models that we know are supported
    const availableModels = [
      {
        name: 'gemini-1.5-flash',
        displayName: 'Gemini 1.5 Flash',
        description: 'Fast and efficient model for quick responses',
        supportedGenerationMethods: ['generateContent'],
      },
      {
        name: 'gemini-1.5-pro',
        displayName: 'Gemini 1.5 Pro',
        description: 'Advanced model for complex reasoning and analysis',
        supportedGenerationMethods: ['generateContent'],
      },
      {
        name: 'gemini-1.0-pro',
        displayName: 'Gemini 1.0 Pro',
        description: 'Reliable model for general purpose tasks',
        supportedGenerationMethods: ['generateContent'],
      },
    ];

    return NextResponse.json({
      models: availableModels,
      count: availableModels.length,
      message: 'Available Gemini models for PunarJal AI AGOS',
    });
  } catch (error: any) {
    console.error('Error listing models:', error);
    return NextResponse.json(
      {
        error: 'Failed to list models',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
