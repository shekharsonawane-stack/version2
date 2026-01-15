export function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: `We collect several types of information from and about users of our website and services:

Personal Information: When you create an account, place an order, or contact us, we may collect your name, email address, phone number, shipping address, billing address, and payment information.

Account Information: Username, password, purchase history, saved items, and preferences.

Automatically Collected Information: IP address, browser type, device information, pages visited, time spent on pages, and referring website.

Location Information: General location data based on IP address to provide localized services.

Communication Data: Records of your correspondence with our customer service team, reviews, and feedback.`,
    },
    {
      title: "2. How We Use Your Information",
      content: `We use the information we collect for various purposes:

Process and fulfill your orders, including shipping and delivery
Process payments and prevent fraudulent transactions
Communicate with you about your orders, account, and customer service inquiries
Send you marketing communications, promotions, and product recommendations (with your consent)
Personalize your shopping experience and provide customized content
Improve our website, products, and services
Analyze website usage and trends
Comply with legal obligations and enforce our terms and policies
Provide customer support and respond to your requests`,
    },
    {
      title: "3. How We Share Your Information",
      content: `We may share your information with third parties in the following circumstances:

Service Providers: We work with third-party companies to provide services such as payment processing, shipping and delivery, financing, marketing, analytics, and customer support. These providers have access to your information only as needed to perform their functions.

Financing Partners: If you apply for financing, we share necessary information with our financing partners to process your application.

Business Transfers: In the event of a merger, acquisition, or sale of all or a portion of our business, your information may be transferred to the acquiring entity.

Legal Requirements: We may disclose your information if required by law, court order, or governmental regulation, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.

With Your Consent: We may share your information with third parties when you give us explicit consent to do so.`,
    },
    {
      title: "4. Cookies and Tracking Technologies",
      content: `We use cookies and similar tracking technologies to enhance your experience on our website:

Essential Cookies: Necessary for the website to function properly
Performance Cookies: Help us understand how visitors use our website
Functional Cookies: Remember your preferences and settings
Targeting Cookies: Deliver relevant advertisements and track campaign effectiveness

You can control cookies through your browser settings. However, disabling cookies may affect your ability to use certain features of our website.`,
    },
    {
      title: "5. Data Security",
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:

Encryption of sensitive data during transmission using SSL/TLS
Secure storage of payment information through PCI-compliant payment processors
Regular security assessments and updates
Access controls and authentication requirements for employee access to data
Regular employee training on data protection and privacy

However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.`,
    },
    {
      title: "6. Your Rights and Choices",
      content: `You have certain rights regarding your personal information:

Access: You can request access to the personal information we hold about you
Correction: You can update or correct inaccurate information
Deletion: You can request deletion of your personal information (subject to legal retention requirements)
Opt-Out: You can opt out of marketing communications at any time by clicking "unsubscribe" in our emails or contacting us
Do Not Sell: We do not sell your personal information to third parties
Account Deletion: You can request deletion of your account and associated data

To exercise these rights, please contact us at privacy@visionstudio.com.`,
    },
    {
      title: "7. Children's Privacy",
      content: `Our website and services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately, and we will delete such information from our systems.`,
    },
    {
      title: "8. Third-Party Links",
      content: `Our website may contain links to third-party websites, services, or applications that are not operated by us. We are not responsible for the privacy practices of these third parties. We encourage you to review the privacy policies of any third-party sites you visit.`,
    },
    {
      title: "9. California Privacy Rights",
      content: `If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):

Right to Know: Request disclosure of the categories and specific pieces of personal information we collect
Right to Delete: Request deletion of your personal information
Right to Opt-Out: Opt-out of the sale of personal information (we do not sell personal information)
Right to Non-Discrimination: You will not be discriminated against for exercising your privacy rights

To exercise these rights, please contact us at privacy@visionstudio.com or call +673 223 4567.`,
    },
    {
      title: "10. International Data Transfers",
      content: `Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. We take steps to ensure that your information receives an adequate level of protection in the jurisdictions in which we process it.`,
    },
    {
      title: "11. Data Retention",
      content: `We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law. When we no longer need your information, we will securely delete or anonymize it.`,
    },
    {
      title: "12. Changes to This Privacy Policy",
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new Privacy Policy on our website and updating the "Last Updated" date. Your continued use of our services after changes are posted constitutes acceptance of the updated Privacy Policy.`,
    },
    {
      title: "13. Contact Us",
      content: `If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:

Vision Studio Privacy Team
Email: privacy@visionstudio.com
Phone: +673 223 4567
Address: Unit 1, Ground Floor, Setia Kenangan II Complex, Kiulap, Bandar Seri Begawan, Brunei

We will respond to your inquiry within 30 days.`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-stone-900 text-white py-24">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h1 className="mb-6 text-white text-[48px]">Privacy Policy</h1>
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
              At Vision Studio, we are committed to protecting your privacy and ensuring the
              security of your personal information. This Privacy Policy explains how we collect,
              use, share, and protect your information when you use our website and services. Please
              read this policy carefully to understand our practices regarding your personal data.
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
            <h3 className="mb-4 text-white">Privacy Questions or Concerns?</h3>
            <p className="text-white/90 mb-6">
              Your privacy matters to us. If you have any questions about how we handle your
              personal information, please reach out to our Privacy Team.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="mailto:privacy@visionstudio.com"
                className="inline-flex items-center justify-center rounded-full h-12 px-8 bg-white text-stone-900 hover:bg-white/90 transition-colors"
              >
                Email Privacy Team
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
