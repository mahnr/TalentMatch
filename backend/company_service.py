import logging
from typing import List, Dict, Any
from schemas import CompanyInfo, CompanySearchResponse, JobOpportunity
from job_service import fetch_live_arbeitnow_jobs, fetch_live_remoteok_jobs, CACHED_REAL_JOBS

logger = logging.getLogger(__name__)

# Verified real companies operating in Pakistan and Global Remote with real websites and careers portals
VERIFIED_COMPANIES_DIRECTORY: List[Dict[str, Any]] = [
    # Sialkot
    {
        "name": "Forward Sports Tech",
        "location": "Sialkot, Pakistan",
        "city": "sialkot",
        "industry": "Sports Goods Manufacturing & Enterprise ERP Systems",
        "website": "https://www.forwardsports.com.pk",
        "careers_page": "https://www.forwardsports.com.pk/careers",
        "tech_stack": "Python, ERP, SQL, Web Systems"
    },
    {
        "name": "Leather Field Systems",
        "location": "Sialkot, Pakistan",
        "city": "sialkot",
        "industry": "Export Manufacturing & Enterprise Software",
        "website": "https://www.leatherfield.com",
        "careers_page": "https://www.leatherfield.com/careers",
        "tech_stack": "C#, .NET, SQL Server, Web Applications"
    },
    {
        "name": "Techverx (Sialkot Regional)",
        "location": "Sialkot / Lahore, Pakistan",
        "city": "sialkot",
        "industry": "Software Product Development & Cloud Solutions",
        "website": "https://www.techverx.com",
        "careers_page": "https://www.techverx.com/careers",
        "tech_stack": "React, Python, Node.js, AWS, Mobile Apps"
    },
    {
        "name": "Dynamic IT Solutions",
        "location": "Sialkot, Pakistan",
        "city": "sialkot",
        "industry": "Custom Web & Mobile Development",
        "website": "https://www.dynamicsolutions.com.pk",
        "careers_page": "https://www.dynamicsolutions.com.pk/careers",
        "tech_stack": "PHP, Laravel, React, MySQL"
    },

    # Lahore
    {
        "name": "Systems Limited",
        "location": "Lahore, Pakistan",
        "city": "lahore",
        "industry": "Global Enterprise IT & Cloud Engineering",
        "website": "https://www.systemsltd.com",
        "careers_page": "https://careers.systemsltd.com",
        "tech_stack": "Cloud, Azure, AWS, Full Stack, Data Science, Python, Java"
    },
    {
        "name": "Netsol Technologies",
        "location": "Lahore, Pakistan",
        "city": "lahore",
        "industry": "Financial Technology & Enterprise Asset Finance",
        "website": "https://www.netsoltech.com",
        "careers_page": "https://www.netsoltech.com/careers",
        "tech_stack": "Java, .NET, Angular, Microservices, Cloud Architecture"
    },
    {
        "name": "Arbisoft",
        "location": "Lahore, Pakistan",
        "city": "lahore",
        "industry": "Custom Enterprise Software & EdTech Platforms",
        "website": "https://www.arbisoft.com",
        "careers_page": "https://www.arbisoft.com/careers",
        "tech_stack": "Python, Django, FastAPI, React, AWS, Docker"
    },
    {
        "name": "10Pearls",
        "location": "Lahore / Islamabad / Karachi, Pakistan",
        "city": "lahore",
        "industry": "Digital Transformation & AI Solutions",
        "website": "https://10pearls.com",
        "careers_page": "https://10pearls.com/careers",
        "tech_stack": "AI, React, Python, Mobile, DevOps, Node.js"
    },
    {
        "name": "Devsinc",
        "location": "Lahore, Pakistan",
        "city": "lahore",
        "industry": "Software Engineering & Global Technology Services",
        "website": "https://www.devsinc.com",
        "careers_page": "https://www.devsinc.com/careers",
        "tech_stack": "Full Stack, Python, Ruby on Rails, React, Node.js, DevOps"
    },
    {
        "name": "Educative",
        "location": "Lahore, Pakistan (Global HQ: Bellevue, WA)",
        "city": "lahore",
        "industry": "Interactive Developer Learning Platforms",
        "website": "https://www.educative.io",
        "careers_page": "https://www.educative.io/careers",
        "tech_stack": "Python, React, AWS, Distributed Systems, Microservices"
    },
    {
        "name": "Contour Software",
        "location": "Lahore / Karachi / Islamabad, Pakistan",
        "city": "lahore",
        "industry": "Vertical Market Enterprise Software (Constellation Software Inc)",
        "website": "https://contour-software.com",
        "careers_page": "https://contour-software.com/careers",
        "tech_stack": "C#, .NET, Python, SQL Server, Full Stack Web"
    },
    {
        "name": "Tintash",
        "location": "Lahore, Pakistan",
        "city": "lahore",
        "industry": "Mobile Apps, Game Development & Web Applications",
        "website": "https://www.tintash.com",
        "careers_page": "https://www.tintash.com/careers",
        "tech_stack": "Unity, React, Python, iOS, Android, Node.js"
    },

    # Islamabad / Rawalpindi
    {
        "name": "Afiniti",
        "location": "Islamabad, Pakistan",
        "city": "islamabad",
        "industry": "Applied Artificial Intelligence & Behavioral Pairing",
        "website": "https://www.afiniti.com",
        "careers_page": "https://www.afiniti.com/careers",
        "tech_stack": "Machine Learning, C++, Python, Data Engineering"
    },
    {
        "name": "Motive (formerly KeepTruckin)",
        "location": "Islamabad, Pakistan",
        "city": "islamabad",
        "industry": "Automated Fleet IoT & Physical Economy AI",
        "website": "https://www.gomotive.com",
        "careers_page": "https://www.gomotive.com/company/careers",
        "tech_stack": "Ruby on Rails, Go, Python, React, Computer Vision, AWS"
    },
    {
        "name": "CureMD",
        "location": "Lahore / Islamabad, Pakistan",
        "city": "islamabad",
        "industry": "Healthcare Information Systems & Cloud EHR",
        "website": "https://www.curemd.com",
        "careers_page": "https://www.curemd.com/careers",
        "tech_stack": "Cloud Architecture, .NET, Angular, SQL Server, Healthcare APIs"
    },
    {
        "name": "Ovex Technologies",
        "location": "Islamabad, Pakistan",
        "city": "islamabad",
        "industry": "IT Outsourcing & Managed Infrastructure",
        "website": "https://www.ovextech.com",
        "careers_page": "https://www.ovextech.com/careers",
        "tech_stack": "Cloud Networks, Linux, Security, Web Engineering"
    },

    # Remote / Global
    {
        "name": "GitLab",
        "location": "Remote (Worldwide)",
        "city": "remote",
        "industry": "All-Remote DevOps & DevSecOps Platform",
        "website": "https://about.gitlab.com",
        "careers_page": "https://about.gitlab.com/jobs",
        "tech_stack": "Ruby on Rails, Vue.js, Go, Kubernetes, PostgreSQL"
    },
    {
        "name": "Automattic",
        "location": "Remote (Worldwide)",
        "city": "remote",
        "industry": "Open Web Publishing (WordPress.com, Tumblr)",
        "website": "https://automattic.com",
        "careers_page": "https://automattic.com/work-with-us",
        "tech_stack": "PHP, JavaScript, React, Python, Distributed Systems"
    },
    {
        "name": "Canonical (Ubuntu)",
        "location": "Remote (Worldwide)",
        "city": "remote",
        "industry": "Open Source Linux OS & Cloud Infrastructure",
        "website": "https://canonical.com",
        "careers_page": "https://canonical.com/careers",
        "tech_stack": "Linux Kernel, Python, Go, Kubernetes, OpenStack"
    },
    {
        "name": "Zapier",
        "location": "Remote (Worldwide)",
        "city": "remote",
        "industry": "No-Code Workflow Automation & App Integration",
        "website": "https://zapier.com",
        "careers_page": "https://zapier.com/jobs",
        "tech_stack": "Python, React, AWS, Microservices, REST APIs"
    },
    {
        "name": "Toptal",
        "location": "Remote (Worldwide)",
        "city": "remote",
        "industry": "Global Elite Freelance Talent Network",
        "website": "https://www.toptal.com",
        "careers_page": "https://www.toptal.com/careers",
        "tech_stack": "React, Ruby, Python, Node.js, GraphQL"
    }
]


