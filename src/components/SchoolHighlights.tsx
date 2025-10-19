import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const highlights = [
  {
    id: 1,
    title: "Library Building",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=800&auto=format&fit=crop",
    description: "Modern learning facilities with extensive resources"
  },
  {
    id: 2,
    title: "Engineering Department",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop",
    description: "State-of-the-art laboratories and workshops"
  },
  {
    id: 3,
    title: "Campus View",
    image: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&auto=format&fit=crop",
    description: "Beautiful campus grounds and facilities"
  },
  {
    id: 4,
    title: "Student Center",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop",
    description: "Hub for student activities and collaboration"
  },
  {
    id: 5,
    title: "Science Building",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop",
    description: "Advanced research and teaching facilities"
  },
];

export const SchoolHighlights = () => {
  const [hoveredSide, setHoveredSide] = useState<'left' | 'right' | null>(null);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Campus Highlights
          </h2>
          <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
            Explore our beautiful campus facilities and departments
          </p>
        </div>

        <div 
          className="relative max-w-5xl mx-auto"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const width = rect.width;
            if (x < width * 0.2) {
              setHoveredSide('left');
            } else if (x > width * 0.8) {
              setHoveredSide('right');
            } else {
              setHoveredSide(null);
            }
          }}
          onMouseLeave={() => setHoveredSide(null)}
        >
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {highlights.map((highlight) => (
                <CarouselItem key={highlight.id}>
                  <div className="relative group">
                    <div className="aspect-[16/9] overflow-hidden rounded-lg">
                      <img
                        src={highlight.image}
                        alt={highlight.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {highlight.title}
                      </h3>
                      <p className="text-white/90">
                        {highlight.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <CarouselPrevious 
              className={`left-4 transition-all duration-300 ${
                hoveredSide === 'left' 
                  ? 'opacity-100 scale-110' 
                  : 'opacity-0 scale-90'
              }`}
            />
            <CarouselNext 
              className={`right-4 transition-all duration-300 ${
                hoveredSide === 'right' 
                  ? 'opacity-100 scale-110' 
                  : 'opacity-0 scale-90'
              }`}
            />
          </Carousel>
        </div>
      </div>
    </section>
  );
};
