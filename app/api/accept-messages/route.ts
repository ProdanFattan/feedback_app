import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { User } from "next-auth";

export async function POST(req: Request) {
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
  const userId = user._id;
  const { acceptMessages } = await req.json();
  try {
    const userDoc = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessages: acceptMessages },
      { new: true }
    );
    if (!userDoc) {
      return Response.json(
        {
          status: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        status: true,
        message: "User settings updated successfully",
        userDoc,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to update user status to accept messages", error);
    return Response.json(
      {
        status: false,
        message: "Failed to update user status to accept messages",
      },
      {
        status: 500,
      }
    );
  }
}

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
  const userId = user._id;

  try {
    const userDoc = await UserModel.findById(userId);
    if (!userDoc) {
      return Response.json(
        {
          status: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    return Response.json(
      {
        status: true,
        isAcceptingMessages: userDoc.isAcceptingMessages,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log("Failed to find Message status", error);
    return Response.json(
      {
        status: false,
        message: "Failed to find message status",
      },
      {
        status: 500,
      }
    );
  }
}


