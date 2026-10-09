import { Metadata, ResolvingMetadata } from 'next';
import Navbar from '@/components/navigation';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import placeholderData from '@/app/lib/placeholder-images.json';

// Shared data for demonstration - in production fetch from DB
const blogPosts = [
  {
    id: "1",
    title: "Solving branding exposure issues for SMEs who need care packages for their workforce.",
    description: "Discover how custom-branded care packages can boost employee morale while turning every team member into a brand ambassador.",
    date: "May 12, 2024",
    imageId: "sme-care-packages"
  },
  {
    id: "2",
    title: "Packaging for Purpose: Delivering Hope to Marginalized Communities.",
    description: "How Boxmoc's durable shipper and supplier boxes are being used to combat food insecurity and provide critical healthcare resources.",
    date: "May 18, 2024",
    imageId: "community-aid-packages"
  },
];

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = (await params).id;
  const post = blogPosts.find((p) => p.id === id);

  if (!post) return { title: 'Post Not Found' };

  const img = placeholderData.blog.find(i => i.id === post.imageId);
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: new Date(post.date).toISOString(),
      images: [img?.url || '', ...previousImages],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [img?.url || ''],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const id = (await params).id;
  const post = blogPosts.find((p) => p.id === id);

  if (!post) notFound();

  const img = placeholderData.blog.find(i => i.id === post.imageId);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container max-w-4xl mx-auto py-12 px-4">
        <div className="space-y-6">
          <p className="text-primary font-bold uppercase tracking-widest text-sm">{post.date}</p>
          <h1 className="text-4xl md:text-6xl font-bold font-headline leading-tight">{post.title}</h1>
          <div className="rounded-2xl overflow-hidden aspect-video relative shadow-2xl">
             <Image 
                src={img?.url || ''} 
                fill 
                alt={post.title} 
                className="object-cover"
                data-ai-hint={img?.hint}
             />
          </div>
          <div className="prose prose-lg dark:prose-invert max-w-none pt-8">
            <p className="text-xl text-muted-foreground leading-relaxed italic border-l-4 border-primary pl-6 py-2">
                {post.description}
            </p>
            <p className="mt-8">
                Content coming soon... This is a placeholder for the full article detail page of Boxmoc's initiative to solve branding exposure and community aid through innovative packaging solutions.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
