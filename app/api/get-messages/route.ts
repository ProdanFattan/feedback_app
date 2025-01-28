import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;
  if (!session || !user) {
    return Response.json(
      {
        status: false,
        message: "You are not logged in",
      },
      {
        status: 401,
      }
    );
  }
  const userId = new mongoose.Types.ObjectId(user._id);
  try {
    const user = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "$messages" } } },
    ]);
    if (!user || user.length === 0) {
      return Response.json(
        {
          status: false,
          message: "No messages found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        status: true,
        message: user[0].messages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Error fetching user data", error);
    return Response.json(
      {
        status: false,
        message: "Error fetching messages from database",
      },
      {
        status: 500,
      }
    );
  }
}
