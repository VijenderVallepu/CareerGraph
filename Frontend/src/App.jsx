import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [missingSkills, setMissingSkills] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------------
  // Fetch recommended jobs
  // ----------------------------------------

  useEffect(() => {
    fetch(`${API_URL}/api/career/jobs`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        return response.json();
      })
      .then((data) => {
        setJobs(data.jobs || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to connect to CareerGraph API");
        setLoading(false);
      });
  }, []);

  // ----------------------------------------
  // Fetch companies
  // ----------------------------------------

  useEffect(() => {
    fetch(`${API_URL}/api/career/companies`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        return response.json();
      })
      .then((data) => {
        setCompanies(data.companies || []);
        setCompaniesLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setCompaniesLoading(false);
      });
  }, []);

  // ----------------------------------------
  // Career path
  // ----------------------------------------

  const handleViewCareerPath = async (jobTitle) => {
    setSelectedJob(jobTitle);
    setDetailsLoading(true);
    setJobDetails(null);
    setMissingSkills([]);
    setError("");

    try {
      const detailsResponse = await fetch(
        `${API_URL}/api/career/job/${encodeURIComponent(jobTitle)}`
      );

      if (!detailsResponse.ok) {
        throw new Error("Unable to get job details");
      }

      const detailsData = await detailsResponse.json();

      const missingResponse = await fetch(
        `${API_URL}/api/career/missing-skills/${encodeURIComponent(jobTitle)}`
      );

      if (!missingResponse.ok) {
        throw new Error("Unable to get missing skills");
      }

      const missingData = await missingResponse.json();

      setJobDetails(detailsData.job);
      setMissingSkills(missingData.missing_skills || []);
    } catch (error) {
      console.error(error);
      setError("Unable to load career path");
    } finally {
      setDetailsLoading(false);
    }
  };

  // ----------------------------------------
  // Calculate match percentage
  // ----------------------------------------

  const getMatchPercentage = (job) => {
    const totalSkills = 7;

    return Math.min(
      Math.round((job.matched_skills / totalSkills) * 100),
      100
    );
  };

  return (
    <div className="app">

      {/* ================= HEADER ================= */}

      <header className="header">
        <div className="header-inner">

          <div className="logo">
            <div className="logo-icon">CG</div>

            <div>
              <h1>CareerGraph</h1>
              <span>Career Intelligence Platform</span>
            </div>
          </div>

          <nav>
            <a href="#dashboard">Dashboard</a>
            <a href="#jobs">Jobs</a>
            <a href="#companies">Companies</a>
            <a href="#skills">Skills</a>
          </nav>

          <button className="profile-button">
            <span>V</span>
            Vijender
          </button>

        </div>
      </header>


      {/* ================= MAIN ================= */}

      <main id="dashboard" className="container">

        {/* HERO */}

        <section className="hero">

          <div className="hero-content">

            <span className="hero-badge">
              ✦ AI-Powered Career Recommendations
            </span>

            <h2>
              Find the career path
              <span> that's right for you.</span>
            </h2>

            <p>
              Discover jobs that match your skills and identify
              exactly what you need to learn to reach your career goals.
            </p>

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Search jobs, skills or companies..."
              />

              <button>
                Search
              </button>
            </div>

          </div>

          <div className="hero-visual">

            <div className="graph-circle">
              <div className="graph-node node-one">Java</div>
              <div className="graph-node node-two">SQL</div>
              <div className="graph-node node-three">Python</div>
              <div className="graph-node node-four">Git</div>

              <div className="graph-center">
                <strong>Career</strong>
                <span>Graph</span>
              </div>
            </div>

          </div>

        </section>


        {/* ================= STATS ================= */}

        <section className="stats-section">

          <div className="stat-card">
            <div className="stat-icon blue">💼</div>
            <div>
              <strong>{jobs.length}</strong>
              <span>Recommended Jobs</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">⚡</div>
            <div>
              <strong>7</strong>
              <span>Your Skills</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">🏢</div>
            <div>
              <strong>{companies.length}</strong>
              <span>Companies</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">🎯</div>
            <div>
              <strong>
                {jobs.length > 0
                  ? `${Math.max(
                      ...jobs.map(getMatchPercentage)
                    )}%`
                  : "0%"}
              </strong>

              <span>Best Match</span>
            </div>
          </div>

        </section>


        {/* ================= SKILLS ================= */}

        <section id="skills" className="section">

          <div className="section-header">

            <div>
              <span className="section-label">
                YOUR PROFILE
              </span>

              <h2>Your Skills</h2>

              <p>
                Skills currently used to generate your recommendations.
              </p>
            </div>

            <button className="secondary-button">
              + Add Skill
            </button>

          </div>

          <div className="skills-container">

            {[
              "Java",
              "Python",
              "SQL",
              "JavaScript",
              "HTML",
              "CSS",
              "Git",
            ].map((skill) => (
              <div className="skill-chip" key={skill}>
                <span className="skill-check">✓</span>
                {skill}
              </div>
            ))}

          </div>

        </section>


        {/* ================= JOBS ================= */}

        <section id="jobs" className="section">

          <div className="section-header">

            <div>
              <span className="section-label">
                OPPORTUNITIES
              </span>

              <h2>Recommended Jobs</h2>

              <p>
                Jobs selected based on your current skill profile.
              </p>
            </div>

            <button className="secondary-button">
              View All →
            </button>

          </div>


          {loading && (
            <div className="loading-grid">

              {[1, 2, 3].map((item) => (
                <div className="skeleton-card" key={item}>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
              ))}

            </div>
          )}


          {error && (
            <div className="error-box">
              <strong>⚠ Unable to load recommendations</strong>
              <p>{error}</p>
            </div>
          )}


          {!loading && !error && jobs.length === 0 && (
            <div className="empty-box">
              No matching jobs found.
            </div>
          )}


          {!loading && !error && (
            <div className="jobs-grid">

              {jobs.map((job, index) => {

                const matchPercentage =
                  getMatchPercentage(job);

                return (
                  <article
                    className="job-card"
                    key={index}
                  >

                    <div className="job-top">

                      <div className="job-icon">
                        {job.job
                          .split(" ")
                          .map((word) => word[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div className="match-badge">
                        {matchPercentage}% Match
                      </div>

                    </div>


                    <h3>{job.job}</h3>

                    <p className="job-description">
                      A career opportunity matching
                      your current technical skills.
                    </p>


                    <div className="match-progress">

                      <div className="progress-header">
                        <span>Skill Match</span>
                        <strong>
                          {job.matched_skills} skills
                        </strong>
                      </div>

                      <div className="progress-bar">
                        <div
                          style={{
                            width: `${matchPercentage}%`,
                          }}
                        ></div>
                      </div>

                    </div>


                    <div className="card-divider"></div>


                    <p className="card-label">
                      Matching Skills
                    </p>

                    <div className="job-skills">

                      {job.skills.map((skill) => (
                        <span key={skill}>
                          {skill}
                        </span>
                      ))}

                    </div>


                    <button
                      className="career-button"
                      onClick={() =>
                        handleViewCareerPath(job.job)
                      }
                    >
                      View Career Path
                      <span>→</span>
                    </button>

                  </article>
                );
              })}

            </div>
          )}

        </section>


        {/* ================= COMPANIES ================= */}

        <section
          id="companies"
          className="section companies-section"
        >

          <div className="section-header">

            <div>
              <span className="section-label">
                CAREER NETWORK
              </span>

              <h2>Companies & Locations</h2>

              <p>
                Explore companies connected to your career opportunities.
              </p>
            </div>

          </div>


          {companiesLoading ? (

            <div className="loading-message">
              Loading companies...
            </div>

          ) : companies.length === 0 ? (

            <div className="empty-box">
              No company recommendations found.
            </div>

          ) : (

            <div className="companies-grid">

              {companies.map((company, index) => (

                <div
                  className="company-card"
                  key={index}
                >

                  <div className="company-icon">
                    🏢
                  </div>

                  <div className="company-content">

                    <div className="company-title-row">

                      <h3>
                        {company.company}
                      </h3>

                      <span className="company-arrow">
                        →
                      </span>

                    </div>

                    <p className="company-job">
                      {company.job}
                    </p>

                    <p className="company-location">
                      📍 {company.location}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* ================= CAREER PATH ================= */}

        {selectedJob && (

          <section className="career-section">

            <div className="section-header">

              <div>
                <span className="section-label">
                  CAREER ANALYSIS
                </span>

                <h2>Your Career Path</h2>

                <p>
                  Personalized analysis for {selectedJob}.
                </p>
              </div>

            </div>


            {detailsLoading && (
              <div className="career-loading">
                Loading career analysis...
              </div>
            )}


            {!detailsLoading && jobDetails && (

              <div className="career-card">

                <div className="career-header">

                  <div>

                    <span className="target-label">
                      TARGET CAREER
                    </span>

                    <h3>
                      {jobDetails.job}
                    </h3>

                  </div>

                  <div className="target-icon">
                    🎯
                  </div>

                </div>


                <div className="career-info">

                  <div>
                    <span>Experience</span>
                    <strong>
                      {jobDetails.experience}
                    </strong>
                  </div>

                  <div>
                    <span>Job Type</span>
                    <strong>
                      {jobDetails.type}
                    </strong>
                  </div>

                </div>


                <div className="path-block">

                  <h4>Required Skills</h4>

                  <div className="required-skills">

                    {jobDetails.required_skills.map(
                      (skill) => (
                        <span key={skill}>
                          ✓ {skill}
                        </span>
                      )
                    )}

                  </div>

                </div>


                <div className="path-block">

                  <h4>
                    Skills You Need To Learn
                  </h4>

                  {missingSkills.length > 0 ? (

                    <div className="missing-skills">

                      {missingSkills.map(
                        (skill) => (
                          <div key={skill}>
                            <span>→</span>
                            {skill}
                          </div>
                        )
                      )}

                    </div>

                  ) : (

                    <div className="success-message">
                      🎉 You already have all
                      required skills!
                    </div>

                  )}

                </div>


                <div className="career-flow">

                  <div>
                    <span>01</span>
                    Your Skills
                  </div>

                  <strong>→</strong>

                  <div>
                    <span>02</span>
                    Skill Gap
                  </div>

                  <strong>→</strong>

                  <div>
                    <span>03</span>
                    Target Job
                  </div>

                  <strong>→</strong>

                  <div>
                    <span>04</span>
                    Career
                  </div>

                </div>

              </div>

            )}

          </section>

        )}

      </main>


      {/* ================= FOOTER ================= */}

      <footer className="footer">

        <div>
          <strong>CareerGraph</strong>
          <span>
            Graph-Based Career Recommendation System
          </span>
        </div>

        <p>
          Built with React • FastAPI • Neo4j
        </p>

      </footer>

    </div>
  );
}

export default App;