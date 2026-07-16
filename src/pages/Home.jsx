const db = globalThis.__BHOODEVI_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useState } from "react";

import Hero3D from "@/components/Hero3D";
import TrustSection from "@/components/TrustSection";
import StatsSection from "@/components/StatsSection";
import FeaturedProperties from "@/components/FeaturedProperties";
import Categories from "@/components/Categories";
import WhyChoose from "@/components/WhyChoose";
import ServicesSection from "@/components/ServicesSection";
import Testimonials from "@/components/Testimonials";
import FAQAccordion from "@/components/FAQAccordion";
import CTABanner from "@/components/CTABanner";

export default function Home() {
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    db.entities.Testimonial.list("-created_date", 10).then(setTestimonials).catch(() => {});
    db.entities.FAQ.list("order", 10).then(setFaqs).catch(() => {});
  }, []);

  return (
    <>
      <Hero3D />
      <TrustSection />
      <StatsSection />
      <FeaturedProperties />
      <Categories />
      <WhyChoose />
      <ServicesSection />
      <Testimonials items={testimonials} />
      <FAQAccordion items={faqs} />
      <CTABanner />
    </>
  );
}