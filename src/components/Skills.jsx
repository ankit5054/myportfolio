export default function Skills() {
  let skillsData = [
    {
      skill: "Backend Development",
      value: "Node.js, NestJS, Express, TypeScript, TypeORM, GraphQL, Redis",
    },
    { skill: "Database", value: "PostgreSQL" },
    {
      skill: "Cloud & DevOps",
      value: "AWS EC2, Aurora, SNS, Lambda, Redis, S3, CloudFront",
    },
    {
      skill: "CI/CD Pipelines",
      value: "Concourse, ArgoCD ",
    },
    {
      skill: "Frontend (Secondary)",
      value: "JavaScript, ReactJS, Redux Toolkit, TypeScript",
    },
    {
      skill: "Tools & Collaboration",
      value: "Jira,Bitbucket, Postman, Git, Dynatrace, Erwin",
    },
    {
      skill: "Testing",
      value: "Jest, React Testing Library",
    },
    {
      skill: "Core Strengths",
      value:
        "Query Optimization, Performance Tuning, Caching Strategies, API Design, System Architecture",
    },
  ];
  return (
    <div name="Skills" className="md:px-20 md:py-8 p-4 w-full">
      <h1 className="text-3xl border-b-4 border-gray-400 pt-10 inline text-white">
        Technical Skills
      </h1>
      <div className="pt-8 md:pl-4 md:text-xl text-gray-400">
        Bringing 4 years of hands-on experience in backend engineering, system
        architecture, and performance optimization — with a strong focus on
        building scalable, reliable, and maintainable solutions.
        <div className="space-y-1 p-2">
          {skillsData.map((i) => (
            <div>
              <b className="text-gray-200">{i.skill}: </b>
              {i.value}
            </div>
          ))}
        </div>
        <p className="mt-4">
          Currently working at Tata Consultancy Services, where I’ve deepened my
          expertise in system architecture, database design, API performance
          tuning, and cloud deployments. I’ve also contributed to building
          high-performance enterprise applications, reducing latency through
          query optimization, and implementing caching and CI/CD best practices.
          My journey has helped me grow into a developer who values
          collaboration, innovation, and engineering excellence, aiming to
          create impactful, production-ready software that scales with business
          needs.
        </p>
      </div>
    </div>
  );
}
