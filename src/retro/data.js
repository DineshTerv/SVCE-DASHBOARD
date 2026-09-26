export const MOCK_STUDENTS = [
  { name: "A YAMUNA", registerNumber: "24BFA32001", department: "CSD", section: "A", batch: "1", todayCount: 10, avgAttendance: 88, cumulativeProgress: 52 },
  { name: "ADDEPALLI NITHIN", registerNumber: "24BFA32002", department: "CSD", section: "A", batch: "1", todayCount: 8, avgAttendance: 76, cumulativeProgress: 44 },
  { name: "ALLURI VENKATA SREEJA", registerNumber: "24BFA32004", department: "CSD", section: "A", batch: "1", todayCount: 10, avgAttendance: 82, cumulativeProgress: 50 },
  { name: "ANALA PUNITH KUMAR REDDY", registerNumber: "24BFA32005", department: "CSD", section: "A", batch: "1", todayCount: 10, avgAttendance: 95, cumulativeProgress: 55 },
  { name: "BALAPPA GARI VAISHNAVI", registerNumber: "24BFA32008", department: "CSD", section: "A", batch: "1", todayCount: 14, avgAttendance: 100, cumulativeProgress: 60 },
  { name: "BATHULA JAYASREE", registerNumber: "24BFA32009", department: "CSD", section: "A", batch: "1", todayCount: 6, avgAttendance: 70, cumulativeProgress: 35 },
  { name: "CHITLA KEERTHI", registerNumber: "24BFA32014", department: "CSD", section: "A", batch: "1", todayCount: 13, avgAttendance: 100, cumulativeProgress: 62 },
  { name: "DASARI ANUROOP", registerNumber: "24BFA32017", department: "CSD", section: "A", batch: "1", todayCount: 0, avgAttendance: 62, cumulativeProgress: 28 },
  { name: "DEGA ROHITH", registerNumber: "24BFA32020", department: "CSD", section: "A", batch: "1", todayCount: 9, avgAttendance: 88, cumulativeProgress: 46 },
  { name: "MATTA YASWITHA", registerNumber: "24BFA32046", department: "CSD", section: "A", batch: "1", todayCount: 0, avgAttendance: 60, cumulativeProgress: 30 },
  { name: "PANDARAM GNANENDRA", registerNumber: "24BFA32054", department: "CSD", section: "A", batch: "1", todayCount: 0, avgAttendance: 55, cumulativeProgress: 22 },
  { name: "A.SNEHA", registerNumber: "24BFA32069", department: "CSD", section: "B", batch: "2", todayCount: 10, avgAttendance: 90, cumulativeProgress: 48 },
  { name: "A.SINDHU KARTHIKA", registerNumber: "24BFA32071", department: "CSD", section: "B", batch: "2", todayCount: 10, avgAttendance: 95, cumulativeProgress: 50 },
  { name: "AGARAM BHANU", registerNumber: "24BFA05141", department: "CSE", section: "C", batch: "3", todayCount: 10, avgAttendance: 95, cumulativeProgress: 52 },
  { name: "ALLU JAYANTH NAIDU", registerNumber: "24BFA05142", department: "CSE", section: "C", batch: "3", todayCount: 10, avgAttendance: 85, cumulativeProgress: 45 },
  { name: "V PUNITH NAIDU", registerNumber: "24BFA33287", department: "CSM", section: "E", batch: "4", todayCount: 10, avgAttendance: 100, cumulativeProgress: 65 },
  { name: "K VENELA RAJESWARI", registerNumber: "24BFA33288", department: "CSM", section: "E", batch: "4", todayCount: 10, avgAttendance: 100, cumulativeProgress: 64 },
  { name: "BIJIVEMULA BHANU SIVA REDDY", registerNumber: "24BFA05211", department: "CSE", section: "D", batch: "5", todayCount: 0, avgAttendance: 65, cumulativeProgress: 25 },
  { name: "GOLUKONDA BHAVYA SRI SATYA", registerNumber: "24BFA05212", department: "CSE", section: "D", batch: "5", todayCount: 10, avgAttendance: 95, cumulativeProgress: 55 },
  { name: "PERAM SAITEJA", registerNumber: "24BFA04367", department: "ECE", section: "C", batch: "6", todayCount: 10, avgAttendance: 90, cumulativeProgress: 51 },
  { name: "POGURI SANTHOSH KUMAR", registerNumber: "24BFA04369", department: "ECE", section: "C", batch: "6", todayCount: 10, avgAttendance: 90, cumulativeProgress: 49 },
  { name: "SHAIK PEDDA KHADARGARI", registerNumber: "24BFA32062", department: "CSD", section: "A", batch: "1", todayCount: 0, avgAttendance: 48, cumulativeProgress: 18 },
  { name: "GOUNDAR MOHITH KUMAR", registerNumber: "25BFA32L02", department: "CSD", section: "A", batch: "1", todayCount: 4, avgAttendance: 55, cumulativeProgress: 28 },
];

/**
 * Replace this function's body with a real fetch call later:
 * return fetch('/api/students').then(res => res.json());
 */
export async function loadData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...MOCK_STUDENTS]);
    }, 400);
  });
}

// ASCII progress bar generator (e.g. 10/10 -> ██████████)
export function generateAsciiBar(value, max, length = 10) {
  const filled = Math.min(Math.round((value / max) * length), length);
  const empty = length - filled;
  return "█".repeat(filled) + "░".repeat(empty);
}
