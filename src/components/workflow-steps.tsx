import React from 'react';
import { BrainCircuit, Paintbrush, PackageCheck, Truck } from 'lucide-react';

const workflowSteps = [
    {
        icon: <BrainCircuit className="h-10 w-10 text-primary" />,
        title: "1. Describe Your Vision",
        description: "Start with a simple text prompt. Describe your idea, and our AI will generate unique design concepts for packaging, cards, flyers, and more in seconds."
    },
    {
        icon: <Paintbrush className="h-10 w-10 text-primary" />,
        title: "2. Customize & Preview",
        description: "Refine your favorite design. Use our intuitive tools to add logos, text, and graphics. See your creation come to life from every angle with our instant 3D previews."
    },
    {
        icon: <PackageCheck className="h-10 w-10 text-primary" />,
        title: "3. Finalize & Order",
        description: "Once your design is perfect, choose your materials and quantities. Our straightforward ordering process makes it easy to move from design to production."
    },
    {
        icon: <Truck className="h-10 w-10 text-primary" />,
        title: "4. Production & Shipping",
        description: "We handle the rest. Our network of high-quality printers and manufacturers produce your items with care and precision, shipping them directly to your door."
    }
];

const ArrowConnector = () => (
    <div className="w-auto pt-16 flex-shrink-0">
        <svg width="82" height="24" viewBox="0 0 82 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M1 12H81" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/30" />
            <path d="M1 12H81" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 8" className="text-primary animate-dash-flow" />
            <path d="M71 2L81 12L71 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary" />
        </svg>
    </div>
);

const VerticalLineConnector = () => (
    <div className="flex justify-center h-12">
        <div className="w-px bg-border border-dashed" />
    </div>
);

const WorkflowCard = ({ step }: { step: typeof workflowSteps[0] }) => (
    <div className="flex flex-col items-center text-center group">
        <div className="p-6 bg-background rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-primary/20 group-hover:-translate-y-2 h-40 w-64 flex flex-col items-center justify-center">
            <div className="p-4 bg-primary/10 rounded-full transition-colors group-hover:bg-primary/20">
                {step.icon}
            </div>
        </div>
        <h3 className="text-xl font-bold font-headline mt-6 mb-2">{step.title}</h3>
        <p className="text-muted-foreground text-sm">{step.description}</p>
    </div>
);

export function WorkflowSteps() {
  return (
    <section id="workflow" className="w-full py-12 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 lg:mb-20">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            From Idea to Delivery
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Our streamlined process makes bringing your creations to life effortless.
          </p>
        </div>

        {/* Desktop horizontal layout */}
        <div className="hidden lg:flex items-start justify-center gap-4 xl:gap-8">
            <div className="w-1/4 flex justify-center">
                <WorkflowCard step={workflowSteps[0]} />
            </div>
            <ArrowConnector />
            <div className="w-1/4 flex justify-center">
                <WorkflowCard step={workflowSteps[1]} />
            </div>
            <ArrowConnector />
            <div className="w-1/4 flex justify-center">
                <WorkflowCard step={workflowSteps[2]} />
            </div>
            <ArrowConnector />
            <div className="w-1/4 flex justify-center">
                <WorkflowCard step={workflowSteps[3]} />
            </div>
        </div>
        
        {/* Mobile vertical layout */}
        <div className="lg:hidden flex flex-col items-center gap-8">
            <WorkflowCard step={workflowSteps[0]} />
            <VerticalLineConnector />
            <WorkflowCard step={workflowSteps[1]} />
            <VerticalLineConnector />
            <WorkflowCard step={workflowSteps[2]} />
            <VerticalLineConnector />
            <WorkflowCard step={workflowSteps[3]} />
        </div>
      </div>
    </section>
  );
}
