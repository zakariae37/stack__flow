'use server'
import Question from "@/database/question.model";
import { connectToDB } from "../mongoose";
import { CreateQuestionParams } from "./shared";
import Tag from "@/database/tag.model";
import { revalidatePath } from "next/cache";

export async function createQuestion(params: CreateQuestionParams) {
    try {
        connectToDB()
        const { title, content, tags, author, path } = params

        const question = await Question.create({
            title,
            content,
            author
        })

        const tagDocuments = []

        for (const tag of tags) {
            const existingTag = await Tag.findOneAndUpdate({ name: { $regex: new RegExp(`^${tag}$`, "i") }},
            { $setOnInsert: { name: tag }, $push: { question: question._id} },
            { upsert: true, new: true })
            tagDocuments.push(existingTag._id)
        }

        await Question.findOneAndUpdate(question._id, 
        { $push: { tags: { $each: tagDocuments }}}
        )

        revalidatePath(path)
    } catch (error) {
        console.log(error);    
    }
}