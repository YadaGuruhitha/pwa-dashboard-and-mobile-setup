/**
 * Base English Translation Dictionary (Reference for all 22 Indic Locales)
 */
export const en: Record<string, string> = {
  // Brand & Header
  appName: "Krishi Jal",
  appTagline: "AI Smart Irrigation & Predictive Crop Water Management",
  welcomeFarmer: "Namaste, Ramesh Gowda",
  farmLocation: "Mandya, Karnataka",
  demoModeBadge: "AI Simulation Active",
  
  // Navigation
  navLanding: "Home / Overview",
  navDashboard: "Dashboard",
  navFields: "Fields & Sensors",
  navConfig: "Crop & Sensor Setup",
  navSchedule: "Irrigation Schedule",
  navWeather: "Agro Weather",
  navAnalytics: "Analytics & Water Savings",
  navVoice: "Krishi Mitra Voice",
  navAlerts: "Alerts Hub",
  navReports: "PDF & CSV Reports",
  navSettings: "Language & Settings",
  navAbout: "Project Information",

  // Auth & Onboarding
  loginTitle: "Farmer Portal Login",
  registerTitle: "Register New Farm",
  phonePlaceholder: "10-digit mobile number",
  passwordPlaceholder: "Enter your password",
  signIn: "Sign In",
  signUp: "Register Account",
  quickDemoLogin: "One-Tap Demo Login (Ramesh Gowda)",
  dontHaveAccount: "New farmer? Register here",
  alreadyHaveAccount: "Already registered? Sign in",
  logout: "Log Out",

  // Field & Soil Moisture Statuses
  criticalDry: "Critically Dry (Urgent Water Needed)",
  moderateMoisture: "Moderate (Monitor Closely)",
  optimalMoisture: "Optimal Moisture (Healthy Soil)",
  overWatered: "Saturated / Over-Watered",
  moistureLevel: "Soil Moisture",
  targetRange: "Optimal Target Range",
  lastWatered: "Last Watered",
  acres: "Acres",
  addField: "Register New Field",
  configureSensors: "Configure Sensors",
  fieldCapacityLabel: "Field Capacity",
  wiltingPointLabel: "Wilting Point",

  // Motor & Pump Controls
  pumpStatus: "Motor Pump Status",
  pumpOn: "Pump ON",
  pumpOff: "Pump OFF",
  pumpAuto: "AI Auto Mode",
  turnOnPump: "Start Pump",
  turnOffPump: "Stop Pump",
  manualOverride: "Manual Override",
  autoScheduleActive: "AI Auto Schedule Active",

  // ML Prediction & Advisory
  aiAdvisory: "AI Irrigation Recommendation",
  predictWithAi: "Run AI Analysis",
  needsWaterYes: "Watering Needed Today",
  needsWaterNo: "No Irrigation Needed Today",
  recVolume: "Recommended Water Volume",
  recDuration: "Motor Runtime",
  optimalSlot: "Best Time Slot",
  waterSavedEst: "Estimated Water Conserved",
  rainGuardActive: "Rain Guard Protected",
  predictionConfidence: "Model Confidence",
  featureImportance: "Key Agricultural Factors",

  // Weather & Microclimate
  weatherTitle: "Farm Weather Forecast",
  temperature: "Temperature",
  humidity: "Air Humidity",
  rainForecast: "Rain Forecast (24h)",
  evapotranspiration: "ET₀ Evapotranspiration",
  simulatedTag: "Live Simulation Data",
  hourlyForecast: "Hourly Microclimate Forecast",
  rainProbability: "Rain Probability",
  windSpeed: "Wind Speed",
  solarRadiation: "Solar Radiation",

  // Irrigation Schedules
  todaysSchedules: "Today's Irrigation Plan",
  weeklySchedules: "7-Day Smart Schedule",
  generateAutoSchedule: "Auto-Optimize Schedule",
  markCompleted: "Mark Done",
  skipRain: "Skip (Rain Expected)",
  pendingStatus: "Scheduled",
  completedStatus: "Completed",
  skippedStatus: "Skipped",
  nextIrrigationIn: "Next Cycle in",
  cycleDuration: "Duration",

  // Voice Assistant
  voiceTitle: "Krishi Mitra Voice Assistant",
  voiceSubtitle: "Speak in your native language for instant crop and irrigation answers",
  speakNow: "Tap & Speak to Krishi Mitra",
  listening: "Listening...",
  processingVoice: "Consulting AI Engine...",
  suggestedQueries: "Quick Tap Questions",
  voiceFallbackNotice: "Voice synthesis fallback: Showing response in text.",
  sarvamBadge: "Powered by Sarvam AI",

  // Water Savings & Financial ROI
  waterSavingsTitle: "Predictive Water Conservation",
  totalWaterSaved: "Total Water Saved",
  electricitySaved: "Electricity Conserved",
  moneySaved: "Estimated Cost Saved",
  efficiencyScore: "Irrigation Efficiency",
  downloadCsv: "Download CSV Data",
  downloadPdf: "Download PDF Report",
  cumulativeSavings: "Cumulative Water Preservation",

  // Alerts & Notifications
  alertsTitle: "Field Notifications",
  allCaughtUp: "All fields are in healthy condition",
  simulateTelemetry: "Simulate Sensor Pulse",
  lowBandwidthMode: "Rural Low-Bandwidth Mode Active",
  criticalAlert: "Critical Moisture Alert",
  weatherAlert: "Weather & Rain Alert",
  pumpAlert: "Motor Pump Alert",

  // Settings & Preferences
  ruralModeLabel: "Rural Low-Bandwidth Mode",
  ruralModeDesc: "Minimizes background network calls and disables heavy animations for 2G/3G connectivity.",
  voiceSettings: "Voice Assistant Settings",
  saveSettings: "Save Preferences",
  selectLanguage: "Select Farmer Language",
  allScheduledLanguages: "22 Scheduled Indian Languages",
  regionalLanguages: "Regional Dialects & Varieties",
  languageSearchPlaceholder: "Search by language name, script, or state...",
  clearCache: "Clear Offline Cached Data",
  profileInfo: "Farmer Profile Details",

  // Common UI Actions & Tooltips
  save: "Save",
  cancel: "Cancel",
  close: "Close",
  back: "Back",
  refresh: "Refresh Data",
  edit: "Edit",
  delete: "Delete",
  confirm: "Confirm",
  status: "Status",
  details: "View Details",
  actions: "Actions",
  filter: "Filter",
  search: "Search",
  viewAll: "View All",

  // Units
  litersUnit: "Liters",
  acresUnit: "Acres",
  mmUnit: "mm",
  celsiusUnit: "°C",
  kwhUnit: "kWh",
  rupeeSymbol: "₹",
};
