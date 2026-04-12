import mongoose from "mongoose";

const createrSchema = new mongoose.Schema(
  {
    // ── AUTHENTICATION ─────────────────────────────────────────────────────
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },

    // ── PERSONAL DETAILS ──────────────────────────────────────────────────
    name: { type: String, trim: true },
    mobile_no: { type: String, trim: true },
    designation: { type: String, trim: true },
    category: { type: String, trim: true },
    aadhar: { type: String, select: false },

    // ── INSTITUTIONAL AFFILIATION ─────────────────────────────────────────
    college: { type: String, trim: true },
    faculty: { type: String, trim: true },
    school: { type: String, trim: true },
    department: { type: String, trim: true },

    // ── PROGRAMME / DISCIPLINE ────────────────────────────────────────────
    programme: { type: String, trim: true },
    discipline: { type: String, trim: true },
    course: { type: String, trim: true },

    // ── PROGRAMME IDENTITY ────────────────────────────────────────────────
    programId: { type: String, trim: true },
    programName: { type: String, trim: true },

    // ── ASSIGNED DOCUMENTS ────────────────────────────────────────────────
    assigned_pd: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProgramDocument",
      },
    ],
    assigned_cd: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "CourseDocument",
      },
    ],

    // ── ROLE & ACCESS ─────────────────────────────────────────────────────
    role: {
      type: String,
      enum: ["creator"],
      default: "creator",
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    blocked: { type: Boolean, default: false },
    blocked_reason: { type: String },
    blocked_at: { type: Date },
    blocked_by: { type: String },

    // ── TOKEN FOR NOTIFICATIONS ──────────────────────────────────────────
    createrToken: {
      type: String,
      sparse: true,
      unique: true
    },

    last_updated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "last_updated",
    },
  }
);

// ── INDEXES for common queries ───────────────────────────────────────────────
createrSchema.index({ programId: 1 });
createrSchema.index({ faculty: 1, school: 1 });
createrSchema.index({ status: 1, blocked: 1 });

const Creater = mongoose.model("Creater", createrSchema);
export default Creater;