import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { toast } from "sonner@2.0.3";

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: "Phone",
      details: "+673 223 4567",
      subdetails: "Mon-Sat: 9am-6pm",
      action: "Call Us",
      href: "tel:+6732234567",
    },
    {
      icon: Mail,
      title: "Email",
      details: "support@visionstudio.com",
      subdetails: "We respond within 24 hours",
      action: "Send Email",
      href: "mailto:support@visionstudio.com",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      details: "Available on our website",
      subdetails: "Instant responses Mon-Sat",
      action: "Start Chat",
      href: "#",
    },
  ];

  const locations = [
    {
      city: "Bandar Seri Begawan",
      address: "Unit 1, Ground Floor, Setia Kenangan II Complex, Kiulap",
      phone: "+673 223 4567",
      hours: "Mon-Sat: 9am-6pm, Sun: Closed",
    },
    {
      city: "Gadong",
      address: "Ground Floor, Times Square Shopping Centre, Gadong",
      phone: "+673 242 8901",
      hours: "Mon-Sat: 10am-7pm, Sun: 10am-5pm",
    },
    {
      city: "Seria",
      address: "Lot 15, Seria Commercial Centre, Jalan Tengah",
      phone: "+673 322 5678",
      hours: "Mon-Sat: 9am-6pm, Sun: Closed",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h1 className="mb-6 text-white text-[48px]">Contact Us</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Have questions? We're here to help. Reach out to our customer service team.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-24">
            {contactMethods.map((method, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl border border-stone-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-stone-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <method.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="mb-3">{method.title}</h3>
                <p className="mb-1">{method.details}</p>
                <p className="text-sm text-muted-foreground mb-6">{method.subdetails}</p>
                <Button variant="outline" className="rounded-full" asChild>
                  <a href={method.href}>{method.action}</a>
                </Button>
              </div>
            ))}
          </div>

          {/* Contact Form and Info */}
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <div>
              <h2 className="mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-2"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-2"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-2"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <Label htmlFor="subject">Subject *</Label>
                  <Select
                    value={formData.subject}
                    onValueChange={(value) => setFormData({ ...formData, subject: value })}
                    required
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="order">Order Inquiry</SelectItem>
                      <SelectItem value="delivery">Delivery Question</SelectItem>
                      <SelectItem value="product">Product Information</SelectItem>
                      <SelectItem value="financing">Financing Options</SelectItem>
                      <SelectItem value="return">Returns & Exchanges</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="mt-2 min-h-[150px]"
                    placeholder="Tell us how we can help..."
                  />
                </div>

                <Button type="submit" className="w-full gap-2 rounded-full h-12">
                  <Send className="h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </div>

            {/* Business Hours & Info */}
            <div className="space-y-8">
              <div>
                <h2 className="mb-6">Business Hours</h2>
                <div className="bg-stone-50 rounded-2xl p-8 space-y-4">
                  <div className="flex items-center gap-4">
                    <Clock className="h-6 w-6 text-stone-900" />
                    <div>
                      <p className="font-medium">Customer Service</p>
                      <p className="text-sm text-muted-foreground">Monday - Friday: 8am - 8pm EST</p>
                      <p className="text-sm text-muted-foreground">Saturday: 9am - 6pm EST</p>
                      <p className="text-sm text-muted-foreground">Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-6">What to Expect</h2>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium mb-1">Quick Response</p>
                      <p className="text-sm text-muted-foreground">
                        We respond to all inquiries within 24 hours during business days
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium mb-1">Personalized Support</p>
                      <p className="text-sm text-muted-foreground">
                        You'll be connected with a knowledgeable team member who can help
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 bg-stone-900 text-white rounded-full flex items-center justify-center flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium mb-1">Complete Resolution</p>
                      <p className="text-sm text-muted-foreground">
                        We'll work with you until your question or concern is fully resolved
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-6">Prefer to Talk?</h2>
                <div className="bg-stone-900 text-white rounded-2xl p-8">
                  <p className="text-lg mb-4">Call us directly at:</p>
                  <p className="text-3xl mb-2">+673 223 4567</p>
                  <p className="text-white/80">Bandar Seri Begawan Main Office</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Showroom Locations */}
      <section className="bg-stone-50 py-24">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-[32px]">Visit Our Showrooms</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Experience our furniture in person at one of our showroom locations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="mb-6">{location.city}</h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <MapPin className="h-5 w-5 text-stone-900 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{location.address}</p>
                  </div>
                  <div className="flex gap-3">
                    <Phone className="h-5 w-5 text-stone-900 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{location.phone}</p>
                  </div>
                  <div className="flex gap-3">
                    <Clock className="h-5 w-5 text-stone-900 flex-shrink-0 mt-0.5" />
                    <p className="text-muted-foreground">{location.hours}</p>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-6 rounded-full">
                  Get Directions
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
