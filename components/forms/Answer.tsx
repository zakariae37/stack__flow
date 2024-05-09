"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { AnswerSchema } from "@/lib/validations";
import { Editor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import Image from "next/image";
import { createAnswer } from "@/lib/actions/answer.action";
import { usePathname } from "next/navigation";

interface Props {
  question: string,
  questionId: string,
  authorId: string
}

const Answer = ({ question, questionId, authorId } : Props) => {
  const pathname = usePathname()
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      answer: "",
    },
  });

  async function handleCreateAnswer(values: z.infer<typeof AnswerSchema>) {
      setIsSubmitting(true)
    try {
      await createAnswer({
        content: values.answer,
        author: JSON.parse(authorId),
        question: JSON.parse(questionId),
        path: pathname
      })
      form.reset() // add new response

      if (editorRef.current) { // this for clear the form
        const editor = editorRef.current as any // as any is for typScript
        editor.setContent('')
      }
    } catch (error) {
      console.log(error);
    }finally{
      setIsSubmitting(false)
    }
  }
  return (
    <div>
      <div className="flex flex-col justify-between sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button className="gap-x-2 bg-gray-100">
          <Image
            src="/assets/icons/stars.svg"
            alt="stars"
            width={12}
            height={12}
            className="object-contain"
          />
          Generate an AI Answer
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleCreateAnswer)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    apiKey={process.env.NEXT_PUBLIC_TINY_EDITOR_API_KEY}
                    onInit={(evt, editor) => {
                      // @ts-ignore
                      editorRef.current = editor;
                    }}
                    onBlur={field.onBlur}
                    onEditorChange={(content) => field.onChange(content)}
                    initialValue=""
                    init={{
                      height: 350,
                      menubar: false,
                      plugins: [
                        "advlist",
                        "autolink",
                        "lists",
                        "link",
                        "image",
                        "charmap",
                        "preview",
                        "anchor",
                        "searchreplace",
                        "visualblocks",
                        "codesample",
                        "fullscreen",
                        "insertdatetime",
                        "media",
                        "table",
                      ],
                      toolbar:
                        "undo redo | " +
                        "codesample | bold italic forecolor | alignleft aligncenter " +
                        "alignright alignjustify | bullist numlist ",
                      content_style:
                        "body { font-family:Inter,Arial; font-size:16px }",
                    }}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              disabled={isSubmitting}
              className="primary-gradient w-fit text-white"
              type="submit"
            >
              {isSubmitting ? "Submitting..." : "Submite"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Answer;
