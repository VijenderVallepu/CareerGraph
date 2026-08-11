from fastapi import APIRouter, HTTPException

from database import get_driver
from queries import (
    GET_MATCHING_JOBS,
    GET_JOB_DETAILS,
    GET_MISSING_SKILLS,
    GET_COMPANY_RECOMMENDATIONS
)


router = APIRouter(
    prefix="/api/career",
    tags=["Career"]
)


@router.get("/jobs")
def get_matching_jobs(user_name: str = "Vijender"):

    try:
        driver = get_driver()

        with driver.session() as session:

            result = session.run(
                GET_MATCHING_JOBS,
                user_name=user_name
            )

            jobs = [record.data() for record in result]

        return {
            "success": True,
            "jobs": jobs
        }

    except Exception as e:

        raise HTTPException(
            status_code=503,
            detail="Unable to connect to CareerGraph database"
        )


@router.get("/job/{job_title}")
def get_job_details(job_title: str):

    try:

        driver = get_driver()

        with driver.session() as session:

            result = session.run(
                GET_JOB_DETAILS,
                job_title=job_title
            )

            record = result.single()

            if not record:
                raise HTTPException(
                    status_code=404,
                    detail="Job not found"
                )

            return {
                "success": True,
                "job": record.data()
            }

    except HTTPException:
        raise

    except Exception:

        raise HTTPException(
            status_code=503,
            detail="Unable to connect to CareerGraph database"
        )


@router.get("/missing-skills/{job_title}")
def get_missing_skills(
    job_title: str,
    user_name: str = "Vijender"
):

    try:

        driver = get_driver()

        with driver.session() as session:

            result = session.run(
                GET_MISSING_SKILLS,
                job_title=job_title,
                user_name=user_name
            )

            skills = [
                record["missing_skill"]
                for record in result
            ]

        return {
            "success": True,
            "job": job_title,
            "missing_skills": skills
        }

    except Exception:

        raise HTTPException(
            status_code=503,
            detail="Unable to connect to CareerGraph database"
        )


@router.get("/companies")
def get_company_recommendations():

    try:
        driver = get_driver()

        with driver.session() as session:

            result = session.run(
                GET_COMPANY_RECOMMENDATIONS
            )

            companies = [
                record.data()
                for record in result
            ]

        return {
            "success": True,
            "companies": companies
        }

    except Exception as e:

        print("Company recommendation error:", e)

        raise HTTPException(
            status_code=503,
            detail="Unable to retrieve company recommendations"
        )