GET_MATCHING_JOBS = """
MATCH (u:User {name: $user_name})-[:HAS_SKILL]->(s:Skill)
MATCH (j:Job)-[:REQUIRES]->(s)
WITH j, count(s) AS matched_skills, collect(s.name) AS skills
RETURN
    j.title AS job,
    matched_skills,
    skills
ORDER BY matched_skills DESC
"""


GET_JOB_DETAILS = """
MATCH (j:Job {title: $job_title})-[:REQUIRES]->(skill:Skill)
RETURN
    j.title AS job,
    j.experience AS experience,
    j.type AS type,
    collect(skill.name) AS required_skills
"""


GET_MISSING_SKILLS = """
MATCH (j:Job {title: $job_title})-[:REQUIRES]->(required:Skill)
OPTIONAL MATCH (u:User {name: $user_name})-[:HAS_SKILL]->(owned:Skill)
WITH required, collect(owned.name) AS owned_skills
WHERE NOT required.name IN owned_skills
RETURN required.name AS missing_skill
"""


GET_COMPANY_RECOMMENDATIONS = """
MATCH (j:Job)<-[:OFFERS]-(c:Company)-[:LOCATED_IN]->(city:City)
RETURN
    j.title AS job,
    c.name AS company,
    city.name AS location
ORDER BY job
"""