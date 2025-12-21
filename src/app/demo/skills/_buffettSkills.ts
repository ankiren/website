// Warren Buffett's skills at different ages

export interface LifeAspect {
  name: string;
  value: number; // 0-100
  icon: string;
}

export interface BuffettLifeAspects {
  aspects: LifeAspect[];
  summary: string;
}

export interface UserCustomSkill {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: number;
  currentScore: number;
  targetScore: number;
  lastPracticed: string;
  totalPractices: number;
  createdAt: string;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  icon: string;
  instructor: string;
  progress: number; // 0-100
  status: "completed" | "in_progress" | "planned";
}

export interface Role {
  id: number;
  title: string;
  organization: string;
  icon: string;
  period: string;
  description: string;
  current: boolean;
}

export interface Project {
  id: number;
  name: string;
  description: string;
  icon: string;
  status: "completed" | "in_progress" | "planned";
  year: string;
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  icon: string;
  year: string;
  description: string;
}

export interface PersonProfile {
  skills: UserCustomSkill[];
  lifeAspects: BuffettLifeAspects;
  courses: Course[];
  roles: Role[];
  projects: Project[];
  certificates: Certificate[];
}

// Buffett at age 10 (1940) - Early interests
export const buffettAge10: UserCustomSkill[] = [
  { id: 1, name: "Mental Math", description: "Quick calculations and number games", icon: "Calculator", color: 0, currentScore: 75, targetScore: 100, lastPracticed: "1940-08-30", totalPractices: 500, createdAt: "1938-01-01" },
  { id: 2, name: "Coin Collecting", description: "First investment hobby - collecting rare coins", icon: "Coins", color: 8, currentScore: 60, targetScore: 100, lastPracticed: "1940-08-28", totalPractices: 200, createdAt: "1939-01-01" },
  { id: 3, name: "Reading", description: "Reading everything in the library", icon: "BookOpen", color: 5, currentScore: 80, targetScore: 100, lastPracticed: "1940-08-30", totalPractices: 1000, createdAt: "1936-01-01" },
  { id: 4, name: "Door-to-Door Sales", description: "Selling gum, Coca-Cola, and magazines", icon: "Store", color: 2, currentScore: 55, targetScore: 100, lastPracticed: "1940-08-25", totalPractices: 150, createdAt: "1939-06-01" },
  { id: 5, name: "Stock Watching", description: "Marking stock prices on the chalkboard at dad's office", icon: "TrendingUp", color: 1, currentScore: 40, targetScore: 100, lastPracticed: "1940-08-29", totalPractices: 100, createdAt: "1940-01-01" },
];

// Buffett at age 30 (1960) - Building expertise
export const buffettAge30: UserCustomSkill[] = [
  { id: 1, name: "Value Investing", description: "Benjamin Graham's principles - buy below intrinsic value", icon: "TrendingUp", color: 2, currentScore: 85, targetScore: 100, lastPracticed: "1960-08-30", totalPractices: 5000, createdAt: "1950-01-01" },
  { id: 2, name: "Financial Statement Analysis", description: "Deep analysis of balance sheets and income statements", icon: "FileText", color: 1, currentScore: 88, targetScore: 100, lastPracticed: "1960-08-30", totalPractices: 4500, createdAt: "1951-01-01" },
  { id: 3, name: "Reading & Research", description: "500 pages daily - annual reports, newspapers, books", icon: "BookOpen", color: 5, currentScore: 92, targetScore: 100, lastPracticed: "1960-08-30", totalPractices: 8000, createdAt: "1945-01-01" },
  { id: 4, name: "Partnership Management", description: "Running Buffett Partnership Ltd.", icon: "Users", color: 0, currentScore: 78, targetScore: 100, lastPracticed: "1960-08-28", totalPractices: 2000, createdAt: "1956-01-01" },
  { id: 5, name: "Business Analysis", description: "Understanding competitive advantages and moats", icon: "Building", color: 3, currentScore: 75, targetScore: 100, lastPracticed: "1960-08-27", totalPractices: 1800, createdAt: "1955-01-01" },
  { id: 6, name: "Investor Relations", description: "Writing letters to partners explaining strategy", icon: "Mail", color: 4, currentScore: 72, targetScore: 100, lastPracticed: "1960-08-20", totalPractices: 1200, createdAt: "1957-01-01" },
  { id: 7, name: "Risk Assessment", description: "Calculating margin of safety for investments", icon: "Shield", color: 7, currentScore: 80, targetScore: 100, lastPracticed: "1960-08-29", totalPractices: 3000, createdAt: "1952-01-01" },
  { id: 8, name: "Patience", description: "Waiting for the right opportunity to invest", icon: "Clock", color: 9, currentScore: 70, targetScore: 100, lastPracticed: "1960-08-30", totalPractices: 2500, createdAt: "1954-01-01" },
];

// Buffett at age 70 (2000) - Legendary investor
export const buffettAge70: UserCustomSkill[] = [
  { id: 1, name: "Value Investing", description: "Legendary status - decades of compounding wisdom", icon: "TrendingUp", color: 2, currentScore: 99, targetScore: 100, lastPracticed: "2000-08-30", totalPractices: 35000, createdAt: "1950-01-01" },
  { id: 2, name: "Capital Allocation", description: "Deploying tens of billions with precision", icon: "Briefcase", color: 3, currentScore: 98, targetScore: 100, lastPracticed: "2000-08-30", totalPractices: 25000, createdAt: "1965-01-01" },
  { id: 3, name: "Business Judgment", description: "Instant recognition of business quality", icon: "Scale", color: 1, currentScore: 99, targetScore: 100, lastPracticed: "2000-08-30", totalPractices: 30000, createdAt: "1956-01-01" },
  { id: 4, name: "Reading & Research", description: "50+ years of compound knowledge", icon: "BookOpen", color: 5, currentScore: 99, targetScore: 100, lastPracticed: "2000-08-30", totalPractices: 50000, createdAt: "1945-01-01" },
  { id: 5, name: "CEO Selection", description: "Building a constellation of exceptional managers", icon: "UserCheck", color: 4, currentScore: 96, targetScore: 100, lastPracticed: "2000-08-25", totalPractices: 12000, createdAt: "1970-01-01" },
  { id: 6, name: "Shareholder Communication", description: "Annual letters as financial literature", icon: "Mail", color: 6, currentScore: 98, targetScore: 100, lastPracticed: "2000-03-01", totalPractices: 15000, createdAt: "1965-01-01" },
  { id: 7, name: "Insurance Float Management", description: "Mastery of insurance as investment vehicle", icon: "Umbrella", color: 0, currentScore: 97, targetScore: 100, lastPracticed: "2000-08-28", totalPractices: 18000, createdAt: "1967-01-01" },
  { id: 8, name: "Risk Assessment", description: "Avoiding catastrophic risks while taking calculated ones", icon: "Shield", color: 7, currentScore: 98, targetScore: 100, lastPracticed: "2000-08-30", totalPractices: 25000, createdAt: "1952-01-01" },
  { id: 9, name: "Long-term Thinking", description: "Multi-decade investment horizon", icon: "Infinity", color: 9, currentScore: 99, targetScore: 100, lastPracticed: "2000-08-30", totalPractices: 35000, createdAt: "1960-01-01" },
  { id: 10, name: "Circle of Competence", description: "Legendary discipline staying within expertise", icon: "Circle", color: 8, currentScore: 98, targetScore: 100, lastPracticed: "2000-08-27", totalPractices: 20000, createdAt: "1962-01-01" },
  { id: 11, name: "Patience", description: "Waiting years for the right opportunity", icon: "Clock", color: 1, currentScore: 99, targetScore: 100, lastPracticed: "2000-08-30", totalPractices: 30000, createdAt: "1954-01-01" },
  { id: 12, name: "Public Speaking", description: "Annual meetings as legendary events", icon: "Mic", color: 4, currentScore: 92, targetScore: 100, lastPracticed: "2000-05-01", totalPractices: 8000, createdAt: "1965-01-01" },
  { id: 13, name: "Mentorship", description: "Teaching the next generation of investors", icon: "GraduationCap", color: 5, currentScore: 90, targetScore: 100, lastPracticed: "2000-08-20", totalPractices: 6000, createdAt: "1980-01-01" },
  { id: 14, name: "Temperament Control", description: "Emotional stability through market cycles", icon: "Heart", color: 3, currentScore: 99, targetScore: 100, lastPracticed: "2000-08-30", totalPractices: 40000, createdAt: "1956-01-01" },
];

// Buffett at age 50 (1980) - Peak mastery
export const buffettAge50: UserCustomSkill[] = [
  { id: 1, name: "Value Investing", description: "Master level - wonderful companies at fair prices", icon: "TrendingUp", color: 2, currentScore: 96, targetScore: 100, lastPracticed: "1980-08-30", totalPractices: 15000, createdAt: "1950-01-01" },
  { id: 2, name: "Financial Statement Analysis", description: "Instant recognition of business quality from numbers", icon: "FileText", color: 1, currentScore: 95, targetScore: 100, lastPracticed: "1980-08-30", totalPractices: 12000, createdAt: "1951-01-01" },
  { id: 3, name: "Reading & Research", description: "Decades of compound knowledge", icon: "BookOpen", color: 5, currentScore: 98, targetScore: 100, lastPracticed: "1980-08-30", totalPractices: 20000, createdAt: "1945-01-01" },
  { id: 4, name: "Capital Allocation", description: "Deploying billions for maximum returns", icon: "Briefcase", color: 3, currentScore: 94, targetScore: 100, lastPracticed: "1980-08-28", totalPractices: 8000, createdAt: "1965-01-01" },
  { id: 5, name: "Business Valuation", description: "Intrinsic value calculation mastery", icon: "Calculator", color: 0, currentScore: 95, targetScore: 100, lastPracticed: "1980-08-29", totalPractices: 10000, createdAt: "1956-01-01" },
  { id: 6, name: "Insurance Operations", description: "Float management and underwriting discipline", icon: "Umbrella", color: 6, currentScore: 90, targetScore: 100, lastPracticed: "1980-08-25", totalPractices: 5000, createdAt: "1967-01-01" },
  { id: 7, name: "CEO Selection", description: "Identifying and retaining exceptional managers", icon: "UserCheck", color: 4, currentScore: 88, targetScore: 100, lastPracticed: "1980-08-20", totalPractices: 3000, createdAt: "1970-01-01" },
  { id: 8, name: "Shareholder Communication", description: "Annual letter writing and meeting presentations", icon: "Mic", color: 4, currentScore: 92, targetScore: 100, lastPracticed: "1980-08-15", totalPractices: 4500, createdAt: "1965-01-01" },
  { id: 9, name: "Acquisition Strategy", description: "Identifying and acquiring quality businesses", icon: "Handshake", color: 8, currentScore: 91, targetScore: 100, lastPracticed: "1980-08-22", totalPractices: 4000, createdAt: "1967-01-01" },
  { id: 10, name: "Risk Management", description: "Never lose money - margin of safety mastery", icon: "Shield", color: 7, currentScore: 94, targetScore: 100, lastPracticed: "1980-08-28", totalPractices: 9000, createdAt: "1952-01-01" },
  { id: 11, name: "Long-term Thinking", description: "Favorite holding period is forever", icon: "Infinity", color: 9, currentScore: 96, targetScore: 100, lastPracticed: "1980-08-30", totalPractices: 11000, createdAt: "1960-01-01" },
  { id: 12, name: "Circle of Competence", description: "Knowing what you know and staying within it", icon: "Circle", color: 0, currentScore: 93, targetScore: 100, lastPracticed: "1980-08-27", totalPractices: 7500, createdAt: "1962-01-01" },
];

