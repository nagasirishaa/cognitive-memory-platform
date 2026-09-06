import mongoose, { Document, Schema } from "mongoose";

export interface IReminder extends Document {
  patientId: string;
  title: string;
  description?: string;
  date: string;
  time: string;
}

const reminderSchema = new Schema<IReminder>(
  {
    patientId: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: false,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Reminder = mongoose.model<IReminder>("Reminder", reminderSchema);

export default Reminder;