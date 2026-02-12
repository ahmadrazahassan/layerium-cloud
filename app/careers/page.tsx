"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { 
  Briefcase, 
  MapPin, 
  Clock,
  ArrowRight,
  Heart,
  Laptop,
  DollarSign,
  Plane,
  GraduationCap,
  Coffee
} from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const benefits = [
  { icon: DollarSign, title: "Competitive Salary", description: "Top-tier compensation packages" },
  { icon: Heart, title: "Health Insurance", description: "Full medical, dental & vision" },
  { icon: Laptop, title: "Remote First", description: "Work from anywhere in the world" },
  { icon: Plane, title: "Unlimited PTO", description: "Take the time you need" },
  { icon: GraduationCap, title: "Learning Budget", description: "$2,000/year for growth" },
  { icon: Coffee, title: "Home Office", description: "$1,000 setup allowance" },
];

const openings = [
  {
    title: "Senior Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Customer Success Manager",
    department: "Support",
    location: "Remote",
    type: "Full-time",
  },
  {
    title: "Technical Writer",
    department: "Documentation",
    location: "Remote",
    type: "Contract",
  },
];

export default function CareersPage() {
  const headerRef = React.useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 lg:pt-36 pb-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Hero */}
          <div ref={headerRef} className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-dark/[0.03] backdrop-blur-sm rounded-full border border-dark/[0.06] text-sm font-dm-sans font-semibold text-dark-muted">
                <Briefcase className="w-4 h-4 text-primary" />
                We're Hiring
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-bold text-dark tracking-tight mb-6"
            >
              Build the future
              <br />
              <span className="text-primary">with us</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="font-outfit text-lg text-dark-muted max-w-lg mx-auto"
            >
              Join a team of passionate people building the next generation of cloud infrastructure.
            </motion.p>
          </div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="font-google-sans font-bold text-2xl text-dark text-center mb-10">
              Why join Layerium?
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center gap-4 p-5 bg-surface-1 rounded-2xl border border-border hover:border-primary/20 transition-all duration-300"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <benefit.icon className="w-5 h-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-google-sans font-semibold text-dark">
                      {benefit.title}
                    </h3>
                    <p className="font-outfit text-sm text-dark-muted">
                      {benefit.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Open Positions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-google-sans font-bold text-2xl text-dark text-center mb-10">
              Open Positions
            </h2>
            <div className="space-y-3">
              {openings.map((job, i) => (
                <motion.a
                  key={job.title}
                  href="#"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.01 }}
                  className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-surface-1 rounded-2xl border border-border hover:border-primary/30 hover:shadow-soft transition-all duration-300"
                >
                  <div>
                    <h3 className="font-google-sans font-semibold text-lg text-dark mb-2 group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-2 rounded-full text-xs font-outfit text-dark-muted">
                        <Briefcase className="w-3 h-3" />
                        {job.department}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-2 rounded-full text-xs font-outfit text-dark-muted">
                        <MapPin className="w-3 h-3" />
                        {job.location}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-2 rounded-full text-xs font-outfit text-dark-muted">
                        <Clock className="w-3 h-3" />
                        {job.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-5 py-2.5 bg-dark text-white rounded-full font-dm-sans text-sm font-semibold group-hover:bg-primary transition-colors">
                    Apply
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center p-10 bg-surface-1 rounded-[32px] border border-border"
          >
            <h3 className="font-google-sans font-bold text-2xl text-dark mb-3">
              Don't see a role that fits?
            </h3>
            <p className="font-outfit text-dark-muted mb-6 max-w-md mx-auto">
              We're always looking for talented people. Send us your resume and we'll keep you in mind.
            </p>
            <a
              href="mailto:careers@layerium.com"
              className="inline-flex items-center gap-2 px-8 py-4 bg-dark text-white font-dm-sans font-semibold rounded-full hover:bg-primary hover:scale-[1.02] transition-all duration-300"
            >
              Send Resume
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
