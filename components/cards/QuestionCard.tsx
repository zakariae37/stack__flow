import Link from 'next/link'
import React from 'react'
import RenderTag from '../shared/RenderTag'
import { formatNumberWithExtension, getTimestamp } from '@/lib/utils'
import Metric from '../shared/Metric'
import { SignedIn } from '@clerk/nextjs'
import EditDeleteAction from '../shared/EditDeleteAction'

interface Props {
    _id: string,
    title: string,
    tags: {_id: string, name: string}[],
    author: {_id: string, username: string, picture: string},
    upvotes: string[],
    views: number,
    clerkId?: string,
    answers: Array<object>,
    createdAt: Date,
}
const QuestionCard = ({ _id, title, tags, author, upvotes, views, answers, clerkId,  createdAt }: Props) => {
    const showActionButtons = clerkId && clerkId === author.clerkId // check if the user who is logged in is the author who create the question
  return (
    <div className='card-wrapper rounded-[10px] p-9 sm:px-11'>
        <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
            <div>
                <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
                    {getTimestamp(createdAt)}
                </span>
                <Link
                    href={`/question/${_id}`}
                >
                    <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>{title}</h3>
                </Link>
            </div>
            <SignedIn>
                {showActionButtons && (
                    <EditDeleteAction 
                        type='Question'
                        itemId={JSON.stringify(_id)}
                    />
                )}
            </SignedIn>
        </div>
        <div className='mt-3.5 flex flex-wrap gap-2'>
            {tags.map((tag) => (
                <RenderTag 
                    key={tag._id}
                    _id={tag._id}
                    name={tag.name}
                />
            ))}
        </div>
        <div className='flex-between mt-6 w-full flex-wrap gap-3'>

            <Metric 
                imgUrl={author.picture}
                alt='user'
                value={author.username}
                title={` -asked ${getTimestamp(createdAt)}`}
                href={`/profile/${author._id}`}
                isAuthor
                textStyles="body-medium text-dark400_light800"
            />
           
            <Metric 
                imgUrl='/assets/icons/like.svg'
                alt='Upvotes'
                value={formatNumberWithExtension(upvotes.length)}
                title=' Votes'
                textStyles="small-medium text-dark400_light800"
            />
            <Metric 
                imgUrl='/assets/icons/message.svg'
                alt='message'
                value={formatNumberWithExtension(answers.length)}
                title=" Answers"
                textStyles="small-medium text-dark400_light800"
            />
            <Metric 
                imgUrl="/assets/icons/eye.svg"
                alt="eye"
                value={formatNumberWithExtension(views)}
                title=" Views"
                textStyles="small-medium text-dark400_light800"
            />
        </div>
    </div>
  )
}

export default QuestionCard