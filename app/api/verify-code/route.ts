import UserModel from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import { z } from "zod";
import {verifySchema} from "@/schemas/verifySchema";

export async function POST(req: Request){
    await dbConnect();
    try {
        const {username, code} = await req.json();
    
    
        // const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({username});
        console.log(user);
        
        if(!user){
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
        
        const result = verifySchema.safeParse({verifyCode: code});
        
        if(!result.success){
            const codeError = result.error.format().verifyCode?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: codeError?.length > 0 ? codeError.join(", ") : "Invalid code",
                },
                {
                    status: 400,
                }
            );
        }
        const {verifyCode} = result.data;
        const isCodeMatched = user.verifyCode === verifyCode;
        const isCodeExpired = new Date() < user.vrifyCodeExpires;
        if(isCodeMatched && isCodeExpired){
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "User verified successfully",
                },
                {
                    status: 200,
                }
            );
        }else if(!isCodeMatched){
            return Response.json(
                {
                    success: false,
                    message: "Invalid code 2",
                },
                {
                    status: 400,
                }
            );
        }else{
            return Response.json(
                {
                    success: false,
                    message: "Code expired",
                },
                {
                    status: 400,
                }
            );
        }
            

    } catch (error) {
        console.log("error during username cheaking", error);
    return Response.json(
      {
        success: false,
        message: "Error during username cheaking",
      },
      {
        status: 500,
      }
    );
    }
}