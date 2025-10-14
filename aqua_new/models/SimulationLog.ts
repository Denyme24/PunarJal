import mongoose from "mongoose";

export interface ISimulationLog extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userEmail: string;
  userLocation?: string;
  
  // Source of simulation
  source: "simulation_page" | "iot_sensors" | "map_view";
  sourceName?: string; // e.g., "Hebbal Lake" for map/IoT sources
  
  // Input parameters
  inputParameters: {
    turbidity: number;
    pH: number;
    cod: number;
    tds: number;
    nitrogen: number;
    phosphorus: number;
    reuseType?: string;
  };
  
  // Simulation result
  simulationResult: {
    primaryTreatment: {
      name: string;
      required: boolean;
      reason: string[];
      parameters: Array<{
        name: string;
        value: number;
        threshold: number;
        unit: string;
        exceedsThreshold: boolean;
      }>;
    };
    secondaryTreatment: {
      name: string;
      required: boolean;
      reason: string[];
      parameters: Array<{
        name: string;
        value: number;
        threshold: number;
        unit: string;
        exceedsThreshold: boolean;
      }>;
    };
    tertiaryTreatment: {
      name: string;
      required: boolean;
      reason: string[];
      parameters: Array<{
        name: string;
        value: number;
        threshold: number;
        unit: string;
        exceedsThreshold: boolean;
      }>;
    };
    overallStatus: "safe" | "needs-treatment" | "critical";
    totalStagesRequired: number;
    estimatedTreatmentTime: number;
    estimatedEfficiency: number;
  };
  
  // Metadata
  timestamp: Date;
  sessionId?: string;
}

const SimulationLogSchema = new mongoose.Schema<ISimulationLog>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    userLocation: {
      type: String,
    },
    source: {
      type: String,
      enum: ["simulation_page", "iot_sensors", "map_view"],
      required: true,
      index: true,
    },
    sourceName: {
      type: String,
    },
    inputParameters: {
      turbidity: { type: Number, required: true },
      pH: { type: Number, required: true },
      cod: { type: Number, required: true },
      tds: { type: Number, required: true },
      nitrogen: { type: Number, required: true },
      phosphorus: { type: Number, required: true },
      reuseType: { type: String },
    },
    simulationResult: {
      primaryTreatment: {
        name: String,
        required: Boolean,
        reason: [String],
        parameters: [
          {
            name: String,
            value: Number,
            threshold: Number,
            unit: String,
            exceedsThreshold: Boolean,
          },
        ],
      },
      secondaryTreatment: {
        name: String,
        required: Boolean,
        reason: [String],
        parameters: [
          {
            name: String,
            value: Number,
            threshold: Number,
            unit: String,
            exceedsThreshold: Boolean,
          },
        ],
      },
      tertiaryTreatment: {
        name: String,
        required: Boolean,
        reason: [String],
        parameters: [
          {
            name: String,
            value: Number,
            threshold: Number,
            unit: String,
            exceedsThreshold: Boolean,
          },
        ],
      },
      overallStatus: {
        type: String,
        enum: ["safe", "needs-treatment", "critical"],
      },
      totalStagesRequired: Number,
      estimatedTreatmentTime: Number,
      estimatedEfficiency: Number,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    sessionId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
SimulationLogSchema.index({ userId: 1, timestamp: -1 });
SimulationLogSchema.index({ userLocation: 1, timestamp: -1 });

export default mongoose.models.SimulationLog ||
  mongoose.model<ISimulationLog>("SimulationLog", SimulationLogSchema);

