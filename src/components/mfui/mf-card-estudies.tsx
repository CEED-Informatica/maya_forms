// shadcn/ui
import { Button } from "@/components/ui/button"
import {
  Card, CardContent,
  CardDescription, CardFooter,
  CardHeader, CardTitle,
} from "@/components/ui/card"

// iconos
import { ArrowRight } from "lucide-react"
import { icons } from "@/components/mfui/icons"

// React Router DOM
import { Link } from "react-router-dom"

export default function MFCardStudies({data}: any) {
  return (
    <Card className="mx-4 my-4 cursor-pointer w-64 py-4 px-2 bg-card rounded-2xl shadow-md hover:bg-muted transition-colors duration-200 border border-border" 
          style={{ borderColor: data.color }}> 
      <CardHeader>
        <div className="flex items-center space-x-4">
          { data.icon && <img src={icons[data.icon]} alt="icono" className="w-10 h-10"/>}
          <div>
            <CardTitle>{data.abbr}</CardTitle>
            <CardDescription>{data.name}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex justify-center">
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" style={{ backgroundColor: data.color, borderColor: data.color }}>
          <div>
          <Link key={data.abbr} to={`/selector/procedures/${data.abbr}`}>Acceder</Link> 
          <ArrowRight />  
          </div>
        </Button>
      </CardFooter>
    </Card> 
  )
}