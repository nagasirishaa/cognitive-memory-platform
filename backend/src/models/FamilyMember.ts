import mongoose, { Document, Schema } from "mongoose";

export interface IFamilyMember extends Document {
  patientId: string;
  name: string;
  relationship: string;
  age?: number;
}

const familyMemberSchema = new Schema<IFamilyMember>(
  {
    patientId: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    relationship: {
      type: String,
      required: true,
      trim: true,
    },

    age: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const FamilyMember = mongoose.model<IFamilyMember>(
  "FamilyMember",
  familyMemberSchema
);

export default FamilyMember;