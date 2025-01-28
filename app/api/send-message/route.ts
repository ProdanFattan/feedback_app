import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { Message } from "@/model/User.model";

export async function POST(req: Request) {
  await dbConnect();
  const { username, content } = await req.json();
  try {
    const user = await UserModel.findOne({ username });
    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        {
          status: 404,
        }
      );
    }
    if (!user.isAcceptingMessages) {
      return Response.json(
        {
          success: false,
          message: "User is not accepting messages",
        },
        {
          status: 403,
        }
      );
    }
    const newMessage = {content, createdAt: new Date()};
    user.messages.push(newMessage as Message);
    await user.save();
    return Response.json({
        success: true,
        message: "Message sent successfully",
    },{
        status: 201,
    })
  } catch (error) {
    console.log("Error during sending message: ", error);
    return Response.json(
      {
        status: false,
        message: "Error during sending message",
      },
      {
        status: 500,
      }
    );
  }
}
