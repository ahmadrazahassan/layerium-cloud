"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { 
  Code, 
  Copy,
  Check,
  ArrowRight,
  Terminal,
  Key,
  Server,
  Activity,
  Settings
} from "lucide-react";
import { Header, Footer } from "@/components/marketing";
import { GreenTrialButton } from "@/components/ui/flip-button";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

const endpoints = [
  {
    method: "GET",
    path: "/v1/servers",
    description: "List all servers",
    category: "Servers",
  },
  {
    method: "POST",
    path: "/v1/servers",
    description: "Create a new server",
    category: "Servers",
  },
  {
    method: "GET",
    path: "/v1/servers/{id}",
    description: "Get server details",
    category: "Servers",
  },
  {
    method: "DELETE",
    path: "/v1/servers/{id}",
    description: "Delete a server",
    category: "Servers",
  },
  {
    method: "POST",
    path: "/v1/servers/{id}/reboot",
    description: "Reboot a server",
    category: "Actions",
  },
  {
    method: "GET",
    path: "/v1/account",
    description: "Get account info",
    category: "Account",
  },
];

const codeExample = `curl -X GET "https://api.layerium.com/v1/servers" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`;

const responseExample = `{
  "data": [
    {
      "id": "srv_abc123",
      "name": "my-vps-server",
      "status": "running",
      "plan": "vps-standard",
      "region": "us-east-1",
      "ip": "192.168.1.1",
      "created_at": "2025-12-01T00:00:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1
  }
}`;

function CodeBlock({ code, language = "bash" }: { code: string; language?: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-dark rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <span className="font-mono text-xs text-white/50">{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg text-xs font-dm-sans text-white/70 hover:text-white hover:bg-white/15 transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="p-5 overflow-x-auto">
        <code className="font-mono text-sm text-white/80 leading-relaxed">{code}</code>
      </pre>
    </div>
  );
}

export default function APIDocsPage() {
  const headerRef = React.useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true });

  const methodColors: Record<string, string> = {
    GET: "bg-emerald-500/10 text-emerald-600",
    POST: "bg-blue-500/10 text-blue-600",
    PUT: "bg-amber-500/10 text-amber-600",
    DELETE: "bg-red-500/10 text-red-600",
  };

  return (
    <>
      <Header />
      <main className="min-h-screen pt-28 lg:pt-36 pb-20">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
          {/* Hero */}
          <div ref={headerRef} className="text-center mb-14">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 bg-dark/[0.03] backdrop-blur-sm rounded-full border border-dark/[0.06] text-sm font-dm-sans font-semibold text-dark-muted">
                <Code className="w-4 h-4 text-primary" />
                API Reference
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1, ease }}
              className="text-4xl sm:text-5xl lg:text-6xl font-google-sans font-bold text-dark tracking-tight mb-4"
            >
              Build with our API
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2, ease }}
              className="font-outfit text-lg text-dark-muted max-w-lg mx-auto"
            >
              Programmatically manage your infrastructure with our RESTful API.
            </motion.p>
          </div>

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <h2 className="font-google-sans font-bold text-2xl text-dark mb-6">
              Quick Start
            </h2>
            <div className="grid lg:grid-cols-3 gap-4 mb-8">
              {[
                { icon: Key, title: "Get API Key", description: "Generate from dashboard" },
                { icon: Terminal, title: "Make Request", description: "Use any HTTP client" },
                { icon: Activity, title: "Monitor", description: "Track usage in real-time" },
              ].map((step, i) => (
                <div
                  key={step.title}
                  className="flex items-center gap-4 p-5 bg-surface-1 rounded-2xl border border-border"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-dm-sans text-xs font-semibold text-dark-muted mb-0.5">
                      Step {i + 1}
                    </div>
                    <h3 className="font-google-sans font-semibold text-dark">
                      {step.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div>
                <h3 className="font-dm-sans text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3">
                  Request
                </h3>
                <CodeBlock code={codeExample} language="bash" />
              </div>
              <div>
                <h3 className="font-dm-sans text-sm font-semibold text-dark-muted uppercase tracking-wider mb-3">
                  Response
                </h3>
                <CodeBlock code={responseExample} language="json" />
              </div>
            </div>
          </motion.div>

          {/* Base URL */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="p-6 bg-surface-1 rounded-2xl border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-google-sans font-semibold text-dark mb-1">
                    Base URL
                  </h3>
                  <p className="font-outfit text-sm text-dark-muted">
                    All API requests should be made to this base URL
                  </p>
                </div>
                <code className="px-4 py-2 bg-dark rounded-xl font-mono text-sm text-white">
                  https://api.layerium.com
                </code>
              </div>
            </div>
          </motion.div>

          {/* Endpoints */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-google-sans font-bold text-2xl text-dark mb-6">
              Endpoints
            </h2>
            <div className="bg-surface-1 rounded-[24px] border border-border overflow-hidden">
              {endpoints.map((endpoint, i) => (
                <a
                  key={`${endpoint.method}-${endpoint.path}`}
                  href="#"
                  className={cn(
                    "group flex items-center justify-between p-5 hover:bg-surface-2 transition-colors",
                    i !== endpoints.length - 1 && "border-b border-border"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "px-3 py-1 rounded-lg font-mono text-xs font-semibold",
                      methodColors[endpoint.method]
                    )}>
                      {endpoint.method}
                    </span>
                    <div>
                      <code className="font-mono text-sm text-dark group-hover:text-primary transition-colors">
                        {endpoint.path}
                      </code>
                      <p className="font-outfit text-sm text-dark-muted">
                        {endpoint.description}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-dark-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 relative overflow-hidden bg-dark rounded-[32px] p-10 lg:p-14"
          >
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full">
                <defs>
                  <pattern id="api-dots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#api-dots)" />
              </svg>
            </div>

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="font-google-sans font-bold text-2xl lg:text-3xl text-white mb-2">
                  Ready to integrate?
                </h3>
                <p className="font-outfit text-white/60 max-w-md">
                  Get your API key from the dashboard and start building.
                </p>
              </div>
              <GreenTrialButton href="/dashboard" size="lg">
                Get API Key
              </GreenTrialButton>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
