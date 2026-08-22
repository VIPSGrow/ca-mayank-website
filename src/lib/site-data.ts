export const NAV_LINKS = [
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Resources" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export const PRIMARY_CTA = "GET MY FINANCIAL HEALTH AUDIT";

export const DEMO = {
  income: 180000,
  expenses: 135000,
  savings: 45000,
  investments: 20000,
  score: 72,
  leaks: 32600,
};

export const EXPENSE_BREAKDOWN = [
  { name: "Housing", value: 30 },
  { name: "Food", value: 18 },
  { name: "Lifestyle", value: 16 },
  { name: "EMIs", value: 14 },
  { name: "Transport", value: 12 },
  { name: "Others", value: 10 },
];

export const LEAKS = [
  { label: "Subscriptions", amount: 2400 },
  { label: "Dining", amount: 6800 },
  { label: "Lifestyle", amount: 9200 },
  { label: "Other recurring expenses", amount: 14200 },
];

export const SCORE_METRICS = [
  { label: "Savings Health", value: 78 },
  { label: "Expense Discipline", value: 65 },
  { label: "Debt Management", value: 82 },
  { label: "Investment Readiness", value: 69 },
  { label: "Goal Progress", value: 71 },
];

export const PROBLEMS = [
  {
    title: "Salary Comes In. Money Disappears.",
    body: "The balance moves every month, but the reason is never fully clear.",
  },
  {
    title: "No Clear View of Your Spending",
    body: "Transactions are spread across cards, apps, UPI and accounts.",
  },
  {
    title: "Saving Isn't Consistent",
    body: "Some months are strong. Others quietly undo the progress.",
  },
  {
    title: "Investments Feel Random",
    body: "Multiple products, no consolidated view, no stated purpose.",
  },
  {
    title: "Taxes May Be Higher Than Necessary",
    body: "Decisions get made in March instead of across the year.",
  },
  {
    title: "Financial Goals Keep Getting Delayed",
    body: "Intentions exist. A structured plan usually does not.",
  },
];

export const PROCESS = [
  {
    n: "01",
    title: "Discussion Call",
    body: "We start with a confidential conversation about your income, commitments, concerns and goals.",
  },
  { n: "02", title: "Data Processing", body: "We categorize and analyze financial transactions." },
  { n: "03", title: "Expert Review", body: "A CA reviews your financial position." },
  { n: "04", title: "Action Plan", body: "You receive a personalized plan." },
];

export const ANALYSIS = [
  { title: "Income Analysis", body: "Understand income stability and sources.", icon: "wallet" },
  { title: "Expense Analysis", body: "Understand spending behaviour.", icon: "receipt" },
  {
    title: "Money Leak Detection",
    body: "Identify unnecessary recurring expenses.",
    icon: "search",
  },
  {
    title: "Savings & Investments Review",
    body: "Evaluate whether your money is aligned with your goals.",
    icon: "piggy",
  },
  {
    title: "Tax Optimization",
    body: "Identify potential tax-saving opportunities.",
    icon: "percent",
  },
  {
    title: "Goal Tracking",
    body: "Track progress toward important financial goals.",
    icon: "goal",
  },
];

export const WHY_US = [
  {
    title: "Expert CA Perspective",
    body: "Financial analysis backed by professional expertise.",
  },
  {
    title: "Complete Financial Picture",
    body: "Income, expenses, savings, investments, taxes and goals.",
  },
  {
    title: "Human + Technology",
    body: "Technology organizes the data. Experts interpret it.",
  },
  {
    title: "Action Over Information",
    body: "You don't just receive a report. You receive a plan.",
  },
  {
    title: "Long-Term Accountability",
    body: "Ongoing support helps build financial discipline.",
  },
];

export const AUDIENCE = [
  "IT Professionals",
  "Managers",
  "Doctors",
  "Consultants",
  "Freelancers",
  "Finance Professionals",
];

export const INCOME_RANGES = [
  "₹8 – 15 LPA",
  "₹15 – 25 LPA",
  "₹25 – 50 LPA",
  "₹50 LPA – 1 Cr",
  "Above ₹1 Cr",
];

export const CONCERNS = [
  "I don't know where my money goes",
  "My savings are inconsistent",
  "My investments feel random",
  "I think I pay more tax than needed",
  "I have goals but no plan",
  "I want ongoing financial guidance",
];

export const TIME_SLOTS = [
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export const SITE = {
  name: "Mayank Gangwar & Company",
  email: "contact@camayankgangwar.com",
  phone: "+91 89389 74273",
  address: "Hathras, Uttar Pradesh, India 204101",
};