// Life aspects at different ages - 5 core areas
export const lifeAspectsAge10: BuffettLifeAspects = {
  summary: "A curious child discovering the world of money",
  aspects: [
    { name: "Knowledge", value: 65, icon: "BookOpen" },
    { name: "Business", value: 40, icon: "Briefcase" },
    { name: "Social", value: 55, icon: "Users" },
    { name: "Discipline", value: 70, icon: "Target" },
    { name: "Wealth", value: 25, icon: "Coins" },
  ]
};

export const lifeAspectsAge30: BuffettLifeAspects = {
  summary: "Building the foundation of an investment empire",
  aspects: [
    { name: "Knowledge", value: 85, icon: "BookOpen" },
    { name: "Business", value: 78, icon: "Briefcase" },
    { name: "Social", value: 70, icon: "Users" },
    { name: "Discipline", value: 88, icon: "Target" },
    { name: "Wealth", value: 65, icon: "Coins" },
  ]
};

export const lifeAspectsAge50: BuffettLifeAspects = {
  summary: "The Oracle of Omaha at peak mastery",
  aspects: [
    { name: "Knowledge", value: 98, icon: "BookOpen" },
    { name: "Business", value: 96, icon: "Briefcase" },
    { name: "Social", value: 85, icon: "Users" },
    { name: "Discipline", value: 95, icon: "Target" },
    { name: "Wealth", value: 92, icon: "Coins" },
  ]
};

export const lifeAspectsAge70: BuffettLifeAspects = {
  summary: "Living legend with unparalleled wisdom and wealth",
  aspects: [
    { name: "Knowledge", value: 99, icon: "BookOpen" },
    { name: "Business", value: 99, icon: "Briefcase" },
    { name: "Social", value: 92, icon: "Users" },
    { name: "Discipline", value: 98, icon: "Target" },
    { name: "Wealth", value: 99, icon: "Coins" },
  ]
};

// Buffett Courses
export const buffettCourses10: Course[] = [
  { id: 1, name: "Elementary School", description: "Rose Hill Elementary School in Omaha", icon: "GraduationCap", instructor: "Public School", progress: 80, status: "in_progress" },
  { id: 2, name: "Library Reading", description: "Reading every finance book in the Omaha library", icon: "BookOpen", instructor: "Self-study", progress: 100, status: "completed" },
  { id: 3, name: "Math & Numbers", description: "Developing mental calculation skills", icon: "Calculator", instructor: "School", progress: 90, status: "completed" },
];

export const buffettCourses30: Course[] = [
  { id: 1, name: "Columbia Business School", description: "MBA under Benjamin Graham", icon: "GraduationCap", instructor: "Benjamin Graham", progress: 100, status: "completed" },
  { id: 2, name: "Security Analysis", description: "Deep study of Graham-Dodd principles", icon: "FileText", instructor: "Benjamin Graham", progress: 100, status: "completed" },
  { id: 3, name: "Dale Carnegie Course", description: "Public speaking and influence", icon: "Mic", instructor: "Dale Carnegie Institute", progress: 100, status: "completed" },
  { id: 4, name: "Annual Reports Analysis", description: "Reading hundreds of 10-Ks annually", icon: "BookOpen", instructor: "Self-study", progress: 95, status: "in_progress" },
];

export const buffettCourses50: Course[] = [
  { id: 1, name: "Business Evaluation", description: "Evaluating management quality and moats", icon: "Building", instructor: "Experience", progress: 100, status: "completed" },
  { id: 2, name: "Insurance Operations", description: "Understanding float and underwriting", icon: "Shield", instructor: "Industry Practice", progress: 100, status: "completed" },
  { id: 3, name: "Capital Allocation", description: "Optimal deployment of capital", icon: "Briefcase", instructor: "Self-developed", progress: 98, status: "completed" },
  { id: 4, name: "Continuous Reading", description: "500+ pages daily habit", icon: "BookOpen", instructor: "Self-discipline", progress: 100, status: "completed" },
];

export const buffettCourses70: Course[] = [
  { id: 1, name: "Global Macro Economics", description: "Understanding worldwide economic trends", icon: "Globe", instructor: "Experience", progress: 100, status: "completed" },
  { id: 2, name: "Technology Assessment", description: "Learning to evaluate tech companies", icon: "Cpu", instructor: "Bill Gates", progress: 60, status: "in_progress" },
  { id: 3, name: "Philanthropy Strategy", description: "Effective giving and foundation management", icon: "Heart", instructor: "Bill & Melinda Gates Foundation", progress: 75, status: "in_progress" },
  { id: 4, name: "Succession Planning", description: "Preparing Berkshire for the future", icon: "Users", instructor: "Self-developed", progress: 50, status: "in_progress" },
  { id: 5, name: "Continuous Reading", description: "50+ years of daily reading habit", icon: "BookOpen", instructor: "Self-discipline", progress: 100, status: "completed" },
];

// Buffett Roles
export const buffettRoles10: Role[] = [
  { id: 1, title: "Student", organization: "Rose Hill Elementary", icon: "GraduationCap", period: "1936-1942", description: "Elementary education in Omaha", current: true },
  { id: 2, title: "Newspaper Delivery Boy", organization: "Washington Post", icon: "Newspaper", period: "1940", description: "Early morning paper route", current: true },
  { id: 3, title: "Door-to-Door Salesman", organization: "Self-employed", icon: "Store", period: "1939-1940", description: "Selling gum, Coca-Cola, magazines", current: true },
];

export const buffettRoles30: Role[] = [
  { id: 1, title: "Managing Partner", organization: "Buffett Partnership Ltd.", icon: "Crown", period: "1956-present", description: "Running investment partnerships", current: true },
  { id: 2, title: "Investor", organization: "Multiple Companies", icon: "TrendingUp", period: "1956-present", description: "Value investing in public equities", current: true },
  { id: 3, title: "Board Member", organization: "Various Companies", icon: "Users", period: "1958-present", description: "Corporate governance roles", current: true },
];

export const buffettRoles50: Role[] = [
  { id: 1, title: "Chairman & CEO", organization: "Berkshire Hathaway", icon: "Crown", period: "1970-present", description: "Leading the holding company", current: true },
  { id: 2, title: "Capital Allocator", organization: "Berkshire Hathaway", icon: "Briefcase", period: "1970-present", description: "Deploying billions in investments", current: true },
  { id: 3, title: "Board Member", organization: "Washington Post Co.", icon: "Newspaper", period: "1974-present", description: "Media company governance", current: true },
  { id: 4, title: "Shareholder Communicator", organization: "Berkshire Hathaway", icon: "Mail", period: "1977-present", description: "Writing annual letters", current: true },
];

export const buffettRoles70: Role[] = [
  { id: 1, title: "Chairman & CEO", organization: "Berkshire Hathaway", icon: "Crown", period: "1970-present", description: "Leading a $100B+ conglomerate", current: true },
  { id: 2, title: "World's Second Richest Person", organization: "Forbes 400", icon: "Trophy", period: "1993-present", description: "Net worth exceeding $30 billion", current: true },
  { id: 3, title: "Board Member", organization: "Coca-Cola Company", icon: "Wine", period: "1989-present", description: "Major shareholder and advisor", current: true },
  { id: 4, title: "Investment Sage", organization: "Global Finance", icon: "Lightbulb", period: "1980-present", description: "Sought-after voice on markets", current: true },
  { id: 5, title: "Philanthropist", organization: "Buffett Foundation", icon: "Heart", period: "1964-present", description: "Preparing major charitable giving", current: true },
];

// Buffett Projects
export const buffettProjects10: Project[] = [
  { id: 1, name: "Coin Collection", description: "Building rare coin portfolio", icon: "Coins", status: "in_progress", year: "1938" },
  { id: 2, name: "Paper Route", description: "500 customers newspaper delivery", icon: "Newspaper", status: "in_progress", year: "1940" },
  { id: 3, name: "Stock Chart Watching", description: "Recording prices at father's office", icon: "TrendingUp", status: "completed", year: "1940" },
];

export const buffettProjects30: Project[] = [
  { id: 1, name: "Buffett Partnership Ltd.", description: "First investment partnership", icon: "Building", status: "completed", year: "1956" },
  { id: 2, name: "Sanborn Map Investment", description: "Activist investment success", icon: "Map", status: "completed", year: "1958" },
  { id: 3, name: "Dempster Mill", description: "First control investment", icon: "Factory", status: "completed", year: "1961" },
  { id: 4, name: "American Express Investment", description: "Salad oil scandal opportunity", icon: "CreditCard", status: "in_progress", year: "1964" },
];

