# ─────────────────────────────────────────────────────────────
# Krishi-Sakhi — Comprehensive Government Schemes Database
# Covering all major central and state agricultural schemes
# ─────────────────────────────────────────────────────────────

SCHEME_CATEGORIES = [
    {"code": "all", "label": "All Schemes", "icon": "Layers", "color": "emerald"},
    {"code": "income", "label": "Income & Pension", "icon": "Wallet", "color": "emerald"},
    {"code": "insurance", "label": "Crop Insurance", "icon": "ShieldCheck", "color": "blue"},
    {"code": "credit", "label": "Credit & Loans", "icon": "Landmark", "color": "amber"},
    {"code": "irrigation", "label": "Solar & Irrigation", "icon": "Sun", "color": "yellow"},
    {"code": "machinery", "label": "Machinery & Drones", "icon": "Tractor", "color": "purple"},
    {"code": "organic", "label": "Organic & Soil Health", "icon": "Sprout", "color": "lime"},
    {"code": "infrastructure", "label": "Storage & Post-Harvest", "icon": "Warehouse", "color": "orange"},
    {"code": "horticulture", "label": "Horticulture & Honey", "icon": "Apple", "color": "rose"},
    {"code": "livestock", "label": "Livestock & Fisheries", "icon": "Fish", "color": "cyan"},
    {"code": "marketing", "label": "Marketing & e-NAM", "icon": "TrendingUp", "color": "indigo"},
    {"code": "women_youth", "label": "Women & Youth", "icon": "Users", "color": "pink"}
]

