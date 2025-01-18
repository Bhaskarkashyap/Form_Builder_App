"use server"

import formSchema, { formSchemaType } from "@/app/schemas/form"
import prisma from "@/lib/prisma"


// const userid = 1

export async function GetFormStats() {

    const stats = await prisma.form.aggregate({
        _sum: {
            visits: true,
            submission: true
        }
    })

    const visits = stats._sum.visits || 0;
    const submission = stats._sum.submission || 0;

    let submissionRate = 0;

    if (visits > 0) {
        submissionRate = (submission / visits) * 100;
    }

    const bounceRate = 100 - submissionRate;

    return { visits, submission, submissionRate, bounceRate }
}



export async function CreateForm(data: formSchemaType) {
    const validation = formSchema.safeParse(data)

    if (!validation.success) {
        throw new Error("form not valid")
    }


    const form = await prisma.form.create({
        data: {
            name: data.name,
            description: data.description
        }
    })

    if (!form) {
        throw new Error("something wents wrong!!")
    }

    return form.id
}


export async function GetForm() {
    return await prisma.form.findMany()
}


export async function GetFormById(id: number) {
    return await prisma.form.findUnique({
        where: {
            id
        }
    })
}


export async function UpdateFormContent(id: number, jsonContent: string) {
    return await prisma.form.update({
        where: {
            id
        },
        data: {
            content: jsonContent
        }
    })

}

export async function PublishForm(id: number) {
    return await prisma.form.update({
        data: {
            published: true,
        },
        where: {
            id
        }
    })
}


export async function GetFormContentByUrl(formUrl: string) {
    return await prisma.form.update({
        select: {
            content: true
        },
        data: {
            visits: {
                increment: 1
            }
        },
        where: {
            shareURL: formUrl
        }
    })
}

export async function SubmitForm(formUrl: string, content: string) {
    return await prisma.form.update({
        data: {
            submission: {
                increment: 1
            },
            FormSubmission: {
                create: {
                    content
                }
            }
        },

        where: {
            shareURL: formUrl,
            published: true
        }

    })
}

export async function GetFormWithSubmission(id: number) {
    return await prisma.form.findUnique({
        where: {
            id
        },
        include: {
            FormSubmission: true
        }
    })
}