export const buffettProjects50: Project[] = [
  { id: 1, name: "Berkshire Textile to Holding", description: "Transforming the company", icon: "Building", status: "completed", year: "1970" },
  { id: 2, name: "GEICO Investment", description: "Major insurance acquisition", icon: "Car", status: "completed", year: "1976" },
  { id: 3, name: "See's Candies", description: "Quality business acquisition", icon: "Gift", status: "completed", year: "1972" },
  { id: 4, name: "Nebraska Furniture Mart", description: "Mrs. B partnership", icon: "Home", status: "completed", year: "1983" },
  { id: 5, name: "Washington Post Investment", description: "Media company stake", icon: "Newspaper", status: "completed", year: "1973" },
];

export const buffettProjects70: Project[] = [
  { id: 1, name: "Coca-Cola Investment", description: "$1.3B stake in the iconic brand", icon: "Wine", status: "completed", year: "1988" },
  { id: 2, name: "General Re Acquisition", description: "$22B reinsurance giant purchase", icon: "Shield", status: "completed", year: "1998" },
  { id: 3, name: "NetJets Expansion", description: "Private aviation dominance", icon: "Plane", status: "completed", year: "1998" },
  { id: 4, name: "MidAmerican Energy", description: "Entry into utilities sector", icon: "Zap", status: "completed", year: "1999" },
  { id: 5, name: "Dairy Queen Acquisition", description: "Fast food chain addition", icon: "IceCream", status: "completed", year: "1997" },
  { id: 6, name: "Annual Meeting Growth", description: "Building the 'Woodstock for Capitalists'", icon: "Users", status: "in_progress", year: "1990s" },
  { id: 7, name: "Silver Investment", description: "129M ounce silver position", icon: "Coins", status: "completed", year: "1997" },
];

// Buffett Certificates
export const buffettCertificates10: Certificate[] = [
  { id: 1, name: "Elementary School Progress", issuer: "Rose Hill Elementary", icon: "Award", year: "1940", description: "Academic achievement recognition" },
];

export const buffettCertificates30: Certificate[] = [
  { id: 1, name: "Bachelor of Science", issuer: "University of Nebraska", icon: "GraduationCap", year: "1950", description: "Business Administration degree" },
  { id: 2, name: "Master of Science in Economics", issuer: "Columbia Business School", icon: "GraduationCap", year: "1951", description: "Studied under Benjamin Graham" },
  { id: 3, name: "Partnership Agreement", issuer: "State of Nebraska", icon: "FileText", year: "1956", description: "Buffett Partnership formation" },
];

export const buffettCertificates50: Certificate[] = [
  { id: 1, name: "Bachelor of Science", issuer: "University of Nebraska", icon: "GraduationCap", year: "1950", description: "Business Administration degree" },
  { id: 2, name: "Master of Science in Economics", issuer: "Columbia Business School", icon: "GraduationCap", year: "1951", description: "Studied under Benjamin Graham" },
  { id: 3, name: "Berkshire Chairman", issuer: "Berkshire Hathaway", icon: "Crown", year: "1970", description: "Chairman of the Board" },
  { id: 4, name: "Forbes 400 Richest", issuer: "Forbes Magazine", icon: "Trophy", year: "1982", description: "First appearance on the list" },
];

export const buffettCertificates70: Certificate[] = [
  { id: 1, name: "World's Second Richest", issuer: "Forbes Magazine", icon: "Trophy", year: "2000", description: "Net worth over $30 billion" },
  { id: 2, name: "Honorary Doctorate", issuer: "University of Nebraska", icon: "GraduationCap", year: "1994", description: "Doctor of Commercial Science" },
  { id: 3, name: "Presidential Medal of Freedom", issuer: "White House", icon: "Award", year: "coming", description: "Highest civilian honor (pending)" },
  { id: 4, name: "Time 100 Most Influential", issuer: "Time Magazine", icon: "Newspaper", year: "1999", description: "Global influence recognition" },
  { id: 5, name: "Master Investor Title", issuer: "Financial Press", icon: "Crown", year: "1990s", description: "The Oracle of Omaha" },
  { id: 6, name: "Investment Legend Status", issuer: "Global Finance Community", icon: "Star", year: "2000", description: "Recognized as greatest investor ever" },
];

export const getBuffettCourses = (age: 10 | 30 | 50 | 70): Course[] => {
  switch (age) {
    case 10: return buffettCourses10;
    case 30: return buffettCourses30;
    case 50: return buffettCourses50;
    case 70: return buffettCourses70;
    default: return buffettCourses70;
  }
};

export const getBuffettRoles = (age: 10 | 30 | 50 | 70): Role[] => {
  switch (age) {
    case 10: return buffettRoles10;
    case 30: return buffettRoles30;
    case 50: return buffettRoles50;
    case 70: return buffettRoles70;
    default: return buffettRoles70;
  }
};

export const getBuffettProjects = (age: 10 | 30 | 50 | 70): Project[] => {
  switch (age) {
    case 10: return buffettProjects10;
    case 30: return buffettProjects30;
    case 50: return buffettProjects50;
    case 70: return buffettProjects70;
    default: return buffettProjects70;
  }
};

export const getBuffettCertificates = (age: 10 | 30 | 50 | 70): Certificate[] => {
  switch (age) {
    case 10: return buffettCertificates10;
    case 30: return buffettCertificates30;
    case 50: return buffettCertificates50;
    case 70: return buffettCertificates70;
    default: return buffettCertificates70;
  }
};

// Get skills by age
export const getBuffettSkills = (age: 10 | 30 | 50 | 70): UserCustomSkill[] => {
  switch (age) {
    case 10: return buffettAge10;
    case 30: return buffettAge30;
    case 50: return buffettAge50;
    case 70: return buffettAge70;
    default: return buffettAge70;
  }
};

// Get life aspects by age
export const getBuffettLifeAspects = (age: 10 | 30 | 50 | 70): BuffettLifeAspects => {
  switch (age) {
    case 10: return lifeAspectsAge10;
    case 30: return lifeAspectsAge30;
    case 50: return lifeAspectsAge50;
    case 70: return lifeAspectsAge70;
    default: return lifeAspectsAge70;
  }
};

// =============================================================================
// STEVE JOBS
// =============================================================================

export const stevejobsAge10: UserCustomSkill[] = [
  { id: 1, name: "Electronics Tinkering", description: "Building HeathKits and exploring electronics with dad", icon: "Cpu", color: 1, currentScore: 55, targetScore: 100, lastPracticed: "1965-02-24", totalPractices: 200, createdAt: "1963-01-01" },
  { id: 2, name: "Curiosity", description: "Endless questions about how things work", icon: "HelpCircle", color: 0, currentScore: 85, targetScore: 100, lastPracticed: "1965-02-24", totalPractices: 500, createdAt: "1960-01-01" },
  { id: 3, name: "Reading", description: "Devouring books on science and technology", icon: "BookOpen", color: 5, currentScore: 70, targetScore: 100, lastPracticed: "1965-02-20", totalPractices: 400, createdAt: "1962-01-01" },
  { id: 4, name: "Swimming", description: "Athletic activities and outdoor exploration", icon: "Waves", color: 6, currentScore: 60, targetScore: 100, lastPracticed: "1965-02-22", totalPractices: 150, createdAt: "1963-01-01" },
];

export const stevejobsAge20: UserCustomSkill[] = [
  { id: 1, name: "Electronics Engineering", description: "Building blue boxes and circuit boards", icon: "Cpu", color: 1, currentScore: 75, targetScore: 100, lastPracticed: "1975-02-24", totalPractices: 1500, createdAt: "1970-01-01" },
  { id: 2, name: "Calligraphy & Design", description: "Typography and visual aesthetics from Reed College", icon: "PenTool", color: 4, currentScore: 70, targetScore: 100, lastPracticed: "1975-02-20", totalPractices: 800, createdAt: "1972-01-01" },
  { id: 3, name: "Salesmanship", description: "Selling blue boxes and convincing investors", icon: "Megaphone", color: 2, currentScore: 72, targetScore: 100, lastPracticed: "1975-02-24", totalPractices: 600, createdAt: "1973-01-01" },
  { id: 4, name: "Zen Philosophy", description: "Meditation and spiritual exploration in India", icon: "Leaf", color: 9, currentScore: 65, targetScore: 100, lastPracticed: "1975-02-15", totalPractices: 400, createdAt: "1974-01-01" },
  { id: 5, name: "Partnership Building", description: "Working with Wozniak on Apple", icon: "Users", color: 0, currentScore: 68, targetScore: 100, lastPracticed: "1975-02-24", totalPractices: 500, createdAt: "1971-01-01" },
  { id: 6, name: "Vision Crafting", description: "Imagining personal computers for everyone", icon: "Eye", color: 3, currentScore: 78, targetScore: 100, lastPracticed: "1975-02-24", totalPractices: 700, createdAt: "1974-01-01" },
];

export const stevejobsAge30: UserCustomSkill[] = [
  { id: 1, name: "Product Design", description: "Creating beautiful, intuitive products", icon: "Palette", color: 4, currentScore: 88, targetScore: 100, lastPracticed: "1985-02-24", totalPractices: 4000, createdAt: "1976-01-01" },
  { id: 2, name: "Leadership", description: "Inspiring teams to achieve the impossible", icon: "Crown", color: 8, currentScore: 75, targetScore: 100, lastPracticed: "1985-02-24", totalPractices: 3000, createdAt: "1977-01-01" },
  { id: 3, name: "Marketing & Storytelling", description: "Reality distortion field and product launches", icon: "Megaphone", color: 2, currentScore: 90, targetScore: 100, lastPracticed: "1985-02-20", totalPractices: 3500, createdAt: "1977-01-01" },
  { id: 4, name: "User Experience", description: "Obsessing over every detail of the user journey", icon: "MousePointer", color: 1, currentScore: 85, targetScore: 100, lastPracticed: "1985-02-24", totalPractices: 3200, createdAt: "1978-01-01" },
  { id: 5, name: "Negotiation", description: "Deals with suppliers and partners", icon: "Handshake", color: 3, currentScore: 78, targetScore: 100, lastPracticed: "1985-02-18", totalPractices: 2000, createdAt: "1980-01-01" },
  { id: 6, name: "Typography", description: "Fonts and visual design excellence", icon: "Type", color: 0, currentScore: 82, targetScore: 100, lastPracticed: "1985-02-22", totalPractices: 2500, createdAt: "1972-01-01" },
  { id: 7, name: "Resilience", description: "Bouncing back from setbacks", icon: "Shield", color: 7, currentScore: 70, targetScore: 100, lastPracticed: "1985-02-24", totalPractices: 1500, createdAt: "1983-01-01" },
  { id: 8, name: "Perfectionism", description: "Never settling for good enough", icon: "Star", color: 5, currentScore: 95, targetScore: 100, lastPracticed: "1985-02-24", totalPractices: 5000, createdAt: "1976-01-01" },
];

