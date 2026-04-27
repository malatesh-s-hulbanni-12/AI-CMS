// import mongoose from "mongoose";

// const Section2Schema = new mongoose.Schema(
//   {
//     programId: { type: String, required: true, index: true },
//     version: { type: String, required: true },

//     // --- Program Overview ---
//     programOverview: { type: String, required: true }, // Long text field

//     // --- Objectives & Outcomes ---
//     // Using array of strings for flexibility
//     peos: [{ type: String }], // Program Educational Objectives
//     pos: [{ type: String }], // Program Outcomes (Graduate Attributes)
//     psos: [{ type: String }], // Program Specific Outcomes

//     // --- Audit ---
//     createdBy: { type: String, required: true },
//     approvedBy: { type: String, default: null },
//     isApproved: { type: Boolean, default: false },
//   },
//   { timestamps: true },
// );

// Section2Schema.index({ programId: 1, version: 1 }, { unique: true });

// export default mongoose.model("PD_Section2_Objectives", Section2Schema);


import mongoose from "mongoose";

const Section2Schema = new mongoose.Schema(
  {
    programId: { type: String, required: true, index: true },
    schemeYear: { type: String, required: true }, // ⭐ ADD THIS FIELD
    version: { type: String, required: true },

    // --- Program Overview ---
    programOverview: { type: String, required: true }, // Long text field

    // --- Objectives & Outcomes ---
    // Using array of strings for flexibility
    peos: [{ type: String }], // Program Educational Objectives
    pos: [{ type: String }], // Program Outcomes (Graduate Attributes)
    psos: [{ type: String }], // Program Specific Outcomes

    // --- Audit ---
    createdBy: { type: String, required: true },
    approvedBy: { type: String, default: null },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// ⭐ FIX: Include schemeYear in unique index
// OLD (causing error):
// Section2Schema.index({ programId: 1, version: 1 }, { unique: true });

// NEW (correct):
Section2Schema.index(
  { programId: 1, schemeYear: 1, version: 1 }, 
  { unique: true }
);

export default mongoose.model("PD_Section2_Objectives", Section2Schema);