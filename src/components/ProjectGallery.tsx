import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Dialog, DialogContent, DialogClose, DialogTitle, DialogDescription } from "./ui/dialog";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  image: string;
  images: string[];
  description: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Modern Downtown Penthouse",
    category: "Living Room",
    location: "Dubai Marina",
    image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwbW9kZXJufGVufDF8fHx8MTc1OTc1MTk3OHww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1600210492493-0946911123ea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaXZpbmclMjByb29tJTIwbW9kZXJufGVufDF8fHx8MTc1OTc1MTk3OHww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1631679706909-1844bbd07221?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTc0MzU1Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1658893136904-63914a6b372c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXNoZWQlMjBsaXZpbmclMjByb29tfGVufDF8fHx8MTc1OTcxNDEwNXww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Complete transformation of a 3,000 sq ft penthouse featuring custom furniture, statement lighting, and curated art pieces."
  },
  {
    id: 2,
    title: "Minimalist Bedroom Retreat",
    category: "Bedroom",
    location: "Palm Jumeirah",
    image: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGx1eHVyeXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGx1eHVyeXxlbnwxfHx8fDE3NTk3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1680210850481-66ee30ca2a48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYmVkcm9vbSUyMGRlc2lnbnxlbnwxfHx8fDE3NTk2ODg4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Serene master bedroom with platform bed, custom nightstands, and floor-to-ceiling windows overlooking the Arabian Gulf."
  },
  {
    id: 3,
    title: "Elegant Dining Experience",
    category: "Dining Room",
    location: "Business Bay",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwcm9vbSUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1617806118233-18e1de247200?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwcm9vbSUyMG1vZGVybnxlbnwxfHx8fDE3NTk3NTU2MTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1758448500631-644bb3c1c942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbGVnYW50JTIwZGluaW5nJTIwcm9vbXxlbnwxfHx8fDE3NTk2NDYwNjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1698133469198-2459cff8665d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXNoZWQlMjBkaW5pbmclMjByb29tfGVufDF8fHx8MTc1OTcxNDgyMXww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Sophisticated dining space with walnut table, designer chairs, and statement chandelier perfect for entertaining."
  },
  {
    id: 4,
    title: "Executive Home Office",
    category: "Office",
    location: "DIFC",
    image: "https://images.unsplash.com/photo-1519086588705-c935fdedcc14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwb2ZmaWNlfGVufDF8fHx8MTc1OTcxNDgyMnww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1519086588705-c935fdedcc14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBob21lJTIwb2ZmaWNlfGVufDF8fHx8MTc1OTcxNDgyMnww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1669723008642-b00fa9d10b76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob21lJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDF8fHx8MTc1OTY0NDMzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Productive workspace featuring executive desk, ergonomic seating, and custom built-in storage solutions."
  },
  {
    id: 5,
    title: "Contemporary Living Space",
    category: "Living Room",
    location: "JBR",
    image: "https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NjU5MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1667584523543-d1d9cc828a15?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NjU5MjM3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1758974835125-83ba4f9d7e25?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHlsaXNoJTIwYXBhcnRtZW50JTIwaW50ZXJpb3J8ZW58MXx8fHwxNzU5NzE0ODIyfDA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Open-concept living room with sectional sofa, media console, and curated accessories for beach-side living."
  },
  {
    id: 6,
    title: "Luxury Apartment Package",
    category: "Full Home",
    location: "Downtown Dubai",
    image: "https://images.unsplash.com/photo-1603072845032-7b5bd641a82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk2NTYyODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1603072845032-7b5bd641a82a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBhcGFydG1lbnQlMjBpbnRlcmlvcnxlbnwxfHx8fDE3NTk2NTYyODF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1758924093181-c31e7ad291cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250ZW1wb3JhcnklMjBsaXZpbmclMjBzcGFjZXxlbnwxfHx8fDE3NTk3MTQ4MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Complete furnishing of a 2-bedroom apartment with modern aesthetic throughout all living spaces."
  },
  {
    id: 7,
    title: "Cozy Reading Nook",
    category: "Special Spaces",
    location: "Arabian Ranches",
    image: "https://images.unsplash.com/photo-1730832970158-152ffa2307e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmVhZGluZyUyMG5vb2t8ZW58MXx8fHwxNzU5NzE1ODE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1730832970158-152ffa2307e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmVhZGluZyUyMG5vb2t8ZW58MXx8fHwxNzU5NzE1ODE4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1705304368090-933597b11c55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwYmVkcm9vbSUyMGZ1cm5pdHVyZXxlbnwxfHx8fDE3NTk3MTQ4MjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Personal sanctuary with accent chair, bookshelf, floor lamp, and throw pillows for the perfect reading corner."
  },
  {
    id: 8,
    title: "Scandinavian Living",
    category: "Living Room",
    location: "The Springs",
    image: "https://images.unsplash.com/photo-1662059360857-9a46f20c85f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmUlMjByb29tfGVufDF8fHx8MTc1OTc0MDYzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1662059360857-9a46f20c85f8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmdXJuaXR1cmUlMjByb29tfGVufDF8fHx8MTc1OTc0MDYzN3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Light and airy living space featuring clean lines, natural materials, and functional Nordic design principles."
  },
  {
    id: 9,
    title: "Master Bedroom Suite",
    category: "Bedroom",
    location: "Emirates Hills",
    image: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    images: [
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBiZWRyb29tJTIwZGVzaWdufGVufDF8fHx8MTc1OTc1NTY0M3ww&ixlib=rb-4.1.0&q=80&w=1080",
    ],
    description: "Opulent master suite with upholstered bed, matching nightstands, bench, and luxurious textiles."
  },
];

