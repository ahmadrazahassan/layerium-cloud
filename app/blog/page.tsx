"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { 
  BookOpen, 
  Calendar,
  Clock,
  ArrowRight,
  Tag
} from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const categories = ["All", "Engineering", "Product", "Security", "Company"];

const posts = [
  {
    title: "Introducing NVMe Storage Across All Plans",
    excerpt: "We're excited to announce that all VPS and RDP plans now include blazing-fast NVMe storage at no extra cost.",
    category: "Product",
    date: "Dec 28, 2025",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop",
    featured: true,
  },
  {
    title: "How We Achieved 99.99% Uptime in 2025",
    excerpt: "A deep dive into our infrastructure improvements and the engineering decisions that led to our best year yet.",
    category: "Engineering",
    date: "Dec 20, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop",
  },
  {
    title: "New Datacenter in Singapore",
    excerpt: "Expanding our global footprint with a new state-of-the-art datacenter in Singapore to better serve APAC customers.",
    category: "Company",
    date: "Dec 15, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop",
  },
  {
    title: "Understanding DDoS Protection",
    excerpt: "Learn how our multi-layered DDoS protection keeps your servers safe from even the most sophisticated attacks.",
    category: "Security",
    date: "Dec 10, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=400&fit=crop",
  },
  {
    title: "Optimizing Your VPS for Maximum Performance",
    excerpt: "Tips and tricks from our engineering team to get the most out of your Layerium VPS.",
    category: "Engineering",
    date: "Dec 5, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=400&fit=crop",
  },
  {
    title: "2025 Year in Review",
    excerpt: "Looking back at an incredible year of growth, new features, and the amazing community we've built.",
    category: "Company",
    date: "Dec 1, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=400&fit=crop",
  },
];

export default function BlogPage() {
  const headerRef = React.useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });
  const [activeCategory, setActiveCategory] = React.useState("All");

  const filteredPosts = activeCategory === "All" 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  const featuredPost = posts.find(p => p.featured);
  const regularPosts = filteredPosts.filter(p => !p.featured);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 lg:pt-36 pb-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Hero */}
          <div ref={headerRef} className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-dark/[0.03] backdrop-blur-sm rounded-full border border-dark/[0.06] text-sm font-dm-sans font-semibold text-dark-muted">
                <BookOpen className="w-4 h-4 text-primary" />
                Blog
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-bold text-dark tracking-tight mb-4"
            >
              Latest Updates
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="font-outfit text-lg text-dark-muted max-w-lg mx-auto"
            >
              News, tutorials, and insights from the Layerium team.
            </motion.p>
          </div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-5 py-2.5 rounded-full font-outfit text-sm font-medium transition-all duration-300",
                  activeCategory === cat
                    ? "bg-dark text-white"
                    : "bg-surface-1 text-dark-muted hover:text-dark border border-border"
                )}
              >
                {cat}
              </button>
            ))}
          </motion.div>

          {/* Featured Post */}
          {featuredPost && activeCategory === "All" && (
            <motion.a
              href="#"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.01 }}
              className="group block mb-10"
            >
              <div className="relative overflow-hidden bg-surface-1 rounded-[32px] border border-border hover:border-primary/20 transition-all duration-300">
                <div className="grid lg:grid-cols-2">
                  <div className="aspect-[16/10] lg:aspect-auto overflow-hidden">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-dm-sans font-semibold rounded-full">
                        Featured
                      </span>
                      <span className="px-3 py-1 bg-surface-2 text-dark-muted text-xs font-outfit rounded-full">
                        {featuredPost.category}
                      </span>
                    </div>
                    <h2 className="font-google-sans font-bold text-2xl lg:text-3xl text-dark mb-4 group-hover:text-primary transition-colors">
                      {featuredPost.title}
                    </h2>
                    <p className="font-outfit text-dark-muted mb-6 leading-relaxed">
                      {featuredPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm font-outfit text-dark-muted">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.a>
          )}

          {/* Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularPosts.map((post, i) => (
              <motion.a
                key={post.title}
                href="#"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="bg-surface-1 rounded-[24px] border border-border overflow-hidden hover:border-primary/20 hover:shadow-soft transition-all duration-300">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-2 rounded-full text-xs font-outfit text-dark-muted mb-4">
                      <Tag className="w-3 h-3" />
                      {post.category}
                    </span>
                    <h3 className="font-google-sans font-semibold text-lg text-dark mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="font-outfit text-sm text-dark-muted mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs font-outfit text-dark-muted">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Newsletter CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 relative overflow-hidden bg-dark rounded-[32px] p-10 lg:p-14"
          >
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="blog-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#blog-dots)" />
              </svg>
            </div>

            <div className="relative text-center">
              <h3 className="font-google-sans font-bold text-2xl lg:text-3xl text-white mb-3">
                Subscribe to our newsletter
              </h3>
              <p className="font-outfit text-white/60 mb-8 max-w-md mx-auto">
                Get the latest updates, tutorials, and news delivered to your inbox.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/10 rounded-full font-outfit text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
                />
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-dark font-dm-sans font-semibold rounded-full hover:bg-primary hover:text-white transition-all duration-300"
                >
                  Subscribe
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
