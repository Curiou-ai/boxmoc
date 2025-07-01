'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import { Button } from "@/components/ui/button";
import Link from "next/link";

const features = [
  {
    value: "ai-generation",
    title: "AI Generation",
    description: "Describe your vision in plain text. Our advanced AI generates unique concepts for packaging, cards, flyers, and more in seconds. It's like having a dedicated designer, available 24/7.",
    imageUrl: "https://placehold.co/600x450.png",
    imageHint: "AI design interface",
    learnMoreUrl: "#",
  },
  {
    value: "3d-preview",
    title: "3D Previews",
    description: "Don't just imagine it—see it. Rotate, zoom, and inspect your designs from every angle with our dynamic, real-time 3D previews for packaging and products. Ensure every detail is perfect.",
    imageUrl: "https://placehold.co/600x450.png",
    imageHint: "3d box render",
    learnMoreUrl: "#",
  },
  {
    value: "customization",
    title: "Easy Customization",
    description: "Take full control of your designs. Easily upload logos, add custom text with various fonts, and use our intuitive tools to create everything from business cards to complex packaging. For specialized requests, you can even connect with our expert designers directly through the in-app chat.",
    imageUrl: "https://placehold.co/600x450.png",
    imageHint: "design tool palette",
    learnMoreUrl: "#",
  }
];

export default function FeaturesTabs() {
  return (
    <Tabs defaultValue={features[0].value} className="w-full">
      <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-x-2 md:gap-x-6 h-auto bg-transparent p-0 border-b">
        {features.map((feature) => (
          <TabsTrigger
            key={feature.value}
            value={feature.value}
            className="text-sm sm:text-lg font-semibold text-muted-foreground p-3 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none bg-transparent whitespace-nowrap focus-visible:ring-offset-0 focus-visible:ring-2"
          >
            {feature.title}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <div className="mt-8">
        {features.map((feature) => (
           <TabsContent key={feature.value} value={feature.value}>
              <Card className="overflow-hidden shadow-lg border-2 border-primary/10">
                <div className="grid md:grid-cols-2">
                    <div className="p-8 md:p-12 space-y-6 flex flex-col justify-center">
                        <h3 className="text-2xl md:text-3xl font-bold font-headline text-left">{feature.title}</h3>
                        <p className="text-muted-foreground text-base md:text-lg text-left">{feature.description}</p>
                        <Button asChild className="self-start">
                          <Link href={feature.learnMoreUrl}>
                            Learn More
                          </Link>
                        </Button>
                    </div>
                    <div className="bg-muted min-h-[300px] md:h-auto order-first md:order-last">
                        <Image
                            src={feature.imageUrl}
                            width={600}
                            height={450}
                            alt={feature.title}
                            data-ai-hint={feature.imageHint}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
              </Card>
           </TabsContent>
        ))}
      </div>
    </Tabs>
  )
}