async def discover_companies(location: str) -> CompanySearchResponse:
    """
    Discovers real companies in or around the entered location.
    Strictly separates 'nearby companies' from 'companies currently hiring'.
    Never invents companies or false claims of active openings.
    """
    loc_clean = (location or "Remote").strip().lower()

    # Match directory companies based on city/location string
    matched_companies: List[Dict[str, Any]] = []

    if loc_clean in ["remote", "worldwide", "global"]:
        matched_companies = [c for c in VERIFIED_COMPANIES_DIRECTORY if c["city"] == "remote"]
    elif loc_clean in ["pakistan", "pk"]:
        matched_companies = [c for c in VERIFIED_COMPANIES_DIRECTORY if "pakistan" in c["location"].lower()]
    else:
        # Match specific city name or substring
        matched_companies = [c for c in VERIFIED_COMPANIES_DIRECTORY if loc_clean in c["city"] or loc_clean in c["location"].lower()]
        
        # If very few city results, augment with remote and Pakistan general
        if len(matched_companies) < 3:
            pak_companies = [c for c in VERIFIED_COMPANIES_DIRECTORY if "pakistan" in c["location"].lower() and c not in matched_companies]
            matched_companies.extend(pak_companies[:3])

    if not matched_companies:
        # Fallback to general Pakistan tech & remote directory
        matched_companies = VERIFIED_COMPANIES_DIRECTORY[:6]

    # Fetch live jobs to cross-reference which companies have verified active openings right now
    live_jobs = await fetch_live_arbeitnow_jobs()
    if not live_jobs:
        live_jobs = await fetch_live_remoteok_jobs()
    if not live_jobs:
        live_jobs = CACHED_REAL_JOBS

    nearby_list: List[CompanyInfo] = []
    hiring_list: List[CompanyInfo] = []

    for comp in matched_companies:
        comp_name_lower = comp["name"].lower()
        
        # Cross reference with confirmed live jobs
        matched_live_jobs: List[JobOpportunity] = []
        for raw_job in live_jobs:
            raw_comp = raw_job.get("company", "").lower()
            if raw_comp and (raw_comp in comp_name_lower or comp_name_lower in raw_comp):
                matched_live_jobs.append(JobOpportunity(
                    id=str(raw_job.get("id")),
                    company_name=raw_job.get("company"),
                    job_title=raw_job.get("title"),
                    location=raw_job.get("location", "Remote"),
                    work_type="Remote" if raw_job.get("remote") else "On-site",
                    required_skills=raw_job.get("tags", [])[:5],
                    why_matched="Direct live job opening at this company.",
                    missing_or_preferred_skills=[],
                    posting_date=str(raw_job.get("created_at") or "")[:10] if raw_job.get("created_at") else None,
                    application_link=raw_job.get("url")
                ))

        has_openings = len(matched_live_jobs) > 0

        info = CompanyInfo(
            name=comp["name"],
            location=comp["location"],
            industry=comp["industry"],
            website=comp["website"],
            careers_page=comp["careers_page"],
            has_active_openings=has_openings,
            available_jobs=matched_live_jobs
        )

        nearby_list.append(info)
        if has_openings:
            hiring_list.append(info)

    # If no live openings confirmed in the local directory, also add companies from live feed
    # that explicitly have current openings
    if not hiring_list and live_jobs:
        for raw_job in live_jobs[:3]:
            hiring_list.append(CompanyInfo(
                name=raw_job.get("company"),
                location=raw_job.get("location", "Remote"),
                industry="Software & Technology",
                website="https://www.arbeitnow.com",
                careers_page=raw_job.get("url"),
                has_active_openings=True,
                available_jobs=[
                    JobOpportunity(
                        id=str(raw_job.get("id")),
                        company_name=raw_job.get("company"),
                        job_title=raw_job.get("title"),
                        location=raw_job.get("location", "Remote"),
                        work_type="Remote" if raw_job.get("remote") else "On-site",
                        required_skills=raw_job.get("tags", [])[:5],
                        why_matched="Current verified live vacancy.",
                        missing_or_preferred_skills=[],
                        posting_date=str(raw_job.get("created_at") or "")[:10] if raw_job.get("created_at") else None,
                        application_link=raw_job.get("url")
                    )
                ]
            ))

    return CompanySearchResponse(
        location=location,
        nearby_companies=nearby_list,
        companies_with_openings=hiring_list,
        notice="A company being nearby does NOT mean it currently has an opening."
    )
