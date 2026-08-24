/* ==========================================
   COURSES MOCK DATASET
   ========================================== */

export const COURSES = [
    {
        id: 'course-tum-msc-cs',
        slug: 'msc-computer-science-tum',
        title: 'MSc Computer Science',
        degree: 'Master of Science',
        degreeType: "Master's",
        field: 'Computer Science',
        universitySlug: 'technical-university-of-munich',
        universityName: 'Technical University of Munich',
        countrySlug: 'germany',
        countryName: 'Germany',
        city: 'Munich',
        duration: '2 Years (4 Semesters)',
        language: 'English',
        tuition: '€2,000 / semester (Non-EU)',
        tuitionAnnual: 4000,
        currency: 'EUR',
        deadline: '15 Jan (Summer) / 31 May (Winter)',
        deadlineDate: '2025-05-31',
        overview: 'A research-oriented Master’s program covering advanced software engineering, distributed systems, algorithms, and artificial intelligence.',
        requirements: {
            academic: [
                { label: "Bachelor's Degree", detail: "BSc in Computer Science or closely related STEM discipline (180 ECTS)" },
                { label: "Minimum CGPA", detail: "7.0 / 10 (or 2.5 German grade equivalent)" },
                { label: "Required Subjects", detail: "Advanced Algorithms, Theoretical CS, Computer Architecture, Math/Statistics (at least 50 ECTS)" }
            ],
            language: [
                { label: "IELTS Academic", detail: "6.5 overall (no subscore below 6.0)" },
                { label: "TOEFL iBT", detail: "88 overall (reading 20, listening 20, speaking 20, writing 20)" }
            ],
            additional: [
                { label: "GRE General", detail: "Not required (optional for non-EU applicants to boost score)" },
                { label: "Work Experience", detail: "Not required" },
                { label: "GATE (India)", detail: "Accepted in lieu of GRE if 90th percentile+" }
            ]
        },
        minCgpa: 7.0,
        minIelts: 6.5,
        minToefl: 88,
        greRequired: false,
        applicationFee: '€50 (uni-assist)',
        documents: ['Passport Copy', 'Bachelor Degree Certificate', 'Official Transcripts', 'Curriculum Vitae (CV)', 'Motivation Letter', 'Language Certificate'],
        sourceUrl: 'https://www.tum.de/en/studies/degree-programs/detail/computer-science-master-of-science-msc',
        verifiedDate: '2024-05-15'
    },
    {
        id: 'course-tum-msc-data',
        slug: 'msc-data-engineering-tum',
        title: 'MSc Data Engineering & Analytics',
        degree: 'Master of Science',
        degreeType: "Master's",
        field: 'Data Science',
        universitySlug: 'technical-university-of-munich',
        universityName: 'Technical University of Munich',
        countrySlug: 'germany',
        countryName: 'Germany',
        city: 'Munich',
        duration: '2 Years (4 Semesters)',
        language: 'English',
        tuition: '€3,000 / semester (Non-EU)',
        tuitionAnnual: 6000,
        currency: 'EUR',
        deadline: '31 May 2025',
        deadlineDate: '2025-05-31',
        overview: 'Specialized program focusing on processing massive datasets, machine learning pipelines, cloud architectures, and scalable analytics.',
        requirements: {
            academic: [
                { label: "Bachelor's Degree", detail: "BSc in Computer Science, Mathematics, or Data Science" },
                { label: "Minimum CGPA", detail: "7.5 / 10 (or 2.0 German grade equivalent)" },
                { label: "Required Subjects", detail: "Linear Algebra, Calculus, Databases, Python/Java Programming" }
            ],
            language: [
                { label: "IELTS Academic", detail: "7.0 overall" },
                { label: "TOEFL iBT", detail: "95 overall" }
            ],
            additional: [
                { label: "GRE General", detail: "Recommended for non-EU applicants (V: 153, Q: 164)" },
                { label: "Work Experience", detail: "Not required" }
            ]
        },
        minCgpa: 7.5,
        minIelts: 7.0,
        minToefl: 95,
        greRequired: false,
        applicationFee: '€50',
        documents: ['Passport Copy', 'Transcripts', 'Module Catalog', 'CV', 'Letter of Motivation', 'IELTS Certificate'],
        sourceUrl: 'https://www.in.tum.de/en/in/cover-page/',
        verifiedDate: '2024-04-20'
    },
    {
        id: 'course-rwth-msc-robo',
        slug: 'msc-robotic-systems-rwth',
        title: 'MSc Robotic Systems Engineering',
        degree: 'Master of Science',
        degreeType: "Master's",
        field: 'Engineering',
        universitySlug: 'rwth-aachen-university',
        universityName: 'RWTH Aachen University',
        countrySlug: 'germany',
        countryName: 'Germany',
        city: 'Aachen',
        duration: '2 Years (4 Semesters)',
        language: 'English',
        tuition: '€0 / semester (€320 admin fee)',
        tuitionAnnual: 0,
        currency: 'EUR',
        deadline: '1 Mar 2025',
        deadlineDate: '2025-03-01',
        overview: 'Combines mechanical engineering, control systems, sensors, and artificial intelligence for autonomous robotic platforms.',
        requirements: {
            academic: [
                { label: "Bachelor's Degree", detail: "BSc in Mechanical Engineering, Electrical Engineering, or Mechatronics" },
                { label: "Minimum CGPA", detail: "7.0 / 10" },
                { label: "Required Subjects", detail: "Mechanics, Control Theory, C++ Programming" }
            ],
            language: [
                { label: "IELTS Academic", detail: "6.5 overall" },
                { label: "TOEFL iBT", detail: "90 overall" }
            ],
            additional: [
                { label: "GRE General", detail: "Mandatory for non-EU (Quantitative min: 160)" },
                { label: "Work Experience", detail: "Not required" }
            ]
        },
        minCgpa: 7.0,
        minIelts: 6.5,
        minToefl: 90,
        greRequired: true,
        applicationFee: '€0',
        documents: ['Passport', 'Degree Certificate', 'GRE Report', 'CV', 'SOP'],
        sourceUrl: 'https://www.rwth-aachen.de/',
        verifiedDate: '2024-03-11'
    },
    {
        id: 'course-imperial-msc-ai',
        slug: 'msc-artificial-intelligence-imperial',
        title: 'MSc Artificial Intelligence',
        degree: 'Master of Science',
        degreeType: "Master's",
        field: 'Computer Science',
        universitySlug: 'imperial-college-london',
        universityName: 'Imperial College London',
        countrySlug: 'united-kingdom',
        countryName: 'United Kingdom',
        city: 'London',
        duration: '1 Year (Full-Time)',
        language: 'English',
        tuition: '£36,500 / total program',
        tuitionAnnual: 36500,
        currency: 'GBP',
        deadline: '15 Jan 2025 (Round 1)',
        deadlineDate: '2025-01-15',
        overview: 'Intensive 1-year Master’s targeting deep learning, computer vision, natural language processing, and ethical AI development.',
        requirements: {
            academic: [
                { label: "Bachelor's Degree", detail: "First class honors degree in Computer Science, Math, or Physics (First Division 8.0+ / 10)" },
                { label: "Minimum CGPA", detail: "8.0 / 10" },
                { label: "Required Subjects", detail: "High proficiency in Linear Algebra, Vector Calculus, Probability, and Python" }
            ],
            language: [
                { label: "IELTS Academic", detail: "7.0 overall (min 6.5 per section)" },
                { label: "TOEFL iBT", detail: "100 overall (min 22 per section)" }
            ],
            additional: [
                { label: "GRE General", detail: "Not required" },
                { label: "Work Experience", detail: "Industrial experience preferred but not mandatory" }
            ]
        },
        minCgpa: 8.0,
        minIelts: 7.0,
        minToefl: 100,
        greRequired: false,
        applicationFee: '£80',
        documents: ['Passport', 'Transcripts', '2 Academic Recommendation Letters', 'Personal Statement', 'CV'],
        sourceUrl: 'https://www.imperial.ac.uk/computing/prospective-students/courses/pg/msc-ai/',
        verifiedDate: '2024-06-01'
    },
    {
        id: 'course-tudelft-msc-cs',
        slug: 'msc-computer-science-tudelft',
        title: 'MSc Computer Science',
        degree: 'Master of Science',
        degreeType: "Master's",
        field: 'Computer Science',
        universitySlug: 'delft-university-of-technology',
        universityName: 'TU Delft',
        countrySlug: 'netherlands',
        countryName: 'Netherlands',
        city: 'Delft',
        duration: '2 Years (120 ECTS)',
        language: 'English',
        tuition: '€21,000 / year',
        tuitionAnnual: 21000,
        currency: 'EUR',
        deadline: '15 Jan 2025 (Scholarships) / 1 Apr 2025 (Final)',
        deadlineDate: '2025-04-01',
        overview: 'Covers Data Science, Software Technology, Cybersecurity, and High Performance Computing with strong industry ties in Holland.',
        requirements: {
            academic: [
                { label: "Bachelor's Degree", detail: "BSc in Computer Science or closely related subject" },
                { label: "Minimum CGPA", detail: "7.5 / 10 (or 75% equivalent)" },
                { label: "Required Subjects", detail: "Software Engineering, Algorithms, Operating Systems, Linear Algebra" }
            ],
            language: [
                { label: "IELTS Academic", detail: "7.0 overall (min 6.5 per section)" },
                { label: "TOEFL iBT", detail: "100 overall (min 22 per subscore)" }
            ],
            additional: [
                { label: "GRE General", detail: "Mandatory for non-EU applicants (GRE Quant 165+)" },
                { label: "Work Experience", detail: "Not required" }
            ]
        },
        minCgpa: 7.5,
        minIelts: 7.0,
        minToefl: 100,
        greRequired: true,
        applicationFee: '€100',
        documents: ['Passport', 'Degree Certificate', 'Official Transcripts', 'GRE Score Card', 'SOP', 'CV'],
        sourceUrl: 'https://www.tudelft.nl/en/education/programmes/masters/computer-science/',
        verifiedDate: '2024-03-22'
    },
    {
        id: 'course-melbourne-msc-it',
        slug: 'master-of-information-technology-melbourne',
        title: 'Master of Information Technology',
        degree: 'Master of IT',
        degreeType: "Master's",
        field: 'Computer Science',
        universitySlug: 'university-of-melbourne',
        universityName: 'University of Melbourne',
        countrySlug: 'australia',
        countryName: 'Australia',
        city: 'Melbourne',
        duration: '2 Years (Full-Time)',
        language: 'English',
        tuition: 'AU$48,700 / year',
        tuitionAnnual: 48700,
        currency: 'AUD',
        deadline: '30 Nov 2024 (Feb intake) / 30 Apr 2025 (July intake)',
        deadlineDate: '2025-04-30',
        overview: 'Flexible IT Master’s offering specializations in Cyber Security, AI, Software Engineering, and Computing Applications.',
        requirements: {
            academic: [
                { label: "Bachelor's Degree", detail: "Bachelor’s degree in any discipline with programming prerequisite" },
                { label: "Minimum CGPA", detail: "6.5 / 10 (65% WAM equivalent)" },
                { label: "Required Subjects", detail: "At least one tertiary computer programming subject completed" }
            ],
            language: [
                { label: "IELTS Academic", detail: "6.5 overall (no band less than 6.0)" },
                { label: "TOEFL iBT", detail: "79 overall (writing 21, speaking 18)" }
            ],
            additional: [
                { label: "GRE General", detail: "Not required" },
                { label: "Work Experience", detail: "Not required" }
            ]
        },
        minCgpa: 6.5,
        minIelts: 6.5,
        minToefl: 79,
        greRequired: false,
        applicationFee: 'AU$120',
        documents: ['Passport', 'Degree Certificate', 'Academic Transcripts', 'IELTS Certificate'],
        sourceUrl: 'https://study.unimelb.edu.au/find/courses/graduate/master-of-information-technology/',
        verifiedDate: '2024-05-30'
    },
    {
        id: 'course-polimi-msc-cse',
        slug: 'msc-computer-science-engineering-polimi',
        title: 'MSc Computer Science & Engineering',
        degree: 'Master of Science',
        degreeType: "Master's",
        field: 'Computer Science',
        universitySlug: 'politecnico-di-milano',
        universityName: 'Politecnico di Milano',
        countrySlug: 'italy',
        countryName: 'Italy',
        city: 'Milan',
        duration: '2 Years (120 ECTS)',
        language: 'English',
        tuition: '€3,892 / year (Tuition waivers available based on merit)',
        tuitionAnnual: 3892,
        currency: 'EUR',
        deadline: '18 Nov 2024 (1st Call) / 3 Mar 2025 (2nd Call)',
        deadlineDate: '2025-03-03',
        overview: 'Top Italian Master’s in CS Engineering offering tracks in AI, Cybersecurity, Bioinformatics, and Interactive Systems.',
        requirements: {
            academic: [
                { label: "Bachelor's Degree", detail: "BSc in Computer Science or Information Engineering" },
                { label: "Minimum CGPA", detail: "7.0 / 10" },
                { label: "Required Subjects", detail: "Foundational CS, Object Oriented Programming, Calculus" }
            ],
            language: [
                { label: "IELTS Academic", detail: "6.0 overall" },
                { label: "TOEFL iBT", detail: "78 overall" }
            ],
            additional: [
                { label: "GRE General", detail: "Not required" },
                { label: "Work Experience", detail: "Not required" }
            ]
        },
        minCgpa: 7.0,
        minIelts: 6.0,
        minToefl: 78,
        greRequired: false,
        applicationFee: '€50',
        documents: ['Passport', 'BSc Certificate', 'Transcript of Records', 'Course Descriptions', 'CV', 'Motivation Letter'],
        sourceUrl: 'https://www.polimi.it/en/',
        verifiedDate: '2024-02-14'
    }
];
