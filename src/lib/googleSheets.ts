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

// Fetch data for Clinical Trials Tracker
const getSampleClinicalTrialsData = () => [
  {
    timestamp: "2025-01-15 10:30:00",
    trial_id: "NCT05234567",
    drug_name: "PF-07321332",
    phase: "Phase III",
    therapeutic_area: "Oncology",
    indication: "Non-Small Cell Lung Cancer",
    status: "Active",
    region: "North America",
    start_date: "2024-03-15",
    expected_end_date: "2026-09-30",
    enrolled_count: "450",
    target_enrollment: "600",
    completion_percent: "75",
    site_locations: "New York, Boston, Chicago, Philadelphia",
    key_milestone: "Interim Analysis Complete",
    next_milestone_date: "2025-04-15",
    milestone_status: "On Track",
    bottleneck_category: "",
    bottleneck_description: "",
    primary_endpoint: "Overall Survival",
    secondary_endpoints: "Progression-Free Survival, Quality of Life",
    principal_investigator: "Dr. Sarah Chen",
    sponsor: "Pfizer Inc.",
    data_source: "ClinicalTrials.gov",
    last_updated_by: "System"
  },
  {
    timestamp: "2025-01-16 14:20:00",
    trial_id: "NCT05234568",
    drug_name: "PF-06939926",
    phase: "Phase II",
    therapeutic_area: "Cardiovascular",
    indication: "Heart Failure",
    status: "Active",
    region: "Europe",
    start_date: "2024-06-01",
    expected_end_date: "2025-12-31",
    enrolled_count: "180",
    target_enrollment: "300",
    completion_percent: "60",
    site_locations: "London, Paris, Berlin, Madrid",
    key_milestone: "Patient Recruitment",
    next_milestone_date: "2025-03-30",
    milestone_status: "On Track",
    bottleneck_category: "Recruitment",
    bottleneck_description: "Slow patient enrollment in Madrid site",
    primary_endpoint: "Change in Ejection Fraction",
    secondary_endpoints: "6-Minute Walk Test, NT-proBNP Levels",
    principal_investigator: "Prof. Michael Schmidt",
    sponsor: "Pfizer Inc.",
    data_source: "EudraCT",
    last_updated_by: "System"
  },
  {
    timestamp: "2025-01-17 09:15:00",
    trial_id: "NCT05234569",
    drug_name: "PF-07304814",
    phase: "Phase I",
    therapeutic_area: "Immunology",
    indication: "Rheumatoid Arthritis",
    status: "Active",
    region: "Asia",
    start_date: "2024-09-10",
    expected_end_date: "2025-06-30",
    enrolled_count: "35",
    target_enrollment: "80",
    completion_percent: "44",
    site_locations: "Tokyo, Seoul, Singapore, Shanghai",
    key_milestone: "Safety Assessment",
    next_milestone_date: "2025-02-28",
    milestone_status: "At Risk",
    bottleneck_category: "Regulatory",
    bottleneck_description: "Pending approval for dose escalation in Japan",
    primary_endpoint: "Safety and Tolerability",
    secondary_endpoints: "Pharmacokinetics, Immunogenicity",
    principal_investigator: "Dr. Yuki Tanaka",
    sponsor: "Pfizer Inc.",
    data_source: "PMDA",
    last_updated_by: "System"
  },
  {
    timestamp: "2025-01-18 11:45:00",
    trial_id: "NCT05234570",
    drug_name: "PF-06650833",
    phase: "Phase II",
    therapeutic_area: "Neurology",
    indication: "Alzheimer's Disease",
    status: "Active",
    region: "Global",
    start_date: "2024-01-20",
    expected_end_date: "2026-01-20",
    enrolled_count: "520",
    target_enrollment: "800",
    completion_percent: "65",
    site_locations: "New York, London, Sydney, Toronto, Berlin",
    key_milestone: "12-Month Follow-up",
    next_milestone_date: "2025-05-20",
    milestone_status: "On Track",
    bottleneck_category: "",
    bottleneck_description: "",
    primary_endpoint: "Cognitive Function Change",
    secondary_endpoints: "Amyloid PET, CDR-SB Score",
    principal_investigator: "Dr. Emily Roberts",
    sponsor: "Pfizer Inc.",
    data_source: "ClinicalTrials.gov",
    last_updated_by: "System"
  },
  {
    timestamp: "2025-01-19 16:00:00",
    trial_id: "NCT05234571",
    drug_name: "PF-07081532",
    phase: "Phase III",
    therapeutic_area: "Infectious Disease",
    indication: "COVID-19",
    status: "Recruiting",
    region: "South America",
    start_date: "2024-11-01",
    expected_end_date: "2025-08-31",
    enrolled_count: "280",
    target_enrollment: "900",
    completion_percent: "31",
    site_locations: "São Paulo, Buenos Aires, Mexico City",
    key_milestone: "Target Enrollment Milestone",
    next_milestone_date: "2025-03-15",
    milestone_status: "Delayed",
    bottleneck_category: "Site Activation",
    bottleneck_description: "Delayed site activation in Buenos Aires due to equipment delivery issues",
    primary_endpoint: "Viral Load Reduction",
    secondary_endpoints: "Hospitalization Rate, Time to Recovery",
    principal_investigator: "Dr. Carlos Martinez",
    sponsor: "Pfizer Inc.",
    data_source: "ANMAT",
    last_updated_by: "System"
  },
  {
    timestamp: "2025-01-20 08:30:00",
    trial_id: "NCT05234572",
    drug_name: "PF-06882961",
    phase: "Phase I",
    therapeutic_area: "Oncology",
    indication: "Breast Cancer",
    status: "Active",
    region: "North America",
    start_date: "2024-10-05",
    expected_end_date: "2025-10-05",
    enrolled_count: "42",
    target_enrollment: "60",
    completion_percent: "70",
    site_locations: "Houston, Miami, Los Angeles, Seattle",
    key_milestone: "Dose Escalation Phase 2",
    next_milestone_date: "2025-02-15",
    milestone_status: "On Track",
    bottleneck_category: "",
    bottleneck_description: "",
    primary_endpoint: "Maximum Tolerated Dose",
    secondary_endpoints: "Tumor Response Rate, Pharmacodynamics",
    principal_investigator: "Dr. Jennifer Lee",
    sponsor: "Pfizer Inc.",
    data_source: "ClinicalTrials.gov",
    last_updated_by: "System"
  }
];

