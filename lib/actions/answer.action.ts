"use server";

import Answer from "@/database/answer.model";
import { connectToDB } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnsweParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared";
import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";

export async function createAnswer(params: CreateAnsweParams) {
  try {
    connectToDB();
    const { author, question, content, path } = params;
    const newAnswer = await Answer.create({
      author,
      question,
      content,
      path,
    });

    await Question.findByIdAndUpdate(question, {
      $push: { answers: newAnswer._id },
    });
    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    connectToDB();
    const { questionId } = params;
    const answers = await Answer.find({ question: questionId })
      .populate({ path: "author", model: User })
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    connectToDB();
    const { answerId, userId, hasupVoted, hasdownVoted, path } = params;
    let updateQuery = {};
    if (hasupVoted) {
      updateQuery = { $pull: { upvotes: userId } };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    }else {
        updateQuery = { $addToSet: { upvotes: userId }}
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })
    if (!answer) {
        throw new Error('Answer Not Found')
    }
    revalidatePath(path)
  } catch (error) {
    console.log(error);
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
    try {
        connectToDB()
        const { userId, answerId, hasupVoted, hasdownVoted, path } = params

        let updateQuery = {}

        if (hasdownVoted) {
            updateQuery = { $pull: { downvotes: userId}}
        }else if (hasupVoted) {
            updateQuery = { $pull : { upvotes: userId }, $push: { downvotes: userId }}
        }else {
            updateQuery = { $addToSet: {downvotes: userId}}
        }

        const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, { new: true })
        if (!answer) {
            throw new Error('Answer not found')
        }

        revalidatePath(path)
    } catch (error) {
        console.log(error);
        
    }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
      connectToDB()
      const { answerId, path } = params
      const answer = await Answer.findById(answerId)
      if (!answer) {
        throw new Error('Answer not found')
      }
      await Answer.deleteOne({ _id: answerId })
      await Question.updateMany({ answers: answerId }, { $pull: { answers: answerId }})
      await Interaction.deleteMany({ answer: answerId })
      revalidatePath(path)
  } catch (error) {
      console.log(error);
      
  }
}
