import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import bycrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();
    const existingUserVerifiedByUsername = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingUserVerifiedByUsername) {
      return Response.json(
        {
          success: false,
          message: "Username already exists",
        },
        {
          status: 400,
        }
      );
    }
    const existingUserVerifiedByEmail = await UserModel.findOne({
      email,
    });
    const verifyCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    if (existingUserVerifiedByEmail) {
        if(existingUserVerifiedByEmail.isVerified){
            return Response.json(
                {
                  success: false,
                  message: "Email already exists",
                },
                {
                  status: 400,
                }
              );
        } else {
            const hashPassword = await bycrypt.hash(password, 10);
            existingUserVerifiedByEmail.password = hashPassword;
            existingUserVerifiedByEmail.verifyCode = verifyCode;
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            existingUserVerifiedByEmail.vrifyCodeExpires = expiryDate;
            await existingUserVerifiedByEmail.save();
        }
    } else {
      const hashPassword = await bycrypt.hash(password, 10);
      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);
      const user = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode,
        vrifyCodeExpires: expiryDate,
        isVerified: false,
        isAcceptingMessages: true,
        messages: [],
      });
      await user.save();
    }

    //sending verification email
    const emailResponse = await sendVerificationEmail(
      email,
      username,
      verifyCode
    );
    if (emailResponse.success) {
      return Response.json(
        {
          success: true,
          message: "User registered successfully",
        },
        {
          status: 201,
        }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: emailResponse.message,
        },
        {
          status: 500,
        }
      );
    }


  } catch (error) {
    console.log("Error during registering user", error);
    return Response.json(
      {
        success: false,
        message: "Error during registering user",
      },
      {
        status: 500,
      }
    );
  }
}