export const stevejobsLifeAspects10: BuffettLifeAspects = {
  summary: "A curious child in Silicon Valley discovering electronics",
  aspects: [
    { name: "Knowledge", value: 60, icon: "BookOpen" },
    { name: "Creativity", value: 70, icon: "Lightbulb" },
    { name: "Social", value: 45, icon: "Users" },
    { name: "Discipline", value: 50, icon: "Target" },
    { name: "Ambition", value: 65, icon: "Rocket" },
  ]
};

export const stevejobsLifeAspects20: BuffettLifeAspects = {
  summary: "A seeker exploring technology, spirituality, and design",
  aspects: [
    { name: "Knowledge", value: 75, icon: "BookOpen" },
    { name: "Creativity", value: 82, icon: "Lightbulb" },
    { name: "Social", value: 60, icon: "Users" },
    { name: "Discipline", value: 55, icon: "Target" },
    { name: "Ambition", value: 85, icon: "Rocket" },
  ]
};

export const stevejobsLifeAspects30: BuffettLifeAspects = {
  summary: "Visionary leader building the future of personal computing",
  aspects: [
    { name: "Knowledge", value: 85, icon: "BookOpen" },
    { name: "Creativity", value: 95, icon: "Lightbulb" },
    { name: "Social", value: 65, icon: "Users" },
    { name: "Discipline", value: 70, icon: "Target" },
    { name: "Ambition", value: 98, icon: "Rocket" },
  ]
};

export const getSteveJobsSkills = (age: 10 | 20 | 30): UserCustomSkill[] => {
  switch (age) {
    case 10: return stevejobsAge10;
    case 20: return stevejobsAge20;
    case 30: return stevejobsAge30;
    default: return stevejobsAge30;
  }
};

export const getSteveJobsLifeAspects = (age: 10 | 20 | 30): BuffettLifeAspects => {
  switch (age) {
    case 10: return stevejobsLifeAspects10;
    case 20: return stevejobsLifeAspects20;
    case 30: return stevejobsLifeAspects30;
    default: return stevejobsLifeAspects30;
  }
};

// Steve Jobs Courses
export const stevejobsCourses10: Course[] = [
  { id: 1, name: "Electronics Basics", description: "Building HeathKits with adoptive father", icon: "Cpu", instructor: "Paul Jobs", progress: 100, status: "completed" },
  { id: 2, name: "Elementary School", description: "Public school education in Mountain View", icon: "GraduationCap", instructor: "Monta Loma Elementary", progress: 80, status: "in_progress" },
  { id: 3, name: "Swimming Lessons", description: "Learning to swim at the local pool", icon: "Waves", instructor: "Community Pool", progress: 70, status: "in_progress" },
];

export const stevejobsCourses20: Course[] = [
  { id: 1, name: "Calligraphy", description: "Typography and letterform design", icon: "PenTool", instructor: "Reed College", progress: 100, status: "completed" },
  { id: 2, name: "Philosophy", description: "Eastern philosophy and Zen Buddhism", icon: "Leaf", instructor: "Self-study", progress: 75, status: "in_progress" },
  { id: 3, name: "Electronics Engineering", description: "Circuit design and blue boxes", icon: "Cpu", instructor: "Self-taught with Woz", progress: 85, status: "completed" },
  { id: 4, name: "Meditation Practice", description: "Zen meditation techniques", icon: "Brain", instructor: "Kobun Chino Otogawa", progress: 60, status: "in_progress" },
];

export const stevejobsCourses30: Course[] = [
  { id: 1, name: "Industrial Design", description: "Product aesthetics and materials", icon: "Palette", instructor: "Self-developed", progress: 95, status: "completed" },
  { id: 2, name: "Marketing & Advertising", description: "Creating compelling product narratives", icon: "Megaphone", instructor: "Regis McKenna", progress: 100, status: "completed" },
  { id: 3, name: "Management", description: "Leading creative teams", icon: "Users", instructor: "Experience", progress: 70, status: "in_progress" },
  { id: 4, name: "Manufacturing", description: "Hardware production processes", icon: "Factory", instructor: "Apple Operations", progress: 80, status: "completed" },
];

// Steve Jobs Roles
export const stevejobsRoles10: Role[] = [
  { id: 1, title: "Student", organization: "Monta Loma Elementary", icon: "GraduationCap", period: "1960-1965", description: "Elementary school education", current: true },
  { id: 2, title: "Electronics Hobbyist", organization: "Home Workshop", icon: "Cpu", period: "1963-1965", description: "Building kits with father", current: true },
];

export const stevejobsRoles20: Role[] = [
  { id: 1, title: "College Dropout", organization: "Reed College", icon: "GraduationCap", period: "1972-1974", description: "Dropped out but audited classes", current: false },
  { id: 2, title: "Technician", organization: "Atari", icon: "Gamepad2", period: "1974", description: "Night shift game designer", current: false },
  { id: 3, title: "Co-founder", organization: "Apple Computer", icon: "Apple", period: "1976-present", description: "Building personal computers", current: true },
  { id: 4, title: "Spiritual Seeker", organization: "Neem Karoli Baba Ashram", icon: "Leaf", period: "1974", description: "Traveled to India seeking enlightenment", current: false },
];

export const stevejobsRoles30: Role[] = [
  { id: 1, title: "Chairman & CEO", organization: "Apple Computer", icon: "Crown", period: "1976-1985", description: "Leading the personal computer revolution", current: true },
  { id: 2, title: "Macintosh Division Lead", organization: "Apple Computer", icon: "Monitor", period: "1981-1985", description: "Creating the Macintosh", current: true },
  { id: 3, title: "Public Face of Apple", organization: "Apple Computer", icon: "Mic", period: "1984", description: "1984 Super Bowl commercial fame", current: true },
];

// Steve Jobs Projects
export const stevejobsProjects10: Project[] = [
  { id: 1, name: "First HeathKit", description: "Building a Heathkit radio with father", icon: "Radio", status: "completed", year: "1963" },
  { id: 2, name: "Neighborhood Explorer", description: "Exploring garages and workshops", icon: "Search", status: "completed", year: "1964" },
];

export const stevejobsProjects20: Project[] = [
  { id: 1, name: "Blue Box", description: "Phone phreaking device with Wozniak", icon: "Phone", status: "completed", year: "1972" },
  { id: 2, name: "India Trip", description: "Spiritual journey to India", icon: "Plane", status: "completed", year: "1974" },
  { id: 3, name: "Apple I", description: "First Apple computer", icon: "Monitor", status: "completed", year: "1976" },
  { id: 4, name: "Apple II Development", description: "Revolutionary personal computer", icon: "Cpu", status: "in_progress", year: "1977" },
];

export const stevejobsProjects30: Project[] = [
  { id: 1, name: "Apple II", description: "Best-selling personal computer", icon: "Monitor", status: "completed", year: "1977" },
  { id: 2, name: "Lisa Computer", description: "First GUI personal computer", icon: "MousePointer", status: "completed", year: "1983" },
  { id: 3, name: "Macintosh", description: "The computer for the rest of us", icon: "Laptop", status: "completed", year: "1984" },
  { id: 4, name: "1984 Super Bowl Ad", description: "Iconic Macintosh commercial", icon: "Tv", status: "completed", year: "1984" },
  { id: 5, name: "LaserWriter", description: "Desktop publishing revolution", icon: "Printer", status: "in_progress", year: "1985" },
];

// Steve Jobs Certificates
export const stevejobsCertificates10: Certificate[] = [
  { id: 1, name: "Elementary School Progress", issuer: "Monta Loma Elementary", icon: "Award", year: "1965", description: "Academic achievement recognition" },
];

export const stevejobsCertificates20: Certificate[] = [
  { id: 1, name: "Reed College Attendance", issuer: "Reed College", icon: "GraduationCap", year: "1972", description: "One semester enrollment" },
  { id: 2, name: "Atari Employee", issuer: "Atari Inc.", icon: "Gamepad2", year: "1974", description: "Employment as technician" },
  { id: 3, name: "Apple Incorporation", issuer: "State of California", icon: "FileText", year: "1977", description: "Apple Computer Company founded" },
];

export const stevejobsCertificates30: Certificate[] = [
  { id: 1, name: "Apple IPO", issuer: "NASDAQ", icon: "TrendingUp", year: "1980", description: "Most successful IPO since Ford" },
  { id: 2, name: "Time Magazine Cover", issuer: "Time Magazine", icon: "Newspaper", year: "1982", description: "Machine of the Year recognition" },
  { id: 3, name: "National Technology Medal", issuer: "Industrial Designers Society", icon: "Award", year: "1985", description: "Product design recognition" },
  { id: 4, name: "Fortune 500", issuer: "Fortune Magazine", icon: "Trophy", year: "1983", description: "Apple enters Fortune 500" },
];

export const getSteveJobsCourses = (age: 10 | 20 | 30): Course[] => {
  switch (age) {
    case 10: return stevejobsCourses10;
    case 20: return stevejobsCourses20;
    case 30: return stevejobsCourses30;
    default: return stevejobsCourses30;
  }
};

export const getSteveJobsRoles = (age: 10 | 20 | 30): Role[] => {
  switch (age) {
    case 10: return stevejobsRoles10;
    case 20: return stevejobsRoles20;
    case 30: return stevejobsRoles30;
    default: return stevejobsRoles30;
  }
};

export const getSteveJobsProjects = (age: 10 | 20 | 30): Project[] => {
  switch (age) {
    case 10: return stevejobsProjects10;
    case 20: return stevejobsProjects20;
    case 30: return stevejobsProjects30;
    default: return stevejobsProjects30;
  }
};

export const getSteveJobsCertificates = (age: 10 | 20 | 30): Certificate[] => {
  switch (age) {
    case 10: return stevejobsCertificates10;
    case 20: return stevejobsCertificates20;
    case 30: return stevejobsCertificates30;
    default: return stevejobsCertificates30;
  }
};

