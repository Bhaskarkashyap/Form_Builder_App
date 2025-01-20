import { GetFormById, GetFormWithSubmission } from '@/actions/form'
import FormLinkShare from '@/components/FormLinkShare';
import VisitBtn from '@/components/VisitBtn';

import { Captions, MousePointerClick, View } from 'lucide-react'


import React, { ReactNode } from 'react'
import { StatsCard } from '../../page';
import { ElementsType, FormElementInstance } from '@/components/FormElements';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistance } from 'date-fns';

async function FormDeailPage({params} : {params : { id : string};}){
    
    const {id} = await params;
    const form = await GetFormById(Number(id))

    if(!form) {
        throw new Error("form not found")
    }
   const { visits, submission } = form;

    let submissionRate = 0;

    if (visits > 0) {
        submissionRate = (submission / visits) * 100;
    }

    const bounceRate = 100 - submissionRate;
  return (
    <>
    <div className='py-10 border-t border-b border-muted'>
      <div className='flex justify-between container'>
        <h1 className='text-4xl font-bold truncate'>{form.name}</h1>
        <VisitBtn shareUrl = {form.shareURL} />
      </div>
      </div>
      <div className='py-4 border-b border-muted'>
        <div className='container flex gap-2 items-center justify-between'>
          <FormLinkShare shareUrl={form.shareURL} />
        </div>
      </div>
        <div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container'>
          
    <StatsCard title="Total Visits"
    helperText= "All time form vists"
    loading={false}
    value={visits.toLocaleString() || ""}
    className = 'shadow-md shadow-purple-600 '
    icon = <View className='text-purple-600' size={16} />
    />
    
    <StatsCard title="Total Submission"
    helperText= "All time form Submission"
    loading={false}
    value={submission.toLocaleString() || ""}
    className = 'shadow-md shadow-green-600 '
    icon = <Captions className='text-green-600' size={16}  />
    />
    <StatsCard title="Submission Rate"
    helperText= "All time form SubmissionRate"
    loading={false}
    value={submissionRate.toLocaleString() + '%' || ""}
     className = 'shadow-md shadow-red-600 '
    icon = <MousePointerClick className='text-red-600' size={16} />
    />
    <StatsCard title="Bounce Rate"
    helperText= "Visits that leaves without interacting"
    loading={false}
    value={bounceRate.toLocaleString() + '%' || ""}
     className = 'shadow-md shadow-gray-600 ' 
    icon = <View className='text-gray-600' size={16} />
    />
        </div>
      
    <div className='container pt-10'>
      <SubmissionsTable id={form.id} />
    </div>
    </>
  )
}

export default FormDeailPage

type Row = { [key : string]:string} & {
  submittedAt: Date;
}

async function SubmissionsTable({id} : {id: number}) {
  const form = await GetFormWithSubmission(id)
   
  if(!form){
    throw new Error('form not found')
  }

  const formElements = JSON.parse(form.content) as FormElementInstance[]

  const columns: {
    id: string;
    label: string;
    required: boolean;
    type:ElementsType
  }[] = [];

  formElements.forEach(element => {
    switch(element.type){
      case 'TextField':
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label as string,
          required: element.extraAttributes?.required as boolean,
          type:element.type,
        });
        break;
        default:
          break;
    }
  })

const rows: Row[] = []

form.FormSubmission.forEach(submission => {
  const content = JSON.parse(submission.content);
  rows.push({
    ...content,
    submittedAt: submission.createdAt
  })
})
  return(
    <>
    <h1 className='text-2xl font-bold my-4'>Submission</h1>
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.id} className='uppercase'>
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
         {
          rows.map((row, index) => (
            <TableRow key={index}>
              {
                columns.map(column =>(
                  <RowCell key={column.id} type={column.type} value={row[column.id]} />
                ))
              }
              <TableCell className='text-muted-foreground text-right'>
                {
                  formatDistance(row.submittedAt, new Date(),{
                    addSuffix:true
                  })
                }
              </TableCell>
            </TableRow>
          ))
         }
        </TableBody>
      </Table>
    </div>
    </>
  )
}

function RowCell({type, value}: {type: ElementsType, value: string}) {
   const node: ReactNode = value;

   return <TableCell>{node}</TableCell>
}