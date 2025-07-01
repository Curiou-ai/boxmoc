'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const testimonials = [
  {
    quote: "Creative geniuses who listen, understand, and craft captivating visuals - an agency that truly understands our needs.",
    name: "Gabrielle Williams",
    title: "CEO, ABC Company",
    avatar: "https://placehold.co/48x48.png",
    avatarHint: "woman smiling"
  },
  {
    quote: "Exceeded our expectations with innovative designs that brought our vision to life - a truly remarkable creative agency.",
    name: "Samantha Johnson",
    title: "Founder, XYZ Corp",
    avatar: "https://placehold.co/48x48.png",
    avatarHint: "professional woman"
  },
  {
    quote: "Their ability to capture our essence in every project is unparalleled - an invaluable creative collaborator.",
    name: "Isabella Rodriguez",
    title: "Marketing Director, Innovate Ltd.",
    avatar: "https://placehold.co/48x48.png",
    avatarHint: "woman portrait"
  },
  {
    quote: "From concept to execution, their creativity knows no bounds - a game-changer for our brand's success.",
    name: "Natalie Martinez",
    title: "Brand Manager, Tech Solutions",
    avatar: "https://placehold.co/48x48.png",
    avatarHint: "woman brunette"
  },
  {
    quote: "A refreshing and imaginative agency that consistently delivers exceptional results - highly recommended for any project.",
    name: "Victoria Thompson",
    title: "Head of Design, Creative Co.",
    avatar: "https://placehold.co/48x48.png",
    avatarHint: "woman glasses"
  },
  {
    quote: "Their team's artistic flair and strategic approach resulted in remarkable campaigns - a reliable creative partner.",
    name: "John Peter",
    title: "E-commerce Founder",
    avatar: "https://placehold.co/48x48.png",
    avatarHint: "man professional"
  },
];

const QuoteIcon = () => (
    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary mb-4">
        <path d="M8.21308 17.8115C6.35417 17.8115 4.75781 17.1828 3.42422 15.9255C2.09063 14.6682 1.42383 13.125 1.42383 11.296C1.42383 9.46696 2.06738 7.67969 3.35449 5.93424C4.6416 4.18879 6.20801 2.50293 8.05371 0.876628L9.94629 2.5625C8.42383 3.90625 7.23486 5.15283 6.37939 6.29916C5.52393 7.44548 5.09619 8.5332 5.09619 9.5625C5.09619 9.93262 5.18213 10.2539 5.35401 10.5264C5.52588 10.7988 5.86475 11.1357 6.37012 11.5371C6.87549 11.9385 7.43262 12.1392 8.04102 12.1392C8.78027 12.1392 9.42383 11.8315 9.97168 11.2163C10.5195 10.6011 10.7935 9.875 10.7935 9.03906H11.4556C11.4556 10.8682 10.8716 12.4355 9.70362 13.7412C8.53565 15.0469 8.21308 15.7095 8.21308 17.8115ZM21.3123 17.8115C19.4534 17.8115 17.857 17.1828 16.5234 15.9255C15.1898 14.6682 14.523 13.125 14.523 11.296C14.523 9.46696 15.1666 7.67969 16.4536 5.93424C17.7407 4.18879 19.3071 2.50293 21.1528 0.876628L23.0454 2.5625C21.523 3.90625 20.334 5.15283 19.4785 6.29916C18.623 7.44548 18.1953 8.5332 18.1953 9.5625C18.1953 9.93262 18.2813 10.2539 18.4531 10.5264C18.625 10.7988 18.9639 11.1357 19.4692 11.5371C19.9746 11.9385 20.5317 12.1392 21.1401 12.1392C21.8794 12.1392 22.523 11.8315 23.0708 11.2163C23.6187 10.6011 23.8926 9.875 23.8926 9.03906H24.5547C24.5547 10.8682 23.9707 12.4355 22.8027 13.7412C21.6348 15.0469 21.3123 15.7095 21.3123 17.8115Z" fill="currentColor"/>
    </svg>
)

const TestimonialCard = ({ testimonial }: { testimonial: typeof testimonials[0] }) => {
    return (
        <Card className="w-[380px] shrink-0 bg-background shadow-md">
            <CardContent className="p-6">
                <QuoteIcon />
                <blockquote className="text-foreground/80 mb-6">{testimonial.quote}</blockquote>
                <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} data-ai-hint={testimonial.avatarHint} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default function Testimonials() {
  return (
    <section id="testimonials" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            Words of praise from others about our presence.
          </h2>
        </div>
        <div className="relative flex flex-col gap-6 overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
            <div className="flex min-w-full shrink-0 items-stretch justify-around gap-6 animate-marquee-left [animation-play-state:running] hover:[animation-play-state:paused]">
                {testimonials.map((t, i) => <TestimonialCard key={`p1-${i}`} testimonial={t} />)}
                {testimonials.map((t, i) => <TestimonialCard key={`p1-dup-${i}`} testimonial={t} />)}
            </div>
            <div className="flex min-w-full shrink-0 items-stretch justify-around gap-6 animate-marquee-right [animation-play-state:running] hover:[animation-play-state:paused]">
                {testimonials.slice(0).reverse().map((t, i) => <TestimonialCard key={`p2-${i}`} testimonial={t} />)}
                {testimonials.slice(0).reverse().map((t, i) => <TestimonialCard key={`p2-dup-${i}`} testimonial={t} />)}
            </div>
        </div>
      </div>
    </section>
  )
}
