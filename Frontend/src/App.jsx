import { useEffect, useState } from "react";
import "./App.css";

function App() {
  // ----------------------------------------
  // State
  // ----------------------------------------

  const [jobs, setJobs] = useState([]);

  const [selectedJob, setSelectedJob] = useState(null);
  const [jobDetails, setJobDetails] = useState(null);
  const [missingSkills, setMissingSkills] = useState([]);

  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [error, setError] = useState("");

  const API_URL = "http://localhost:8000";


  // ----------------------------------------
  // Get recommended jobs
  // ----------------------------------------

  useEffect(() => {
    console.log("Fetching recommended jobs...");

    fetch(`${API_URL}/api/career/jobs`)
      .then((response) => {
        console.log("Jobs response:", response.status);

        if (!response.ok) {
          throw new Error("Failed to fetch jobs");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Jobs data:", data);

        setJobs(data.jobs || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Jobs API error:", error);

        setError("Unable to connect to CareerGraph API");
        setLoading(false);
      });
  }, []);


  // ----------------------------------------
  // Get companies and locations
  // ----------------------------------------

  useEffect(() => {
    console.log("Fetching companies...");

    fetch(`${API_URL}/api/career/companies`)
      .then((response) => {
        console.log(
          "Companies response status:",
          response.status
        );

        if (!response.ok) {
          throw new Error("Failed to fetch companies");
        }

        return response.json();
      })
      .then((data) => {
        console.log("Companies data:", data);

        setCompanies(data.companies || []);
        setCompaniesLoading(false);
      })
      .catch((error) => {
        console.error("Companies API error:", error);

        setCompaniesLoading(false);
      });
  }, []);


  // ----------------------------------------
  // Get career path
  // ----------------------------------------

  const handleViewCareerPath = async (jobTitle) => {
    setSelectedJob(jobTitle);

    setDetailsLoading(true);

    setJobDetails(null);

    setMissingSkills([]);

    try {
      // ------------------------------------
      // Get job details
      // ------------------------------------

      const detailsResponse = await fetch(
        `${API_URL}/api/career/job/${encodeURIComponent(
          jobTitle
        )}`
      );

      if (!detailsResponse.ok) {
        throw new Error("Unable to get job details");
      }

      const detailsData = await detailsResponse.json();


      // ------------------------------------
      // Get missing skills
      // ------------------------------------

      const missingResponse = await fetch(
        `${API_URL}/api/career/missing-skills/${encodeURIComponent(
          jobTitle
        )}`
      );

      if (!missingResponse.ok) {
        throw new Error("Unable to get missing skills");
      }

      const missingData = await missingResponse.json();


      // ------------------------------------
      // Update state
      // ------------------------------------

      setJobDetails(detailsData.job);

      setMissingSkills(
        missingData.missing_skills || []
      );

    } catch (error) {
      console.error("Career path error:", error);

      setError("Unable to load career path");

    } finally {
      setDetailsLoading(false);
    }
  };


  // ----------------------------------------
  // UI
  // ----------------------------------------

  return (
    <div className="app">

      {/* ---------------------------------- */}
      {/* HEADER */}
      {/* ---------------------------------- */}

      <header className="header">

        <h1>CareerGraph</h1>

        <p>
          Graph-Based Career Recommendation System
        </p>

      </header>


      <main className="container">

        {/* -------------------------------- */}
        {/* HERO */}
        {/* -------------------------------- */}

        <section className="hero">

          <h2>
            Find Your Best Career Opportunities
          </h2>

          <p>
            Discover jobs based on the skills
            you already have.
          </p>

        </section>


        {/* -------------------------------- */}
        {/* YOUR SKILLS */}
        {/* -------------------------------- */}

        <section className="skills-section">

          <h2>Your Skills</h2>

          <div className="skills">

            <span>Java</span>

            <span>Python</span>

            <span>SQL</span>

            <span>JavaScript</span>

            <span>HTML</span>

            <span>CSS</span>

            <span>Git</span>

          </div>

        </section>


        {/* -------------------------------- */}
        {/* RECOMMENDED JOBS */}
        {/* -------------------------------- */}

        <section className="jobs-section">

          <h2>Recommended Jobs</h2>


          {/* Loading */}

          {loading && (
            <div className="message">
              Loading career recommendations...
            </div>
          )}


          {/* Error */}

          {error && (
            <div className="error">
              {error}
            </div>
          )}


          {/* No jobs */}

          {!loading &&
            !error &&
            jobs.length === 0 && (

              <div className="message">
                No matching jobs found.
              </div>

            )}


          {/* Jobs */}

          <div className="jobs-grid">

            {jobs.map((job, index) => (

              <div
                className="job-card"
                key={index}
              >

                <div className="job-header">

                  <h3>
                    {job.job}
                  </h3>

                  <span className="match">

                    {job.matched_skills}

                    {" "}

                    skills matched

                  </span>

                </div>


                <p className="label">
                  Matching Skills
                </p>


                <div className="skill-list">

                  {job.skills &&
                    job.skills.map((skill) => (

                      <span key={skill}>
                        {skill}
                      </span>

                    ))}

                </div>


                <button
                  onClick={() =>
                    handleViewCareerPath(
                      job.job
                    )
                  }
                >

                  View Career Path →

                </button>

              </div>

            ))}

          </div>

        </section>


       {/* -------------------------------- */}
{/* COMPANIES & LOCATIONS */}
{/* -------------------------------- */}

<section className="companies-section">

  <h2>Companies & Locations</h2>

  <p className="section-description">
    Explore companies offering jobs in your career graph.
  </p>

  {companiesLoading && (
    <div className="message">
      Loading companies...
    </div>
  )}

  {!companiesLoading &&
    companies.length === 0 && (
      <div className="message">
        No company recommendations found.
      </div>
    )}

  {!companiesLoading &&
    companies.length > 0 && (

      <div className="companies-grid">

        {Object.entries(
          companies.reduce((grouped, item) => {

            if (!grouped[item.company]) {
              grouped[item.company] = {
                location: item.location,
                jobs: []
              };
            }

            grouped[item.company].jobs.push(
              item.job
            );

            return grouped;

          }, {})
        ).map(([companyName, companyData]) => (

          <div
            className="company-card"
            key={companyName}
          >

            <div className="company-icon">
              🏢
            </div>

            <div>

              <h3>
                {companyName}
              </h3>

              <p className="company-location">
                📍 {companyData.location}
              </p>

              <p className="label">
                Available Jobs
              </p>

              <div className="company-jobs">

                {companyData.jobs.map(
                  (job, index) => (

                    <span
                      key={`${job}-${index}`}
                    >
                      {job}
                    </span>

                  )
                )}

              </div>

            </div>

          </div>

        ))}

      </div>

    )}

</section>

        {/* -------------------------------- */}
        {/* CAREER PATH */}
        {/* -------------------------------- */}

        {selectedJob && (

          <section className="career-path">

            <h2>
              Career Path
            </h2>


            {/* Loading */}

            {detailsLoading && (

              <div className="message">

                Loading career path...

              </div>

            )}


            {/* Career details */}

            {!detailsLoading &&
              jobDetails && (

                <div className="career-card">

                  <h3>
                    {jobDetails.job}
                  </h3>


                  {/* Job info */}

                  <div className="job-info">

                    <div>

                      <strong>
                        Experience
                      </strong>

                      <p>
                        {jobDetails.experience}
                      </p>

                    </div>


                    <div>

                      <strong>
                        Job Type
                      </strong>

                      <p>
                        {jobDetails.type}
                      </p>

                    </div>

                  </div>


                  {/* Required skills */}

                  <div className="path-section">

                    <h4>
                      Required Skills
                    </h4>


                    <div className="skill-list">

                      {jobDetails.required_skills &&
                        jobDetails.required_skills.map(
                          (skill) => (

                            <span key={skill}>
                              {skill}
                            </span>

                          )
                        )}

                    </div>

                  </div>


                  {/* Missing skills */}

                  <div className="path-section">

                    <h4>
                      Skills to Learn
                    </h4>


                    {missingSkills.length > 0 ? (

                      <div className="missing-skills">

                        {missingSkills.map(
                          (skill) => (

                            <span key={skill}>

                              → {skill}

                            </span>

                          )
                        )}

                      </div>

                    ) : (

                      <p className="success-text">

                        🎉 You already have all
                        required skills!

                      </p>

                    )}

                  </div>

                </div>

              )}

          </section>

        )}

      </main>

    </div>
  );
}

export default App;