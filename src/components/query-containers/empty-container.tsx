interface EmptyContainerProps{
    message:String,
    children?:React.ReactNode
}
export default function EmptyContainer({message,children}:EmptyContainerProps){
return <div className="flex flex-col gap-4 min-h-[20rem] items-center justify-center">
<p className="max-w-sm text-muted-foreground text-center">{message}</p>
{children}
</div>
}