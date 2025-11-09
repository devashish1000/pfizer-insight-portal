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
