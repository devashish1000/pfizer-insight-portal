import { IntelligenceData } from "@/components/IntelligenceTable";

// Note: In production, you should store the API key securely
// For now, we'll use a placeholder that users can replace
const GOOGLE_SHEETS_API_KEY = "AIzaSyDGzvIPk1cZ867bZdD58biqZdnPpqSQG4U";
const SPREADSHEET_ID = "161GLwIcjtp0uJ0Dyb9v3ZnoPRf7FQ7nc8kMG-autv_k";
const RANGE = "Sheet1!A1:G1000"; // Adjust based on your sheet structure

export const fetchSheetData = async (): Promise<IntelligenceData[]> => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }

    const data = await response.json();
    const rows = data.values || [];

    // Skip header row
    const dataRows = rows.slice(1);

    return dataRows.map((row: string[]) => ({
      timestamp: row[0] || "",
      title: row[1] || "",
      summary: row[2] || "",
      category: row[3] || "",
      source: row[4] || "",
      impact: row[5] || "",
      region: row[6] || "",
    }));
  } catch (error) {
    console.error("Error fetching Google Sheets data:", error);
    // Return sample data as fallback
    return getSampleData();
  }
};

// Fetch data for Regulatory Intelligence Tracker
export const fetchRegulatoryData = async (): Promise<any[]> => {
  const RANGE = "Regulatory_Intelligence_Tracker!A:U"; // Adjust range if you add more columns
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);

    const data = await response.json();
    const rows = data.values || [];
    const dataRows = rows.slice(1); // skip headers

    return dataRows.map((row: string[]) => ({
      timestamp: row[0] || "",
      agency: row[1] || "",
      region: row[2] || "",
      submission_id: row[3] || "",
      submission_type: row[4] || "",
      compound_name: row[5] || "",
      generic_name: row[6] || "",
      therapeutic_area: row[7] || "",
      indication: row[8] || "",
      status: row[9] || "",
      priority_designation: row[10] || "",
      submission_date: row[11] || "",
      target_decision_date: row[12] || "",
      approval_date: row[13] || "",
      review_cycle: row[14] || "",
      key_issues: row[15] || "",
      risk_level: row[16] || "",
      impact: row[17] || "",
      source: row[18] || "",
      summary: row[19] || "",
      last_updated_by: row[20] || "",
    }));
  } catch (error) {
    console.error("Error fetching Regulatory data:", error);
    return [];
  }
};

// Fetch and merge data from all Google Sheets tabs
export const fetchAllSheetsData = async (): Promise<any[]> => {
  const sheets = [
    { name: "Sheet1", range: "Sheet1!A:G" },
    { name: "Regulatory_Intelligence_Tracker", range: "Regulatory_Intelligence_Tracker!A:U" },
    { name: "Clinical_Trials", range: "Clinical_Trials!A:Z" },
    { name: "Medical_Research", range: "Medical_Research!A:Z" },
    { name: "Public_Health", range: "Public_Health!A:Z" },
  ];

  const allData: any[] = [];

  for (const sheet of sheets) {
    try {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheet.range}?key=${GOOGLE_SHEETS_API_KEY}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn(`Failed to fetch ${sheet.name}: ${response.statusText}`);
        continue;
      }

      const data = await response.json();
      const rows = data.values || [];

      if (rows.length <= 1) continue; // Skip if only headers or empty

      const headers = rows[0];
      const dataRows = rows.slice(1);

      // Map rows to objects with dynamic headers
      const sheetData = dataRows.map((row: string[]) => {
        const record: any = { _sourceSheet: sheet.name };
        headers.forEach((header: string, index: number) => {
          const key = header.toLowerCase().replace(/ /g, "_");
          record[key] = row[index] || "";
        });
        return record;
      });

      allData.push(...sheetData);
    } catch (error) {
      console.error(`Error fetching ${sheet.name}:`, error);
    }
  }

  // Sort by timestamp descending
  allData.sort((a, b) => {
    const dateA = new Date(a.timestamp || 0).getTime();
    const dateB = new Date(b.timestamp || 0).getTime();
    return dateB - dateA;
  });

  return allData;
};

// Sample data for testing
const getSampleData = (): IntelligenceData[] => [
  {
    timestamp: new Date().toISOString(),
    title: "New FDA Guidance on Clinical Trial Data",
    summary: "FDA releases updated guidance on electronic data submission requirements for clinical trials",
    category: "Regulatory",
    source: "FDA.gov",
    impact: "High",
    region: "United States",
  },
  {
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    title: "EMA Approves Novel Cancer Treatment",
    summary: "European Medicines Agency grants approval for breakthrough oncology therapy",
    category: "Drug Approval",
    source: "EMA Press Release",
    impact: "High",
    region: "European Union",
  },
  {
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    title: "WHO Updates Vaccine Guidelines",
    summary: "World Health Organization publishes revised recommendations for COVID-19 vaccine deployment",
    category: "Medical Guidelines",
    source: "WHO",
    impact: "Medium",
    region: "Global",
  },
  {
    timestamp: new Date().toISOString(),
    title: "Japan Regulatory Update on Biosimilars",
    summary: "PMDA announces streamlined approval pathway for biosimilar medications",
    category: "Regulatory",
    source: "PMDA Japan",
    impact: "Medium",
    region: "Japan",
  },
  {
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    title: "Clinical Trial Results: Phase III Success",
    summary: "Positive results announced for Phase III trial of investigational respiratory treatment",
    category: "Clinical Research",
    source: "Clinical Trials Journal",
    impact: "High",
    region: "Global",
  },
];
