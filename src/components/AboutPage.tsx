import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Heart, Users, Award, Leaf } from "lucide-react";
import ceoImage from "figma:asset/8eb688761d01afcfce0b0ab0ead80339a1cb9dc4.png";

export function AboutPage() {
  const team = [
    {
      name: "Radin Sufri Radin Basiuni",
      role: "Founder & CEO",
      image: ceoImage,
      bio: "With over 15 years in interior design and business leadership, Radin founded Vision Studio to make beautiful furniture accessible to everyone.",
    },
    {
      name: "Zainab Al-Hashimi",
      role: "Head of Design",
      image: "https://images.unsplash.com/photo-1667842503541-965849144d33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHdvbWFuJTIwaGlqYWIlMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTk4MDM4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "Zainab brings expertise from top furniture brands, curating collections that blend contemporary style with timeless elegance.",
    },
    {
      name: "Aisha Rahman",
      role: "Customer Experience Director",
      image: "https://images.unsplash.com/photo-1625987306773-8b9e554b25e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtdXNsaW0lMjB3b21hbiUyMGhlYWRzY2FyZnxlbnwxfHx8fDE3NTk4MDM4MDV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      bio: "Aisha ensures every customer receives exceptional service from browsing to delivery and beyond.",
    },
    {
      name: "Hassan Abdullah",
      role: "Operations Manager",
      image: "https://images.unsplash.com/photo-1672685667592-0392f458f46f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBtYW4lMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTk2NDQ4NTh8MA&ixlib=rb-4.1.0&q=80&w=1080",
      bio: "Hassan oversees our logistics and delivery operations, ensuring seamless service across all locations.",
    },
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Every decision we make starts with you. Your satisfaction and comfort are our top priorities.",
    },
    {
      icon: Award,
      title: "Quality Excellence",
      description: "We never compromise on quality. Each piece is carefully selected for durability and timeless design.",
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "We're committed to eco-friendly practices, from sourcing to packaging and delivery.",
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "We believe in giving back, partnering with local charities and supporting our communities.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-stone-950">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBzaG93cm9vbXxlbnwxfHx8fDE3NTk3NTgxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Vision Studio Showroom"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="mb-6 text-white drop-shadow-2xl text-[64px]">About Vision Studio</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              Transforming houses into homes, one beautiful piece at a time
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="mb-6 text-[32px]">Our Story</h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Vision Studio was born from a simple idea: everyone deserves to live in a beautifully
                  furnished home, regardless of their budget or design expertise. Founded in 2018, we set
                  out to revolutionize the furniture shopping experience.
                </p>
                <p>
                  What started as a small showroom has grown into a comprehensive home furnishing solution,
                  serving thousands of happy customers across the region. We've built our reputation on
                  quality products, exceptional service, and innovative financing options that make premium
                  furniture accessible.
                </p>
                <p>
                  Today, Vision Studio continues to evolve, always keeping our customers at the heart of
                  everything we do. From our curated collections to our white-glove delivery service, we're
                  committed to making your furniture shopping experience seamless and enjoyable.
                </p>
              </div>
            </div>
            <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1556912173-46c336c7fd55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBzdG9yZSUyMGludGVyaW9yfGVufDF8fHx8MTc1OTc1ODE1Nnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Vision Studio Store"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="bg-stone-50 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-[32px]">Our Values</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              These core principles guide everything we do at Vision Studio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-[32px]">Meet Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              The passionate people behind Vision Studio
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6 aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <ImageWithFallback
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="mb-2">{member.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-stone-900 text-white py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="mb-8 text-white">Our Mission</h2>
          <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12">
            To make beautifully designed, high-quality furniture accessible to everyone through
            innovative financing, exceptional service, and a carefully curated selection that
            transforms houses into homes people love.
          </p>
          <div className="grid md:grid-cols-3 gap-12 mt-16 max-w-4xl mx-auto">
            <div>
              <div className="text-5xl mb-4">50K+</div>
              <p className="text-white/80">Happy Customers</p>
            </div>
            <div>
              <div className="text-5xl mb-4">98%</div>
              <p className="text-white/80">Satisfaction Rate</p>
            </div>
            <div>
              <div className="text-5xl mb-4">5 Years</div>
              <p className="text-white/80">In Business</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
