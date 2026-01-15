import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Truck, Wrench, Package, Home, Clock, CheckCircle2, Shield, Sparkles } from "lucide-react";
import { Button } from "./ui/button";

export function ServicesPage() {
  const services = [
    {
      icon: Truck,
      title: "White-Glove Delivery",
      description: "Premium delivery service with careful handling and placement",
      features: [
        "Scheduled delivery at your convenience",
        "Professional, uniformed delivery team",
        "Careful handling and protection of your home",
        "Delivery tracking and status updates",
      ],
    },
    {
      icon: Wrench,
      title: "Professional Assembly",
      description: "Expert assembly of all furniture pieces",
      features: [
        "Complete assembly of all items",
        "Proper tools and equipment included",
        "Quality check after assembly",
        "Installation of any additional hardware",
      ],
    },
    {
      icon: Home,
      title: "Room Placement",
      description: "Strategic placement in your desired location",
      features: [
        "Placement in your specified room",
        "Positioning according to your layout",
        "Adjustment until you're satisfied",
        "Protection of floors and walls",
      ],
    },
    {
      icon: Package,
      title: "Packaging Removal",
      description: "Complete cleanup and recycling service",
      features: [
        "Removal of all boxes and materials",
        "Cleanup of any assembly debris",
        "Eco-friendly recycling of materials",
        "Leave your space clean and ready",
      ],
    },
  ];

  const process = [
    {
      step: "1",
      title: "Schedule Delivery",
      description: "Choose your preferred delivery date and 4-hour time window during checkout",
    },
    {
      step: "2",
      title: "Preparation Call",
      description: "We'll call 24-48 hours before to confirm details and answer any questions",
    },
    {
      step: "3",
      title: "Day of Delivery",
      description: "Our team arrives, unloads, assembles, and places your furniture",
    },
    {
      step: "4",
      title: "Final Inspection",
      description: "We inspect everything with you and ensure complete satisfaction",
    },
  ];

  const additionalServices = [
    {
      icon: Shield,
      title: "Furniture Protection Plan",
      description: "Comprehensive coverage for accidents, stains, and damages",
      price: "Starting at $99",
    },
    {
      icon: Sparkles,
      title: "Professional Cleaning",
      description: "Deep cleaning and maintenance services for upholstered furniture",
      price: "Starting at $149",
    },
    {
      icon: Clock,
      title: "Express Delivery",
      description: "Rush delivery available for select in-stock items",
      price: "Starting at $199",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-stone-950">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1645526816819-f4c8cdaf47fc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBkZWxpdmVyeSUyMGhvbWV8ZW58MXx8fHwxNzU5NzQwMDEyfDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Furniture Delivery Service"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-6">
            <h1 className="mb-6 text-white drop-shadow-2xl text-[64px]">Our Services</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto drop-shadow-lg">
              Premium delivery and installation services designed for your complete satisfaction
            </p>
          </div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4">What's Included</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our comprehensive service covers everything from delivery to final placement
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white border border-stone-200 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3 text-[24px]">{service.title}</h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Process */}
      <section className="bg-stone-50 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-[36px]">How It Works</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our streamlined delivery process ensures a smooth experience from start to finish
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {process.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-stone-900 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <span className="text-2xl">{step.step}</span>
                </div>
                <h3 className="mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="mb-6">Assembly & Installation</h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  Our professional installation team is trained to handle all types of furniture
                  assembly. Whether it's a simple bookshelf or a complex modular sectional, we have
                  the expertise and tools to do it right.
                </p>
                <p>
                  We carefully unpack each item, inspect for any damage, and assemble everything
                  according to manufacturer specifications. All hardware is properly secured, and we
                  ensure every piece is stable and ready for use.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Expert assembly by certified technicians</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>All tools and equipment provided</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Quality inspection after assembly</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Care instructions provided</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmdXJuaXR1cmUlMjBhc3NlbWJseXxlbnwxfHx8fDE3NTk3NTgxNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Professional Assembly"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1560185127-6d2e3b9b9c95?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGxpdmluZyUyMHJvb218ZW58MXx8fHwxNzU5NzU4MTU2fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Cleanup Service"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="mb-6">Cleanup & Packaging Removal</h2>
              <div className="space-y-6 text-muted-foreground text-lg leading-relaxed">
                <p>
                  We don't just deliver your furniture and leave. Our team takes care of all the
                  mess, removing every box, wrapper, and piece of packaging material from your home.
                </p>
                <p>
                  We're committed to sustainability, so all packaging materials are properly
                  recycled or disposed of in an environmentally responsible manner. Your space will
                  be left clean and ready to enjoy.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Complete removal of all packaging</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Cleanup of assembly debris</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Eco-friendly recycling</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Final walkthrough with you</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="bg-stone-50 py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-[32px]">Additional Services</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Enhance your furniture experience with our premium add-on services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3">{service.title}</h3>
                <p className="text-muted-foreground mb-4">{service.description}</p>
                <p className="font-medium text-lg mb-6">{service.price}</p>
                <Button variant="outline" className="w-full rounded-full">
                  Learn More
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-stone-900 text-white py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="mb-6 text-white text-[36px]">Experience Premium Service</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12">
            Let our professional team handle everything. Sit back, relax, and enjoy your beautifully
            furnished home.
          </p>
          <Button size="lg" className="gap-2 rounded-full h-14 px-10 bg-white text-stone-900 hover:bg-white/90">
            Start Shopping
          </Button>
        </div>
      </section>
    </div>
  );
}
