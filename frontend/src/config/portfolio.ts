// Portfolio Configuration
// Centralized personal data and content

export const personalInfo = {
  name: "Maria Isabel Guerrero",
  firstName: "Maria",
  title: "Full-Stack Developer",
  email: "mariaigs2005@gmail.com",
  tagline: "I build systems that scale",
  description: "I'm a Full-Stack developer specializing in building microservices and modern web applications.",
  bio: `Hi, I'm Maria, a Full-Stack Developer and Computer Science student at Champlain College.
I specialize in building scalable backend systems and modern web applications using Java,
Spring Boot, and React. I enjoy solving complex problems with clean, efficient code and have
a strong passion for learning new technologies and helping others grow. Beyond coding, I work
as a Programming Tutor and coach gymnastics. Let's build something amazing together!`,
};

export const socialLinks = {
  github: "https://github.com",
  linkedin: "",
  twitter: "",
  resume: "/resume.pdf",
};

export const experiences = [
  {
    title: "Gymnastics Coach",
    company: "Club Gym Richelieu",
    period: "2022.03 - Present",
    responsibilities: [
      "Coach artistic gymnastics for children ages 7+ in recreational and advanced programs",
      "Develop age-appropriate training programs focusing on technique, safety, and skill progression",
      "Demonstrate strong communication skills while instructing in both French and English",
      "Maintain detailed progress evaluations and ensure safe, engaging learning environments",
    ],
  },
  {
    title: "Programming Tutor",
    company: "Champlain College",
    period: "2025.09 - 2025.11",
    responsibilities: [
      "Provide personalized Java programming instruction to first-year CEGEP students through tutoring sessions",
      "Develop customized learning approaches to accommodate diverse learning styles and skill levels",
      "Assist students with debugging techniques, algorithm development, and best coding practices",
    ],
  },
];

export const education = [
  {
    degree: "DEC in Computer Science",
    school: "Champlain College",
    period: "2023.08 - Present",
  },
];

export const testimonials = [
  {
    name: "John Doe",
    role: "Project Manager",
    company: "Tech Company",
    text: "Maria is an exceptional developer who consistently delivers high-quality work. Her attention to detail and problem-solving skills are outstanding.",
  },
  {
    name: "Jane Smith",
    role: "Team Lead",
    company: "Software Inc",
    text: "Working with Maria was a pleasure. She is highly skilled, communicative, and always goes above and beyond to meet project requirements.",
  },
  {
    name: "Alex Johnson",
    role: "Senior Developer",
    company: "Dev Studio",
    text: "Maria's technical abilities and dedication to learning make her a valuable team member. I highly recommend her for any development project.",
  },
];

export const featuredProjects = [
  {
    title: "Passion Sports Jerseys",
    description:
      "E-commerce platform for sports jerseys built with Spring Boot microservices. Led backend development featuring secure payments, inventory management, and responsive storefront.",
    technologies: ["Spring Boot", "Microservices", "Java", "PostgreSQL"],
    github: "#",
    live: "#",
    image: "/images/robot-developer.jpg",
    featured: true,
  },
  {
    title: "Pet Clinic Microservices",
    description:
      "Veterinary clinic management system built collaboratively using Spring Boot and React. Implemented services for appointments, billing, inventory, and customer management.",
    technologies: ["Spring Boot", "React", "Microservices", "MySQL"],
    github: "#",
    live: "#",
    image: "/images/robot-developer.jpg",
    featured: true,
  },
];

export const otherProjects = [
  {
    title: "Task Manager App",
    description: "Full-stack task management application with user authentication and real-time updates.",
    technologies: ["Next.js", "TypeScript", "Prisma"],
  },
  {
    title: "Weather Dashboard",
    description: "Interactive weather dashboard with location-based forecasts and data visualization.",
    technologies: ["React", "Chart.js", "API Integration"],
  },
  {
    title: "Chat Application",
    description: "Real-time messaging application with WebSocket support and user presence indicators.",
    technologies: ["Node.js", "Socket.io", "MongoDB"],
  },
];

export const hobbies = ["Gymnastics", "Music", "Yoga", "Traveling"];

export const skills = {
  soft: [
    { icon: "Users", label: "Teaching/Mentoring" },
    { icon: "MessageCircle", label: "Communication" },
    { icon: "GitBranch", label: "Collaboration" },
    { icon: "Wrench", label: "Problem-solving" },
    { icon: "RefreshCw", label: "Adaptability" },
    { icon: "Clock", label: "Patience" },
  ],
  languages: [
    { name: "Java", icon: "Coffee" },
    { name: "JavaScript/TypeScript", icon: "FileCode" },
    { name: "Python", icon: "Code" },
    { name: "SQL", icon: "Database" },
    { name: "HTML/CSS", icon: "Globe" },
    { name: "C#", icon: "Hash" },
  ],
  frontend: [
    { name: "React", icon: "Layers" },
    { name: "Next.js", icon: "Server" },
    { name: "Tailwind CSS", icon: "Code" },
  ],
  databases: [
    { name: "PostgreSQL", icon: "Database" },
    { name: "MySQL", icon: "Database" },
    { name: "SQL Server", icon: "Database" },
  ],
  tools: [
    { icon: "Box", label: "Docker" },
    { icon: "Github", label: "Git/GitHub" },
    { icon: "Network", label: "REST APIs" },
    { icon: "Cpu", label: "Microservices" },
    { icon: "Shield", label: "Better Auth" },
  ],
  technical: [
    { icon: "Settings", label: "OOP" },
    { icon: "Layers", label: "MVC Architecture" },
    { icon: "CheckSquare", label: "Agile/Scrum" },
    { icon: "GitPullRequest", label: "Code Reviews" },
  ],
};

// Animation config for LiquidEther
export const liquidEtherConfig = {
  colors: ["#5227FF", "#FF9FFC", "#B19EEF"],
  welcome: {
    mouseForce: 20,
    cursorSize: 100,
    viscous: 30,
    iterationsViscous: 32,
    iterationsPoisson: 32,
    resolution: 0.5,
    autoSpeed: 0.5,
    autoIntensity: 2.2,
  },
  contact: {
    mouseForce: 15,
    cursorSize: 80,
    viscous: 25,
    iterationsViscous: 32,
    iterationsPoisson: 32,
    resolution: 0.4,
    autoSpeed: 0.3,
    autoIntensity: 1.5,
  },
};
