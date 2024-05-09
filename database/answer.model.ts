import { Schema, model, models, Document } from "mongoose";

export interface IAnswer extends Document {
    author: Schema.Types.ObjectId,
    question: Schema.Types.ObjectId,
    content: string,
    upvotes: Schema.Types.ObjectId[],
    downvotes: Schema.Types.ObjectId[],
    createdAt: Date
}

const AnswerSchema =new Schema({
    author: { type: String, required: true, ref: 'User'}, 
    question: { type: String, required: true, ref: 'Question'}, 
    content: { type: String, required: true}, 
    upvotes: [{ type: String, ref: 'User'}], 
    downvotes: [{ type: String, ref: 'User'}], 
    createdAt: { type: Date, default: Date.now}, 
})

const Answer = models.Answer || model('Answer', AnswerSchema)
export default Answer