SCHEMES_DATABASE = [
    # ── 1. Income Support & Social Security ──────────────────
    {
        "id": "pm_kisan",
        "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "regional_name": "प्रधानमंत्री किसान सम्मान निधि",
        "category": "Income & Pension",
        "category_code": "income",
        "benefit": "₹6,000 per year transferred directly to bank accounts in 3 equal four-monthly installments of ₹2,000 each.",
        "subsidy_amount": "₹6,000 / Year (100% Direct Benefit Transfer)",
        "eligibility": "All landholding farmer families across India having cultivable agricultural land in their name.",
        "documents": "Aadhaar Card, Land ownership record (Khatauni/7/12 extract), Aadhaar-linked Bank Account.",
        "state": "Pan-India",
        "crops": "All Crops",
        "badge": "Central Sector",
        "apply_url": "https://pmkisan.gov.in",
        "department": "Ministry of Agriculture & Farmers Welfare"
    },
    {
        "id": "pm_kmy",
        "name": "PM-KMY (Pradhan Mantri Kisan Maan Dhan Yojana)",
        "regional_name": "प्रधानमंत्री किसान मान-धन योजना",
        "category": "Income & Pension",
        "category_code": "income",
        "benefit": "Assured minimum monthly pension of ₹3,000 to small and marginal farmers upon attaining 60 years of age.",
        "subsidy_amount": "₹3,000 / Month Pension",
        "eligibility": "Small and marginal farmers owning cultivable land up to 2 hectares (5 acres), entry age 18 to 40 years.",
        "documents": "Aadhaar Card, Savings Bank Account / Jan Dhan Account, Land Record copy.",
        "state": "Pan-India",
        "crops": "All Crops",
        "badge": "Old Age Security",
        "apply_url": "https://maandhan.in",
        "department": "Department of Agriculture & Farmers Welfare / LIC"
    },
    {
        "id": "rythu_bharosa",
        "name": "Rythu Bharosa / Rythu Bandhu Investment Support",
        "regional_name": "రైతు బంధు / రైతు భరోసా",
        "category": "Income & Pension",
        "category_code": "income",
        "benefit": "Direct investment support of ₹10,000 to ₹13,500 per acre per year for purchasing seasonal farming inputs.",
        "subsidy_amount": "₹10,000 - ₹13,500 / Acre / Year",
        "eligibility": "Cultivating landholders and tenant farmers registered in Andhra Pradesh and Telangana.",
        "documents": "Pattadar Passbook, Aadhaar Card, Active Bank Account.",
        "state": "Telangana & Andhra Pradesh",
        "crops": "All Crops",
        "badge": "State Scheme",
        "apply_url": "https://ysrrythubharosa.ap.gov.in",
        "department": "State Agriculture Department"
    },
    {
        "id": "kalia_scheme",
        "name": "KALIA (Krushak Assistance for Livelihood and Income Augmentation)",
        "regional_name": "କାଳିଆ ଯୋଜନା (ଓଡ଼ିଶା)",
        "category": "Income & Pension",
        "category_code": "income",
        "benefit": "Financial assistance of ₹10,000/year for small/marginal farmers and ₹12,500 for landless agricultural laborers.",
        "subsidy_amount": "₹10,000 - ₹12,500 / Year",
        "eligibility": "Small, marginal, and landless agricultural households in Odisha.",
        "documents": "Aadhaar Card, Ration Card, Bank Passbook.",
        "state": "Odisha",
        "crops": "All Crops",
        "badge": "State Scheme",
        "apply_url": "https://kalia.odisha.gov.in",
        "department": "Government of Odisha"
    },

    # ── 2. Crop Insurance & Risk Mitigation ───────────────────
    {
        "id": "pmfby",
        "name": "PMFBY (Pradhan Mantri Fasal Bima Yojana)",
        "regional_name": "प्रधानमंत्री फसल बीमा योजना",
        "category": "Crop Insurance",
        "category_code": "insurance",
        "benefit": "Comprehensive risk insurance covering post-sowing to post-harvest yield loss due to non-preventable natural risks (drought, flood, unseasonal hail, pests).",
        "subsidy_amount": "Farmer pays only 1.5% (Rabi) / 2% (Kharif) / 5% (Commercial), rest paid by Govt.",
        "eligibility": "All farmers growing notified crops in notified areas (both loanee and non-loanee farmers).",
        "documents": "Land record (RoR/7-12), Sowing Certificate, Aadhaar Card, Bank Passbook.",
        "state": "Pan-India",
        "crops": "Cereals, Pulses, Oilseeds, Commercial & Horticultural Crops",
        "badge": "Comprehensive Insurance",
        "apply_url": "https://pmfby.gov.in",
        "department": "Ministry of Agriculture & Farmers Welfare"
    },
    {
        "id": "wbcis",
        "name": "Restructured Weather Based Crop Insurance Scheme (WBCIS)",
        "regional_name": "मौसम आधारित फसल बीमा योजना",
        "category": "Crop Insurance",
        "category_code": "insurance",
        "benefit": "Parametric insurance payout triggered automatically by weather station deviations (rainfall deficit, frost, heat waves, high humidity).",
        "subsidy_amount": "Heavily Subsidized Premium (Max 5% borne by farmer)",
        "eligibility": "Cultivators growing notified horticultural, spice, and food crops in reference weather station command zones.",
        "documents": "Land tenure record / Tenancy agreement, Aadhaar Card, Bank details.",
        "state": "Pan-India",
        "crops": "Fruits, Vegetables, Spices, Cotton, Sugarcane",
        "badge": "Parametric Weather Cover",
        "apply_url": "https://pmfby.gov.in",
        "department": "Agriculture Insurance Company of India (AIC)"
    },

    # ── 3. Credit & Subsidized Loans ─────────────────────────
    {
        "id": "kcc",
        "name": "KCC (Kisan Credit Card Scheme)",
        "regional_name": "किसान क्रेडिट कार्ड योजना",
        "category": "Credit & Loans",
        "category_code": "credit",
        "benefit": "Revolving credit line up to ₹3,00,000 for crop cultivation, farm maintenance, post-harvest expenses, dairy, and fisheries.",
        "subsidy_amount": "4% Effective Interest Rate (with prompt repayment subvention) + Collateral-free up to ₹1.6 Lakh",
        "eligibility": "Individual/joint cultivators, tenant farmers, oral lessees, sharecroppers, and allied activity farmers (dairy/poultry/fishers).",
        "documents": "Land records, Identity proof, Address proof, Passport photos, Crop cultivation declaration.",
        "state": "Pan-India",
        "crops": "All Agricultural & Allied Commodities",
        "badge": "Low-Interest Credit",
        "apply_url": "https://myscheme.gov.in/schemes/kcc",
        "department": "NABARD / Reserve Bank of India"
    },
    {
        "id": "miss_scheme",
        "name": "Modified Interest Subvention Scheme (MISS)",
        "regional_name": "संशोधित ब्याज सबवेंशन योजना",
        "category": "Credit & Loans",
        "category_code": "credit",
        "benefit": "Central interest subvention of 1.5% to lending institutions plus 3% extra rebate to farmers on prompt repayment, reducing interest from 7% to 4%.",
        "subsidy_amount": "3% Prompt Repayment Incentive",
        "eligibility": "Farmers who borrow short-term crop loans up to ₹3 Lakh through commercial, cooperative, or regional rural banks.",
        "documents": "Active KCC account with good repayment track record.",
        "state": "Pan-India",
        "crops": "All Crops",
        "badge": "Interest Rebate",
        "apply_url": "https://agricoop.nic.in",
        "department": "Ministry of Agriculture & Farmers Welfare"
    },

    # ── 4. Solar & Irrigation ────────────────────────────────
    {
        "id": "pm_kusum",
        "name": "PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan)",
        "regional_name": "पीएम-कुसुम सौर ऊर्जा योजना",
        "category": "Solar & Irrigation",
        "category_code": "irrigation",
        "benefit": "Installation of standalone off-grid solar agriculture pumps and solarization of existing grid-connected agricultural pumps with option to sell excess power to the grid.",
        "subsidy_amount": "Up to 60% Financial Subsidy (30% Central + 30% State) + 30% Bank Loan",
        "eligibility": "Individual farmers, farmer groups, cooperatives, and Water User Associations (WUAs).",
        "documents": "Land possession certificate, Water source verification, Aadhaar, Bank Details, Electricity connection copy.",
        "state": "Pan-India",
        "crops": "All Crops",
        "badge": "Solar Energy",
        "apply_url": "https://pmkusum.mnre.gov.in",
        "department": "Ministry of New and Renewable Energy (MNRE)"
    },
    {
        "id": "pmksy_pdmc",
        "name": "PMKSY - Per Drop More Crop (Micro-Irrigation)",
        "regional_name": "प्रधानमंत्री कृषि सिंचाई योजना - प्रति बूंद अधिक फसल",
        "category": "Solar & Irrigation",
        "category_code": "irrigation",
        "benefit": "Capital subsidy on precision micro-irrigation systems including drip irrigation, inline drippers, micro-sprinklers, and portable sprinkler sets.",
        "subsidy_amount": "55% Subsidy for Small/Marginal Farmers, 45% for Other Farmers",
        "eligibility": "All farmers with an assured water source and cultivable land ownership or valid long-term lease.",
        "documents": "Land ownership documents (7/12 or RoR), Water test / source certificate, Aadhaar, Bank Passbook.",
        "state": "Pan-India",
        "crops": "Horticulture, Vegetables, Sugarcane, Cotton, Maize, Pulses",
        "badge": "Water Conservation",
        "apply_url": "https://pmksy.gov.in",
        "department": "Department of Agriculture & Farmers Welfare"
    },

    # ── 5. Farm Mechanization & Drones ────────────────────────
    {
        "id": "smam_scheme",
        "name": "SMAM (Sub-Mission on Agricultural Mechanization)",
        "regional_name": "कृषि यंत्रीकरण उप-मिशन",
        "category": "Machinery & Drones",
        "category_code": "machinery",
        "benefit": "Financial assistance on modern farm machinery including tractors, power tillers, rotavators, multi-crop threshers, laser land levelers, and combine harvesters.",
        "subsidy_amount": "40% to 50% Capital Subsidy on Machinery Cost",
        "eligibility": "All landholding farmers. Preferential allocation for small, marginal, women, SC/ST cultivators.",
        "documents": "Aadhaar Card, Land Record / Patta, Quotation from authorized dealer, Bank Passbook.",
        "state": "Pan-India",
        "crops": "All Crops",
        "badge": "Farm Machinery",
        "apply_url": "https://agrimachinery.nic.in",
        "department": "Ministry of Agriculture & Farmers Welfare"
    },
    {
        "id": "kisan_drone",
        "name": "Kisan Drone Subsidy Scheme",
        "regional_name": "किसान ड्रोन अनुदान योजना",
        "category": "Machinery & Drones",
        "category_code": "machinery",
        "benefit": "Direct financial assistance to purchase DGCA-type-certified agricultural drones for precision spraying of pesticides, bio-fertilizers, and liquid nano urea.",
        "subsidy_amount": "40% to 50% Subsidy (Up to ₹5,00,000 for individual farmers/women)",
        "eligibility": "Individual progressive farmers, FPOs, Custom Hiring Centers, and agricultural graduates.",
        "documents": "DGCA Remote Pilot License / training completion certificate, Land ownership proof, Aadhaar, Bank Details.",
        "state": "Pan-India",
        "crops": "Paddy, Cotton, Wheat, Sugarcane, Fruit Orchards",
        "badge": "Precision Tech",
        "apply_url": "https://agrimachinery.nic.in",
        "department": "Ministry of Agriculture & Farmers Welfare"
    },
    {
        "id": "chc_scheme",
        "name": "Custom Hiring Centers (CHC) Establishment Scheme",
        "regional_name": "कस्टम हायरिंग सेंटर योजना",
        "category": "Machinery & Drones",
        "category_code": "machinery",
        "benefit": "Financial grant for establishing farm machinery rental banks at village panchayat level, allowing small farmers to rent high-cost machinery at subsidized hourly rates.",
        "subsidy_amount": "40% Project Subsidy (Up to ₹10 Lakh to ₹24 Lakh per CHC)",
        "eligibility": "Rural youth entrepreneurs, Cooperative societies, Farmer Producer Organizations (FPOs), and SHGs.",
        "documents": "Detailed Project Report (DPR), Registration certificate, Land ownership/lease deed, Bank sanction letter.",
        "state": "Pan-India",
        "crops": "All Crops",
        "badge": "Rental Enterprise",
        "apply_url": "https://agrimachinery.nic.in",
        "department": "Department of Agriculture & Farmers Welfare"
    },

    # ── 6. Organic & Soil Health ─────────────────────────────
    {
        "id": "soil_health_card",
        "name": "Soil Health Card (SHC) Scheme",
        "regional_name": "मृदा स्वास्थ्य कार्ड योजना",
        "category": "Organic & Soil Health",
        "category_code": "organic",
        "benefit": "Comprehensive cycle testing of 12 vital soil parameters (NPK, Secondary nutrients, Micro-nutrients, pH, EC, Organic Carbon) with customized dosage prescriptions.",
        "subsidy_amount": "100% Free Soil Sampling & Analytical Testing",
        "eligibility": "All landholding and tenant farmers across every revenue village in India.",
        "documents": "No paper documents needed. Soil sample collected directly by village agriculture field assistants.",
        "state": "Pan-India",
        "crops": "All Crops",
        "badge": "Free Diagnostics",
        "apply_url": "https://soilhealth.dac.gov.in",
        "department": "Ministry of Agriculture & Farmers Welfare"
    },
    {
        "id": "pkvy_scheme",
        "name": "PKVY (Paramparagat Krishi Vikas Yojana)",
        "regional_name": "परम्परागत कृषि विकास योजना",
        "category": "Organic & Soil Health",
        "category_code": "organic",
        "benefit": "Financial assistance of ₹50,000 per hectare for 3 years (₹31,000 directly for organic inputs, vermicompost, botanical extracts, bio-fertilizers, and PGS-India certification).",
        "subsidy_amount": "₹50,000 / Hectare over 3 years",
        "eligibility": "Farmers organizing into clusters of 20 or more members covering 20 hectares (50 acres) of contiguous land.",
        "documents": "Cluster registration resolution, Aadhaar Card, Land ownership papers, Soil test baseline report.",
        "state": "Pan-India",
        "crops": "Organic Cereals, Millets, Spices, Pulses, Fruits, Vegetables",
        "badge": "Organic Cluster",
        "apply_url": "https://pgsindia-ncof.gov.in",
        "department": "National Centre of Organic and Natural Farming (NCONF)"
    },
    {
        "id": "bpkp_scheme",
        "name": "Bharatiya Prakritik Krishi Paddhati (BPKP - Natural Farming)",
        "regional_name": "भारतीय प्राकृतिक कृषि पद्धति",
        "category": "Organic & Soil Health",
        "category_code": "organic",
        "benefit": "Financial assistance of ₹12,200 per hectare for 3 years to adopt chemical-free, cow-based micro-formulations (Jeevamrit, Beejamrit, Ghanjeevamrit, and mulching).",
        "subsidy_amount": "₹12,200 / Hectare (3-Year Assistance)",
        "eligibility": "Gram Panchayats, FPOs, and farmer clusters practicing continuous zero-chemical natural farming.",
        "documents": "Aadhaar Card, Land ownership record, Gram Panchayat verification certificate.",
        "state": "Pan-India",
        "crops": "All Field & Horticultural Crops",
        "badge": "Natural Farming",
        "apply_url": "https://naturalfarming.dac.gov.in",
        "department": "Ministry of Agriculture & Farmers Welfare"
    },

    # ── 7. Storage, Post-Harvest & Infrastructure ─────────────
    {
        "id": "aif_scheme",
        "name": "Agriculture Infrastructure Fund (AIF)",
        "regional_name": "कृषि अवसंरचना कोष",
        "category": "Storage & Infrastructure",
        "category_code": "infrastructure",
        "benefit": "Medium to long-term debt financing for post-harvest management assets including cold stores, ripening chambers, sorting/grading units, drying yards, and grain silos.",
        "subsidy_amount": "3% Annual Interest Subvention up to ₹2 Crore + CGTMSE Credit Guarantee",
        "eligibility": "Primary Agricultural Credit Societies (PACS), FPOs, Agri-entrepreneurs, Startups, and SHGs.",
        "documents": "Detailed Project Report (DPR), Land title / Registered lease deed, Bank loan sanction, KYC.",
        "state": "Pan-India",
        "crops": "Grains, Pulses, Fruits, Vegetables, Spices",
        "badge": "Capital Infrastructure",
        "apply_url": "https://agriinfra.dac.gov.in",
        "department": "Department of Agriculture & Farmers Welfare"
    },
    {
        "id": "pmfme_scheme",
        "name": "PMFME (PM Formalisation of Micro food processing Enterprises)",
        "regional_name": "प्रधानमंत्री सूक्ष्म खाद्य उद्योग उन्नयन योजना",
        "category": "Storage & Infrastructure",
        "category_code": "infrastructure",
        "benefit": "Credit-linked capital subsidy for establishing or modernizing micro food processing units (flour mills, spice grinders, oil expellers, fruit pulp processing, packaging units).",
        "subsidy_amount": "35% Capital Subsidy (Up to ₹10,00,000 per unit)",
        "eligibility": "Individual micro food enterprises, SHGs, FPOs, and producer cooperatives under the One District One Product (ODOP) framework.",
        "documents": "Udyam Aadhaar, Bank Statement of last 6 months, Detailed Project Report, Machinery quotation.",
        "state": "Pan-India",
        "crops": "Food Grains, Oilseeds, Horticultural & Agro-processing Commodities",
        "badge": "Micro Processing",
        "apply_url": "https://pmfme.mofpi.gov.in",
        "department": "Ministry of Food Processing Industries (MoFPI)"
    },
    {
        "id": "ami_godown",
        "name": "Gramin Bhandaran Yojana / Agricultural Marketing Infrastructure (AMI)",
        "regional_name": "ग्रामीण भंडारण योजना / कृषि विपणन अवसंरचना",
        "category": "Storage & Infrastructure",
        "category_code": "infrastructure",
        "benefit": "Capital investment subsidy for the construction or renovation of scientific rural godowns, cold storages, and grain warehouses to prevent post-harvest distress sales.",
        "subsidy_amount": "25% to 33.33% Capital Subsidy (Up to ₹3 Crore project cost)",
        "eligibility": "Farmers, groups of farmers, cooperatives, FPOs, marketing boards, and agro-processing firms.",
        "documents": "Approved civil engineering blueprint, Land ownership deed, Bank sanction letter, DPR.",
        "state": "Pan-India",
        "crops": "Wheat, Paddy, Pulses, Oilseeds, Cotton",
        "badge": "Warehousing Subsidy",
        "apply_url": "https://dmi.gov.in",
        "department": "Directorate of Marketing & Inspection (DMI) / NABARD"
    },

    # ── 8. Horticulture, Floriculture & Honey ────────────────
    {
        "id": "midh_horticulture",
        "name": "MIDH (Mission for Integrated Development of Horticulture)",
        "regional_name": "एकीकृत बागवानी विकास मिशन",
        "category": "Horticulture & Honey",
        "category_code": "horticulture",
        "benefit": "Capital subsidies for commercial polyhouses, shade net structures, plastic mulching, high-density fruit orchards, mushroom cultivation, and tissue culture propagation.",
        "subsidy_amount": "Up to 50% Subsidy on Polyhouses, Shade Nets & Orchard Planting",
        "eligibility": "Individual horticulture farmers, grower societies, registered trusts, and corporate farmers.",
        "documents": "Land record (7/12 or RoR), Water availability certificate, Project proposal, Aadhaar.",
        "state": "Pan-India",
        "crops": "Fruits, Vegetables, Flowers, Spices, Aromatic Plants, Mushrooms",
        "badge": "Polyhouse & Orchards",
        "apply_url": "https://midh.gov.in",
        "department": "Mission for Integrated Development of Horticulture"
    },
    {
        "id": "nbhm_beekeeping",
        "name": "National Beekeeping & Honey Mission (NBHM)",
        "regional_name": "राष्ट्रीय मधुमक्खी पालन एवं शहद मिशन",
        "category": "Horticulture & Honey",
        "category_code": "horticulture",
        "benefit": "Promotion of the 'Sweet Revolution' through substantial subsidies for scientific bee boxes, colonies, honey extractors, queen rearing stations, and testing laboratories.",
        "subsidy_amount": "Up to 80% Subsidy for Beekeeping Equipment & Extraction Units",
        "eligibility": "Individual farmers, beekeepers, Self Help Groups, and beekeeping cooperatives.",
        "documents": "Beekeeping training certificate, Land/site migration consent, Aadhaar, Bank Details.",
        "state": "Pan-India",
        "crops": "Honey, Mustard, Sunflowers, Orchards, Litchi, Acacia",
        "badge": "Sweet Revolution",
        "apply_url": "https://nbhm.gov.in",
        "department": "National Bee Board (NBB)"
    },

    # ── 9. Livestock, Dairy & Fisheries ──────────────────────
    {
        "id": "pmmsy_fisheries",
        "name": "PMMSY (Pradhan Mantri Matsya Sampada Yojana)",
        "regional_name": "प्रधानमंत्री मत्स्य संपदा योजना",
        "category": "Livestock & Fisheries",
        "category_code": "livestock",
        "benefit": "Subsidies for constructing new fish ponds, biofloc units, recirculating aquaculture systems (RAS), feed mills, refrigerated transport vans, and deep-sea fishing equipment.",
        "subsidy_amount": "40% Subsidy for General Category, 60% for Women and SC/ST Beneficiaries",
        "eligibility": "Fishers, fish farmers, youth entrepreneurs, SHGs, JLGs, and fisheries cooperatives.",
        "documents": "Water body ownership/lease rights of at least 7 years, Fisheries department registration, DPR, Aadhaar.",
        "state": "Pan-India",
        "crops": "Aquaculture, Freshwater Fish, Shrimp, Marine Fisheries",
        "badge": "Blue Revolution",
        "apply_url": "https://pmmsy.dof.gov.in",
        "department": "Department of Fisheries"
    },
    {
        "id": "nlm_livestock",
        "name": "National Livestock Mission (NLM) - Breed Development",
        "regional_name": "राष्ट्रीय पशुधन मिशन",
        "category": "Livestock & Fisheries",
        "category_code": "livestock",
        "benefit": "Capital subsidy for establishing rural poultry parent farms, commercial sheep/goat breeding farms, pig breeding farms, and mechanized fodder seed production units.",
        "subsidy_amount": "50% Capital Subsidy (Up to ₹50,00,000 per project)",
        "eligibility": "Individual entrepreneurs, FPOs, JLGs, SHGs, and Section 8 companies.",
        "documents": "Land ownership/lease of at least 8 years, Bank appraisal letter, DPR, KYC documents.",
        "state": "Pan-India",
        "crops": "Dairy Cattle, Goats, Sheep, Poultry, Fodder Crops",
        "badge": "Livestock Breeding",
        "apply_url": "https://nlm.udyamimitra.in",
        "department": "Department of Animal Husbandry & Dairying"
    },
    {
        "id": "rgm_dairy",
        "name": "Rashtriya Gokul Mission (RGM - Indigenous Bovine Breeding)",
        "regional_name": "राष्ट्रीय गोकुल मिशन",
        "category": "Livestock & Fisheries",
        "category_code": "livestock",
        "benefit": "Financial grant for setting up breed multiplication farms for elite indigenous cattle breeds (Gir, Sahiwal, Red Sindhi, Tharparkar, Murrah) to boost milk productivity.",
        "subsidy_amount": "50% Subsidy (Up to ₹2,00,00,000)",
        "eligibility": "Individual dairy entrepreneurs, cooperatives, and cattle breeders with at least 5 acres of land.",
        "documents": "Land possession title, DPR, Bank loan sanction letter, Biosecurity declaration.",
        "state": "Pan-India",
        "crops": "Dairy & Milk Production",
        "badge": "White Revolution",
        "apply_url": "https://dahd.nic.in",
        "department": "Ministry of Fisheries, Animal Husbandry & Dairying"
    },

    # ── 10. Marketing, Value Realization & e-NAM ──────────────
    {
        "id": "enam_portal",
        "name": "e-NAM (National Agriculture Market)",
        "regional_name": "राष्ट्रीय कृषि बाजार (ई-नाम)",
        "category": "Marketing & e-NAM",
        "category_code": "marketing",
        "benefit": "Pan-India electronic trading portal integrating 1,361+ wholesale APMC mandis across 23 States/UTs; provides transparent digital bidding, free quality assaying, and direct bank payout.",
        "subsidy_amount": "Zero Brokerage / Free Digital Assaying & Direct Payment",
        "eligibility": "All farmers wanting to trade their agricultural produce directly without middleman cartels.",
        "documents": "Aadhaar Card, Mandi Registration, Active Bank Account Details, Mobile Number.",
        "state": "Pan-India",
        "crops": "209 Notified Agricultural Commodities (Grains, Oilseeds, Vegetables, Fruits)",
        "badge": "Digital Mandi",
        "apply_url": "https://enam.gov.in",
        "department": "Small Farmers' Agri-Business Consortium (SFAC)"
    },
    {
        "id": "pm_aasha",
        "name": "PM-AASHA (Pradhan Mantri Annadata Aay Sanrakshan Abhiyan)",
        "regional_name": "प्रधानमंत्री अन्नदाता आय संरक्षण अभियान",
        "category": "Marketing & e-NAM",
        "category_code": "marketing",
        "benefit": "Government price assurance umbrella comprising Price Support Scheme (PSS) physical procurement, and Price Deficiency Payment Scheme (PDPS) direct compensation when market rates fall below MSP.",
        "subsidy_amount": "100% Minimum Support Price (MSP) Guarantee",
        "eligibility": "Farmers cultivating notified oilseeds (Mustard, Groundnut, Soyabean), pulses, and copra.",
        "documents": "Farmer registration ID, Land revenue record, Crop sowing certificate, Bank Account.",
        "state": "Pan-India",
        "crops": "Oilseeds, Pulses, Copra",
        "badge": "MSP Assurance",
        "apply_url": "https://agricoop.nic.in",
        "department": "Department of Agriculture & Farmers Welfare"
    },
    {
        "id": "fpo_formation",
        "name": "Scheme for Formation and Promotion of 10,000 FPOs",
        "regional_name": "10,000 किसान उत्पादक संगठन (FPO) गठन योजना",
        "category": "Marketing & e-NAM",
        "category_code": "marketing",
        "benefit": "Financial assistance of ₹18 Lakh per FPO for 3 years, matching equity grant up to ₹15 Lakh per FPO, and credit guarantee coverage up to ₹2 Crore to enable smallholders to bulk purchase and market directly.",
        "subsidy_amount": "₹18 Lakh Management Grant + Up to ₹15 Lakh Equity Match",
        "eligibility": "Groups of at least 300 farmers in plains (100 in hilly/NER areas) registered as Producer Companies or Cooperatives.",
        "documents": "Farmer member list, Land records, Company/Society registration deed, Business Plan.",
        "state": "Pan-India",
        "crops": "All Agricultural, Horticultural & Allied Commodities",
        "badge": "Farmer Collectives",
        "apply_url": "https://sfacindia.com",
        "department": "SFAC / NABARD / NCDC"
    },

    # ── 11. Women & Youth in Agriculture ──────────────────────
    {
        "id": "namo_drone_didi",
        "name": "Namo Drone Didi Scheme (Women in Agri-Tech)",
        "regional_name": "नमो ड्रोन दीदी योजना",
        "category": "Women & Youth",
        "category_code": "women_youth",
        "benefit": "Supply of agricultural drones and certified drone pilot training to 15,000 selected Women Self Help Groups (SHGs) to provide paid precision aerial spraying services to local farmers.",
        "subsidy_amount": "80% Financial Assistance (Up to ₹8,00,000 per SHG) + Drone Pilot Training",
        "eligibility": "Members of registered Women Self Help Groups (SHGs) under Deendayal Antyodaya Yojana - DAY-NRLM.",
        "documents": "SHG registration certificate, Member Aadhaar Card, 10th pass educational qualification for designated pilot, Bank Details.",
        "state": "Pan-India",
        "crops": "All Field Crops & Orchards",
        "badge": "Women Empowerment",
        "apply_url": "https://nrlm.gov.in",
        "department": "Ministry of Rural Development / Department of Agriculture"
    },
    {
        "id": "acabc_scheme",
        "name": "Agri-Clinics and Agri-Business Centres (AC&ABC) Scheme",
        "regional_name": "कृषि क्लिनिक एवं कृषि व्यवसाय केंद्र योजना",
        "category": "Women & Youth",
        "category_code": "women_youth",
        "benefit": "Free 45-day residential entrepreneurship training followed by bank loan subsidy to setup soil testing labs, custom hiring centers, veterinary clinics, or input dealerships.",
        "subsidy_amount": "36% Composite Subsidy (44% for Women/SC/ST/NER) on Loans up to ₹20-100 Lakh",
        "eligibility": "Graduates or diploma holders in agriculture, horticulture, veterinary science, or allied biological sciences.",
        "documents": "Educational degree/diploma certificate, MANAGE training certificate, Bank loan sanction, DPR.",
        "state": "Pan-India",
        "crops": "All Agri-Ventures & Services",
        "badge": "Youth Enterprise",
        "apply_url": "https://acabcmis.gov.in",
        "department": "National Institute of Agricultural Extension Management (MANAGE) / NABARD"
    },
    {
        "id": "mksp_women",
        "name": "Mahila Kisan Sashaktikaran Pariyojana (MKSP)",
        "regional_name": "महिला किसान सशक्तिकरण परियोजना",
        "category": "Women & Youth",
        "category_code": "women_youth",
        "benefit": "Capacity building and livelihood funding to empower women in agriculture, non-timber forest produce (NTFP), and indigenous livestock rearing.",
        "subsidy_amount": "Up to 75% Funding for Community Agri-Enterprises",
        "eligibility": "Small, marginal, and landless women farmers organized into community self-help federations.",
        "documents": "Community SHG membership card, Aadhaar, Bank Account.",
        "state": "Pan-India",
        "crops": "Millet farming, Kitchen Gardens, Organic Farming, Small Ruminants",
        "badge": "Women Farmers",
        "apply_url": "https://aajeevika.gov.in",
        "department": "Ministry of Rural Development"
    }
]

