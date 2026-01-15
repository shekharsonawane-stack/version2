import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useState } from "react";

export function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqs = [
    {
      category: "Financing & Payments",
      questions: [
        {
          question: "What financing options do you offer?",
          answer: "We offer flexible financing options through our trusted partners. You can choose from 0% APR for 12 months, low monthly payments over 24-48 months, or lease-to-own programs. No hidden fees, and approval is instant in most cases. Minimum purchase of $500 required for financing.",
        },
        {
          question: "How does the financing approval process work?",
          answer: "Our financing application is quick and easy. Simply select your items, choose the financing option at checkout, and complete a brief application. Most customers receive instant approval. We consider various credit profiles and offer multiple financing partners to maximize your approval chances.",
        },
        {
          question: "Can I pay off my financing early?",
          answer: "Yes! You can pay off your financing balance at any time without any prepayment penalties or fees. This can help you save on interest charges if you have a promotional rate that expires.",
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), debit cards, PayPal, and bank transfers. For financed orders, payments are automatically processed monthly according to your agreement.",
        },
      ],
    },
    {
      category: "Delivery & Installation",
      questions: [
        {
          question: "What's included in your white-glove delivery service?",
          answer: "Our white-glove delivery service includes scheduled delivery at your preferred time, professional assembly of all furniture, placement in your desired room, full inspection to ensure everything is perfect, and removal of all packaging materials. We treat your home with the utmost care.",
        },
        {
          question: "How long does delivery take?",
          answer: "Most in-stock items are delivered within 2-3 weeks. Custom or made-to-order pieces may take 6-10 weeks. During checkout, you'll see the estimated delivery timeframe for each item. We'll contact you to schedule your preferred delivery date and time window.",
        },
        {
          question: "Do you deliver to apartments and upper floors?",
          answer: "Yes! Our delivery team is experienced in navigating apartments, stairs, and elevators. Please inform us during checkout if there are any access restrictions, narrow hallways, or stairs so we can prepare accordingly. Additional fees may apply for complex deliveries.",
        },
        {
          question: "What if I'm not home during delivery?",
          answer: "We require someone 18+ to be present to receive the delivery and sign for it. If you can't be home, you can authorize another adult to receive the delivery on your behalf. We'll call you 24-48 hours before delivery to confirm the appointment.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer: "We offer a 30-day return policy on most items. If you're not completely satisfied, contact us within 30 days of delivery to arrange a return. Items must be in original condition with all parts and packaging. We provide free return pickup and issue a full refund once the item is received and inspected.",
        },
        {
          question: "Are there any items that can't be returned?",
          answer: "Custom-made or personalized items, clearance/final sale items, and mattresses (for hygiene reasons) cannot be returned unless defective. All other items are eligible for our 30-day return policy. Specific return eligibility is noted on each product page.",
        },
        {
          question: "Can I exchange an item for a different color or size?",
          answer: "Yes! If you need a different color or size, contact us within 30 days of delivery. We'll arrange pickup of the original item and delivery of the replacement. If there's a price difference, we'll either refund or charge the difference accordingly.",
        },
        {
          question: "How long does it take to receive my refund?",
          answer: "Once we receive and inspect your returned item, refunds are processed within 5-7 business days. The refund will be issued to your original payment method. Please allow an additional 3-5 business days for the credit to appear on your statement.",
        },
      ],
    },
    {
      category: "Product Quality & Warranties",
      questions: [
        {
          question: "What if my furniture arrives damaged?",
          answer: "While rare, if your furniture arrives damaged, please don't sign the delivery receipt and immediately notify our delivery team. Take photos of the damage and contact us within 48 hours. We'll arrange for a replacement or repair at no cost to you. Your satisfaction is our priority.",
        },
        {
          question: "Do your products come with a warranty?",
          answer: "Yes! All our furniture comes with a manufacturer's warranty ranging from 1-10 years depending on the item. Warranties cover defects in materials and workmanship. Extended warranty options are available for purchase. Full warranty details are provided with each product.",
        },
        {
          question: "What if something breaks after the warranty expires?",
          answer: "We offer repair services and replacement parts even after the warranty period. Contact our customer service team, and we'll do our best to help you repair or replace the item at a reasonable cost. We stand behind our products long-term.",
        },
        {
          question: "How do I care for my furniture?",
          answer: "Each item comes with specific care instructions. Generally, we recommend regular dusting, avoiding direct sunlight and heat sources, using coasters and placemats, and professional cleaning for upholstered items. Detailed care guides are included with your delivery and available on our website.",
        },
      ],
    },
    {
      category: "Orders & Shipping",
      questions: [
        {
          question: "Can I track my order?",
          answer: "Yes! Once your order ships, you'll receive a tracking number via email. You can also track your order status anytime by logging into your account on our website. We'll send you updates at each stage: order confirmed, in production, shipped, and out for delivery.",
        },
        {
          question: "Can I cancel or modify my order?",
          answer: "You can cancel or modify your order within 24 hours of placing it at no charge. After 24 hours, if the item hasn't shipped yet, we can still make changes but a 15% restocking fee may apply. Once shipped, our standard return policy applies.",
        },
        {
          question: "Do you ship internationally?",
          answer: "Currently, we only ship within the United States. We're working on expanding our shipping options to include Canada and select international locations. Sign up for our newsletter to be notified when international shipping becomes available.",
        },
        {
          question: "What if I order multiple items?",
          answer: "Items may ship separately based on availability and warehouse location. You'll receive separate tracking numbers for each shipment. We try to coordinate deliveries when possible, but some items may arrive on different dates. There's no additional charge for multiple shipments.",
        },
      ],
    },
    {
      category: "Customer Support",
      questions: [
        {
          question: "How can I contact customer service?",
          answer: "We're here to help! Contact us via phone (+673 223 4567), email (support@visionstudio.com), or live chat on our website. Our customer service team is available Monday-Friday 9am-6pm and Saturday 9am-5pm. We typically respond to emails within 24 hours.",
        },
        {
          question: "Do you have physical showrooms?",
          answer: "Yes! We have showrooms in major cities where you can see and test our furniture in person. Visit our Locations page to find a showroom near you. No appointment necessary, but scheduled consultations with our design experts are available.",
        },
        {
          question: "Can I get design help or advice?",
          answer: "Absolutely! Our design experts are available for free consultations. You can chat with our AI design assistant 24/7, book a video consultation, or visit a showroom for in-person advice. We can help with room layouts, color coordination, and style selection.",
        },
      ],
    },
  ];

  const filteredFaqs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (q) =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h1 className="mb-6 text-white text-[36px]">Frequently Asked Questions</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-12">
            Find answers to common questions about our products, services, and policies
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for answers..."
                className="pl-12 h-14 bg-white rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No results found for "{searchQuery}". Try different keywords or{" "}
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-primary underline hover:no-underline"
                >
                  clear your search
                </button>
                .
              </p>
            </div>
          ) : (
            <div className="space-y-16">
              {filteredFaqs.map((category, categoryIndex) => (
                <div key={categoryIndex}>
                  <h2 className="mb-8">{category.category}</h2>
                  <Accordion type="single" collapsible className="space-y-4">
                    {category.questions.map((faq, index) => (
                      <AccordionItem
                        key={index}
                        value={`${categoryIndex}-${index}`}
                        className="border border-stone-200 rounded-2xl px-6 py-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <AccordionTrigger className="hover:no-underline text-left">
                          <h3 className="text-lg pr-4">{faq.question}</h3>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Still Have Questions */}
      <section className="bg-stone-50 py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="mb-6">Still Have Questions?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Our customer service team is here to help. Get in touch and we'll respond as quickly as
            possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@visionstudio.com"
              className="inline-flex items-center justify-center rounded-full h-12 px-8 bg-stone-900 text-white hover:bg-stone-800 transition-colors"
            >
              Email Us
            </a>
            <a
              href="tel:+6732234567"
              className="inline-flex items-center justify-center rounded-full h-12 px-8 border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors"
            >
              Call +673 223 4567
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
