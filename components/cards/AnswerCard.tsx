import Link from 'next/link'
import React from 'react'
import { formatNumberWithExtension, getTimestamp } from '@/lib/utils'
import Metric from '../shared/Metric'
import { SignedIn } from '@clerk/nextjs'
import EditDeleteAction from '../shared/EditDeleteAction'

interface Props {
    _id: string,
    author: {_id: string, clerkId: string, username: string, picture: string},
    upvotes: number,
    question: {_id: string, title: string},
    clerkId?: string | null,
    createdAt: Date,
}
const AnswerCard = ({ _id, author, upvotes, question, clerkId, createdAt }: Props) => {
    const showActionButtons = clerkId && clerkId === author.clerkId
  return (
    <Link href={`/question/${question._id}/#${_id}`} className='card-wrapper rounded-[10px] p-9 sm:px-11'>
        <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
            <div>
                <span className='subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden'>
                    {getTimestamp(createdAt)}
                </span>
                <h3 className='sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1'>{question.title}</h3>
            </div>
            <SignedIn>
                {showActionButtons && (
                    <EditDeleteAction 
                        type='Answer'
                        itemId={JSON.stringify(_id)}
                    />
                )}
            </SignedIn>
        </div>
        <div className='flex-between mt-6 w-full flex-wrap gap-3'>
            <Metric 
                imgUrl={author.picture}
                alt='user'
                value={author.username}
                title={` -asked ${getTimestamp(createdAt)}`}
                href={`/profile/${author.clerkId}`}
                isAuthor
                textStyles="body-medium text-dark400_light800"
            />
            <Metric 
                imgUrl='/assets/icons/like.svg'
                alt='Upvotes'
                value={formatNumberWithExtension(upvotes)}
                title=' Votes'
                textStyles="small-medium text-dark400_light800"
            />
        </div>
    </Link>
  )
}

export default AnswerCard
