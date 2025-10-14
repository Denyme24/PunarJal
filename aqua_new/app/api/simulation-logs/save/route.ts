import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import SimulationLog from "@/models/SimulationLog";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    // Verify authentication
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);
    if (!decoded || !decoded.id) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Connect to database
    await connectDB();

    // Get user details
    const user = await User.findById(decoded.id).select("organizationEmail location");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const {
      source,
      sourceName,
      inputParameters,
      simulationResult,
      sessionId,
    } = body;

    // Validate required fields
    if (!source || !inputParameters || !simulationResult) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: source, inputParameters, simulationResult",
        },
        { status: 400 }
      );
    }

    // Validate source
    if (!["simulation_page", "iot_sensors", "map_view"].includes(source)) {
      return NextResponse.json(
        {
          error:
            'Invalid source. Must be one of: simulation_page, iot_sensors, map_view',
        },
        { status: 400 }
      );
    }

    // Create simulation log
    const simulationLog = new SimulationLog({
      userId: decoded.id,
      userEmail: user.organizationEmail,
      userLocation: user.location,
      source,
      sourceName,
      inputParameters: {
        turbidity: inputParameters.turbidity,
        pH: inputParameters.pH,
        cod: inputParameters.cod,
        tds: inputParameters.tds,
        nitrogen: inputParameters.nitrogen,
        phosphorus: inputParameters.phosphorus,
        reuseType: inputParameters.reuseType,
      },
      simulationResult: {
        primaryTreatment: simulationResult.primaryTreatment,
        secondaryTreatment: simulationResult.secondaryTreatment,
        tertiaryTreatment: simulationResult.tertiaryTreatment,
        overallStatus: simulationResult.overallStatus,
        totalStagesRequired: simulationResult.totalStagesRequired,
        estimatedTreatmentTime: simulationResult.estimatedTreatmentTime,
        estimatedEfficiency: simulationResult.estimatedEfficiency,
      },
      sessionId,
      timestamp: new Date(),
    });

    await simulationLog.save();

    return NextResponse.json({
      success: true,
      message: "Simulation log saved successfully",
      logId: simulationLog._id,
    });
  } catch (error: any) {
    console.error("Error saving simulation log:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to save simulation log" },
      { status: 500 }
    );
  }
}

