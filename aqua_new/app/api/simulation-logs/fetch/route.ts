import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import SimulationLog from "@/models/SimulationLog";

export async function GET(request: Request) {
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

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const source = searchParams.get("source"); // Optional filter by source
    const includeAll = searchParams.get("includeAll") === "true"; // Include all users' logs

    // Build query
    const query: any = includeAll ? {} : { userId: decoded.id };
    
    if (source && ["simulation_page", "iot_sensors", "map_view"].includes(source)) {
      query.source = source;
    }

    // Fetch simulation logs
    const logs = await SimulationLog.find(query)
      .sort({ timestamp: -1 }) // Most recent first
      .limit(Math.min(limit, 100)) // Cap at 100
      .select("-__v") // Exclude version key
      .lean();

    // Calculate statistics
    const stats = {
      totalLogs: await SimulationLog.countDocuments(query),
      safeCount: logs.filter(
        (log: any) => log.simulationResult?.overallStatus === "safe"
      ).length,
      treatmentCount: logs.filter(
        (log: any) => log.simulationResult?.overallStatus === "needs-treatment"
      ).length,
      criticalCount: logs.filter(
        (log: any) => log.simulationResult?.overallStatus === "critical"
      ).length,
      averageEfficiency:
        logs.length > 0
          ? (
              logs.reduce(
                (sum: number, log: any) =>
                  sum + (log.simulationResult?.estimatedEfficiency || 0),
                0
              ) / logs.length
            ).toFixed(1)
          : 0,
      bySource: {
        simulation_page: logs.filter(
          (log: any) => log.source === "simulation_page"
        ).length,
        iot_sensors: logs.filter((log: any) => log.source === "iot_sensors")
          .length,
        map_view: logs.filter((log: any) => log.source === "map_view").length,
      },
    };

    return NextResponse.json({
      success: true,
      logs,
      stats,
      count: logs.length,
    });
  } catch (error: any) {
    console.error("Error fetching simulation logs:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to fetch simulation logs" },
      { status: 500 }
    );
  }
}

