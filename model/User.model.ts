import mongoose, { Schema, Document } from "mongoose";
export interface Message extends Document {
  content: string;
  createdAt: Date;
}
const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});
export interface User extends Document {
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  vrifyCodeExpires: Date;
  isAcceptingMessages: boolean;
  isVerified: boolean;
  messages: Message[];
}
const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
      "Please fill a valid email address",
    ],
  },
  password: { type: String, required: [true, "Password is required"] },
  verifyCode: { type: String, required: true },
  vrifyCodeExpires: { type: Date, required: true },
  isAcceptingMessages: { type: Boolean, default: true, },
  isVerified: { type: Boolean, default: false },
  messages: [MessageSchema],
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);
export default UserModel;