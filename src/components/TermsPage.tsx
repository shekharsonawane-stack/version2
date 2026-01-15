export function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: `By accessing and using the Vision Studio website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these Terms of Service, please do not use our website or services.`,
    },
    {
      title: "2. Products and Pricing",
      content: `All products displayed on our website are subject to availability. We reserve the right to discontinue any product at any time. Prices for our products are subject to change without notice. We make every effort to ensure pricing accuracy, but errors may occur. If a product is listed at an incorrect price due to an error, we reserve the right to refuse or cancel any orders placed for that product.`,
    },
    {
      title: "3. Orders and Payment",
      content: `When you place an order with Vision Studio, you are offering to purchase a product. All orders are subject to acceptance and availability. We reserve the right to refuse any order for any reason. Payment must be received before we dispatch your order. We accept major credit cards, debit cards, and approved financing options. By providing payment information, you represent and warrant that you are authorized to use the payment method provided.`,
    },
    {
      title: "4. Financing Terms",
      content: `Financing options are provided through third-party partners and are subject to credit approval. Terms and conditions of financing agreements are set by the financing provider. Vision Studio is not responsible for financing decisions, terms, or payment processing. Customers are responsible for understanding and complying with their financing agreement terms. Failure to make payments may result in additional fees, interest charges, and impact your credit score.`,
    },
    {
      title: "5. Delivery and Installation",
      content: `Delivery timeframes provided are estimates only and are not guaranteed. Vision Studio is not liable for any delays in delivery. Our white-glove delivery service includes delivery, assembly, placement, and packaging removal as described on our Services page. A signature from someone 18 years or older is required upon delivery. Customers must ensure adequate access to the delivery location, including doorways, hallways, stairwells, and elevators. Additional fees may apply for complex deliveries or locations with restricted access.`,
    },
    {
      title: "6. Returns and Refunds",
      content: `Most items may be returned within 30 days of delivery for a full refund, subject to our Returns Policy. Custom-made items, clearance items, and mattresses cannot be returned unless defective. Items must be in original condition with all parts and packaging. We provide free return pickup service. Refunds are processed within 5-7 business days after we receive and inspect the returned item. The refund will be issued to the original payment method. Shipping charges are non-refundable except in cases of defective products or our error.`,
    },
    {
      title: "7. Warranties",
      content: `All products come with manufacturer warranties that cover defects in materials and workmanship. Warranty periods vary by product and manufacturer. Warranties do not cover normal wear and tear, misuse, abuse, or damage from accidents or modifications. Extended warranty options are available for purchase. To make a warranty claim, contact our customer service with proof of purchase and details of the defect.`,
    },
    {
      title: "8. Limitation of Liability",
      content: `Vision Studio shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our products or services. Our total liability for any claim arising out of or relating to these terms shall not exceed the amount paid by you for the product or service giving rise to the claim. Some jurisdictions do not allow the exclusion of certain warranties or limitation of liability, so these limitations may not apply to you.`,
    },
    {
      title: "9. Intellectual Property",
      content: `All content on the Vision Studio website, including text, graphics, logos, images, and software, is the property of Vision Studio or its content suppliers and is protected by intellectual property laws. You may not reproduce, distribute, modify, or create derivative works from any content on our website without express written permission.`,
    },
    {
      title: "10. User Accounts",
      content: `When you create an account with us, you must provide accurate, complete, and current information. You are responsible for maintaining the confidentiality of your account and password. You are responsible for all activities that occur under your account. You agree to immediately notify us of any unauthorized use of your account.`,
    },
    {
      title: "11. Privacy",
      content: `Your use of our website and services is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices regarding your personal information.`,
    },
    {
      title: "12. Prohibited Uses",
      content: `You may not use our website or services for any illegal or unauthorized purpose. You agree to comply with all applicable laws and regulations. Prohibited activities include but are not limited to: attempting to interfere with the proper functioning of the website, engaging in any fraudulent activities, transmitting any viruses or malicious code, harvesting or collecting information about other users, or impersonating any person or entity.`,
    },
    {
      title: "13. Indemnification",
      content: `You agree to indemnify, defend, and hold harmless Vision Studio and its officers, directors, employees, and agents from any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of our services, your violation of these Terms, or your violation of any rights of another party.`,
    },
    {
      title: "14. Dispute Resolution",
      content: `Any dispute arising out of or relating to these Terms or our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. The arbitration shall take place in New York, NY. You waive any right to a jury trial or to participate in a class action lawsuit.`,
    },
    {
      title: "15. Governing Law",
      content: `These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.`,
    },
    {
      title: "16. Changes to Terms",
      content: `We reserve the right to modify or replace these Terms at any time at our sole discretion. Material changes will be notified via email or through a notice on our website. Your continued use of our services after any changes constitutes acceptance of the new Terms.`,
    },
    {
      title: "17. Severability",
      content: `If any provision of these Terms is found to be unenforceable or invalid, that provision will be limited or eliminated to the minimum extent necessary so that these Terms will otherwise remain in full force and effect.`,
    },
    {
      title: "18. Contact Information",
      content: `If you have any questions about these Terms of Service, please contact us at:\n\nVision Studio\nEmail: legal@visionstudio.com\nPhone: +673 223 4567\nAddress: Unit 1, Ground Floor, Setia Kenangan II Complex, Kiulap, Bandar Seri Begawan, Brunei`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h1 className="mb-6 text-white text-[32px]">Terms of Service</h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto">
            Last Updated: October 7, 2025
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div className="mb-12 p-6 bg-stone-50 rounded-2xl">
            <p className="text-muted-foreground leading-relaxed">
              Please read these Terms of Service carefully before using the Vision Studio website
              and services. These terms govern your access to and use of our website, products, and
              services. By using our services, you agree to be bound by these terms.
            </p>
          </div>

          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index}>
                <h2 className="mb-4">{section.title}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 bg-stone-900 text-white rounded-2xl">
            <h3 className="mb-4 text-white">Questions About Our Terms?</h3>
            <p className="text-white/90 mb-6">
              If you have any questions or concerns about these Terms of Service, please don't
              hesitate to contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:legal@visionstudio.com"
                className="inline-flex items-center justify-center rounded-full h-12 px-8 bg-white text-stone-900 hover:bg-white/90 transition-colors"
              >
                Email Legal Team
              </a>
              <a
                href="tel:+6732234567"
                className="inline-flex items-center justify-center rounded-full h-12 px-8 border-2 border-white text-white hover:bg-white/10 transition-colors"
              >
                Call +673 223 4567
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
