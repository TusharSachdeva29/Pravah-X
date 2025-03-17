import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  funFact: string;
}

function FeatureCard({ icon, title, description, funFact }: FeatureCardProps) {
  return (
    <Card className="flex flex-col items-center text-center hover:shadow-lg transition-shadow hover:scale-105 transform duration-300">
      <CardHeader>
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">{icon}</div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
        <p className="mt-4 text-xs italic text-primary">{funFact}</p>
      </CardContent>
    </Card>
  )
}

export default FeatureCard