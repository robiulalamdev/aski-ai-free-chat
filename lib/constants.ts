export const APP_NAME = "NexaChat"
export const APP_DESCRIPTION = "Privacy-first AI chat that runs entirely in your browser. No servers, no tracking."
export const APP_URL = "https://freeaichat.app"

export const PRICING_PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "For casual users",
    features: ["Local AI model", "Basic tools", "1 conversation"],
    cta: "Start Chat",
    href: "/chat/new",
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For power users",
    features: ["Faster models", "All tools", "Unlimited conversations", "Custom prompts"],
    cta: "Coming Soon",
    href: "#",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$29",
    period: "/month",
    description: "For teams",
    features: ["Priority models", "API access", "Team management", "Dedicated support"],
    cta: "Coming Soon",
    href: "#",
  },
]

export const FEATURES = [
  {
    title: "100% Private",
    description: "AI runs entirely in your browser. Nothing leaves your device.",
    icon: "Shield",
  },
  {
    title: "Zero Server Cost",
    description: "No expensive GPU servers needed. The model runs locally.",
    icon: "Server",
  },
  {
    title: "Offline Ready",
    description: "After first download, use the AI offline anywhere.",
    icon: "Wifi",
  },
  {
    title: "Tool Calling",
    description: "Search the web, read websites, and more — all from chat.",
    icon: "Zap",
  },
  {
    title: "Markdown Responses",
    description: "Beautiful formatted responses with code blocks and tables.",
    icon: "FileText",
  },
  {
    title: "Open Source",
    description: "Transparent, auditable, and community-driven development.",
    icon: "Code",
  },
]

export const FAQS = [
  {
    question: "How does the AI run in my browser?",
    answer: "We use WebGPU and WebAssembly to run optimized AI models directly in your browser. The model is downloaded once and cached locally.",
  },
  {
    question: "Is my data private?",
    answer: "Yes. Everything runs locally on your device. No chat data is sent to any server. Only tool requests (like web searches) go through our proxy.",
  },
  {
    question: "What models are available?",
    answer: "We support Qwen 0.5B, SmolLM2, TinyLlama, and Gemma 1B. You can switch models anytime.",
  },
  {
    question: "Does it work on mobile?",
    answer: "Yes! The app is fully responsive and works as a PWA on mobile devices with WebGPU support.",
  },
  {
    question: "Do I need internet after setup?",
    answer: "After the initial model download, basic chat works offline. Internet is only needed for web search and website reading tools.",
  },
  {
    question: "Is it really free?",
    answer: "Yes, the Free plan gives you full access to the local AI model. No hidden costs or API usage limits.",
  },
]
