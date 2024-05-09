"use server";

import Interaction from "@/database/interaction.model";
import { connectToDB } from "../mongoose";
import { ViewQuestionParams } from "./shared";
import Question from "@/database/question.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    connectToDB();

    const { userId, questionId } = params;

    // increment the number of views

    await Question.findByIdAndUpdate(questionId, { $inc: { views: 1 } });

    if (userId) {
      // if the user already view
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });
      if (existingInteraction) {
        return console.log('User has already viewed');
      }

      // create an interaction 

      await Interaction.create ({
        user: userId,
        action: 'view',
        question: questionId
      })
    }

    
  } catch (error) {
    console.log(error);
  }
}
