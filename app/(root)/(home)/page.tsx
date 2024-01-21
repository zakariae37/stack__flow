/* eslint-disable tailwindcss/no-custom-classname */
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient text-light-900 min-h-[46px] px-6 py-3">
            Ask a Question
          </Button>
        </Link>
      </div>
    </>
  );
}
