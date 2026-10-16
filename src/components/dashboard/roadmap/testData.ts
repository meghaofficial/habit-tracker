export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  totalProblems: number;
  completedProblems: number;
  color: string;
  badge?: string;
};

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
