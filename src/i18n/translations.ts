export type Language = 'en' | 'bn';

export interface Translations {
  appTitle: string;
  appSubtitle: string;
  systemReady: string;
  routingActive: string;
  routeUpdated: string;
  hazardSimulated: string;
  noRouteStatus: string;
  startBlockedStatus: string;
  
  importButton: string;
  loadSample: string;
  loadComplex: string;
  downloadSample: string;
  resetButton: string;
  resetTooltip: string;
  
  selectStartTitle: string;
  selectStartPlaceholder: string;
  clickMapHint: string;
  
  routeAvailable: string;
  destinationExit: string;
  totalCost: string;
  corridorCount: string;
  corridorUnit: string;
  routeSequence: string;
  
  noRouteTitle: string;
  noRouteDesc: string;
  
  startBlockedTitle: string;
  startBlockedDesc: string;
  
  noStartSelectedTitle: string;
  noStartSelectedDesc: string;
  
  hazardControlTitle: string;
  nodesTab: string;
  corridorsTab: string;
  exitsTab: string;
  searchPlaceholder: string;
  
  statusOpen: string;
  statusBlocked: string;
  statusClosed: string;
  
  roomLabel: string;
  junctionLabel: string;
  exitLabel: string;
  
  legendTitle: string;
  legendRoom: string;
  legendJunction: string;
  legendOpenExit: string;
  legendClosedExit: string;
  legendChosenExit: string;
  legendActiveRoute: string;
  legendBlockedNode: string;
  legendBlockedCorridor: string;
  legendStartNode: string;
  
  zoomIn: string;
  zoomOut: string;
  resetZoom: string;
  
  validationErrorTitle: string;
  validationErrorSubtitle: string;
  validationClose: string;
  
  emptyStateTitle: string;
  emptyStateDesc: string;
  emptyStateAction: string;
  emptyStateOrTry: string;
  
  routeStepWalkthrough: string;
  stepPrev: string;
  stepNext: string;
  stepOf: string;
  
  exportMap: string;
  auditLogTitle: string;
  clearLog: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appTitle: 'SMART ESCAPE',
    appSubtitle: 'Interactive Evacuation Route Simulator',
    systemReady: 'SYSTEM READY',
    routingActive: 'ROUTING ACTIVE',
    routeUpdated: 'Route updated',
    hazardSimulated: 'HAZARDS ACTIVE',
    noRouteStatus: 'NO ROUTE',
    startBlockedStatus: 'START BLOCKED',

    importButton: 'Import Building JSON',
    loadSample: 'Load Spec Sample',
    loadComplex: 'Load Medical Center',
    downloadSample: 'Get Sample JSON',
    resetButton: 'Reset to Initial State',
    resetTooltip: 'Restores the original hazards defined in the imported JSON file',

    selectStartTitle: 'START LOCATION',
    selectStartPlaceholder: 'Choose unblocked room or junction...',
    clickMapHint: 'Or click any unblocked room/junction on the map',

    routeAvailable: 'EVACUATION ROUTE FOUND',
    destinationExit: 'Destination Exit',
    totalCost: 'Total Evacuation Cost',
    corridorCount: 'Corridors Traversed',
    corridorUnit: 'corridors',
    routeSequence: 'Path Sequence',

    noRouteTitle: 'No Route Available',
    noRouteDesc: 'No open exit can be reached from the selected starting location under current hazard conditions.',

    startBlockedTitle: 'Starting Location Blocked',
    startBlockedDesc: 'The selected starting location is currently unavailable due to active hazard. Choose another room or clear the blockage.',

    noStartSelectedTitle: 'Select Starting Location',
    noStartSelectedDesc: 'Please choose an evacuation origin from the dropdown above or click any room or junction directly on the floor plan.',

    hazardControlTitle: 'HAZARD SIMULATION CENTER',
    nodesTab: 'Rooms & Junctions',
    corridorsTab: 'Corridors',
    exitsTab: 'Exits',
    searchPlaceholder: 'Search by ID or label...',

    statusOpen: 'OPEN',
    statusBlocked: 'BLOCKED',
    statusClosed: 'CLOSED',

    roomLabel: 'Room',
    junctionLabel: 'Junction',
    exitLabel: 'Exit Gate',

    legendTitle: 'MAP LEGEND',
    legendRoom: 'Room',
    legendJunction: 'Junction',
    legendOpenExit: 'Open Exit',
    legendClosedExit: 'Closed Exit',
    legendChosenExit: 'Evacuation Exit',
    legendActiveRoute: 'Evacuation Route',
    legendBlockedNode: 'Blocked Node',
    legendBlockedCorridor: 'Blocked Corridor',
    legendStartNode: 'Start Location',

    zoomIn: 'Zoom In',
    zoomOut: 'Zoom Out',
    resetZoom: 'Fit to View',

    validationErrorTitle: 'INVALID BUILDING FILE',
    validationErrorSubtitle: 'Please correct the highlighted issues in your JSON file and import again:',
    validationClose: 'Dismiss & Fix File',

    emptyStateTitle: 'SMART ESCAPE SIMULATOR',
    emptyStateDesc: 'Upload a building floor plan JSON to visualize architectural nodes, simulate dynamic hazards, and compute optimal evacuation paths.',
    emptyStateAction: 'Import Building JSON',
    emptyStateOrTry: 'Or test with pre-built dataset:',

    routeStepWalkthrough: 'Route Step Walkthrough',
    stepPrev: 'Previous',
    stepNext: 'Next',
    stepOf: 'of',

