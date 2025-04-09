import { db } from "../db";
import { qaDatabase } from "@shared/schema";

// Career-related questions and answers
const questionsAndAnswers = [
  {
    question: "How do I choose the right career path?",
    answer: "Choosing the right career path involves identifying your interests, strengths, and long-term goals. Start by assessing your skills, values, and passions. Research various fields that align with these factors. Consider job shadowing, internships, or informational interviews to get first-hand experience. Seek guidance from career counselors and professionals in fields you're interested in. Remember that career paths can evolve, so focus on finding a direction that excites you now while remaining open to future opportunities.",
    category: "career_planning"
  },
  {
    question: "What if I don't know what I want to do after graduation?",
    answer: "It's completely normal to be unsure about your career path after graduation. Consider taking a career assessment test to identify your strengths and interests. Explore internships or entry-level positions in different fields to gain experience and clarity. Network with professionals and attend career fairs. Temporary positions or volunteer work can provide valuable insights while building your skills. Remember that many successful professionals didn't have a clear plan immediately after graduation - your career is a journey that will evolve over time.",
    category: "career_planning"
  },
  {
    question: "Is it okay to switch career paths later?",
    answer: "Absolutely! Career changes are increasingly common and often lead to greater satisfaction and success. Many skills are transferable between industries, and diverse experience can be a significant asset. When changing careers, identify your transferable skills, understand what additional education or training you might need, and build a network in your new field. Create a thoughtful transition plan that may include part-time study, volunteering, or side projects while maintaining financial stability. Remember that your previous experience is valuable and offers unique perspectives in your new field.",
    category: "career_planning"
  },
  {
    question: "What are some top career options after a B.Tech in CSE?",
    answer: "After completing a B.Tech in Computer Science and Engineering (CSE), numerous career paths are available. You could become a Software Developer, Web Developer, Mobile App Developer, Database Administrator, or Systems Analyst. Emerging fields include Data Science, Machine Learning Engineering, AI Research, and Cloud Computing. Other options include Cybersecurity, DevOps Engineering, Quality Assurance, UI/UX Design, and Product Management. Entrepreneurship is also viable with a tech background. For those interested in further specialization, pursuing higher education in a specific field can open additional opportunities.",
    category: "tech_careers"
  },
  {
    question: "How important is competitive programming for tech jobs?",
    answer: "Competitive programming can be beneficial for tech jobs, but its importance varies by role and company. For positions at top tech companies or roles that require strong algorithmic thinking, competitive programming experience can be valuable as it demonstrates problem-solving abilities and code efficiency. However, many successful tech professionals haven't participated in competitive programming. For most industry roles, practical programming skills, project experience, collaboration abilities, and domain knowledge are equally or more important. Focus on building a well-rounded skill set that includes both algorithmic thinking and practical software development experience.",
    category: "tech_careers"
  },
  {
    question: "Do I need a master's degree to get a good job in tech?",
    answer: "A master's degree is not always necessary for a successful tech career. Many excellent opportunities are available with a bachelor's degree or even without a formal degree if you have strong skills and a solid portfolio. That said, a master's degree can be beneficial for specialization in fields like AI, machine learning, cybersecurity, or advanced computer science topics. It may also help with career advancement into research, specialized roles, or academic positions. Consider your specific career goals, the requirements in your target roles and companies, and the return on investment before deciding on further education.",
    category: "education"
  },
  {
    question: "What exams are required to study abroad?",
    answer: "To study abroad, you'll typically need to take standardized tests that demonstrate your academic abilities and language proficiency. For English language proficiency, common exams include TOEFL, IELTS, or the Duolingo English Test. For graduate programs in the US, the GRE is often required for most fields, while GMAT is specifically for business programs. Some countries have their own requirements: for instance, Germany may require TestDaF for German-language programs. Test requirements vary by country, university, and program, so research the specific requirements for your target institutions well in advance of application deadlines.",
    category: "education"
  },
  {
    question: "Which countries are best for tech careers?",
    answer: "Several countries offer excellent opportunities for tech careers. The United States, particularly Silicon Valley, remains a global tech hub with numerous opportunities and competitive salaries. Canada has a growing tech sector with favorable immigration policies for skilled workers. Germany, the UK, Australia, and Singapore also have robust tech ecosystems. Nordic countries like Sweden and Finland offer excellent work-life balance alongside innovation. India and China have rapidly expanding tech sectors with domestic opportunities. Consider factors like salary potential, cost of living, visa requirements, industry specializations, and quality of life when evaluating the best location for your tech career.",
    category: "international"
  },
  {
    question: "What skills should I focus on for a data science career?",
    answer: "For a successful data science career, focus on developing a mix of technical and soft skills. Technical skills should include programming languages (Python, R), statistics and mathematics, data manipulation, visualization tools (Tableau, Power BI), machine learning, SQL for database queries, and big data technologies. Equally important are soft skills like problem-solving, business acumen to translate data insights into business value, communication to explain complex findings to non-technical stakeholders, curiosity, and teamwork. Practical experience through projects, competitions, or internships is essential to apply these skills in real-world contexts.",
    category: "tech_careers"
  },
  {
    question: "How can I prepare for technical interviews?",
    answer: "Effective technical interview preparation requires a structured approach. First, strengthen your fundamental knowledge in computer science concepts, data structures, and algorithms. Practice coding problems regularly using platforms like LeetCode, HackerRank, or CodeSignal. Understand the specific technologies mentioned in the job description and be prepared to discuss past projects in detail. Practice system design questions for senior roles. Conduct mock interviews with peers or use services like Pramp for realistic practice. Research the company and prepare questions to ask your interviewers. Finally, practice explaining your thought process clearly - interviewers often value your approach as much as the final solution.",
    category: "job_search"
  },
  {
    question: "Should I take a gap year after college?",
    answer: "Taking a gap year after college can be beneficial if approached thoughtfully. It provides time for self-discovery, skill development, work experience, or travel that may clarify your career goals. However, planning is essential - establish clear objectives for this time and consider how you'll explain the gap to future employers. Use the year for meaningful activities like internships, volunteer work, learning new skills, freelancing, travel with purpose, or personal projects. A well-utilized gap year can make you more focused and bring unique perspectives to your future career, but ensure you maintain professional connections and have a plan for transitioning back to your career path afterward.",
    category: "career_planning"
  },
  {
    question: "How do I negotiate my first job offer?",
    answer: "When negotiating your first job offer, preparation is key. Research typical salaries for the role, location, and industry using resources like Glassdoor, PayScale, and industry reports. Consider the entire compensation package including benefits, work flexibility, professional development opportunities, and not just the base salary. Rehearse your negotiation conversation, starting with expressing enthusiasm for the role before discussing compensation. Be specific about your desired salary range based on your research. If the employer can't meet your salary requirements, consider negotiating other benefits like additional vacation time, flexible work arrangements, or an earlier performance review. Throughout the process, maintain professionalism and gratitude for the opportunity.",
    category: "job_search"
  }
];

async function seedQADatabase() {
  console.log("Starting to seed QA database...");
  
  try {
    // Check if we already have data to avoid duplicates
    const existingEntries = await db.select().from(qaDatabase);
    
    if (existingEntries.length > 0) {
      console.log(`Database already contains ${existingEntries.length} QA entries. Skipping seed.`);
      return;
    }
    
    // Insert all questions and answers
    await db.insert(qaDatabase).values(questionsAndAnswers);
    
    console.log(`Successfully added ${questionsAndAnswers.length} QA entries to the database.`);
  } catch (error) {
    console.error("Error seeding QA database:", error);
  }
}

// Export the function for use in server startup
export { seedQADatabase };