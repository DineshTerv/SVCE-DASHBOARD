// Initial mock dataset matching R-Sequences dashboard specifications

export const COLLEGE_INFO = {
  name: "R-Sequences",
  oifCode: "TI27167",
  defaultDate: "2026-09-22",
  totalStudentsDefault: 441,
  totalBatchesDefault: 8,
};

export const DEPARTMENTS = ["All Depts", "CSC-A", "CSC-B", "ECE-A", "ECE-B", "EEE", "MECH", "CIVIL"];
export const BATCHES = ["All Batches", "1", "2", "3", "4", "5", "6", "7", "8"];

// Base student list template
const BASE_STUDENTS = [
  { slNo: 1, name: "ADUSUMALLI JAI KALYAN", regNo: "24BFA37001", dept: "CSC-A", section: "A", batch: "5", isStar: false },
  { slNo: 2, name: "ANNADANAM VASUNDHARA", regNo: "24BFA37003", dept: "CSC-A", section: "A", batch: "5", isStar: true },
  { slNo: 3, name: "AVULA GREESHMA", regNo: "24BFA37004", dept: "CSC-A", section: "A", batch: "5", isStar: false },
  { slNo: 4, name: "BODIREDDY PADMINI", regNo: "24BFA37005", dept: "CSC-A", section: "A", batch: "5", isStar: false },
  { slNo: 5, name: "BOTTA VENKATA TEJA", regNo: "24BFA37006", dept: "CSC-A", section: "A", batch: "5", isStar: false },
  { slNo: 6, name: "CHUKKA BALA VENKATESH", regNo: "24BFA37012", dept: "CSC-A", section: "A", batch: "5", isStar: false },
  { slNo: 7, name: "GADDAM JAYA PRAVEEN", regNo: "24BFA37016", dept: "CSC-A", section: "A", batch: "5", isStar: false },
  { slNo: 8, name: "KURAM SRAVANI", regNo: "24BFA37032", dept: "CSC-A", section: "A", batch: "5", isStar: false },
  { slNo: 9, name: "MALLAVARAM VAISHNAVI", regNo: "24BFA37035", dept: "CSC-A", section: "A", batch: "5", isStar: false },
  { slNo: 10, name: "BANDI PAVAN KUMAR", regNo: "24BFA37008", dept: "CSC-B", section: "B", batch: "3", isStar: false },
  { slNo: 11, name: "DHARANI SREEKANTH", regNo: "24BFA37014", dept: "CSC-B", section: "B", batch: "3", isStar: true },
  { slNo: 12, name: "EMANI HARIKA", regNo: "24BFA37015", dept: "ECE-A", section: "A", batch: "2", isStar: false },
  { slNo: 13, name: "GUNTURU SAI KUMAR", regNo: "24BFA37019", dept: "ECE-A", section: "A", batch: "2", isStar: false },
  { slNo: 14, name: "KALAVAKUNTA RAMYA", regNo: "24BFA37025", dept: "ECE-B", section: "B", batch: "4", isStar: false },
  { slNo: 15, name: "NALLAPU REDDY VARUN", regNo: "24BFA37042", dept: "EEE", section: "A", batch: "1", isStar: false },
];

export const generateAllStudents = () => {
  const depts = ["CSC-A", "CSC-B", "ECE-A", "ECE-B", "EEE", "MECH", "CIVIL"];
  const sections = ["A", "B", "C"];
  const firstNames = ["KAVYA", "PRANEETH", "SAI", "LOKESH", "TEJASWINI", "ROHIT", "MANOJ", "DIVYA", "SURESH", "ANUSHKA", "CHARAN", "BHAVANA", "RAKESH", "PRIYA", "KISHORE"];
  const lastNames = ["REDDY", "KUMAR", "RAO", "CHOWDARY", "VERMA", "SHARMA", "NAIDU", "GUPTA", "SINGH", "PATIL"];

  const students = [...BASE_STUDENTS];

  for (let i = students.length + 1; i <= 441; i++) {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    const dept = depts[i % depts.length];
    const sec = sections[i % sections.length];
    const bId = ((i % 8) + 1).toString();
    const regNum = `24BFA3${7000 + i}`;

    students.push({
      slNo: i,
      name: `${fn} ${ln}`,
      regNo: regNum,
      dept: dept,
      section: sec,
      batch: bId,
      isStar: i % 19 === 0
    });
  }

  return students;
};

