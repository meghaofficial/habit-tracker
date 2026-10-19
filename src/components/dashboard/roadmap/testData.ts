import type { RoadmapData, RoadmapItem } from "./types";

export const initialRoadmaps: RoadmapItem[] = [
  {
    id: "frontend-react",
    title: "Frontend Mastery (React & Next.js)",
    description:
      "Component architecture, performance optimization, SSR, and state management.",
    category: "Frontend",
    icon: "⚛️",
    totalProblems: 24,
    completedProblems: 24,
    color: "#38bdf8",
    badge: "Mastered",
  },
  {
    id: "system-design",
    title: "System Design & Distributed Systems",
    description:
      "Scalability, microservices, load balancing, caching, and database sharding.",
    category: "Architecture",
    icon: "🏛️",
    totalProblems: 20,
    completedProblems: 14,
    color: "#10b981",
    badge: "Popular",
  },
  {
    id: "backend-nodejs",
    title: "Backend Engineering with Node & Go",
    description:
      "RESTful APIs, gRPC, auth patterns, concurrency, and message brokers.",
    category: "Backend",
    icon: "🚀",
    totalProblems: 18,
    completedProblems: 9,
    color: "#8b5cf6",
  },
  {
    id: "dsa-patterns",
    title: "Data Structures & Core Algorithms",
    description:
      "Dynamic programming, graphs, trees, sorting, and Big-O efficiency.",
    category: "Algorithms",
    icon: "🧩",
    totalProblems: 30,
    completedProblems: 30,
    color: "#f59e0b",
    badge: "Completed",
  },
  {
    id: "devops-cloud",
    title: "DevOps & Cloud Infrastructure",
    description:
      "Docker containerization, Kubernetes orchestration, CI/CD, and AWS services.",
    category: "DevOps",
    icon: "☁️",
    totalProblems: 16,
    completedProblems: 6,
    color: "#06b6d4",
  },
  {
    id: "database-engineering",
    title: "Database Engineering & SQL Tuning",
    description:
      "Query execution plans, indexing strategies, ACID guarantees, and transactions.",
    category: "Database",
    icon: "🗄️",
    totalProblems: 15,
    completedProblems: 15,
    color: "#ec4899",
    badge: "Completed",
  },
  {
    id: "ai-engineer",
    title: "AI Engineering & LLM Applications",
    description:
      "Prompt engineering, RAG pipelines, embeddings, and autonomous agent systems.",
    category: "AI / ML",
    icon: "🧠",
    totalProblems: 12,
    completedProblems: 4,
    color: "#a855f7",
    badge: "Trending",
  },
  {
    id: "cybersecurity",
    title: "Web Security & Penetration Testing",
    description:
      "OWASP Top 10 vulnerabilities, JWT security, OAuth 2.0, and sanitization.",
    category: "Security",
    icon: "🛡️",
    totalProblems: 10,
    completedProblems: 0,
    color: "#f43f5e",
  },
  {
    id: "mobile-react-native",
    title: "Mobile App Dev with React Native",
    description:
      "Cross-platform mobile apps, offline-first sync, animations, and deployment.",
    category: "Mobile",
    icon: "📱",
    totalProblems: 14,
    completedProblems: 7,
    color: "#f97316",
  },
  {
    id: "testing-qa",
    title: "Software Testing & QA Automation",
    description:
      "Unit testing, integration testing, Cypress, Playwright, and TDD practices.",
    category: "Testing",
    icon: "🎯",
    totalProblems: 12,
    completedProblems: 12,
    color: "#22c55e",
    badge: "Completed",
  },
];

// Initial default roadmap template with sample nodes to make testing immediately interactive
export const initialRootRoadmap: RoadmapData = {
  id: "roadmap-" + Date.now(),
  title: "Modern Full-Stack Engineering",
  category: "Software Development",
  icon: "🚀",
  color: "#6366f1",
  description:
    "End-to-end pathway covering web architecture, APIs, distributed persistence, and cloud deployment.",
  nodes: [
    {
      id: "node-1",
      title: "Core Web Fundamentals",
      type: "single",
      icon: "🌱",
      color: "#10b981",
      description:
        "Master HTTP/HTTPS, browser rendering, DNS resolution, and security headers.",
      completed: true,
      status: "completed",
    },
    {
      id: "node-2",
      title: "State Management & React Architecture",
      type: "sequential",
      icon: "⚛️",
      color: "#38bdf8",
      tasks: [
        {
          id: "t1",
          title: "Step 1: Component Lifecycle & Hooks",
          completed: true,
        },
        {
          id: "t2",
          title: "Step 2: Global Stores (Redux / Zustand)",
          completed: true,
        },
        {
          id: "t3",
          title: "Step 3: Server State & TanStack Query",
          completed: false,
        },
        {
          id: "t4",
          title: "Step 4: Performance Profiling & Memoization",
          completed: false,
        },
      ],
      status: "completed",
    },
    {
      id: "node-3",
      title: "Backend Services & Microservices",
      type: "nested",
      icon: "🏛️",
      color: "#8b5cf6",
      status: "active",
      nestedRoadmap: {
        id: "sub-1",
        title: "Distributed Microservices & APIs",
        category: "Backend Architecture",
        icon: "🏛️",
        color: "#8b5cf6",
        description:
          "Deep dive into gRPC, message queues, API gateways, and concurrency.",
        nodes: [
          {
            id: "sub-node-1",
            title: "REST & gRPC Contracts",
            type: "single",
            icon: "📜",
            color: "#8b5cf6",
            completed: true,
            status: "completed",
          },
          {
            id: "sub-node-2",
            title: "Event-Driven Queues (Kafka / RabbitMQ)",
            type: "sequential",
            icon: "⚡",
            color: "#ec4899",
            tasks: [
              {
                id: "sub-t1",
                title: "Step 1: Producer / Consumer Patterns",
                completed: true,
              },
              {
                id: "sub-t2",
                title: "Step 2: Dead Letter Queues & Retries",
                completed: false,
              },
            ],
            status: "active",
          },
        ],
      },
    },
    {
      id: "node-4",
      title: "SQL & Distributed Database Tuning",
      type: "sequential",
      icon: "🗄️",
      color: "#f59e0b",
      tasks: [
        { id: "t4-1", title: "Step 1: Indexing & B-Trees", completed: true },
        {
          id: "t4-2",
          title: "Step 2: ACID Transactions & Locks",
          completed: false,
        },
        {
          id: "t4-3",
          title: "Step 3: Sharding & Read Replicas",
          completed: false,
        },
      ],
      status: "pending",
    },
    {
      id: "node-5",
      title: "Observability & Tracing",
      type: "single",
      icon: "📊",
      color: "#ec4899",
      description:
        "Prometheus, Grafana, OpenTelemetry, and structured logging in production.",
      completed: false,
      status: "pending",
    },
  ],
};

export const DEFAULT_COLORS = [
  "#6366f1", // Indigo
  "#38bdf8", // Sky
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#ec4899", // Pink
  "#8b5cf6", // Purple
  "#f43f5e", // Rose
  "#14b8a6", // Teal
];

export const PRESET_ICONS = [
  "🚀",
  "🌱",
  "⚡",
  "🧩",
  "🏛️",
  "🗄️",
  "🛡️",
  "📱",
  "🎯",
  "🧠",
  "🔥",
  "📚",
];