export const fetchClinicalTrialsData = async (): Promise<any[]> => {
  const RANGE = "Clinical_Trials_Tracker!A:Y";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}?key=${GOOGLE_SHEETS_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch data: ${response.statusText}`);

    const data = await response.json();
    const rows = data.values || [];
    const dataRows = rows.slice(1); // skip headers

    if (dataRows.length === 0) {
      console.log("[QA] No data in sheet, using sample clinical trials data");
      return getSampleClinicalTrialsData();
    }

    const trials = dataRows.map((row: string[]) => ({
      timestamp: row[0] || "",
      trial_id: row[1] || "",
      drug_name: row[2] || "",
      phase: row[3] || "",
      therapeutic_area: row[4] || "",
      indication: row[5] || "",
      status: row[6] || "",
      region: row[7] || "",
      start_date: row[8] || "",
      expected_end_date: row[9] || "",
      enrolled_count: row[10] || "",
      target_enrollment: row[11] || "",
      completion_percent: row[12] || "",
      site_locations: row[13] || "",
      key_milestone: row[14] || "",
      next_milestone_date: row[15] || "",
      milestone_status: row[16] || "",
      bottleneck_category: row[17] || "",
      bottleneck_description: row[18] || "",
      primary_endpoint: row[19] || "",
      secondary_endpoints: row[20] || "",
      principal_investigator: row[21] || "",
      sponsor: row[22] || "",
      data_source: row[23] || "",
      last_updated_by: row[24] || "",
    }));

    console.log(`[QA] Detected ${trials.length} trials from Clinical_Trials_Tracker`);
    
    return trials;
  } catch (error) {
    console.error("Error fetching Clinical Trials data:", error);
    console.log("[QA] Using sample clinical trials data as fallback");
    return getSampleClinicalTrialsData();
  }
};

// Fetch and merge data from all Google Sheets tabs
export const fetchAllSheetsData = async (): Promise<any[]> => {
  const doFetch = async (): Promise<any[]> => {
    try {
      await detectAndMapSheets();
    } catch (e) {
      console.warn('[QA] detectAndMapSheets failed, continuing with defaults:', e);
    }

    const sheets = Object.keys(sheetLabelMap).map(sheetName => ({
      name: sheetName,
      range: `${sheetName}!A:Z`
    }));

    const allData: any[] = [];
    const startTime = performance.now();

    for (const sheet of sheets) {
      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${sheet.range}?key=${GOOGLE_SHEETS_API_KEY}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(url, { signal: controller.signal }).catch((err) => {
          console.warn(`[QA] Fetch aborted or failed for ${sheet.name}:`, err?.name || err);
          return undefined as any;
        });
        clearTimeout(timeout);

        if (!response || !response.ok) {
          console.warn(`Failed to fetch ${sheet.name}${response ? `: ${response.statusText}` : ''}`);
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
        continue;
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

  // Global timeout safeguard so the UI never hangs
  const TIMEOUT_MS = 10000;
  try {
    return await Promise.race([
      doFetch(),
      new Promise<any[]>((resolve) => {
        setTimeout(() => {
          console.warn(`[QA] fetchAllSheetsData timed out after ${TIMEOUT_MS}ms — returning offline fallback []`);
          resolve([]);
        }, TIMEOUT_MS);
      }),
    ]);
  } catch (e) {
    console.error('[QA] fetchAllSheetsData failed:', e);
    return [];
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
