import React, { useEffect } from "react";
import Navbar from "../Components/Homecomponents/Navbar";
import Footer from "../Components/Homecomponents/Footer";
import { useSiteSettings } from "../contexts/SiteSettingsContext";

const sectionHeadingClass = "text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2";

const PrivacyPolicy = () => {
  const { country } = useSiteSettings();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const isUK = country === "uk";
  const isUS = country === "us";
  const isCanada = country === "canada";
  const showCleanerPolicy = isUK || isUS || isCanada;

  return (
    <div className="font-jakarta bg-white text-slate-700 ">
      <Navbar />

      {/* --- HEADER --- */}
      <section className="bg-white py-16 border-b border-gray-100 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] uppercase tracking-tighter mb-4">
            Shine <span className="text-[#448cff]"> & </span>Span Cleaning
            Services LTD
          </h1>
          <p className="text-[#448cff] font-black uppercase tracking-widest text-sm mb-4">
            {showCleanerPolicy ? "Cleaner Privacy Policy" : "Professional Cleaning Services"}
          </p>
          {isUK && (
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">
              United Kingdom
            </p>
          )}
          {isUS && (
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">
              United States
            </p>
          )}
          {isCanada && (
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">
              Canada
            </p>
          )}
          <div className="flex flex-col md:flex-row justify-center gap-4 text-slate-400 text-xs font-bold uppercase tracking-widest">
            <span>Effective Date: 31 January 2025</span>
            <span className="hidden md:block">|</span>
            <span>Last Updated: 31 January 2025</span>
          </div>
        </div>
      </section>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-4xl mx-auto px-6 py-20 font-jakarta">
        <div className="space-y-16">
          {isUK ? (
            /* --- UK: CLEANER PRIVACY POLICY --- */
            <>
              <section>
                <h2 className={sectionHeadingClass}>1. Legal Framework</h2>
                <p className="leading-relaxed">
                  This Privacy Policy complies with UK GDPR and the Data Protection Act 2018.
                </p>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>2. Data Collected</h2>
                <p className="leading-relaxed mb-4">
                  The Company may collect identification details, contact information, tax details, banking
                  information, insurance documents, background checks, GPS attendance data, performance
                  records, and system usage logs.
                </p>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>3. Purpose of Processing</h2>
                <p className="leading-relaxed">
                  Data is processed for contract administration, compliance, payment processing, regulatory
                  requirements, and operational management.
                </p>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>4. Data Retention</h2>
                <p className="leading-relaxed">
                  Data is retained for statutory limitation periods (typically 6–7 years depending on jurisdiction).
                </p>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>5. Security Measures</h2>
                <p className="leading-relaxed">
                  The Company implements encryption, role-based access controls, secure servers, and breach
                  response protocols.
                </p>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>6. Contractor Rights</h2>
                <p className="leading-relaxed">
                  Contractors have rights under UK GDPR including access, rectification, erasure, restriction,
                  data portability, and the right to lodge a complaint with the ICO.
                </p>
              </section>
              <section className="bg-slate-50 border border-gray-400 p-8 md:p-12 rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-widest text-center">
                  Contact Information
                </h2>
                <div className="space-y-2 font-bold text-slate-800 text-lg text-center">
                  <p className="text-[#448cff] uppercase text-xs tracking-[0.2em] mb-2 font-black text-center">Get in Touch</p>
                  <p>Shine & Span Cleaning Services LTD</p>
                  <p>Email: cleaning@shinespan.co.uk</p>
                  <p>Phone: 0738 464 7705 (from 1pm till 7pm)</p>
                  <p>Address: [Your Business Address]</p>
                </div>
              </section>
              <div className="text-center pt-10 border-t border-gray-100">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  By engaging with Shine & Span Cleaning Services LTD as a contractor, you acknowledge that you have read and understood this Cleaner Privacy Policy.
                </p>
              </div>
            </>
          ) : isUS ? (
            /* --- US: CLEANER PRIVACY POLICY --- */
            <>
              <section>
                <h2 className={sectionHeadingClass}>1. Legal Framework</h2>
                <p className="leading-relaxed">
                  This Privacy Policy complies with applicable federal and state privacy laws, including CCPA where applicable.
                </p>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>2. Data Collected</h2>
                <p className="leading-relaxed mb-4">
                  The Company may collect identification details, contact information, tax details, banking
                  information, insurance documents, background checks, GPS attendance data, performance
                  records, and system usage logs.
                </p>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>3. Purpose of Processing</h2>
                <p className="leading-relaxed">
                  Data is processed for contract administration, compliance, payment processing, regulatory
                  requirements, and operational management.
                </p>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>4. Data Retention</h2>
                <p className="leading-relaxed">
                  Data is retained for statutory limitation periods (typically 6–7 years depending on jurisdiction).
                </p>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>5. Security Measures</h2>
                <p className="leading-relaxed">
                  The Company implements encryption, role-based access controls, secure servers, and breach
                  response protocols.
                </p>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>6. Contractor Rights</h2>
                <p className="leading-relaxed">
                  Contractors may request access, correction, or lawful erasure of personal data subject to legal limitations.
                </p>
              </section>
              <section className="bg-slate-50 border border-gray-400 p-8 md:p-12 rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-widest text-center">
                  Contact Information
                </h2>
                <div className="space-y-2 font-bold text-slate-800 text-lg text-center">
                  <p className="text-[#448cff] uppercase text-xs tracking-[0.2em] mb-2 font-black text-center">Get in Touch</p>
                  <p>Shine & Span Cleaning Services LTD</p>
                  <p>Email: cleaning@shinespan.co.uk</p>
                  <p>Phone: 0738 464 7705 (from 1pm till 7pm)</p>
                  <p>Address: [Your Business Address]</p>
                </div>
              </section>
              <div className="text-center pt-10 border-t border-gray-100">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  By engaging with Shine & Span Cleaning Services LTD as a contractor, you acknowledge that you have read and understood this Cleaner Privacy Policy.
                </p>
              </div>
            </>
          ) : isCanada ? (
            /* --- CANADA: CLEANER PRIVACY POLICY --- */
            <>
              <section>
                <h2 className={sectionHeadingClass}>Legal Framework</h2>
                <p className="leading-relaxed mb-4">
                  This Privacy Policy complies with:
                </p>
                <ul className="list-disc pl-8 space-y-2 leading-relaxed">
                  <li>Personal Information Protection and Electronic Documents Act (PIPEDA)</li>
                  <li>Applicable provincial privacy legislation</li>
                </ul>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>1. Information Collected</h2>
                <p className="leading-relaxed mb-2">The Company may collect:</p>
                <ul className="list-disc pl-8 space-y-2 leading-relaxed">
                  <li>Identification details</li>
                  <li>Contact information</li>
                  <li>Social Insurance Number (where legally required)</li>
                  <li>Banking information</li>
                  <li>Insurance documentation</li>
                  <li>Background check information</li>
                  <li>GPS attendance data</li>
                  <li>Performance and compliance records</li>
                </ul>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>2. Purpose of Processing</h2>
                <p className="leading-relaxed mb-2">Personal information is processed for:</p>
                <ul className="list-disc pl-8 space-y-2 leading-relaxed">
                  <li>Contract administration</li>
                  <li>Payment processing</li>
                  <li>Legal and regulatory compliance</li>
                  <li>Operational management</li>
                  <li>Quality control</li>
                </ul>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>3. Data Retention</h2>
                <p className="leading-relaxed">
                  Personal data is retained for statutory limitation periods (typically 6–7 years), or longer where required by law.
                </p>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>4. Security Measures</h2>
                <p className="leading-relaxed mb-2">The Company implements:</p>
                <ul className="list-disc pl-8 space-y-2 leading-relaxed">
                  <li>Encryption</li>
                  <li>Secure server storage</li>
                  <li>Role-based access controls</li>
                  <li>Password-protected systems</li>
                  <li>Breach response protocols</li>
                </ul>
              </section>
              <section>
                <h2 className={sectionHeadingClass}>5. Contractor Rights</h2>
                <p className="leading-relaxed mb-2">Subject to legal limitations, Contractors may:</p>
                <ul className="list-disc pl-8 space-y-2 leading-relaxed">
                  <li>Request access to personal information</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request lawful erasure</li>
                  <li>File a complaint with the Privacy Commissioner of Canada</li>
                </ul>
              </section>
              <section className="bg-slate-50 border border-gray-400 p-8 md:p-12 rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-widest text-center">
                  Contact Information
                </h2>
                <div className="space-y-2 font-bold text-slate-800 text-lg text-center">
                  <p className="text-[#448cff] uppercase text-xs tracking-[0.2em] mb-2 font-black text-center">Get in Touch</p>
                  <p>Shine & Span Cleaning Services LTD</p>
                  <p>Email: cleaning@shinespan.co.uk</p>
                  <p>Phone: 0738 464 7705 (from 1pm till 7pm)</p>
                  <p>Address: [Your Business Address]</p>
                </div>
              </section>
              <div className="text-center pt-10 border-t border-gray-100">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                  By engaging with Shine & Span Cleaning Services LTD as a contractor, you acknowledge that you have read and understood this Cleaner Privacy Policy.
                </p>
              </div>
            </>
          ) : (
            <>
          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              1. Introduction
            </h2>
            <p className="leading-relaxed mb-4">
              Shine & Span Cleaning Services LTD ("we", "us", "our", "the
              Company") is committed to protecting your privacy and personal
              data. This Privacy Policy explains how we collect, use, store, and
              protect your personal information when you use our cleaning
              services.
            </p>
            <p className="leading-relaxed">
              This Privacy Policy complies with the UK General Data Protection
              Regulation (UK GDPR) and the Data Protection Act 2018. By using
              our services, you consent to the data practices described in this
              policy.
            </p>
          </section>

          {/* 2. Data Controller */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              2. Data Controller
            </h2>
            <p className="mb-4">
              Shine & Span Cleaning Services LTD is the data controller
              responsible for your personal data. Our contact details are:
            </p>
            <ul className="list-disc pl-8 space-y-2 font-bold text-slate-800">
              <li>Company Name: Shine & Span Cleaning Services LTD</li>
              <li>Email: privacy@Shine & Span Cleaning Services LTD.co.uk</li>
              <li>Phone: 0738 464 7705 (from 1pm till 7pm)</li>
              <li>Address: [Your Business Address]</li>
            </ul>
          </section>

          {/* 3. Information We Collect */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              3. Information We Collect
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase mb-4 tracking-widest">
                  3.1 Personal Information
                </h3>
                <p className="mb-4 font-medium">
                  We collect the following types of personal information:
                </p>
                <ul className="list-disc pl-8 space-y-3 leading-relaxed">
                  <li>
                    <strong>Contact Information:</strong> Name, email address,
                    phone number, postal address
                  </li>
                  <li>
                    <strong>Account Information:</strong> Username, password
                    (encrypted), account preferences
                  </li>
                  <li>
                    <strong>Property Information:</strong> Property address,
                    property type, access instructions, special requirements
                  </li>
                  <li>
                    <strong>Payment Information:</strong> Credit/debit card
                    details, billing address, payment history (processed
                    securely through third-party payment processors)
                  </li>
                  <li>
                    <strong>Service Information:</strong> Booking history,
                    service preferences, feedback and reviews
                  </li>
                  <li>
                    <strong>Communication Data:</strong> Emails, messages, phone
                    calls, and other communications with us
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase mb-4 tracking-widest">
                  3.2 Automatically Collected Information
                </h3>
                <p className="mb-4 font-medium">
                  When you use our website or mobile app, we automatically
                  collect:
                </p>
                <ul className="list-disc pl-8 space-y-3 leading-relaxed">
                  <li>
                    Device information (IP address, browser type, operating
                    system)
                  </li>
                  <li>
                    Usage data (pages visited, time spent, clicks, navigation
                    paths)
                  </li>
                  <li>
                    Location data (with your consent, for service delivery
                    purposes)
                  </li>
                  <li>
                    Cookies and similar tracking technologies (see Section 9)
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase mb-4 tracking-widest">
                  3.3 Information from Third Parties
                </h3>
                <p className="mb-4 font-medium">
                  We may receive information about you from:
                </p>
                <ul className="list-disc pl-8 space-y-3 leading-relaxed">
                  <li>Payment processors (transaction confirmation)</li>
                  <li>
                    Social media platforms (if you log in using social media)
                  </li>
                  <li>Marketing partners (with your consent)</li>
                  <li>
                    Public databases and credit reference agencies (for fraud
                    prevention)
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 4. How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              4. How We Use Your Information
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase mb-4 tracking-widest">
                  4.1 Lawful Basis for Processing
                </h3>
                <p className="mb-4">
                  We process your personal data under the following lawful
                  bases:
                </p>
                <ul className="list-disc pl-8 space-y-3">
                  <li>
                    <strong>Contract Performance:</strong> To provide cleaning
                    services you have requested
                  </li>
                  <li>
                    <strong>Legitimate Interest:</strong> To improve our
                    services, prevent fraud, and ensure security
                  </li>
                  <li>
                    <strong>Legal Obligation:</strong> To comply with tax,
                    accounting, and legal requirements
                  </li>
                  <li>
                    <strong>Consent:</strong> For marketing communications and
                    optional data processing (you can withdraw consent at any
                    time)
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase mb-4 tracking-widest">
                  4.2 Purposes of Data Processing
                </h3>
                <ul className="list-disc pl-8 space-y-3">
                  <li>To provide and manage cleaning services</li>
                  <li>To process payments and prevent fraud</li>
                  <li>
                    To communicate with you about bookings, changes, and updates
                  </li>
                  <li>To send service reminders and confirmations</li>
                  <li>
                    To respond to your inquiries and provide customer support
                  </li>
                  <li>To improve our services and develop new features</li>
                  <li>To send marketing communications (with your consent)</li>
                  <li>To comply with legal and regulatory requirements</li>
                  <li>
                    To protect our rights and prevent misuse of our services
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Data Sharing and Disclosure */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              5. Data Sharing and Disclosure
            </h2>
            <h3 className="font-black text-slate-800 text-sm uppercase mb-4 tracking-widest">
              5.1 When We Share Your Data
            </h3>
            <ul className="list-disc pl-8 space-y-4 mb-8">
              <li>
                <strong>Our Cleaners:</strong> We share necessary information
                (name, address, contact details, service requirements) with
                assigned cleaners to perform services.
              </li>
              <li>
                <strong>Payment Processors:</strong> We use third-party payment
                processors (e.g., Stripe, PayPal) to handle transactions
                securely. They have access to payment information only.
              </li>
              <li>
                <strong>Service Providers:</strong> We work with third-party
                companies for IT services, customer support, marketing, and
                analytics. They process data on our behalf under strict
                confidentiality agreements.
              </li>
              <li>
                <strong>Legal Authorities:</strong> We may disclose information
                if required by law, court order, or to protect our legal rights.
              </li>
              <li>
                <strong>Business Transfers:</strong> If we merge with or are
                acquired by another company, your data may be transferred to the
                new owner.
              </li>
            </ul>
            <div className="p-6 border border-gray-400 bg-slate-50">
              <p className="font-black text-slate-900 uppercase text-xs tracking-widest mb-2">
                5.2 We Do Not Sell Your Data
              </p>
              <p className="text-sm font-medium">
                We do not sell, rent, or trade your personal information to
                third parties for their marketing purposes.
              </p>
            </div>
          </section>

          {/* 6. Data Retention */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              6. Data Retention
            </h2>
            <p className="mb-4">
              We retain your personal data only as long as necessary for the
              purposes outlined in this Privacy Policy or as required by law.
            </p>
            <ul className="list-disc pl-8 space-y-3">
              <li>
                <strong>Account Data:</strong> Retained while your account is
                active and for 6 years after account closure (for legal and tax
                purposes)
              </li>
              <li>
                <strong>Booking and Payment Data:</strong> Retained for 6 years
                after the last transaction (for accounting and legal compliance)
              </li>
              <li>
                <strong>Marketing Data:</strong> Retained until you withdraw
                consent or request deletion
              </li>
              <li>
                <strong>Communication Records:</strong> Retained for 3 years for
                customer service and dispute resolution purposes
              </li>
            </ul>
          </section>

          {/* 7. Your Rights Under UK GDPR */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              7. Your Rights Under UK GDPR
            </h2>
            <p className="mb-6 leading-relaxed">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-8 space-y-4 font-medium leading-relaxed">
              <li>
                <strong>Right to Access:</strong> You can request a copy of the
                personal data we hold about you.
              </li>
              <li>
                <strong>Right to Rectification:</strong> You can request
                correction of inaccurate or incomplete data.
              </li>
              <li>
                <strong>Right to Erasure:</strong> You can request deletion of
                your personal data (subject to legal obligations).
              </li>
              <li>
                <strong>Right to Restrict Processing:</strong> You can request
                that we limit how we use your data.
              </li>
              <li>
                <strong>Right to Data Portability:</strong> You can request your
                data in a structured, machine-readable format.
              </li>
              <li>
                <strong>Right to Object:</strong> You can object to processing
                based on legitimate interests or for marketing purposes.
              </li>
              <li>
                <strong>Right to Withdraw Consent:</strong> You can withdraw
                consent for data processing at any time (does not affect prior
                processing).
              </li>
              <li>
                <strong>Right to Lodge a Complaint:</strong> You can complain to
                the Information Commissioner's Office (ICO) if you believe we
                have mishandled your data.
              </li>
            </ul>
            <div className="mt-8 p-6 border border-gray-400 rounded-sm bg-slate-50 font-bold">
              <h4 className="font-black text-sm uppercase mb-3 text-[#448cff]">
                7.1 How to Exercise Your Rights
              </h4>
              <p className="text-sm">
                To exercise any of these rights, please contact us at:
              </p>
              <ul className="mt-2 text-sm space-y-1">
                <li>Email: privacy@Shine & Span Cleaning Services LTD.co.uk</li>
                <li>Phone: 0738 464 7705 (from 1pm till 7pm)</li>
              </ul>
              <p className="mt-4 text-[11px] uppercase tracking-widest text-slate-400">
                We will respond to your request within 30 days.
              </p>
            </div>
          </section>

          {/* 8. Data Security */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              8. Data Security
            </h2>
            <p className="mb-6 leading-relaxed">
              We take the security of your personal data seriously and implement
              appropriate technical and organizational measures to protect it,
              including:
            </p>
            <ul className="list-disc pl-8 space-y-3 font-medium leading-relaxed">
              <li>Encryption of data in transit (SSL/TLS) and at rest</li>
              <li>
                Secure payment processing through PCI-DSS compliant payment
                processors
              </li>
              <li>
                Access controls and authentication (passwords, two-factor
                authentication)
              </li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Employee training on data protection and confidentiality</li>
              <li>
                Secure data storage with reputable cloud service providers
              </li>
            </ul>
            <p className="mt-6 leading-relaxed bg-blue-50 p-4 text-sm border border-blue-100 italic">
              However, no method of transmission over the internet or electronic
              storage is 100% secure. While we strive to protect your data, we
              cannot guarantee absolute security.
            </p>
          </section>

          {/* 9. Cookies and Tracking Technologies */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              9. Cookies and Tracking Technologies
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase mb-3 tracking-widest">
                  9.1 What Are Cookies?
                </h3>
                <p className="leading-relaxed">
                  Cookies are small text files stored on your device when you
                  visit our website. They help us improve your experience and
                  provide certain features.
                </p>
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase mb-3 tracking-widest">
                  9.2 Types of Cookies We Use
                </h3>
                <ul className="list-disc pl-8 space-y-3">
                  <li>
                    <strong>Essential Cookies:</strong> Required for the website
                    to function (e.g., session management, security). Cannot be
                    disabled.
                  </li>
                  <li>
                    <strong>Performance Cookies:</strong> Help us understand how
                    visitors use our website (e.g., Google Analytics). Used to
                    improve performance.
                  </li>
                  <li>
                    <strong>Functional Cookies:</strong> Remember your
                    preferences (e.g., language, location). Enhance user
                    experience.
                  </li>
                  <li>
                    <strong>Marketing Cookies:</strong> Track your activity
                    across websites to deliver targeted advertising. Require
                    your consent.
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase mb-3 tracking-widest">
                  9.3 Managing Cookies
                </h3>
                <p className="leading-relaxed">
                  You can control and delete cookies through your browser
                  settings. However, disabling certain cookies may affect
                  website functionality. For more information, visit
                  www.aboutcookies.org.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Third-Party Links */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              10. Third-Party Links
            </h2>
            <p className="leading-relaxed">
              Our website may contain links to third-party websites (e.g.,
              payment processors, social media). We are not responsible for the
              privacy practices of these websites. We encourage you to read
              their privacy policies before providing any personal information.
            </p>
          </section>

          {/* 11. Children's Privacy */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              11. Children's Privacy
            </h2>
            <p className="leading-relaxed">
              Our services are not intended for children under the age of 18. We
              do not knowingly collect personal data from children. If we become
              aware that we have collected data from a child, we will delete it
              promptly. If you believe we have collected data from a child,
              please contact us immediately.
            </p>
          </section>

          {/* 12. International Data Transfers */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              12. International Data Transfers
            </h2>
            <p className="mb-6 leading-relaxed">
              Your personal data is primarily stored and processed within the
              United Kingdom. If we transfer data outside the UK or European
              Economic Area (EEA), we will ensure appropriate safeguards are in
              place, such as:
            </p>
            <ul className="list-disc pl-8 space-y-3 font-medium">
              <li>
                Standard Contractual Clauses (SCCs) approved by the UK ICO
              </li>
              <li>Adequacy decisions by the UK government</li>
              <li>Binding Corporate Rules (BCRs) for intra-group transfers</li>
            </ul>
          </section>

          {/* 13. Changes to This Privacy Policy */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2">
              13. Changes to This Privacy Policy
            </h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. Any changes will
              be posted on our website with an updated "Last Updated" date. We
              encourage you to review this policy periodically. If we make
              significant changes, we will notify you by email or through a
              prominent notice on our website.
            </p>
          </section>

          {/* 14. Contact Us */}
          <section className="bg-slate-50 border border-gray-400 p-8 md:p-12 rounded-sm">
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-8 tracking-widest">
              14. Contact Us
            </h2>
            <div className="space-y-2 font-bold text-slate-800 mb-10 text-lg">
              <p className="text-[#448cff] uppercase text-xs tracking-[0.2em] mb-2 font-black">
                Company Details
              </p>
              <p>Shine & Span Cleaning Services LTD</p>
              <p>Email: cleaning@shinespan.co.uk</p>
              <p>Phone: 0738 464 7705 (from 1pm till 7pm)</p>
              <p>Address: [Your Business Address]</p>
            </div>

            <div className="pt-8 border-t border-gray-200">
              <h3 className="font-black text-[#1e293b] text-sm uppercase mb-4 tracking-widest">
                14.1 Information Commissioner's Office (ICO)
              </h3>
              <p className="text-sm leading-relaxed mb-4 font-medium">
                If you are not satisfied with our response to your privacy
                concerns, you have the right to lodge a complaint with the ICO:
              </p>
              <ul className="text-sm space-y-2 font-bold text-slate-600">
                <li>Website: www.ico.org.uk</li>
                <li>Phone: 0303 123 1113</li>
                <li>
                  Address: Information Commissioner's Office, Wycliffe House,
                  Water Lane, Wilmslow, Cheshire, SK9 5AF
                </li>
              </ul>
            </div>
          </section>

          {/* FINAL FOOTNOTE */}
          <div className="text-center pt-10 border-t border-gray-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
              By using Shine & Span Cleaning Services LTD services, you
              acknowledge that you have read and understood this Privacy Policy.
            </p>
          </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