// =============================================================================
// BILL GATES
// =============================================================================

export const billgatesAge10: UserCustomSkill[] = [
  { id: 1, name: "Reading", description: "Reading encyclopedias and any book available", icon: "BookOpen", color: 5, currentScore: 85, targetScore: 100, lastPracticed: "1965-10-28", totalPractices: 1000, createdAt: "1960-01-01" },
  { id: 2, name: "Board Games", description: "Strategic thinking through Risk and Monopoly", icon: "Dice5", color: 3, currentScore: 75, targetScore: 100, lastPracticed: "1965-10-25", totalPractices: 400, createdAt: "1962-01-01" },
  { id: 3, name: "Mathematics", description: "Advanced math skills beyond his grade", icon: "Calculator", color: 1, currentScore: 80, targetScore: 100, lastPracticed: "1965-10-28", totalPractices: 600, createdAt: "1961-01-01" },
  { id: 4, name: "Argumentation", description: "Debating with parents and teachers", icon: "MessageSquare", color: 0, currentScore: 70, targetScore: 100, lastPracticed: "1965-10-27", totalPractices: 300, createdAt: "1963-01-01" },
];

export const billgatesAge30: UserCustomSkill[] = [
  { id: 1, name: "Programming", description: "Writing code and understanding systems", icon: "Code", color: 1, currentScore: 95, targetScore: 100, lastPracticed: "1985-10-28", totalPractices: 15000, createdAt: "1968-01-01" },
  { id: 2, name: "Business Strategy", description: "Dominating the PC software market", icon: "Target", color: 2, currentScore: 92, targetScore: 100, lastPracticed: "1985-10-28", totalPractices: 8000, createdAt: "1975-01-01" },
  { id: 3, name: "Negotiation", description: "Licensing deals with IBM and others", icon: "Handshake", color: 3, currentScore: 88, targetScore: 100, lastPracticed: "1985-10-25", totalPractices: 5000, createdAt: "1980-01-01" },
  { id: 4, name: "Technical Vision", description: "A computer on every desk and in every home", icon: "Monitor", color: 6, currentScore: 90, targetScore: 100, lastPracticed: "1985-10-28", totalPractices: 6000, createdAt: "1975-01-01" },
  { id: 5, name: "Team Building", description: "Recruiting and leading top engineers", icon: "Users", color: 0, currentScore: 78, targetScore: 100, lastPracticed: "1985-10-20", totalPractices: 3000, createdAt: "1978-01-01" },
  { id: 6, name: "Competitive Analysis", description: "Understanding and outmaneuvering competitors", icon: "Swords", color: 7, currentScore: 85, targetScore: 100, lastPracticed: "1985-10-28", totalPractices: 4000, createdAt: "1980-01-01" },
  { id: 7, name: "Product Management", description: "Deciding what features to build", icon: "Package", color: 4, currentScore: 82, targetScore: 100, lastPracticed: "1985-10-26", totalPractices: 4500, createdAt: "1979-01-01" },
  { id: 8, name: "Reading & Research", description: "Think weeks and continuous learning", icon: "BookOpen", color: 5, currentScore: 90, targetScore: 100, lastPracticed: "1985-10-28", totalPractices: 10000, createdAt: "1960-01-01" },
];

export const billgatesAge50: UserCustomSkill[] = [
  { id: 1, name: "Philanthropy", description: "Giving away billions to solve global problems", icon: "Heart", color: 4, currentScore: 92, targetScore: 100, lastPracticed: "2005-10-28", totalPractices: 8000, createdAt: "2000-01-01" },
  { id: 2, name: "Global Health", description: "Fighting malaria, polio, and diseases", icon: "Stethoscope", color: 2, currentScore: 88, targetScore: 100, lastPracticed: "2005-10-28", totalPractices: 5000, createdAt: "2000-01-01" },
  { id: 3, name: "Strategic Thinking", description: "Systems thinking for complex problems", icon: "Brain", color: 0, currentScore: 96, targetScore: 100, lastPracticed: "2005-10-28", totalPractices: 20000, createdAt: "1970-01-01" },
  { id: 4, name: "Public Speaking", description: "TED talks and global advocacy", icon: "Mic", color: 3, currentScore: 82, targetScore: 100, lastPracticed: "2005-10-25", totalPractices: 3000, createdAt: "1985-01-01" },
  { id: 5, name: "Investment Analysis", description: "Evaluating opportunities for impact", icon: "TrendingUp", color: 1, currentScore: 90, targetScore: 100, lastPracticed: "2005-10-28", totalPractices: 10000, createdAt: "1986-01-01" },
  { id: 6, name: "Partnership Building", description: "Working with governments and NGOs", icon: "Handshake", color: 8, currentScore: 85, targetScore: 100, lastPracticed: "2005-10-20", totalPractices: 4000, createdAt: "2000-01-01" },
  { id: 7, name: "Education Reform", description: "Improving schools and learning outcomes", icon: "GraduationCap", color: 5, currentScore: 80, targetScore: 100, lastPracticed: "2005-10-22", totalPractices: 3500, createdAt: "2000-01-01" },
  { id: 8, name: "Climate Action", description: "Investing in clean energy solutions", icon: "Leaf", color: 9, currentScore: 75, targetScore: 100, lastPracticed: "2005-10-28", totalPractices: 2000, createdAt: "2004-01-01" },
  { id: 9, name: "Book Writing", description: "Sharing ideas through bestselling books", icon: "BookOpen", color: 6, currentScore: 78, targetScore: 100, lastPracticed: "2005-10-15", totalPractices: 1500, createdAt: "1995-01-01" },
  { id: 10, name: "Technology Vision", description: "Predicting and shaping tech futures", icon: "Telescope", color: 7, currentScore: 94, targetScore: 100, lastPracticed: "2005-10-28", totalPractices: 15000, createdAt: "1975-01-01" },
];

export const billgatesLifeAspects10: BuffettLifeAspects = {
  summary: "A precocious child obsessed with reading and learning",
  aspects: [
    { name: "Knowledge", value: 80, icon: "BookOpen" },
    { name: "Logic", value: 75, icon: "Brain" },
    { name: "Social", value: 45, icon: "Users" },
    { name: "Discipline", value: 60, icon: "Target" },
    { name: "Ambition", value: 55, icon: "Rocket" },
  ]
};

export const billgatesLifeAspects30: BuffettLifeAspects = {
  summary: "Tech titan building the world's largest software company",
  aspects: [
    { name: "Knowledge", value: 92, icon: "BookOpen" },
    { name: "Logic", value: 95, icon: "Brain" },
    { name: "Social", value: 65, icon: "Users" },
    { name: "Discipline", value: 88, icon: "Target" },
    { name: "Ambition", value: 98, icon: "Rocket" },
  ]
};

export const billgatesLifeAspects50: BuffettLifeAspects = {
  summary: "Philanthropist dedicating wealth to global challenges",
  aspects: [
    { name: "Knowledge", value: 96, icon: "BookOpen" },
    { name: "Logic", value: 94, icon: "Brain" },
    { name: "Social", value: 80, icon: "Users" },
    { name: "Discipline", value: 90, icon: "Target" },
    { name: "Ambition", value: 92, icon: "Rocket" },
  ]
};

export const getBillGatesSkills = (age: 10 | 30 | 50): UserCustomSkill[] => {
  switch (age) {
    case 10: return billgatesAge10;
    case 30: return billgatesAge30;
    case 50: return billgatesAge50;
    default: return billgatesAge50;
  }
};

export const getBillGatesLifeAspects = (age: 10 | 30 | 50): BuffettLifeAspects => {
  switch (age) {
    case 10: return billgatesLifeAspects10;
    case 30: return billgatesLifeAspects30;
    case 50: return billgatesLifeAspects50;
    default: return billgatesLifeAspects50;
  }
};

// =============================================================================
// ALBERT EINSTEIN
// =============================================================================

export const einsteinAge10: UserCustomSkill[] = [
  { id: 1, name: "Mathematics", description: "Self-taught geometry and algebra", icon: "Calculator", color: 1, currentScore: 75, targetScore: 100, lastPracticed: "1889-03-14", totalPractices: 500, createdAt: "1885-01-01" },
  { id: 2, name: "Curiosity", description: "Wondering about the nature of light and space", icon: "HelpCircle", color: 0, currentScore: 90, targetScore: 100, lastPracticed: "1889-03-14", totalPractices: 1000, createdAt: "1882-01-01" },
  { id: 3, name: "Violin", description: "Playing Mozart with deep emotional connection", icon: "Music", color: 4, currentScore: 60, targetScore: 100, lastPracticed: "1889-03-12", totalPractices: 400, createdAt: "1885-01-01" },
  { id: 4, name: "Reading", description: "Popular science books and philosophy", icon: "BookOpen", color: 5, currentScore: 70, targetScore: 100, lastPracticed: "1889-03-14", totalPractices: 600, createdAt: "1884-01-01" },
  { id: 5, name: "Independent Thinking", description: "Questioning authority and established ideas", icon: "Lightbulb", color: 8, currentScore: 80, targetScore: 100, lastPracticed: "1889-03-14", totalPractices: 700, createdAt: "1883-01-01" },
];

export const einsteinAge20: UserCustomSkill[] = [
  { id: 1, name: "Theoretical Physics", description: "Studying Maxwell's equations and thermodynamics", icon: "Atom", color: 1, currentScore: 82, targetScore: 100, lastPracticed: "1899-03-14", totalPractices: 3000, createdAt: "1895-01-01" },
  { id: 2, name: "Mathematics", description: "Advanced calculus and differential geometry", icon: "Calculator", color: 0, currentScore: 78, targetScore: 100, lastPracticed: "1899-03-14", totalPractices: 2500, createdAt: "1885-01-01" },
  { id: 3, name: "Philosophy", description: "Reading Kant, Hume, and Mach", icon: "ScrollText", color: 5, currentScore: 75, targetScore: 100, lastPracticed: "1899-03-10", totalPractices: 1500, createdAt: "1895-01-01" },
  { id: 4, name: "Thought Experiments", description: "Imagining riding on a beam of light", icon: "Brain", color: 3, currentScore: 88, targetScore: 100, lastPracticed: "1899-03-14", totalPractices: 2000, createdAt: "1895-01-01" },
  { id: 5, name: "Violin", description: "Mozart and Bach for mental clarity", icon: "Music", color: 4, currentScore: 72, targetScore: 100, lastPracticed: "1899-03-12", totalPractices: 1200, createdAt: "1885-01-01" },
  { id: 6, name: "Debate", description: "Discussing physics with friends at Olympia Academy", icon: "MessageSquare", color: 2, currentScore: 70, targetScore: 100, lastPracticed: "1899-03-08", totalPractices: 800, createdAt: "1897-01-01" },
];

