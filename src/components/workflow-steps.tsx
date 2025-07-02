
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

const ArrowConnectorUp = () => (
    <div className="flex-1 h-32">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
             <defs>
                <marker id="arrowhead-up" markerWidth="7" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <polygon points="0 0, 7 2.5, 0 5" className="fill-primary" />
                </marker>
            </defs>
            <path d="M5 95C25 95, 25 5, 95 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/30" markerEnd="url(#arrowhead-up)" />
            <path d="M5 95C25 95, 25 5, 95 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 8" className="text-primary animate-dash-flow" />
        </svg>
    </div>
);

const ArrowConnectorDown = () => (
    <div className="flex-1 h-32">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
            <defs>
                <marker id="arrowhead-down" markerWidth="7" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <polygon points="0 0, 7 2.5, 0 5" className="fill-primary" />
                </marker>
            </defs>
            <path d="M5 5C25 5, 25 95, 95 95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/30" markerEnd="url(#arrowhead-down)" />
            <path d="M5 5C25 5, 25 95, 95 95" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="8 8" className="text-primary animate-dash-flow" />
        </svg>
    </div>
);

const VerticalArrowConnector = () => (
    <div className="flex justify-center h-20">
        <svg viewBox="0 0 20 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-auto h-full">
            <defs>
                <marker id="arrowhead-vertical" markerWidth="7" markerHeight="5" refX="5" refY="2.5" orient="auto-start-reverse">
                    <polygon points="0 0, 7 2.5, 0 5" className="fill-primary" />
                </marker>
            </defs>
            <path 
                d="M 10 0 C -10 20, 30 60, 10 80" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary/30" 
                markerEnd="url(#arrowhead-vertical)" 
            />
            <path 
                d="M 10 0 C -10 20, 30 60, 10 80"
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeDasharray="6 6" 
                className="text-primary animate-dash-flow" 
            />
        </svg>
    </div>
);


const WorkflowCard = ({ step }: { step: typeof workflowSteps[0] }) => (
    <div className="flex flex-col items-center text-center group">
        <div className="p-6 bg-background rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-primary/20 group-hover:-translate-y-2 w-full">
            <div className="inline-block p-4 bg-primary/10 rounded-full transition-colors group-hover:bg-primary/20">
                {step.icon}
            </div>
            <h3 className="text-xl font-bold font-headline mt-6 mb-2">{step.title}</h3>
            <p className="text-muted-foreground text-sm">{step.description}</p>
        </div>
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

        {/* Desktop horizontal staggered layout */}
        <div className="hidden lg:flex items-start justify-center">
            {workflowSteps.map((step, index) => (
                <React.Fragment key={index}>
                    <div className={`w-56 xl:w-64 shrink-0 ${index % 2 !== 0 ? 'pt-32' : 'pt-0'}`}>
                        <WorkflowCard step={step} />
                    </div>
                    {index < workflowSteps.length - 1 && (
                       index % 2 === 0 ? <ArrowConnectorDown /> : <ArrowConnectorUp />
                    )}
                </React.Fragment>
            ))}
        </div>
        
        {/* Mobile vertical layout */}
        <div className="lg:hidden flex flex-col items-center gap-4 max-w-xs mx-auto">
             {workflowSteps.map((step, index) => (
                <React.Fragment key={`mobile-${index}`}>
                    <WorkflowCard step={step} />
                    {index < workflowSteps.length - 1 && <VerticalArrowConnector />}
                </React.Fragment>
             ))}
        </div>
      </div>
    </section>
  );
}
