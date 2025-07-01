
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

export function WorkflowSteps() {
  return (
    <section id="workflow" className="w-full py-12 md:py-24 lg:py-32 bg-card">
      <div className="container px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
            From Idea to Delivery
          </h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Our streamlined process makes bringing your creations to life effortless.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {workflowSteps.map((step, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-background rounded-xl shadow-lg transition-transform duration-300 hover:scale-105">
              <div className="mb-4 p-4 bg-primary/10 rounded-full">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold font-headline mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
