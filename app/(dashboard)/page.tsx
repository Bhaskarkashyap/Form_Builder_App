import { GetForm, GetFormStats } from '@/actions/form'
import CreateFormButton from '@/components/createFormButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Form } from '@prisma/client'
import { formatDistance } from 'date-fns'
import { Captions, FilePenLine, MousePointerClick, View } from 'lucide-react'
import Link from 'next/link'
import React, { Suspense } from 'react'


import { ThemeSwitcher } from '@/components/ThemeSwitcher'
import UserButton from '@/components/UserButton'
import { ScrollText } from 'lucide-react'

const DashboardPage = async () => {
  const forms = await GetForm()
  return (
<div className='mx-auto'>
<nav className='flex justify-between items-center border-b border-border h-[60px] px-4 py-2'>
    <div className='flex gap-x-2'>
    <ScrollText size={15} /> 
    <h1 className='font-bold'>
    <Link href={"/?visited=true"}>
    Form Builder
    </Link>
      </h1>
    </div>
    <div className='flex gap-4 items-center'>
      <ThemeSwitcher />
      <UserButton url='/landingpage' label='Log Out' />
    </div>
  </nav>
    <div className='container pt-4 w-full mt-5 gap-y-5 relative'>

      <Suspense fallback={<StatsCards loading={true} />}><CardStatsWrapper /></Suspense>
  
    <Separator className='my-6' />
    <div className='mb-10'>
    <CreateFormButton />
    </div>
    {/* <h2 className='text-4xl font-bold col-span-2'>Your Forms</h2>
    <Separator className='my-6' /> */}
    {!forms.length && <h1 className='text-muted-foreground text-center'>Not yet create form...</h1>}
     <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
     <Suspense fallback = {[1,2,3,4].map(el => <FormCardSkeleton key={el} />)}>
     <FormCards />
      </Suspense>
     </div>
    </div>
</div>
  )
}

async function CardStatsWrapper(){
  const stats = await GetFormStats();

  return <StatsCards loading={false} data={stats} />
}

interface StateProps {
data?: Awaited<ReturnType<typeof GetFormStats>>,
loading: boolean
}

 function StatsCards(props: StateProps) {
  const {data , loading } = props;

  return (
<>
<h2 className='font-bold text-xl'>Overview</h2>
    <div className='w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
    
    <StatsCard title="Total Visits"
    helperText= "All time form vists"
    loading={loading}
    value={data?.visits.toLocaleString() || ""}
    className = 'shadow-md  bg-[#e9e9e6]  text-black'
    icon = <View className='text-purple-600' size={16} />
    />
    
    <StatsCard title="Total Submission"
    helperText= "All time form Submission"
    loading={loading}
    value={data?.submission.toLocaleString() || ""}
    className = 'shadow-md bg-purple-100 text-black'
    icon = <Captions className='text-green-600' size={16}  />
    />
    <StatsCard title="Submission Rate"
    helperText= "All time form SubmissionRate"
    loading={loading}
    value={data?.submissionRate.toLocaleString() + '%' || ""}
     className = 'shadow-md bg-green-100 text-black '
    icon = <MousePointerClick className='text-red-600' size={16} />
    />
    <StatsCard title="Bounce Rate"
    helperText= "Visits that leaves without interacting"
    loading={loading}
    value={data?.bounceRate.toLocaleString() + '%' || ""}
     className = 'shadow-md bg-blue-100 text-black' 
    icon = <View className='text-gray-600' size={16} />
    />
  
  </div>
</>
  )
}


export function StatsCard({title, helperText, loading, value, className, icon}: {
  title: string;
  value: string;
  helperText: string;
  loading: boolean
  className?: string
  icon: React.ReactNode
}) {
  return <Card className={cn(className, 'rounded-none')}>

    <CardHeader className='flex flex-row items-center justify-between pb-2'>
      <CardTitle className='text-sm font-medium'>{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className='text-2xl font-bold'>
       { loading &&(
        <Skeleton>
          <span className='opacity-0 '>0</span>
        </Skeleton>
       )}
       {!loading && value}
      </div>
      <p className='text-xs pt-1'>{helperText}</p>
    </CardContent>
  </Card>
}

function FormCardSkeleton(){
  return <Skeleton className='border-2 border-primary-/20 h-[190px] w-full' />
}


async function FormCards() {
  const forms = await GetForm()

  return (
   <>
   {
    forms.map((form) => (
      <FormCard key={form.id} form={form} />
    ))
   }
   </>
  )
}

function FormCard({form} : {form : Form}){
return <Card>
  <CardHeader>
    <CardTitle className='flex items-center gap-2 justify-between'>
      <span className='truncate font-bold '>{form.name}</span>
      {form.published && <Badge>Published</Badge>}
      {!form.published && <Badge variant={"destructive"}>Draft</Badge>}
    </CardTitle>
    <CardDescription className='flex items-center justify-between text-muted-foreground text-sm '>
      {formatDistance(form.createdAt, new Date(), {
        addSuffix: true
      })}
      {/* {
        form.published && <span></span>
      } */}
    </CardDescription>
  </CardHeader>
  <CardContent className='h-[20px] truncate text-sm text-muted-foreground '>
    {form.description || "No description"}
  </CardContent>
  <CardFooter>
    {form.published && (
      <Button asChild className='w-full mt-2 text-md gap-4'>
        <Link href={`/forms/${form.id}`}>View Submission</Link> 
      </Button>
    )}
    {!form.published && (
      <Button asChild className='w-full mt-2 text-md gap-4'  variant={"secondary"}>
        <Link href={`/builder/${form.id}`}>Edit Form <FilePenLine /></Link> 
      </Button>
    )}
  </CardFooter>
</Card>
}


export default DashboardPage