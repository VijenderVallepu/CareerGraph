import os

from dotenv import load_dotenv
from neo4j import GraphDatabase


# --------------------------------------------------
# Load environment variables
# --------------------------------------------------

load_dotenv(dotenv_path="../backend/.env")

URI = os.getenv("COGNODB_URI")
USERNAME = os.getenv("COGNODB_USERNAME")
PASSWORD = os.getenv("COGNODB_PASSWORD")


# --------------------------------------------------
# Create database driver
# --------------------------------------------------

driver = GraphDatabase.driver(
    URI,
    auth=(USERNAME, PASSWORD)
)


# --------------------------------------------------
# Clear existing database
# --------------------------------------------------

def clear_database(tx):

    query = """
    MATCH (n)
    DETACH DELETE n
    """

    tx.run(query).consume()


# --------------------------------------------------
# Create nodes
# --------------------------------------------------

def create_nodes(tx):

    query = """
    CREATE
        (hyderabad:City {name: "Hyderabad"}),
        (bangalore:City {name: "Bangalore"}),
        (chennai:City {name: "Chennai"}),
        (pune:City {name: "Pune"}),

        (java:Skill {name: "Java", category: "Programming"}),
        (python:Skill {name: "Python", category: "Programming"}),
        (sql:Skill {name: "SQL", category: "Database"}),
        (spring:Skill {name: "Spring Boot", category: "Backend"}),
        (javascript:Skill {name: "JavaScript", category: "Programming"}),
        (react:Skill {name: "React", category: "Frontend"}),
        (html:Skill {name: "HTML", category: "Frontend"}),
        (css:Skill {name: "CSS", category: "Frontend"}),
        (docker:Skill {name: "Docker", category: "DevOps"}),
        (aws:Skill {name: "AWS", category: "Cloud"}),
        (git:Skill {name: "Git", category: "Tools"}),
        (linux:Skill {name: "Linux", category: "Operating System"}),

        (javaDev:Job {
            title: "Java Developer",
            experience: "Fresher",
            type: "Full Time"
        }),

        (pythonDev:Job {
            title: "Python Developer",
            experience: "Fresher",
            type: "Full Time"
        }),

        (backendDev:Job {
            title: "Backend Developer",
            experience: "0-2 years",
            type: "Full Time"
        }),

        (frontendDev:Job {
            title: "Frontend Developer",
            experience: "Fresher",
            type: "Full Time"
        }),

        (softwareEngineer:Job {
            title: "Software Engineer",
            experience: "0-2 years",
            type: "Full Time"
        }),

        (devopsEngineer:Job {
            title: "DevOps Engineer",
            experience: "1-2 years",
            type: "Full Time"
        }),

        (techNova:Company {
            name: "TechNova",
            industry: "Software"
        }),

        (cloudWorks:Company {
            name: "CloudWorks",
            industry: "Cloud Technology"
        }),

        (dataSphere:Company {
            name: "DataSphere",
            industry: "Data Technology"
        }),

        (codeLabs:Company {
            name: "CodeLabs",
            industry: "Software"
        }),

        (innovateX:Company {
            name: "InnovateX",
            industry: "Technology"
        }),

        (user:User {
            name: "Vijender"
        })
    """

    tx.run(query).consume()


# --------------------------------------------------
# Create relationships
# --------------------------------------------------

