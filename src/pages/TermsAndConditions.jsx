import React, { useEffect } from "react";
import Navbar from "../Components/Homecomponents/Navbar";
import Footer from "../Components/Homecomponents/Footer";
import { useSiteSettings } from "../contexts/SiteSettingsContext";

const TermsAndConditions = () => {
  const { currencySymbol, country } = useSiteSettings();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sectionClass = "text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2 inline-block";
  const isUK = country === "uk";
  const isUS = country === "us";
  const isCanada = country === "canada";
  const showContractorAgreement = isUK || isUS || isCanada;

  return (
    <div className="font-jakarta bg-white text-slate-700 ">
      <Navbar />

      {/* --- PAGE HEADER --- */}
      <section className="bg-white py-16 border-b border-gray-100 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-black text-[#1e293b] uppercase tracking-tighter mb-4">
            Shine <span className="text-[#448cff]">&</span> Span Cleaning
            Services LTD
          </h1>
          <p className="text-[#448cff] font-black uppercase tracking-widest text-sm mb-4">
            {showContractorAgreement ? "Independent Contractor Agreement" : "Terms and Conditions"}
          </p>
          {isUK && (
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">
              United Kingdom – Balanced Enforcement
            </p>
          )}
          {isUS && (
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mb-2">
              United States – Balanced Enforcement
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

      {/* --- CONTENT SECTION --- */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="space-y-16">
          {isUK ? (
            /* --- UK: INDEPENDENT CONTRACTOR AGREEMENT --- */
            <>
              <section>
                <h2 className={sectionClass}>1. Independent Contractor Status</h2>
                <p className="leading-relaxed text-center">
                  The Contractor is engaged as an independent contractor. Nothing in this Agreement creates
                  employment, worker, partnership, or agency status. <i>The contractor</i> controls the manner and method of
                  work and is responsible for all taxes, statutory contributions, and insurance obligations.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>2. Scope of Services</h2>
                <p className="leading-relaxed text-center">
                  Contractor shall provide cleaning services as allocated through the company's booking system.
                  <i>The contractor</i> retains discretion over how services are performed, subject to agreed service standards.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>3. Reasonable Non-Solicitation</h2>
                <p className="leading-relaxed text-center">
                  During engagement and for 6 months following termination, Contractor shall not directly solicit or
                  accept work from clients personally serviced through the Company. This restriction is limited to
                  clients directly introduced to Contractor.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>4. Liquidated Damages (Reasonable Estimate)</h2>
                <p className="leading-relaxed text-center">
                  In the event of <i>a proven</i> breach of non-solicitation or confidentiality, <i>the contractor</i> agrees to pay {currencySymbol}5,000
                  as a reasonable pre-estimate of loss. This amount is compensatory, not punitive.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>5. Revenue Recovery Formula</h2>
                <p className="leading-relaxed text-center">
                  If Contractor directly engages a Company client in breach of this Agreement, Contractor shall
                  compensate Company for 6 months of average revenue generated from that client.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>6. Confidentiality</h2>
                <p className="leading-relaxed text-center">
                  Contractor shall keep confidential all client data, pricing structures, CRM systems, automation
                  workflows, and operational processes. Obligation survives termination.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>7. Digital Evidence</h2>
                <p className="leading-relaxed text-center">
                  Contractor acknowledges Company uses CRM records, booking logs, GPS timestamps (where
                  lawful), and system records. Such digital records may be used as contractual evidence in disputes.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>8. Proportional Breach Structure</h2>
                <p className="leading-relaxed text-center">
                  Minor breaches may result in written warnings. Material breaches may result in suspension or
                  termination. Serious misconduct may result in damages and injunctive relief.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>9. Dispute Resolution</h2>
                <p className="leading-relaxed text-center">
                  Parties agree to attempt good faith resolution prior to legal proceedings. Unresolved disputes may
                  proceed in accordance with governing law.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>10. Governing Law</h2>
                <p className="leading-relaxed text-center">
                  This Agreement is governed by the laws of England and Wales.
                </p>
              </section>
              <section className="bg-slate-50 border border-gray-400 p-8 md:p-12 rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-8 tracking-widest text-center">
                  Contact Information
                </h2>
                <div className="space-y-2 font-bold text-slate-800 text-lg text-center">
                  <p className="text-[#448cff] uppercase text-xs tracking-[0.2em] mb-2 font-black text-center">Get in Touch</p>
                  <p>Shine & Span Cleaning Services LTD</p>
                  <p>Email: cleaning@shinespan.co.uk</p>
                  <p>Phone: 0738 464 7705 (Available from 1 PM to 7 PM)</p>
                  <p>Address: [Your Business Address]</p>
                </div>
              </section>
              <div className="text-center pt-10 border-t border-gray-100">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] text-center">
                  By engaging with Shine & Span Cleaning Services LTD as a contractor, you acknowledge that you have read and understood this Independent Contractor Agreement.
                </p>
              </div>
            </>
          ) : isUS ? (
            /* --- US: INDEPENDENT CONTRACTOR AGREEMENT --- */
            <>
              <section>
                <h2 className={sectionClass}>1. Independent Contractor Status</h2>
                <p className="leading-relaxed text-center">
                  The Contractor is engaged as an independent contractor. Nothing in this Agreement creates
                  employment, worker, partnership, or agency status. <i>The contractor</i> controls the manner and method of
                  work and is responsible for all taxes, statutory contributions, and insurance obligations.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>2. Scope of Services</h2>
                <p className="leading-relaxed text-center">
                  Contractor shall provide cleaning services as allocated through the company's booking system.
                  <i>The contractor</i> retains discretion over how services are performed, subject to agreed service standards.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>3. Reasonable Non-Solicitation</h2>
                <p className="leading-relaxed text-center">
                  During engagement and for 6 months following termination, Contractor shall not directly solicit or
                  accept work from clients personally serviced through the Company. This restriction is limited to
                  clients directly introduced to Contractor.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>4. Liquidated Damages (Reasonable Estimate)</h2>
                <p className="leading-relaxed text-center">
                  In the event of <i>a proven</i> breach of non-solicitation or confidentiality, <i>the contractor</i> agrees to pay {currencySymbol}5,000
                  as a reasonable pre-estimate of loss. This amount is compensatory, not punitive.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>5. Revenue Recovery Formula</h2>
                <p className="leading-relaxed text-center">
                  If Contractor directly engages a Company client in breach of this Agreement, Contractor shall
                  compensate Company for 6 months of average revenue generated from that client.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>6. Confidentiality</h2>
                <p className="leading-relaxed text-center">
                  Contractor shall keep confidential all client data, pricing structures, CRM systems, automation
                  workflows, and operational processes. Obligation survives termination.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>7. Digital Evidence</h2>
                <p className="leading-relaxed text-center">
                  Contractor acknowledges Company uses CRM records, booking logs, GPS timestamps (where
                  lawful), and system records. Such digital records may be used as contractual evidence in disputes.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>8. Proportional Breach Structure</h2>
                <p className="leading-relaxed text-center">
                  Minor breaches may result in written warnings. Material breaches may result in suspension or
                  termination. Serious misconduct may result in damages and injunctive relief.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>9. Dispute Resolution</h2>
                <p className="leading-relaxed text-center">
                  Parties agree to attempt good faith resolution prior to legal proceedings. Unresolved disputes may
                  proceed in accordance with governing law.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>10. Governing Law</h2>
                <p className="leading-relaxed text-center">
                  This Agreement is governed by the laws of the State of ________.
                </p>
              </section>
              <section className="bg-slate-50 border border-gray-400 p-8 md:p-12 rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-8 tracking-widest text-center">
                  Contact Information
                </h2>
                <div className="space-y-2 font-bold text-slate-800 text-lg text-center">
                  <p className="text-[#448cff] uppercase text-xs tracking-[0.2em] mb-2 font-black text-center">Get in Touch</p>
                  <p>Shine & Span Cleaning Services LTD</p>
                  <p>Email: cleaning@shinespan.co.uk</p>
                  <p>Phone: 0738 464 7705 (Available from 1 PM to 7 PM)</p>
                  <p>Address: [Your Business Address]</p>
                </div>
              </section>
              <div className="text-center pt-10 border-t border-gray-100">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] text-center">
                  By engaging with Shine & Span Cleaning Services LTD as a contractor, you acknowledge that you have read and understood this Independent Contractor Agreement.
                </p>
              </div>
            </>
          ) : isCanada ? (
            /* --- CANADA: INDEPENDENT CONTRACTOR AGREEMENT --- */
            <>
              <section>
                <h2 className={sectionClass}>1. Independent Contractor Status</h2>
                <p className="leading-relaxed text-center mb-4">
                  1.1 <i>The Contractor</i> is engaged as an independent contractor and not as an employee, agent, partner, or representative of the Company.
                </p>
                <p className="leading-relaxed text-center mb-2">
                  1.2 <i>The Contractor</i> is solely responsible for:
                </p>
                <ul className="list-inside list-disc space-y-1 text-center leading-relaxed mb-4">
                  <li>Canada Revenue Agency (CRA) filings</li>
                  <li>Canada Pension Plan (CPP) contributions</li>
                  <li>Employment Insurance (EI) contributions</li>
                  <li>GST/HST registration and remittance (where applicable)</li>
                  <li>Income taxes and other statutory obligations</li>
                </ul>
                <p className="leading-relaxed text-center">
                  1.3 Nothing in this Agreement shall create an employment relationship under the Canada Labour Code or applicable provincial employment standards legislation.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>2. Scope of Services</h2>
                <p className="leading-relaxed text-center mb-4">
                  2.1 <i>The Contractor</i> shall provide residential and/or commercial cleaning services as allocated through the Company's booking or scheduling system.
                </p>
                <p className="leading-relaxed text-center">
                  2.2 <i>The Contractor</i> retains control over the manner and method of performing services, subject to agreed quality standards.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>3. Reasonable Non-Solicitation</h2>
                <p className="leading-relaxed text-center mb-4">
                  3.1 During the term of this Agreement and for six (6) months following termination, <i>the Contractor</i> shall not directly solicit or accept work from any client personally serviced through the Company.
                </p>
                <p className="leading-relaxed text-center">
                  3.2 This restriction is limited to clients directly introduced to <i>the Contractor</i> by the Company.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>4. Liquidated Damages</h2>
                <p className="leading-relaxed text-center mb-4">
                  4.1 In the event of proven breach of Section 3 (Non-Solicitation) or Section 6 (Confidentiality), <i>the Contractor</i> agrees to pay CAD $5,000 as a reasonable pre-estimate of loss.
                </p>
                <p className="leading-relaxed text-center">
                  4.2 The parties agree this amount is compensatory and not punitive.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>5. Revenue Recovery Formula</h2>
                <p className="leading-relaxed text-center">
                  If <i>the Contractor</i> directly or indirectly engages a Company client in breach of this Agreement, <i>the Contractor</i> shall compensate the Company for six (6) months of average revenue generated from that client prior to breach.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>6. Confidentiality</h2>
                <p className="leading-relaxed text-center mb-2">
                  6.1 <i>The Contractor</i> shall keep strictly confidential:
                </p>
                <ul className="list-inside list-disc space-y-1 text-center leading-relaxed mb-4">
                  <li>Client identities</li>
                  <li>Pricing structures</li>
                  <li>CRM systems</li>
                  <li>Operational processes</li>
                  <li>Automation systems</li>
                  <li>AI workflows</li>
                  <li>Marketing strategy</li>
                </ul>
                <p className="leading-relaxed text-center">
                  6.2 This obligation survives termination.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>7. Digital Evidence Clause</h2>
                <p className="leading-relaxed text-center mb-2">
                  <i>The Contractor</i> acknowledges that the Company uses:
                </p>
                <ul className="list-inside list-disc space-y-1 text-center leading-relaxed mb-4">
                  <li>CRM logs</li>
                  <li>Booking records</li>
                  <li>GPS attendance timestamps (where lawful)</li>
                  <li>System access logs</li>
                  <li>Electronic communications</li>
                </ul>
                <p className="leading-relaxed text-center">
                  Such records may be relied upon as contractual evidence in arbitration or court proceedings.
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>8. Proportional Breach Structure</h2>
                <ul className="list-inside list-disc space-y-2 text-center leading-relaxed">
                  <li><strong>Minor breach:</strong> Written warning</li>
                  <li><strong>Material breach:</strong> Suspension or termination</li>
                  <li><strong>Serious misconduct:</strong> Damages and injunctive relief</li>
                </ul>
              </section>
              <section>
                <h2 className={sectionClass}>9. Dispute Resolution</h2>
                <p className="leading-relaxed text-center mb-4">
                  The Parties agree to attempt good faith resolution prior to legal proceedings.
                </p>
                <p className="leading-relaxed text-center">
                  Unresolved disputes shall proceed in accordance with the laws of the Province of [Insert Province].
                </p>
              </section>
              <section>
                <h2 className={sectionClass}>10. Governing Law</h2>
                <p className="leading-relaxed text-center">
                  This Agreement is governed by the laws of the Province of ________ and the applicable federal laws of Canada.
                </p>
              </section>
              <section className="bg-slate-50 border border-gray-400 p-8 md:p-12 rounded-sm text-center">
                <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-8 tracking-widest text-center">
                  Contact Information
                </h2>
                <div className="space-y-2 font-bold text-slate-800 text-lg text-center">
                  <p className="text-[#448cff] uppercase text-xs tracking-[0.2em] mb-2 font-black text-center">Get in Touch</p>
                  <p>Shine & Span Cleaning Services LTD</p>
                  <p>Email: cleaning@shinespan.co.uk</p>
                  <p>Phone: 0738 464 7705 (Available from 1 PM to 7 PM)</p>
                  <p>Address: [Your Business Address]</p>
                </div>
              </section>
              <div className="text-center pt-10 border-t border-gray-100">
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] text-center">
                  By engaging with Shine & Span Cleaning Services LTD as a contractor, you acknowledge that you have read and understood this Independent Contractor Agreement.
                </p>
              </div>
            </>
          ) : (
            <>
          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2 inline-block">
              1. Introduction
            </h2>
            <p className="leading-relaxed mb-4 text-center">
              These Terms and Conditions ("Terms") govern the provision of
              cleaning services by Shine & Span Cleaning Services LTD ("we",
              "us", "our", "the Company") to customers ("you", "your", "the
              Customer"). By booking our services, you agree to be bound by
              these Terms.
            </p>
            <p className="leading-relaxed text-center font-bold">
              Please read these Terms carefully before using our services. If
              you do not agree with any part of these Terms, you should not use
              our services.
            </p>
          </section>

          {/* 2. Services Provided */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2 inline-block">
              2. Services Provided
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase mb-4 tracking-widest">
                  2.1 Scope of Services
                </h3>
                <p className="mb-4">
                  Shine & Span Cleaning Services LTD provides professional
                  cleaning services including:
                </p>
                <ul className="list-inside list-disc space-y-2 text-center">
                  <li>Regular domestic cleaning</li>
                  <li>Deep cleaning</li>
                  <li>End of tenancy cleaning</li>
                  <li>Office cleaning</li>
                  <li>Post-construction cleaning</li>
                  <li>Carpet and upholstery cleaning</li>
                </ul>
              </div>
              <p className="leading-relaxed">
                <strong>2.2 Service Customization:</strong> Services can be
                customized based on requirements. Special requests may incur
                additional charges.
              </p>
              <p className="leading-relaxed">
                <strong>2.3 Service Standards:</strong> We use
                professional-grade products. All cleaners are trained, insured,
                and background-checked.
              </p>
            </div>
          </section>

          {/* 3. Booking and Scheduling */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2 inline-block">
              3. Booking and Scheduling
            </h2>
            <ul className="list-inside list-disc space-y-4 text-center leading-relaxed">
              <li>
                <strong>3.1 How to Book:</strong> Via website, app, telephone,
                or email.
              </li>
              <li>
                <strong>3.2 Confirmation:</strong> Booking is confirmed only via
                a confirmation email/message.
              </li>
              <li>
                <strong>3.3 Rescheduling:</strong> At least 24 hours' notice
                required.
              </li>
            </ul>
          </section>

          {/* 4. Pricing and Payment */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2 inline-block">
              4. Pricing and Payment
            </h2>
            <p className="mb-6">
              Pricing is based on service type, size, and duration in the local
              currency ({currencySymbol}).
            </p>
            <ul className="list-inside list-disc space-y-3 text-center">
              <li>
                <strong>Payment:</strong> Due at booking or immediately after
                completion.
              </li>
              <li>
                <strong>Late Payment:</strong> If not received within 7 days,{" "}
                {currencySymbol}15 fee applies.
              </li>
              <li>
                <strong>Price Changes:</strong> We provide 30 days' notice for
                regular contract increases.
              </li>
            </ul>
          </section>

          {/* 5. Cancellation and Refunds */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2 inline-block">
              5. Cancellation and Refunds
            </h2>
            <div className="space-y-6 leading-relaxed">
              <p>
                <strong>5.1 Fees:</strong> 24h notice: No fee. Under 24h: 50%
                fee. Under 2h: 100% fee.
              </p>
              <p>
                <strong>5.2 Refund Policy:</strong> Contact us within 24 hours
                if unsatisfied. We may offer a re-clean or refund.
              </p>
              <p>
                <strong>5.3 No Refunds:</strong> No refund if the complaint is
                made after 24 hours or if access was inadequate.
              </p>
            </div>
          </section>

          {/* 6. Customer Responsibilities */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2 inline-block">
              6. Customer Responsibilities
            </h2>
            <ul className="list-inside list-disc space-y-4 text-center leading-relaxed">
              <li>
                <strong>6.1 Preparation:</strong> Property must be reasonably
                tidy. We clean, we don't tidy clutter.
              </li>
              <li>
                <strong>6.2 Safety:</strong> Inform us of mold, asbestos, or
                hazardous materials in advance.
              </li>
              <li>
                <strong>6.3 Pets:</strong> Please secure pets in a separate room
                during the service.
              </li>
              <li>
                <strong>6.4 Valuables:</strong> Secure fragile items. We are not
                liable for unsecured valuables.
              </li>
            </ul>
          </section>

          {/* 7. Liability and Insurance */}
          <section>
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-6 tracking-tight border-b-2 border-gray-100 pb-2 inline-block text-center">
              7. Liability and Insurance
            </h2>
            <p className="mb-4">
              Shine & Span Cleaning Services LTD maintains public and employer's
              liability insurance.
            </p>
            <p className="leading-relaxed mb-4">
              <strong>7.2 Limitation:</strong> Total liability is limited to the
              cost of service or {currencySymbol}1,000, whichever is lower.
            </p>
            <p className="leading-relaxed italic">
              Damage must be reported within 24 hours of service completion.
            </p>
          </section>

          {/* 8, 9, 10, 11 (Brief Sections) */}
          <section className="space-y-12">
            <div>
              <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-4 border-b-2 border-gray-100 pb-2 inline-block">
                8. Data Protection
              </h2>
              <p className="text-center leading-relaxed">
                We process data in accordance with UK GDPR. See our Privacy
                Policy for details.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-4 border-b-2 border-gray-100 pb-2 inline-block">
                9. Complaints
              </h2>
              <p className="text-center leading-relaxed">
                Contact support@Shine & Span Cleaning Services LTD.co.uk within
                24 hours. We respond within 5 working days.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-4 border-b-2 border-gray-100 pb-2 inline-block">
                10. Termination
              </h2>
              <p className="text-center leading-relaxed">
                Customers must provide 7 days' notice. We may terminate
                immediately for breach or safety issues.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-4 border-b-2 border-gray-100 pb-2 inline-block">
                11. General Provisions
              </h2>
              <p className="text-center leading-relaxed text-sm">
                Terms are subject to change with 30 days' notice. Severability
                and assignment clauses apply.
              </p>
            </div>
          </section>

          {/* 12. Contact Us */}
          <section className="bg-slate-50 border border-gray-400 p-8 md:p-12 rounded-sm text-center">
            <h2 className="text-2xl font-black text-[#1e293b] uppercase mb-8 tracking-widest text-center">
              12. Contact Information
            </h2>
            <div className="space-y-2 font-bold text-slate-800 text-lg text-center">
              <p className="text-[#448cff] uppercase text-xs tracking-[0.2em] mb-2 font-black text-center">
                Get in Touch
              </p>
              <p>Shine & Span Cleaning Services LTD</p>
              <p>Email: cleaning@shinespan.co.uk</p>
              <p>Phone: 0738 464 7705 (Available from 1 PM to 7 PM)</p>
              <p>Address: [Your Business Address]</p>
            </div>
          </section>

          {/* FINAL FOOTNOTE */}
          <div className="text-center pt-10 border-t border-gray-100">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] text-center">
              By booking Shine & Span Cleaning Services LTD services, you
              acknowledge that you have read and understood these Terms and
              Conditions.
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

export default TermsAndConditions;