export function ProjectGallery() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Living Room", "Bedroom", "Dining Room", "Office", "Full Home", "Special Spaces"];

  const filteredProjects = selectedCategory === "All" 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => 
        prev === selectedProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handlePrevImage = () => {
    if (selectedProject) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? selectedProject.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <section id="our-work" className="bg-white py-24 md:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-16 text-center max-w-3xl mx-auto">
          <h1 className="mb-4 text-[48px]">Our Work</h1>
          <p className="text-muted-foreground text-lg text-[20px]">
            Explore our portfolio of completed projects and see how we've transformed spaces across the region
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2.5 rounded-full text-sm transition-all ${
                selectedCategory === category
                  ? "bg-stone-900 text-white shadow-md"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className={`group cursor-pointer ${
                index % 5 === 0 || index % 5 === 4 ? "md:row-span-2" : ""
              }`}
              onClick={() => handleProjectClick(project)}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 h-full">
                <div className={`relative ${
                  index % 5 === 0 || index % 5 === 4 ? "aspect-[4/5]" : "aspect-[4/3]"
                }`}>
                  <ImageWithFallback
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/90 via-stone-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Project Info Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <div className="transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm text-stone-900 text-xs rounded-full mb-3">
                      {project.category}
                    </span>
                    <h3 className="text-white mb-1 drop-shadow-lg">{project.title}</h3>
                    <p className="text-white/80 text-sm drop-shadow">{project.location}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Project Detail Dialog */}
        <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
          <DialogContent className="max-w-5xl p-0 overflow-hidden">
            <DialogTitle className="sr-only">
              {selectedProject?.title || "Project Details"}
            </DialogTitle>
            <DialogDescription className="sr-only">
              View detailed images and information about this project
            </DialogDescription>
            <DialogClose className="absolute right-4 top-4 z-50 rounded-full bg-white/90 backdrop-blur-sm p-2 text-stone-900 hover:bg-white transition-colors shadow-lg">
              <X className="h-5 w-5" />
            </DialogClose>

            {selectedProject && (
              <div className="grid md:grid-cols-2">
                {/* Image Gallery */}
                <div className="relative bg-stone-100">
                  <div className="aspect-square relative">
                    <ImageWithFallback
                      src={selectedProject.images[currentImageIndex]}
                      alt={`${selectedProject.title} - Image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Navigation Arrows */}
                  {selectedProject.images.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </Button>

                      {/* Image Counter */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-stone-900/80 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
                        {currentImageIndex + 1} / {selectedProject.images.length}
                      </div>
                    </>
                  )}

                  {/* Thumbnail Navigation */}
                  {selectedProject.images.length > 1 && (
                    <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 px-4">
                      {selectedProject.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            index === currentImageIndex
                              ? "bg-white w-8"
                              : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Project Details */}
                <div className="p-8 md:p-12 flex flex-col">
                  <div className="flex-1">
                    <span className="inline-block px-3 py-1 bg-stone-100 text-stone-900 text-sm rounded-full mb-4">
                      {selectedProject.category}
                    </span>
                    <h2 className="mb-2">{selectedProject.title}</h2>
                    <p className="text-muted-foreground mb-6">{selectedProject.location}</p>
                    <p className="text-muted-foreground leading-relaxed mb-8">
                      {selectedProject.description}
                    </p>

                    {/* Project Stats */}
                    <div className="grid grid-cols-2 gap-6 py-6 border-y border-stone-200 mb-8">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Category</p>
                        <p className="font-medium">{selectedProject.category}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Location</p>
                        <p className="font-medium">{selectedProject.location}</p>
                      </div>
                    </div>
                  </div>

                  <Button className="w-full rounded-full h-12" asChild>
                    <a href="#products">Shop Similar Furniture</a>
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