def create_relationships(tx):

    query = """
    MATCH
        (user:User),
        (java:Skill {name: "Java"}),
        (python:Skill {name: "Python"}),
        (sql:Skill {name: "SQL"}),
        (spring:Skill {name: "Spring Boot"}),
        (javascript:Skill {name: "JavaScript"}),
        (react:Skill {name: "React"}),
        (html:Skill {name: "HTML"}),
        (css:Skill {name: "CSS"}),
        (docker:Skill {name: "Docker"}),
        (aws:Skill {name: "AWS"}),
        (git:Skill {name: "Git"}),
        (linux:Skill {name: "Linux"}),
        (javaDev:Job {title: "Java Developer"}),
        (pythonDev:Job {title: "Python Developer"}),
        (backendDev:Job {title: "Backend Developer"}),
        (frontendDev:Job {title: "Frontend Developer"}),
        (softwareEngineer:Job {title: "Software Engineer"}),
        (devopsEngineer:Job {title: "DevOps Engineer"}),
        (techNova:Company {name: "TechNova"}),
        (cloudWorks:Company {name: "CloudWorks"}),
        (dataSphere:Company {name: "DataSphere"}),
        (codeLabs:Company {name: "CodeLabs"}),
        (innovateX:Company {name: "InnovateX"}),
        (hyderabad:City {name: "Hyderabad"}),
        (bangalore:City {name: "Bangalore"}),
        (chennai:City {name: "Chennai"})

    CREATE
        (user)-[:HAS_SKILL]->(java),
        (user)-[:HAS_SKILL]->(python),
        (user)-[:HAS_SKILL]->(sql),
        (user)-[:HAS_SKILL]->(javascript),
        (user)-[:HAS_SKILL]->(html),
        (user)-[:HAS_SKILL]->(css),
        (user)-[:HAS_SKILL]->(git),

        (javaDev)-[:REQUIRES]->(java),
        (javaDev)-[:REQUIRES]->(sql),
        (javaDev)-[:REQUIRES]->(spring),
        (javaDev)-[:REQUIRES]->(git),

        (pythonDev)-[:REQUIRES]->(python),
        (pythonDev)-[:REQUIRES]->(sql),
        (pythonDev)-[:REQUIRES]->(git),

        (backendDev)-[:REQUIRES]->(java),
        (backendDev)-[:REQUIRES]->(python),
        (backendDev)-[:REQUIRES]->(sql),
        (backendDev)-[:REQUIRES]->(docker),

        (frontendDev)-[:REQUIRES]->(javascript),
        (frontendDev)-[:REQUIRES]->(react),
        (frontendDev)-[:REQUIRES]->(html),
        (frontendDev)-[:REQUIRES]->(css),

        (softwareEngineer)-[:REQUIRES]->(java),
        (softwareEngineer)-[:REQUIRES]->(python),
        (softwareEngineer)-[:REQUIRES]->(sql),
        (softwareEngineer)-[:REQUIRES]->(git),

        (devopsEngineer)-[:REQUIRES]->(docker),
        (devopsEngineer)-[:REQUIRES]->(aws),
        (devopsEngineer)-[:REQUIRES]->(linux),

        (techNova)-[:OFFERS]->(javaDev),
        (techNova)-[:OFFERS]->(softwareEngineer),

        (cloudWorks)-[:OFFERS]->(devopsEngineer),
        (cloudWorks)-[:OFFERS]->(backendDev),

        (dataSphere)-[:OFFERS]->(pythonDev),

        (codeLabs)-[:OFFERS]->(frontendDev),
        (codeLabs)-[:OFFERS]->(backendDev),

        (innovateX)-[:OFFERS]->(javaDev),

        (techNova)-[:LOCATED_IN]->(hyderabad),
        (cloudWorks)-[:LOCATED_IN]->(bangalore),
        (dataSphere)-[:LOCATED_IN]->(hyderabad),
        (codeLabs)-[:LOCATED_IN]->(chennai),
        (innovateX)-[:LOCATED_IN]->(hyderabad),

        (java)-[:RELATED_TO]->(spring),
        (java)-[:RELATED_TO]->(python),
        (python)-[:RELATED_TO]->(sql),
        (javascript)-[:RELATED_TO]->(react),
        (html)-[:RELATED_TO]->(css),
        (docker)-[:RELATED_TO]->(linux),
        (docker)-[:RELATED_TO]->(aws)
    """

    tx.run(query).consume()


# --------------------------------------------------
# Main
# --------------------------------------------------

try:

    # Verify connection
    driver.verify_connectivity()

    print("Connected to CognoDB")

    # Clear old data
    with driver.session() as session:
        session.execute_write(clear_database)

    print("Old data cleared")

    # Create nodes
    with driver.session() as session:
        session.execute_write(create_nodes)

    print("Nodes created")

    # Create relationships
    with driver.session() as session:
        session.execute_write(create_relationships)

    print("Relationships created")

    # Verify nodes
    with driver.session() as session:

        result = session.run(
            "MATCH (n) RETURN count(n) AS count"
        )

        node_count = result.single()["count"]

    # Verify relationships
    with driver.session() as session:

        result = session.run(
            "MATCH ()-[r]->() RETURN count(r) AS count"
        )

        relationship_count = result.single()["count"]

    print()
    print("===================================")
    print("DATABASE SEEDING COMPLETE")
    print("===================================")
    print("Total nodes:", node_count)
    print("Total relationships:", relationship_count)
    print("===================================")


finally:

    driver.close()