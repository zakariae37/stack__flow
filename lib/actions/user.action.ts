"use server";

import User from "@/database/user.model";
import { connectToDB } from "../mongoose";
import { CreateUserParams, DeleteUserParams, UpdateUserParams } from "./shared";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";

export async function getUserById(params: any) {
  try {
    connectToDB();
    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function createUser(userData:CreateUserParams) {
    try {
        connectToDB()
        
        const newUser = await User.create(userData)
        return newUser
    } catch (error) {
        console.log(error);
        
    }
}

export async function updateUser(params:UpdateUserParams) {
    try {
        connectToDB()
        const {clerkId, updateData, path} = params
        await User.findOneAndUpdate({clerkId}, updateData, { new: true })
        revalidatePath(path)
    } catch (error) {
        console.log(error);
    }
}

export async function deleteUser(params: DeleteUserParams) {
    try {
        connectToDB()
        const { clerkId } = params

        const user = await User.findOneAndDelete({ clerkId })

        if (!user) {
            throw new Error('User not found')
        }

        // delete user from db
        // delete questins, comments , answer ...

        // get question ids

        // const userQuestionIds = await Question.find({ author: user._id}).distinct('_id')

        // delete user questions

        await Question.deleteMany({ author: user._id})

        const deletedUser = await User.findByIdAndDelete(user._id)

        return deletedUser
    } catch (error) {
        console.log(error);
        throw error
    }
}