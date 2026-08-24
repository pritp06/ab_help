/* ==========================================
   COUNTRIES MOCK DATASET
   ========================================== */

export const COUNTRIES = [
    {
        id: 'country-germany',
        slug: 'germany',
        name: 'Germany',
        region: 'Europe',
        flag: '🇩🇪',
        overview: 'Renowned for tuition-free public universities, world-class engineering, and strong post-study work opportunities.',
        tuitionRange: '€0 - €3,000 / year',
        livingCosts: '€934 / month (Blocked Account)',
        universitiesCount: 280,
        englishProgramsCount: 1450,
        popularFields: ['Computer Science', 'Mechanical Engineering', 'Data Science', 'Automotive', 'Business Analytics'],
        postStudyWorkVisa: '18 Months',
        sources: [
            { label: 'DAAD Official Portal', url: 'https://www.daad.de/en/' }
        ]
    },
    {
        id: 'country-uk',
        slug: 'united-kingdom',
        name: 'United Kingdom',
        region: 'Europe',
        flag: '🇬🇧',
        overview: 'Home to prestigious Russell Group universities with intensive 1-year Master’s programs and vibrant international research hubs.',
        tuitionRange: '£14,000 - £35,000 / year',
        livingCosts: '£1,000 - £1,300 / month',
        universitiesCount: 160,
        englishProgramsCount: 4200,
        popularFields: ['Computer Science', 'Finance', 'Law', 'Artificial Intelligence', 'Biomedical Science'],
        postStudyWorkVisa: '2 Years (Graduate Route)',
        sources: [
            { label: 'Study UK (British Council)', url: 'https://study-uk.britishcouncil.org/' }
        ]
    },
    {
        id: 'country-canada',
        slug: 'canada',
        name: 'Canada',
        region: 'North America',
        flag: '🇨🇦',
        overview: 'Welcoming multicultural nation with high living standards, top-ranked research institutes, and clear permanent residency pathways.',
        tuitionRange: 'CA$18,000 - CA$45,000 / year',
        livingCosts: 'CA$1,200 - CA$1,800 / month',
        universitiesCount: 100,
        englishProgramsCount: 2800,
        popularFields: ['Software Engineering', 'Data Analytics', 'Management', 'Environmental Science', 'Healthcare'],
        postStudyWorkVisa: 'Up to 3 Years (PGWP)',
        sources: [
            { label: 'EduCanada Official', url: 'https://www.educanada.ca/' }
        ]
    },
    {
        id: 'country-netherlands',
        slug: 'netherlands',
        name: 'Netherlands',
        region: 'Europe',
        flag: '🇳🇱',
        overview: 'Pioneer in English-taught European education, famous for problem-based learning, high-tech innovation, and bike-friendly cities.',
        tuitionRange: '€2,100 - €16,000 / year',
        livingCosts: '€950 - €1,400 / month',
        universitiesCount: 55,
        englishProgramsCount: 2100,
        popularFields: ['Computer Science', 'Artificial Intelligence', 'Sustainable Energy', 'International Business'],
        postStudyWorkVisa: '1 Year (Orientation Year)',
        sources: [
            { label: 'Study in NL (Nuffic)', url: 'https://www.studyinnl.org/' }
        ]
    },
    {
        id: 'country-australia',
        slug: 'australia',
        name: 'Australia',
        region: 'Oceania',
        flag: '🇦🇺',
        overview: 'Top quality of life, world-leading Group of Eight research institutions, and generous post-study work rights.',
        tuitionRange: 'AU$25,000 - AU$48,000 / year',
        livingCosts: 'AU$1,500 - AU$2,200 / month',
        universitiesCount: 43,
        englishProgramsCount: 3100,
        popularFields: ['Information Technology', 'Civil Engineering', 'Biotechnology', 'Cybersecurity'],
        postStudyWorkVisa: '2 to 4 Years',
        sources: [
            { label: 'Study Australia Official', url: 'https://www.studyaustralia.gov.au/' }
        ]
    },
    {
        id: 'country-italy',
        slug: 'italy',
        name: 'Italy',
        region: 'Europe',
        flag: '🇮🇹',
        overview: 'Historic European academic centers offering affordable English-taught degrees, rich culture, and regional tuition waivers.',
        tuitionRange: '€900 - €4,000 / year',
        livingCosts: '€700 - €1,100 / month',
        universitiesCount: 90,
        englishProgramsCount: 750,
        popularFields: ['Design', 'Robotics Engineering', 'Architecture', 'Economics & Management'],
        postStudyWorkVisa: '1 Year',
        sources: [
            { label: 'Universitaly Portal', url: 'https://www.universitaly.it/' }
        ]
    }
];