export const einsteinAge30: UserCustomSkill[] = [
  { id: 1, name: "Theoretical Physics", description: "Special relativity and photoelectric effect", icon: "Atom", color: 1, currentScore: 95, targetScore: 100, lastPracticed: "1909-03-14", totalPractices: 8000, createdAt: "1895-01-01" },
  { id: 2, name: "Mathematical Physics", description: "Tensor calculus and field equations", icon: "Calculator", color: 0, currentScore: 88, targetScore: 100, lastPracticed: "1909-03-14", totalPractices: 6000, createdAt: "1885-01-01" },
  { id: 3, name: "Scientific Writing", description: "Publishing groundbreaking papers", icon: "FileText", color: 5, currentScore: 85, targetScore: 100, lastPracticed: "1909-03-10", totalPractices: 3000, createdAt: "1905-01-01" },
  { id: 4, name: "University Teaching", description: "Professor at University of Zurich", icon: "GraduationCap", color: 3, currentScore: 75, targetScore: 100, lastPracticed: "1909-03-14", totalPractices: 2000, createdAt: "1908-01-01" },
  { id: 5, name: "Thought Experiments", description: "Elevators, trains, and falling observers", icon: "Brain", color: 8, currentScore: 98, targetScore: 100, lastPracticed: "1909-03-14", totalPractices: 5000, createdAt: "1895-01-01" },
  { id: 6, name: "Collaboration", description: "Working with mathematicians like Grossmann", icon: "Users", color: 2, currentScore: 72, targetScore: 100, lastPracticed: "1909-03-08", totalPractices: 1500, createdAt: "1907-01-01" },
  { id: 7, name: "Violin", description: "Chamber music and solo performances", icon: "Music", color: 4, currentScore: 78, targetScore: 100, lastPracticed: "1909-03-12", totalPractices: 2500, createdAt: "1885-01-01" },
];

export const einsteinAge40: UserCustomSkill[] = [
  { id: 1, name: "General Relativity", description: "Completed theory of gravity and spacetime", icon: "Orbit", color: 1, currentScore: 99, targetScore: 100, lastPracticed: "1919-03-14", totalPractices: 15000, createdAt: "1907-01-01" },
  { id: 2, name: "Mathematical Physics", description: "Mastery of differential geometry", icon: "Calculator", color: 0, currentScore: 92, targetScore: 100, lastPracticed: "1919-03-14", totalPractices: 12000, createdAt: "1885-01-01" },
  { id: 3, name: "Scientific Communication", description: "Explaining relativity to the world", icon: "Globe", color: 6, currentScore: 88, targetScore: 100, lastPracticed: "1919-03-14", totalPractices: 5000, createdAt: "1915-01-01" },
  { id: 4, name: "Public Speaking", description: "Lectures across Europe and America", icon: "Mic", color: 3, currentScore: 80, targetScore: 100, lastPracticed: "1919-03-10", totalPractices: 2000, createdAt: "1909-01-01" },
  { id: 5, name: "Quantum Theory", description: "Foundational work despite later skepticism", icon: "Atom", color: 8, currentScore: 90, targetScore: 100, lastPracticed: "1919-03-14", totalPractices: 8000, createdAt: "1905-01-01" },
  { id: 6, name: "Pacifism & Activism", description: "Speaking out against war and nationalism", icon: "Heart", color: 4, currentScore: 75, targetScore: 100, lastPracticed: "1919-03-08", totalPractices: 1500, createdAt: "1914-01-01" },
  { id: 7, name: "Unified Field Theory", description: "Seeking to unite all forces of nature", icon: "Sparkles", color: 9, currentScore: 60, targetScore: 100, lastPracticed: "1919-03-14", totalPractices: 3000, createdAt: "1918-01-01" },
  { id: 8, name: "Mentorship", description: "Guiding young physicists", icon: "Users", color: 2, currentScore: 72, targetScore: 100, lastPracticed: "1919-03-05", totalPractices: 1200, createdAt: "1910-01-01" },
  { id: 9, name: "Violin & Music", description: "Playing with world-class musicians", icon: "Music", color: 5, currentScore: 82, targetScore: 100, lastPracticed: "1919-03-12", totalPractices: 4000, createdAt: "1885-01-01" },
];

export const einsteinLifeAspects10: BuffettLifeAspects = {
  summary: "A dreamy child questioning the nature of reality",
  aspects: [
    { name: "Intellect", value: 75, icon: "Brain" },
    { name: "Creativity", value: 80, icon: "Lightbulb" },
    { name: "Social", value: 40, icon: "Users" },
    { name: "Curiosity", value: 95, icon: "HelpCircle" },
    { name: "Artistry", value: 55, icon: "Music" },
  ]
};

export const einsteinLifeAspects20: BuffettLifeAspects = {
  summary: "A struggling student with revolutionary ideas brewing",
  aspects: [
    { name: "Intellect", value: 88, icon: "Brain" },
    { name: "Creativity", value: 90, icon: "Lightbulb" },
    { name: "Social", value: 55, icon: "Users" },
    { name: "Curiosity", value: 98, icon: "HelpCircle" },
    { name: "Artistry", value: 65, icon: "Music" },
  ]
};

export const einsteinLifeAspects30: BuffettLifeAspects = {
  summary: "Miracle year genius transforming physics forever",
  aspects: [
    { name: "Intellect", value: 96, icon: "Brain" },
    { name: "Creativity", value: 98, icon: "Lightbulb" },
    { name: "Social", value: 60, icon: "Users" },
    { name: "Curiosity", value: 95, icon: "HelpCircle" },
    { name: "Artistry", value: 72, icon: "Music" },
  ]
};

export const einsteinLifeAspects40: BuffettLifeAspects = {
  summary: "World-famous scientist and humanitarian icon",
  aspects: [
    { name: "Intellect", value: 99, icon: "Brain" },
    { name: "Creativity", value: 95, icon: "Lightbulb" },
    { name: "Social", value: 75, icon: "Users" },
    { name: "Curiosity", value: 92, icon: "HelpCircle" },
    { name: "Artistry", value: 78, icon: "Music" },
  ]
};

export const getEinsteinSkills = (age: 10 | 20 | 30 | 40): UserCustomSkill[] => {
  switch (age) {
    case 10: return einsteinAge10;
    case 20: return einsteinAge20;
    case 30: return einsteinAge30;
    case 40: return einsteinAge40;
    default: return einsteinAge40;
  }
};

export const getEinsteinLifeAspects = (age: 10 | 20 | 30 | 40): BuffettLifeAspects => {
  switch (age) {
    case 10: return einsteinLifeAspects10;
    case 20: return einsteinLifeAspects20;
    case 30: return einsteinLifeAspects30;
    case 40: return einsteinLifeAspects40;
    default: return einsteinLifeAspects40;
  }
};

// =============================================================================
// WOLFGANG AMADEUS MOZART (1756-1791)
// Note: Mozart died at 35, so age 50 is hypothetical
// =============================================================================

export const mozartAge10: UserCustomSkill[] = [
  { id: 1, name: "Piano Performance", description: "Performing for royalty across Europe", icon: "Piano", color: 4, currentScore: 90, targetScore: 100, lastPracticed: "1766-01-27", totalPractices: 5000, createdAt: "1760-01-01" },
  { id: 2, name: "Violin", description: "Second instrument with remarkable proficiency", icon: "Music", color: 5, currentScore: 75, targetScore: 100, lastPracticed: "1766-01-25", totalPractices: 2000, createdAt: "1762-01-01" },
  { id: 3, name: "Composition", description: "Writing symphonies and sonatas as a child", icon: "FileMusic", color: 1, currentScore: 80, targetScore: 100, lastPracticed: "1766-01-27", totalPractices: 1500, createdAt: "1761-01-01" },
  { id: 4, name: "Sight Reading", description: "Playing any piece at first sight perfectly", icon: "Eye", color: 0, currentScore: 95, targetScore: 100, lastPracticed: "1766-01-27", totalPractices: 3000, createdAt: "1760-01-01" },
  { id: 5, name: "Music Theory", description: "Understanding harmony and counterpoint", icon: "BookOpen", color: 3, currentScore: 70, targetScore: 100, lastPracticed: "1766-01-20", totalPractices: 1000, createdAt: "1762-01-01" },
  { id: 6, name: "Performance Charm", description: "Captivating audiences with showmanship", icon: "Sparkles", color: 8, currentScore: 85, targetScore: 100, lastPracticed: "1766-01-27", totalPractices: 800, createdAt: "1762-01-01" },
];

export const mozartAge30: UserCustomSkill[] = [
  { id: 1, name: "Opera Composition", description: "Le Nozze di Figaro, Don Giovanni masterpieces", icon: "Theater", color: 4, currentScore: 98, targetScore: 100, lastPracticed: "1786-01-27", totalPractices: 15000, createdAt: "1770-01-01" },
  { id: 2, name: "Piano Performance", description: "Virtuoso performer and improviser", icon: "Piano", color: 1, currentScore: 97, targetScore: 100, lastPracticed: "1786-01-27", totalPractices: 25000, createdAt: "1760-01-01" },
  { id: 3, name: "Orchestration", description: "Mastery of instrumental colors and textures", icon: "Music2", color: 5, currentScore: 96, targetScore: 100, lastPracticed: "1786-01-27", totalPractices: 12000, createdAt: "1765-01-01" },
  { id: 4, name: "Piano Concerto", description: "Writing revolutionary piano concertos", icon: "Music", color: 0, currentScore: 98, targetScore: 100, lastPracticed: "1786-01-25", totalPractices: 10000, createdAt: "1773-01-01" },
  { id: 5, name: "Chamber Music", description: "String quartets and quintets of depth", icon: "Users", color: 3, currentScore: 94, targetScore: 100, lastPracticed: "1786-01-20", totalPractices: 8000, createdAt: "1770-01-01" },
  { id: 6, name: "Teaching", description: "Private lessons to aristocratic students", icon: "GraduationCap", color: 2, currentScore: 75, targetScore: 100, lastPracticed: "1786-01-22", totalPractices: 3000, createdAt: "1780-01-01" },
  { id: 7, name: "Improvisation", description: "Spontaneous musical creation at the keyboard", icon: "Wand2", color: 8, currentScore: 99, targetScore: 100, lastPracticed: "1786-01-27", totalPractices: 15000, createdAt: "1762-01-01" },
  { id: 8, name: "Business Management", description: "Freelance career and concert promotion", icon: "Briefcase", color: 6, currentScore: 55, targetScore: 100, lastPracticed: "1786-01-15", totalPractices: 1500, createdAt: "1781-01-01" },
];

