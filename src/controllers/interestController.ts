import { Request, Response } from "express";
import Interest, { IInterest } from "../db/interestModel";
import { jwtDecode } from "jwt-decode";
import User, {IUser} from '../db/userModel'

interface myToken {
  userId: string;
  iat: number;
  exp: number;
}

export const createInterest = async (req: Request, res: Response) => {
  try {
    // Extract interest creation data from request body
    const { categories } = req.body;

    if(!categories){
        res.json({message:"All fields required"});
    }

    const token = req.cookies.accessToken;
    const user = jwtDecode<myToken>(token);
    if(!user){
        return res.json({message: "Invalid Token Login Again"})
    }

    const _id = user.userId;

    const interestedUser: IUser |null = await  User.findOne({_id});
    console.log(interestedUser)
    const email = interestedUser?.email;

    // Create a new interest instance
    const newInterest = new Interest({
      userId: _id,
      categories,
      email:email,
    });

    // Save the interest to the database
    await newInterest.save();

    // Send a success response
    res.status(201).json({ message: "Job interests created successfully",newInterest });
  } catch (error) {
    // Handle interest creation errors
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
