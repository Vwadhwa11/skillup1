// Edit this file to update prices, booking link and contact details. No build step needed.
window.SITE_CONFIG = {
  calendlyUrl: "https://calendly.com/your-handle/ai-consultation", // <- replace
  contactEmail: "hello@skillup-ai.example",                        // shown on the page only
  currency: "$",
  pricingNote: "Indicative pricing per team. Final quotes depend on team size, location and customisation.",
  programmes: [
    { id: "ai-at-work", name: "AI at Work", duration: "Half-day workshop", from: 1200,
      summary: "A focused session that gets everyone using AI safely and productively in their daily work.",
      includes: ["Live, hands-on exercises with your own tasks", "Prompting and review habits that hold up", "Safe-use guidelines for your team", "Prompt library and follow-up notes"] },
    { id: "ai-for-business", name: "AI for Business", duration: "Two-day intensive", from: 3800, featured: true,
      summary: "Map your processes, automate the repetitive ones, and build your first AI agents.",
      includes: ["Process mapping and automation shortlist", "Build working automations and agents in class", "Productivity playbooks per role", "30-day async support after the course"] },
    { id: "ai-build-lab", name: "AI Build Lab", duration: "Three-week guided sprint", from: 7500,
      summary: "Prototype and deploy a tool your team will actually use, with a coach beside you.",
      includes: ["Weekly build sessions and office hours", "One scoped internal tool, shipped live", "Deployment, handover and documentation", "Demo day with your stakeholders"] }
  ]
};
