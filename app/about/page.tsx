"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { 
  ArrowRight,
  Globe,
  Shield,
  Server,
  Users,
  Heart,
  Target,
  Rocket,
  Check,
  MapPin,
  Building2,
  Award
} from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { cn } from "@/lib/utils";
import { WireframeDottedGlobe } from "@/components/ui/wireframe-dotted-globe";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animated counter
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = value;
      const duration = 2000;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

const values = [
  { icon: Target, title: "Mission Driven", description: "Making enterprise infrastructure accessible to everyone" },
  { icon: Heart, title: "Customer First", description: "Every decision starts with how it helps our customers" },
  { icon: Rocket, title: "Always Innovating", description: "Constantly pushing boundaries to deliver better solutions" },
  { icon: Users, title: "Team Focused", description: "Great products come from great teams" },
];

const team = [
  { name: "Alex Chen", role: "CEO", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
  { name: "Sarah Miller", role: "CTO", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face" },
  { name: "James Wilson", role: "Engineering", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" },
  { name: "Emily Davis", role: "Success", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" },
  { name: "Michael Park", role: "Product", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face" },
  { name: "Lisa Zhang", role: "Marketing", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face" },
];

const timeline = [
  { year: "2020", event: "Founded", highlight: true },
  { year: "2021", event: "1K Users" },
  { year: "2022", event: "Global" },
  { year: "2023", event: "Series A", highlight: true },
  { year: "2024", event: "50K Users" },
  { year: "2025", event: "Enterprise", highlight: true },
];

export default function AboutPage() {
  const heroRef = React.useRef(null);
  const isHeroInView = useInView(heroRef, { once: true });

  return (
    <>
      <Header />
      <main className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <section className="relative pt-28 lg:pt-36 pb-20 lg:pb-28">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left Content */}
              <div ref={heroRef}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, ease }}
                  className="flex flex-wrap gap-2 mb-8"
                >
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-full text-sm font-dm-sans font-semibold">
                    <Building2 className="w-3.5 h-3.5" />
                    About Us
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-1 rounded-full text-sm font-dm-sans font-medium text-dark-muted border border-border">
                    <MapPin className="w-3.5 h-3.5" />
                    San Francisco
                  </span>
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-surface-1 rounded-full text-sm font-dm-sans font-medium text-dark-muted border border-border">
                    <Users className="w-3.5 h-3.5" />
                    50+ Team
                  </span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.1, ease }}
                  className="text-4xl sm:text-5xl lg:text-[3.5rem] font-google-sans font-bold text-dark tracking-tight leading-[1.1] mb-6"
                >
                  Building the
                  <br />
                  infrastructure layer
                  <br />
                  <span className="text-primary">for the internet</span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.2, ease }}
                  className="font-outfit text-lg text-dark-muted leading-relaxed mb-10 max-w-md"
                >
                  From a small team with a big vision to a global platform serving 50,000+ customers worldwide.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isHeroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.5, delay: 0.3, ease }}
                  className="flex flex-wrap gap-3"
                >
                  <Link
                    href="/careers"
                    className="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-dark text-white font-dm-sans font-semibold rounded-full hover:bg-primary hover:scale-[1.02] transition-all duration-300"
                  >
                    Join Our Team
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 bg-surface-1 text-dark font-dm-sans font-semibold rounded-full border border-border hover:border-dark/30 hover:bg-surface-2 transition-all duration-300"
                  >
                    Contact Us
                  </Link>
                </motion.div>
              </div>

              {/* Right - Globe */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isHeroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, delay: 0.2, ease }}
                className="relative flex items-center justify-center"
              >
                <div className="relative">
                  {/* Subtle glow behind globe */}
                  <div className="absolute inset-0 bg-primary/5 rounded-full blur-3xl scale-125" />
                  <WireframeDottedGlobe size={380} rotationSpeed={0.002} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Pills Row */}
        <section className="py-12 lg:py-16 border-y border-border bg-surface-1/30">
          <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-4"
            >
              {[
                { value: 50000, suffix: "+", label: "Customers", icon: Users },
                { value: 15, suffix: "+", label: "Locations", icon: Globe },
                { value: 99.99, suffix: "%", label: "Uptime", icon: Shield },
                { value: 1, suffix: "M+", label: "Servers", icon: Server },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  className="flex items-center gap-4 px-6 py-4 bg-surface-1 rounded-full border border-border hover:border-dark/20 hover:shadow-soft transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-full bg-dark flex items-center justify-center">
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="font-work-sans font-bold text-xl text-dark">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="font-outfit text-sm text-dark-muted">
                      {stat.label}
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Timeline Pills */}
        <section className="py-16 lg:py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-full text-sm font-dm-sans font-semibold mb-6">
                Our Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-google-sans font-bold text-dark tracking-tight">
                Key milestones
              </h2>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-wrap justify-center gap-3"
            >
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 rounded-full border transition-all duration-300 cursor-default",
                    item.highlight
                      ? "bg-dark text-white border-dark"
                      : "bg-surface-1 text-dark border-border hover:border-dark/30"
                  )}
                >
                  <span className={cn(
                    "font-work-sans font-bold text-lg",
                    item.highlight ? "text-primary" : "text-dark"
                  )}>
                    {item.year}
                  </span>
                  <span className={cn(
                    "font-outfit text-sm",
                    item.highlight ? "text-white/80" : "text-dark-muted"
                  )}>
                    {item.event}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Mission Card */}
        <section className="py-16 lg:py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-dark rounded-[32px] p-10 lg:p-16 overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="mission-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mission-dots)" />
                  </svg>
                </div>

                <div className="relative">
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-dm-sans font-semibold text-white/80">
                      <Target className="w-3.5 h-3.5" />
                      Our Mission
                    </span>
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 rounded-full text-sm font-dm-sans font-semibold text-primary">
                      <Award className="w-3.5 h-3.5" />
                      Since 2020
                    </span>
                  </div>

                  <h3 className="font-google-sans font-bold text-3xl lg:text-4xl text-white leading-tight mb-6 max-w-2xl">
                    Making enterprise infrastructure
                    <span className="text-primary"> accessible to everyone</span>
                  </h3>

                  <p className="font-outfit text-lg text-white/60 leading-relaxed max-w-2xl mb-10">
                    We believe every developer, startup, and business deserves access to the same 
                    powerful infrastructure that powers the world's largest companies. No complexity, 
                    no hidden fees, no compromises.
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {["Simple Pricing", "Global Scale", "24/7 Support", "99.99% Uptime"].map((item) => (
                      <span
                        key={item}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 rounded-full text-sm font-outfit text-white/80"
                      >
                        <Check className="w-4 h-4 text-emerald-400" />
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Values Grid */}
        <section className="py-16 lg:py-20 bg-surface-1/30">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-full text-sm font-dm-sans font-semibold mb-6">
                <Heart className="w-3.5 h-3.5" />
                Our Values
              </span>
              <h2 className="text-3xl sm:text-4xl font-google-sans font-bold text-dark tracking-tight">
                What drives us
              </h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 gap-4">
              {values.map((value, i) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <div className="flex items-start gap-4 p-6 bg-surface-1 rounded-[24px] border border-border hover:border-dark/20 hover:shadow-soft transition-all duration-300">
                    <div className="w-12 h-12 rounded-full bg-dark flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <value.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-google-sans font-semibold text-lg text-dark mb-1">
                        {value.title}
                      </h3>
                      <p className="font-outfit text-dark-muted">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 lg:py-20">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-dark text-white rounded-full text-sm font-dm-sans font-semibold mb-6">
                <Users className="w-3.5 h-3.5" />
                Leadership
              </span>
              <h2 className="text-3xl sm:text-4xl font-google-sans font-bold text-dark tracking-tight mb-3">
                Meet the team
              </h2>
              <p className="font-outfit text-dark-muted">
                The people building the future of cloud
              </p>
            </motion.div>

            <div className="flex flex-wrap justify-center gap-4">
              {team.map((member, i) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 px-4 py-3 bg-surface-1 rounded-full border border-border hover:border-dark/20 hover:shadow-soft transition-all duration-300">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-surface-2"
                    />
                    <div className="pr-2">
                      <h3 className="font-google-sans font-semibold text-dark">
                        {member.name}
                      </h3>
                      <p className="font-outfit text-sm text-dark-muted">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Team Size Pill */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex justify-center mt-8"
            >
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-dark/[0.03] rounded-full border border-dark/[0.06]">
                <div className="flex -space-x-2">
                  {team.slice(0, 4).map((member, i) => (
                    <img
                      key={member.name}
                      src={member.avatar}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-background"
                    />
                  ))}
                </div>
                <span className="font-outfit text-sm text-dark-muted">
                  <span className="font-semibold text-dark">50+</span> team members worldwide
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Investors */}
        <section className="py-12 lg:py-16 border-y border-border bg-surface-1/30">
          <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 lg:gap-10"
            >
              <span className="font-dm-sans text-sm font-semibold text-dark-muted uppercase tracking-wider">
                Backed by
              </span>
              <div className="flex flex-wrap justify-center gap-4">
                {["Sequoia", "a16z", "Index", "Accel"].map((investor, i) => (
                  <motion.div
                    key={investor}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-surface-1 rounded-full border border-border"
                  >
                    <div className="w-6 h-6 rounded-md bg-dark flex items-center justify-center">
                      <span className="font-google-sans font-bold text-white text-[10px]">
                        {investor.charAt(0)}
                      </span>
                    </div>
                    <span className="font-outfit font-medium text-dark">
                      {investor}
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="relative bg-dark rounded-[36px] p-10 lg:p-16 overflow-hidden text-center">
                {/* Background */}
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full">
                    <defs>
                      <pattern id="cta-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#cta-dots)" />
                  </svg>
                </div>

                {/* Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[100px]" />

                <div className="relative">
                  <div className="flex justify-center mb-8">
                    <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-sm font-dm-sans font-semibold text-white/80">
                      <Rocket className="w-3.5 h-3.5" />
                      We're Hiring
                    </span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-google-sans font-bold text-white tracking-tight mb-5">
                    Join our team
                  </h2>

                  <p className="font-outfit text-lg text-white/60 mb-10 max-w-md mx-auto">
                    We're looking for talented people who share our passion for building great products.
                  </p>

                  <div className="flex flex-wrap justify-center gap-3">
                    <Link
                      href="/careers"
                      className="group inline-flex items-center gap-2.5 px-8 py-4 bg-white text-dark font-dm-sans font-semibold rounded-full hover:bg-primary hover:text-white hover:scale-[1.02] transition-all duration-300"
                    >
                      View Open Roles
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2.5 px-8 py-4 bg-white/10 text-white font-dm-sans font-semibold rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300"
                    >
                      Contact Us
                    </Link>
                  </div>

                  {/* Open Positions Pills */}
                  <div className="flex flex-wrap justify-center gap-2 mt-10">
                    {["Engineering", "Design", "Product", "Sales"].map((dept) => (
                      <span
                        key={dept}
                        className="px-4 py-2 bg-white/5 rounded-full text-sm font-outfit text-white/50 border border-white/10"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