export const DATE_ANALYTICS_MAP = {
  "2026-09-22": {
    todayTargetCompleted: 217,
    tillDateTargetCompleted: 247,
    todayTargetDistribution: [
      { label: "0 questions", count: 103 },
      { label: "1 Question", count: 1 },
      { label: "2 Questions", count: 0 },
      { label: "3 Questions", count: 2 },
      { label: "4 Questions", count: 6 },
      { label: "5 Questions", count: 8 },
      { label: "6 Questions", count: 6 },
      { label: "7 Questions", count: 1 },
      { label: "8 Questions", count: 13 },
      { label: "9 Questions", count: 84 },
      { label: "10 Questions", count: 198 },
      { label: "11 Questions", count: 8 },
      { label: "12 Questions", count: 3 },
      { label: "13 Questions", count: 3 },
      { label: "14 Questions", count: 2 },
      { label: "15 Questions", count: 3 },
    ],
    tillDateDistribution: [
      { label: "0 questions", count: 82 },
      { label: "1-14 Questions", count: 7 },
      { label: "15-28 Questions", count: 30 },
      { label: "29-42 Questions", count: 120 },
      { label: "43-56 Questions", count: 146 },
      { label: "57-70 Questions", count: 42 },
      { label: "71-84 Questions", count: 9 },
      { label: "85-98 Questions", count: 4 },
      { label: "99-112 Questions", count: 1 },
    ],
  },
  "2026-09-21": {
    todayTargetCompleted: 195,
    tillDateTargetCompleted: 220,
    todayTargetDistribution: [
      { label: "0 questions", count: 120 },
      { label: "1 Question", count: 4 },
      { label: "2 Questions", count: 2 },
      { label: "3 Questions", count: 5 },
      { label: "4 Questions", count: 10 },
      { label: "5 Questions", count: 12 },
      { label: "6 Questions", count: 9 },
      { label: "7 Questions", count: 4 },
      { label: "8 Questions", count: 20 },
      { label: "9 Questions", count: 60 },
      { label: "10 Questions", count: 170 },
      { label: "11 Questions", count: 15 },
      { label: "12 Questions", count: 5 },
      { label: "13 Questions", count: 2 },
      { label: "14 Questions", count: 1 },
      { label: "15 Questions", count: 2 },
    ],
    tillDateDistribution: [
      { label: "0 questions", count: 95 },
      { label: "1-14 Questions", count: 15 },
      { label: "15-28 Questions", count: 45 },
      { label: "29-42 Questions", count: 135 },
      { label: "43-56 Questions", count: 120 },
      { label: "57-70 Questions", count: 22 },
      { label: "71-84 Questions", count: 6 },
      { label: "85-98 Questions", count: 2 },
      { label: "99-112 Questions", count: 1 },
    ],
  },
  "2026-09-23": {
    todayTargetCompleted: 260,
    tillDateTargetCompleted: 290,
    todayTargetDistribution: [
      { label: "0 questions", count: 80 },
      { label: "1 Question", count: 0 },
      { label: "2 Questions", count: 1 },
      { label: "3 Questions", count: 2 },
      { label: "4 Questions", count: 4 },
      { label: "5 Questions", count: 5 },
      { label: "6 Questions", count: 4 },
      { label: "7 Questions", count: 2 },
      { label: "8 Questions", count: 10 },
      { label: "9 Questions", count: 70 },
      { label: "10 Questions", count: 230 },
      { label: "11 Questions", count: 20 },
      { label: "12 Questions", count: 8 },
      { label: "13 Questions", count: 3 },
      { label: "14 Questions", count: 1 },
      { label: "15 Questions", count: 1 },
    ],
    tillDateDistribution: [
      { label: "0 questions", count: 65 },
      { label: "1-14 Questions", count: 5 },
      { label: "15-28 Questions", count: 25 },
      { label: "29-42 Questions", count: 100 },
      { label: "43-56 Questions", count: 160 },
      { label: "57-70 Questions", count: 65 },
      { label: "71-84 Questions", count: 15 },
      { label: "85-98 Questions", count: 5 },
      { label: "99-112 Questions", count: 1 },
    ],
  }
};
