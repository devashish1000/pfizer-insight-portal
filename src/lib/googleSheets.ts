import { IntelligenceData } from "@/components/IntelligenceTable";

// Note: In production, you should store the API key securely
// For now, we'll use a placeholder that users can replace
const GOOGLE_SHEETS_API_KEY = "AIzaSyDGzvIPk1cZ867bZdD58biqZdnPpqSQG4U";
const SPREADSHEET_ID = "161GLwIcjtp0uJ0Dyb9v3ZnoPRf7FQ7nc8kMG-autv_k";
const RANGE = "Sheet1!A1:G1000"; // Adjust based on your sheet structure

// Dynamic sheet label mapping with colors
export const sheetLabelMap: Record<string, { name: string; color: string; description: string }> = {
  'Sheet1': { 
    name: 'Global Intelligence', 
    color: 'cyan',
    description: 'Aggregated medical and pharma news updates'
  },
  'Regulatory_Intelligence_Tracker': { 
    name: 'Regulatory Intelligence', 
    color: 'teal',
    description: 'Global submission tracking and compliance updates'
  },
  'Medical_Research': { 
    name: 'Medical Research', 
    color: 'green',
    description: 'Recent peer-reviewed publications and discoveries'
  },
  'Clinical_Trials': { 
    name: 'Clinical Trials', 
    color: 'purple',
    description: 'Ongoing or completed trial data and results'
  },
  'Public_Health': { 
    name: 'Public Health & Forecasts', 
    color: 'orange',
    description: 'Epidemiological trends and outbreak insights'
  },
};

const colorPalette = ['cyan', 'teal', 'green', 'purple', 'orange', 'indigo', 'pink'];
let colorIndex = 0;

// Dynamically detect all sheets and update mapping
export const detectAndMapSheets = async (): Promise<void> => {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}?key=${GOOGLE_SHEETS_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('[QA] Failed to detect sheets:', response.statusText);
      return;
    }

    const data = await response.json();
    const sheets = data.sheets || [];
    
    console.log(`[QA] Detected Sheets → ${sheets.length}`);
    
    sheets.forEach((sheet: any) => {
      const sheetName = sheet.properties.title;
      
      if (!sheetLabelMap[sheetName]) {
        // Generate friendly label
        const friendlyName = sheetName
          .split('_')
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        
        // Assign color from palette
        const color = colorPalette[colorIndex % colorPalette.length];
        colorIndex++;
        
        sheetLabelMap[sheetName] = {
          name: friendlyName,
          color,
          description: `Data from ${friendlyName}`
        };
        
        console.log(`[QA] ${sheetName} → ${friendlyName} (${color})`);
      } else {
        console.log(`[QA] ${sheetName} → ${sheetLabelMap[sheetName].name} (${sheetLabelMap[sheetName].color})`);
      }
    });
  } catch (error) {
    console.error('[QA] Error detecting sheets:', error);
  }
};

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

// Fetch data for Medical Research Insights
export const fetchMedicalResearchData = async (): Promise<any[]> => {
  const RANGE = "Medical_Research_Insights!A:V";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);

    const data = await response.json();
    const rows = data.values || [];
    const dataRows = rows.slice(1); // skip headers

    return dataRows.map((row: string[]) => ({
      timestamp: row[0] || "",
      title: row[1] || "",
      sentiment: row[2] || "",
      source: row[3] || "",
      source_type: row[4] || "",
      publication_date: row[5] || "",
      therapeutic_area: row[6] || "",
      impact_level: row[7] || "",
      reach: row[8] || "",
      mentions: row[9] || "",
      engagement: row[10] || "",
      region: row[11] || "",
      summary: row[12] || "",
      key_findings: row[13] || "",
      study_design: row[14] || "",
      sample_size: row[15] || "",
      journal: row[16] || "",
      authors: row[17] || "",
      affiliation: row[18] || "",
      impact_score: row[19] || "",
      data_source: row[20] || "",
      last_updated_by: row[21] || "",
    }));
  } catch (error) {
    console.error("Error fetching Medical Research data:", error);
    return [];
  }
};

// Fetch and merge data from all Google Sheets tabs
export const fetchAllSheetsData = async (): Promise<any[]> => {
  // First, detect and map all sheets dynamically
  await detectAndMapSheets();
  
  const sheets = Object.keys(sheetLabelMap).map(sheetName => ({
    name: sheetName,
    range: `${sheetName}!A:Z`
  }));

  const allData: any[] = [];
  const startTime = performance.now();

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

  const loadTime = performance.now() - startTime;
  const now = new Date();
  const timestamp = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  
  console.log(`[QA] Data Load Complete → ${allData.length} records in ${loadTime.toFixed(2)}ms`);
  console.log(`[QA] Last Updated → ${timestamp}`);

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