def get_all_schemes(category: str = "all", state: str = "all", crop: str = "all", search: str = "", land_size_acres: float = None):
    """Filter schemes by category, state, crop, search keyword, and land size."""
    results = SCHEMES_DATABASE.copy()

    # Category filter
    if category and category.lower() not in ["all", "any"]:
        cat_lower = category.lower().strip()
        results = [
            s for s in results 
            if s["category_code"].lower() == cat_lower or s["category"].lower() == cat_lower
        ]

    # State filter
    if state and state.lower() not in ["all", "global", "india", "any"]:
        st_lower = state.lower().strip()
        results = [
            s for s in results 
            if "pan-india" in s["state"].lower() or st_lower in s["state"].lower()
        ]

    # Search filter
    if search and search.strip():
        q = search.lower().strip()
        results = [
            s for s in results 
            if q in s["name"].lower() 
            or q in s.get("regional_name", "").lower()
            or q in s["benefit"].lower() 
            or q in s["eligibility"].lower()
            or q in s["category"].lower()
            or q in s.get("subsidy_amount", "").lower()
        ]

    # Land size filter (optional filtering for small/marginal farmer specific schemes)
    if land_size_acres is not None and land_size_acres > 5.0:
        # Some schemes like PM-KMY or small-farmer subsidies are specifically for <= 2 ha (5 acres)
        # We don't remove them strictly but can annotate or order them
        pass

    return results

def get_scheme_categories_with_counts():
    """Return category metadata with live counts of matching schemes."""
    categories_with_counts = []
    total_count = len(SCHEMES_DATABASE)

    for cat in SCHEME_CATEGORIES:
        if cat["code"] == "all":
            count = total_count
        else:
            count = sum(1 for s in SCHEMES_DATABASE if s["category_code"] == cat["code"])
        
        categories_with_counts.append({
            **cat,
            "count": count
        })

    return categories_with_counts