    exportMap: 'Export Map SVG',
    auditLogTitle: 'Simulation Activity Log',
    clearLog: 'Clear Log',
  },
  bn: {
    appTitle: 'স্মার্ট এস্কেপ',
    appSubtitle: 'ইন্টারেক্টিভ উদ্ধার রুট সিমুলেটর',
    systemReady: 'সিস্টেম প্রস্তুত',
    routingActive: 'রুট সক্রিয়',
    routeUpdated: 'রুট হালনাগাদ হয়েছে',
    hazardSimulated: 'বিপদ সক্রিয়',
    noRouteStatus: 'কোনো রুট নেই',
    startBlockedStatus: 'শুরুর স্থান অবরুদ্ধ',

    importButton: 'ভবন JSON ইমপোর্ট করুন',
    loadSample: 'অফিসিয়াল নমুনা লোড',
    loadComplex: 'মেডিক্যাল সেন্টার লোড',
    downloadSample: 'নমুনা JSON সংগ্রহ',
    resetButton: 'মূল অবস্থায় রিসেট',
    resetTooltip: 'আমদানিকৃত ফাইলে সংরক্ষিত মূল বিপত্তি অবস্থায় ফিরিয়ে নেয়',

    selectStartTitle: 'শুরুর অবস্থান নির্বাচন',
    selectStartPlaceholder: 'উন্মুক্ত কক্ষ বা জংশন বাছুন...',
    clickMapHint: 'অথবা মানচিত্রের যেকোনো উন্মুক্ত স্থান স্পর্শ করুন',

    routeAvailable: 'নিরাপদ উদ্ধার রুট প্রস্তুত',
    destinationExit: 'গন্তব্য প্রস্থান গেট',
    totalCost: 'মোট উদ্ধার দূরত্ব ব্যয়',
    corridorCount: 'অতিক্রান্ত করিডোর সংখ্যা',
    corridorUnit: 'টি করিডোর',
    routeSequence: 'উদ্ধার পথ ক্রম',

    noRouteTitle: 'কোনো রুট পাওয়া যায়নি',
    noRouteDesc: 'বর্তমান বিপত্তি পরিস্থিতিতে নির্বাচিত অবস্থান থেকে কোনো উন্মুক্ত প্রস্থানে পৌঁছানো সম্ভব নয়।',

    startBlockedTitle: 'শুরুর অবস্থান অবরুদ্ধ',
    startBlockedDesc: 'নির্বাচিত শুরুর অবস্থানটিতে বর্তমানে বিপত্তি রয়েছে। অনুগ্রহ করে অন্য কোনো স্থান নির্বাচন করুন অথবা বিপত্তি অপসারণ করুন।',

    noStartSelectedTitle: 'শুরুর অবস্থান নির্বাচন করুন',
    noStartSelectedDesc: 'অনুগ্রহ করে উপরের ড্রপডাউন থেকে প্রস্থান শুরুর স্থান বাছুন অথবা সরাসরি মানচিত্রে ক্লিক করুন।',

    hazardControlTitle: 'বিপত্তি ও প্রতিবন্ধকতা নিয়ন্ত্রণ',
    nodesTab: 'কক্ষ ও জংশনসমূহ',
    corridorsTab: 'করিডোরসমূহ',
    exitsTab: 'বহির্গমন পথসমূহ',
    searchPlaceholder: 'আইডি বা নাম দিয়ে খুঁজুন...',

    statusOpen: 'উন্মুক্ত',
    statusBlocked: 'অবরুদ্ধ',
    statusClosed: 'বন্ধ',

    roomLabel: 'কক্ষ',
    junctionLabel: 'জংশন',
    exitLabel: 'প্রস্থান গেট',

    legendTitle: 'মানচিত্র নির্দেশিকা',
    legendRoom: 'কক্ষ',
    legendJunction: 'জংশন',
    legendOpenExit: 'উন্মুক্ত প্রস্থান',
    legendClosedExit: 'বন্ধ প্রস্থান',
    legendChosenExit: 'নির্ধারিত উদ্ধার প্রস্থান',
    legendActiveRoute: 'সক্রিয় উদ্ধার রুট',
    legendBlockedNode: 'অবরুদ্ধ নোড',
    legendBlockedCorridor: 'অবরুদ্ধ করিডোর',
    legendStartNode: 'শুরুর অবস্থান',

    zoomIn: 'বড় করুন',
    zoomOut: 'ছোট করুন',
    resetZoom: 'ম্যাপ রিসেট',

    validationErrorTitle: 'ভবন ফাইলটি সঠিক নয়',
    validationErrorSubtitle: 'অনুগ্রহ করে আপনার JSON ফাইলের নিম্নলিখিত ত্রুটিগুলো সংশোধন করে পুনরায় ইমপোর্ট করুন:',
    validationClose: 'বাতিল ও সংশোধন করুন',

    emptyStateTitle: 'স্মার্ট এস্কেপ সিমুলেটর',
    emptyStateDesc: 'ভবনের ফ্লোরপ্ল্যান দেখতে, জরুরি বিপত্তি সিমুলেট করতে এবং দ্রুততম নিরাপদ উদ্ধার রুট গণনা করতে ভবন JSON ফাইল ইমপোর্ট করুন।',
    emptyStateAction: 'ভবন JSON ইমপোর্ট করুন',
    emptyStateOrTry: 'অথবা নমুনা ভবন দিয়ে পরীক্ষা করুন:',

    routeStepWalkthrough: 'ধাপে ধাপে পথ পর্যালোচনা',
    stepPrev: 'পূর্ববর্তী ধাপ',
    stepNext: 'পরবর্তী ধাপ',
    stepOf: 'এর',

    exportMap: 'ম্যাপ SVG ডাউনলোড',
    auditLogTitle: 'সিমুলেশন কার্যক্রম লগ',
    clearLog: 'লগ মুছে ফেলুন',
  },
};