export const mozartAge50: UserCustomSkill[] = [
  // Hypothetical: What if Mozart had lived to 50 (1806)?
  { id: 1, name: "Opera Composition", description: "Hypothetical: 30+ operas defining the art form", icon: "Theater", color: 4, currentScore: 100, targetScore: 100, lastPracticed: "1806-01-27", totalPractices: 40000, createdAt: "1770-01-01" },
  { id: 2, name: "Symphony Writing", description: "Hypothetical: 60+ symphonies rivaling Beethoven", icon: "Music2", color: 1, currentScore: 99, targetScore: 100, lastPracticed: "1806-01-27", totalPractices: 35000, createdAt: "1764-01-01" },
  { id: 3, name: "Piano Mastery", description: "Hypothetical: Elder statesman of the keyboard", icon: "Piano", color: 0, currentScore: 98, targetScore: 100, lastPracticed: "1806-01-25", totalPractices: 50000, createdAt: "1760-01-01" },
  { id: 4, name: "Musical Innovation", description: "Hypothetical: Pioneering Romantic era techniques", icon: "Lightbulb", color: 8, currentScore: 95, targetScore: 100, lastPracticed: "1806-01-27", totalPractices: 20000, createdAt: "1785-01-01" },
  { id: 5, name: "Conducting", description: "Hypothetical: Leading major orchestras of Europe", icon: "Wand2", color: 3, currentScore: 92, targetScore: 100, lastPracticed: "1806-01-20", totalPractices: 12000, createdAt: "1780-01-01" },
  { id: 6, name: "Music Education", description: "Hypothetical: Training the next generation", icon: "GraduationCap", color: 2, currentScore: 88, targetScore: 100, lastPracticed: "1806-01-22", totalPractices: 10000, createdAt: "1790-01-01" },
  { id: 7, name: "Sacred Music", description: "Hypothetical: Completed Requiem and more masses", icon: "Church", color: 5, currentScore: 96, targetScore: 100, lastPracticed: "1806-01-15", totalPractices: 15000, createdAt: "1768-01-01" },
  { id: 8, name: "Chamber Music", description: "Hypothetical: Definitive string quartets", icon: "Users", color: 6, currentScore: 97, targetScore: 100, lastPracticed: "1806-01-27", totalPractices: 18000, createdAt: "1770-01-01" },
  { id: 9, name: "Legacy Building", description: "Hypothetical: Establishing music conservatories", icon: "Building", color: 9, currentScore: 85, targetScore: 100, lastPracticed: "1806-01-10", totalPractices: 5000, createdAt: "1800-01-01" },
  { id: 10, name: "Artistic Wisdom", description: "Hypothetical: Decades of creative refinement", icon: "Sparkles", color: 7, currentScore: 98, targetScore: 100, lastPracticed: "1806-01-27", totalPractices: 30000, createdAt: "1760-01-01" },
];

export const mozartLifeAspects10: BuffettLifeAspects = {
  summary: "Child prodigy touring European courts with father Leopold",
  aspects: [
    { name: "Talent", value: 95, icon: "Music" },
    { name: "Knowledge", value: 70, icon: "BookOpen" },
    { name: "Social", value: 75, icon: "Users" },
    { name: "Freedom", value: 30, icon: "Bird" },
    { name: "Joy", value: 85, icon: "Smile" },
  ]
};

export const mozartLifeAspects30: BuffettLifeAspects = {
  summary: "Freelance genius creating immortal masterpieces in Vienna",
  aspects: [
    { name: "Talent", value: 99, icon: "Music" },
    { name: "Knowledge", value: 95, icon: "BookOpen" },
    { name: "Social", value: 70, icon: "Users" },
    { name: "Freedom", value: 65, icon: "Bird" },
    { name: "Joy", value: 60, icon: "Smile" },
  ]
};

export const mozartLifeAspects50: BuffettLifeAspects = {
  summary: "Hypothetical: Revered master shaping European music",
  aspects: [
    { name: "Talent", value: 100, icon: "Music" },
    { name: "Knowledge", value: 98, icon: "BookOpen" },
    { name: "Social", value: 85, icon: "Users" },
    { name: "Freedom", value: 80, icon: "Bird" },
    { name: "Joy", value: 75, icon: "Smile" },
  ]
};

export const getMozartSkills = (age: 10 | 30 | 50): UserCustomSkill[] => {
  switch (age) {
    case 10: return mozartAge10;
    case 30: return mozartAge30;
    case 50: return mozartAge50;
    default: return mozartAge50;
  }
};

export const getMozartLifeAspects = (age: 10 | 30 | 50): BuffettLifeAspects => {
  switch (age) {
    case 10: return mozartLifeAspects10;
    case 30: return mozartLifeAspects30;
    case 50: return mozartLifeAspects50;
    default: return mozartLifeAspects50;
  }
};

// =============================================================================
// LUDWIG VAN BEETHOVEN (1770-1827)
// =============================================================================

export const beethovenAge10: UserCustomSkill[] = [
  { id: 1, name: "Piano Performance", description: "Rigorous training under father Johann", icon: "Piano", color: 8, currentScore: 70, targetScore: 100, lastPracticed: "1780-12-16", totalPractices: 3000, createdAt: "1775-01-01" },
  { id: 2, name: "Organ Playing", description: "Church organ studies in Bonn", icon: "Music", color: 5, currentScore: 55, targetScore: 100, lastPracticed: "1780-12-14", totalPractices: 1000, createdAt: "1778-01-01" },
  { id: 3, name: "Music Theory", description: "Learning composition fundamentals", icon: "BookOpen", color: 3, currentScore: 60, targetScore: 100, lastPracticed: "1780-12-16", totalPractices: 800, createdAt: "1777-01-01" },
  { id: 4, name: "Violin", description: "String instrument training", icon: "Music2", color: 1, currentScore: 45, targetScore: 100, lastPracticed: "1780-12-10", totalPractices: 500, createdAt: "1778-01-01" },
  { id: 5, name: "Sight Reading", description: "Reading and playing music at first sight", icon: "Eye", color: 0, currentScore: 65, targetScore: 100, lastPracticed: "1780-12-16", totalPractices: 1500, createdAt: "1776-01-01" },
];

export const beethovenAge20: UserCustomSkill[] = [
  { id: 1, name: "Piano Virtuosity", description: "Stunning Vienna with powerful performances", icon: "Piano", color: 8, currentScore: 88, targetScore: 100, lastPracticed: "1790-12-16", totalPractices: 12000, createdAt: "1775-01-01" },
  { id: 2, name: "Composition", description: "Early works showing unique voice", icon: "PenTool", color: 1, currentScore: 75, targetScore: 100, lastPracticed: "1790-12-16", totalPractices: 5000, createdAt: "1782-01-01" },
  { id: 3, name: "Improvisation", description: "Famous for spontaneous keyboard fantasies", icon: "Wand2", color: 4, currentScore: 92, targetScore: 100, lastPracticed: "1790-12-16", totalPractices: 8000, createdAt: "1780-01-01" },
  { id: 4, name: "Counterpoint", description: "Studying with Haydn and Albrechtsberger", icon: "Layers", color: 0, currentScore: 70, targetScore: 100, lastPracticed: "1790-12-14", totalPractices: 3000, createdAt: "1792-01-01" },
  { id: 5, name: "Chamber Music", description: "Writing trios and early string quartets", icon: "Users", color: 3, currentScore: 68, targetScore: 100, lastPracticed: "1790-12-12", totalPractices: 2500, createdAt: "1785-01-01" },
  { id: 6, name: "Patron Relations", description: "Building relationships with Viennese nobility", icon: "Crown", color: 8, currentScore: 65, targetScore: 100, lastPracticed: "1790-12-10", totalPractices: 1500, createdAt: "1792-01-01" },
];

export const beethovenAge30: UserCustomSkill[] = [
  { id: 1, name: "Piano Mastery", description: "Revolutionary sonatas changing the instrument", icon: "Piano", color: 8, currentScore: 96, targetScore: 100, lastPracticed: "1800-12-16", totalPractices: 20000, createdAt: "1775-01-01" },
  { id: 2, name: "Symphonic Writing", description: "First two symphonies, Third in progress", icon: "Music2", color: 1, currentScore: 88, targetScore: 100, lastPracticed: "1800-12-16", totalPractices: 10000, createdAt: "1795-01-01" },
  { id: 3, name: "Composition", description: "Pathétique, Moonlight sonatas composed", icon: "PenTool", color: 4, currentScore: 92, targetScore: 100, lastPracticed: "1800-12-16", totalPractices: 15000, createdAt: "1782-01-01" },
  { id: 4, name: "Improvisation", description: "Legendary spontaneous performances", icon: "Wand2", color: 3, currentScore: 98, targetScore: 100, lastPracticed: "1800-12-14", totalPractices: 15000, createdAt: "1780-01-01" },
  { id: 5, name: "String Quartets", description: "Op. 18 quartets establishing mastery", icon: "Users", color: 0, currentScore: 85, targetScore: 100, lastPracticed: "1800-12-12", totalPractices: 6000, createdAt: "1798-01-01" },
  { id: 6, name: "Concerto Writing", description: "First three piano concertos", icon: "Sparkles", color: 5, currentScore: 82, targetScore: 100, lastPracticed: "1800-12-10", totalPractices: 5000, createdAt: "1795-01-01" },
  { id: 7, name: "Inner Strength", description: "Coping with onset of deafness", icon: "Shield", color: 7, currentScore: 75, targetScore: 100, lastPracticed: "1800-12-16", totalPractices: 2000, createdAt: "1798-01-01" },
  { id: 8, name: "Musical Innovation", description: "Breaking classical conventions", icon: "Lightbulb", color: 9, currentScore: 90, targetScore: 100, lastPracticed: "1800-12-16", totalPractices: 8000, createdAt: "1795-01-01" },
];

