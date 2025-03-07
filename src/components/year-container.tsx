import { Badge } from "./ui/badge";

export function YearContainer({year}:{year:string|undefined}){
    const currentYear = new Date().getFullYear();
return <Badge
variant={
  Number(year || 0) === currentYear
    ? "go"
    : Number(year || 0) < currentYear
      ? "destructive"
      : "warn"
}
>
{year}
</Badge>

}