export const beethovenLifeAspects10: BuffettLifeAspects = {
  summary: "A young prodigy under his father's strict musical discipline in Bonn",
  aspects: [
    { name: "Talent", value: 75, icon: "Music" },
    { name: "Discipline", value: 70, icon: "Target" },
    { name: "Emotion", value: 65, icon: "Heart" },
    { name: "Freedom", value: 25, icon: "Bird" },
    { name: "Joy", value: 45, icon: "Smile" },
  ]
};

export const beethovenLifeAspects20: BuffettLifeAspects = {
  summary: "Rising star in Vienna, studying and stunning audiences",
  aspects: [
    { name: "Talent", value: 90, icon: "Music" },
    { name: "Discipline", value: 85, icon: "Target" },
    { name: "Emotion", value: 80, icon: "Heart" },
    { name: "Freedom", value: 60, icon: "Bird" },
    { name: "Joy", value: 70, icon: "Smile" },
  ]
};

export const beethovenLifeAspects30: BuffettLifeAspects = {
  summary: "Genius confronting deafness, creating revolutionary works",
  aspects: [
    { name: "Talent", value: 98, icon: "Music" },
    { name: "Discipline", value: 92, icon: "Target" },
    { name: "Emotion", value: 95, icon: "Heart" },
    { name: "Freedom", value: 70, icon: "Bird" },
    { name: "Joy", value: 55, icon: "Smile" },
  ]
};

export const getBeethovenSkills = (age: 10 | 20 | 30): UserCustomSkill[] => {
  switch (age) {
    case 10: return beethovenAge10;
    case 20: return beethovenAge20;
    case 30: return beethovenAge30;
    default: return beethovenAge30;
  }
};

export const getBeethovenLifeAspects = (age: 10 | 20 | 30): BuffettLifeAspects => {
  switch (age) {
    case 10: return beethovenLifeAspects10;
    case 20: return beethovenLifeAspects20;
    case 30: return beethovenLifeAspects30;
    default: return beethovenLifeAspects30;
  }
};

// Beethoven Courses
export const beethovenCourses10: Course[] = [
  { id: 1, name: "Piano Fundamentals", description: "Basic keyboard technique under father Johann", icon: "Piano", instructor: "Johann van Beethoven", progress: 100, status: "completed" },
  { id: 2, name: "Music Reading", description: "Learning to read sheet music", icon: "FileMusic", instructor: "Christian Gottlob Neefe", progress: 80, status: "in_progress" },
  { id: 3, name: "Organ Studies", description: "Church organ performance", icon: "Music", instructor: "Court Organist", progress: 60, status: "in_progress" },
];

export const beethovenCourses20: Course[] = [
  { id: 1, name: "Counterpoint & Harmony", description: "Advanced composition techniques", icon: "Layers", instructor: "Joseph Haydn", progress: 100, status: "completed" },
  { id: 2, name: "Italian Vocal Style", description: "Opera composition techniques", icon: "Mic", instructor: "Antonio Salieri", progress: 85, status: "completed" },
  { id: 3, name: "Advanced Piano", description: "Virtuoso performance techniques", icon: "Piano", instructor: "Self-taught", progress: 95, status: "completed" },
  { id: 4, name: "Orchestration", description: "Writing for full orchestra", icon: "Users", instructor: "Johann Albrechtsberger", progress: 70, status: "in_progress" },
];

export const beethovenCourses30: Course[] = [
  { id: 1, name: "Symphonic Form", description: "Large-scale orchestral composition", icon: "Music2", instructor: "Self-developed", progress: 100, status: "completed" },
  { id: 2, name: "String Quartet Writing", description: "Chamber music mastery", icon: "Users", instructor: "Self-taught", progress: 100, status: "completed" },
  { id: 3, name: "Piano Sonata Development", description: "Expanding sonata form boundaries", icon: "Piano", instructor: "Self-innovated", progress: 100, status: "completed" },
  { id: 4, name: "Hearing Preservation", description: "Treatments for hearing loss", icon: "Ear", instructor: "Dr. Schmidt", progress: 30, status: "in_progress" },
];

// Beethoven Roles
export const beethovenRoles10: Role[] = [
  { id: 1, title: "Student Musician", organization: "Beethoven Household", icon: "GraduationCap", period: "1775-1780", description: "Intensive musical training under father", current: true },
  { id: 2, title: "Church Organist Assistant", organization: "Bonn Court Chapel", icon: "Church", period: "1780", description: "Assisting with church services", current: true },
];

export const beethovenRoles20: Role[] = [
  { id: 1, title: "Court Musician", organization: "Elector of Cologne", icon: "Crown", period: "1784-1792", description: "Official court position in Bonn", current: false },
  { id: 2, title: "Piano Virtuoso", organization: "Vienna Salons", icon: "Piano", period: "1792-present", description: "Performing for aristocracy", current: true },
  { id: 3, title: "Composition Student", organization: "Vienna Masters", icon: "GraduationCap", period: "1792-1795", description: "Studying with Haydn and others", current: true },
];

export const beethovenRoles30: Role[] = [
  { id: 1, title: "Freelance Composer", organization: "Independent", icon: "PenTool", period: "1795-present", description: "Composing on commission and publishing", current: true },
  { id: 2, title: "Piano Virtuoso", organization: "European Concert Halls", icon: "Piano", period: "1795-present", description: "Public and private performances", current: true },
  { id: 3, title: "Music Teacher", organization: "Viennese Nobility", icon: "GraduationCap", period: "1794-present", description: "Teaching aristocratic students", current: true },
];

// Beethoven Projects
export const beethovenProjects10: Project[] = [
  { id: 1, name: "First Compositions", description: "Early keyboard pieces (now lost)", icon: "FileMusic", status: "completed", year: "1780" },
  { id: 2, name: "Public Performance Debut", description: "First public appearance as performer", icon: "Star", status: "completed", year: "1778" },
];

export const beethovenProjects20: Project[] = [
  { id: 1, name: "Piano Trios Op. 1", description: "First published major works", icon: "Music", status: "completed", year: "1795" },
  { id: 2, name: "Piano Sonatas Op. 2", description: "Three sonatas dedicated to Haydn", icon: "Piano", status: "completed", year: "1795" },
  { id: 3, name: "First Piano Concerto", description: "Concerto No. 1 in C major", icon: "Sparkles", status: "in_progress", year: "1795" },
];

export const beethovenProjects30: Project[] = [
  { id: 1, name: "Symphony No. 1", description: "First symphony premiered 1800", icon: "Music2", status: "completed", year: "1800" },
  { id: 2, name: "Moonlight Sonata", description: "Piano Sonata No. 14 in C-sharp minor", icon: "Moon", status: "completed", year: "1801" },
  { id: 3, name: "Symphony No. 3 'Eroica'", description: "Revolutionary heroic symphony", icon: "Flame", status: "in_progress", year: "1803" },
  { id: 4, name: "String Quartets Op. 18", description: "Six quartets establishing mastery", icon: "Users", status: "completed", year: "1800" },
  { id: 5, name: "Heiligenstadt Testament", description: "Personal document about deafness crisis", icon: "FileText", status: "completed", year: "1802" },
];

// Beethoven Certificates
export const beethovenCertificates10: Certificate[] = [
  { id: 1, name: "Court Musician Apprentice", issuer: "Electoral Court of Bonn", icon: "Award", year: "1780", description: "Recognition as young musical talent" },
];

export const beethovenCertificates20: Certificate[] = [
  { id: 1, name: "Court Organist Certificate", issuer: "Electoral Court of Bonn", icon: "Award", year: "1784", description: "Official appointment as assistant organist" },
  { id: 2, name: "Letter of Introduction", issuer: "Count Waldstein", icon: "ScrollText", year: "1792", description: "Recommendation to study in Vienna" },
  { id: 3, name: "Patron Recognition", issuer: "Prince Lichnowsky", icon: "Crown", year: "1794", description: "Acceptance as resident composer" },
];

export const beethovenCertificates30: Certificate[] = [
  { id: 1, name: "Imperial Recognition", issuer: "Viennese Aristocracy", icon: "Crown", year: "1800", description: "Recognized as leading composer" },
  { id: 2, name: "Publication Rights", issuer: "Breitkopf & Härtel", icon: "FileText", year: "1801", description: "Major publishing contract" },
  { id: 3, name: "Dedication Acceptance", issuer: "Prince Lobkowitz", icon: "Award", year: "1799", description: "String quartets Op. 18 dedication" },
  { id: 4, name: "Academy Concert Privilege", issuer: "Theater an der Wien", icon: "Theater", year: "1800", description: "Right to hold benefit concerts" },
];

export const getBeethovenCourses = (age: 10 | 20 | 30): Course[] => {
  switch (age) {
    case 10: return beethovenCourses10;
    case 20: return beethovenCourses20;
    case 30: return beethovenCourses30;
    default: return beethovenCourses30;
  }
};

export const getBeethovenRoles = (age: 10 | 20 | 30): Role[] => {
  switch (age) {
    case 10: return beethovenRoles10;
    case 20: return beethovenRoles20;
    case 30: return beethovenRoles30;
    default: return beethovenRoles30;
  }
};

export const getBeethovenProjects = (age: 10 | 20 | 30): Project[] => {
  switch (age) {
    case 10: return beethovenProjects10;
    case 20: return beethovenProjects20;
    case 30: return beethovenProjects30;
    default: return beethovenProjects30;
  }
};

export const getBeethovenCertificates = (age: 10 | 20 | 30): Certificate[] => {
  switch (age) {
    case 10: return beethovenCertificates10;
    case 20: return beethovenCertificates20;
    case 30: return beethovenCertificates30;
    default: return beethovenCertificates30;
  }
};
