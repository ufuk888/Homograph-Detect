// DOM Elements
const tabBtns = document.querySelectorAll('.vt-tab');
const searchAreas = document.querySelectorAll('.vt-search-area');
const singleInput = document.getElementById('single-input');
const targetInput = document.getElementById('target-domain');
const testInput = document.getElementById('test-domain');

const resultsContainer = document.getElementById('results-container');
const heroSection = document.querySelector('.vt-hero');
const cardsContainer = document.getElementById('character-cards');
const reportPanel = document.getElementById('report-panel');
const mixedScriptBanner = document.getElementById('mixed-script-banner');
const brandBanner = document.getElementById('brand-impersonation-banner');
const brandTitle = document.getElementById('brand-impersonation-title');
const brandText = document.getElementById('brand-impersonation-text');
const typoBanner = document.getElementById('typosquatting-banner');
const typoText = document.getElementById('typosquatting-text');

let currentMode = 'single'; // 'single' | 'compare'

// ── SECURITY CONSTANTS ──────────────────────────────────────────────────────
const MAX_INPUT_LENGTH = 256; // Max input length to prevent DoS
const ALLOWED_TABS = new Set(['single', 'compare']); // Tab allowlist

// XSS guard: escape user input before writing to innerHTML
function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
}

// Target keywords & brands most commonly abused in phishing attacks
const targetKeywords = [
    // Popular Brands
    'apple', 'google', 'microsoft', 'amazon', 'facebook', 'netflix', 'instagram', 'twitter', 'linkedin',
    'paypal', 'binance', 'coinbase', 'metamask', 'papara', 'ininal',
    'trendyol', 'hepsiburada', 'sahibinden', 'yemeksepeti', 'getir',
    'ziraat', 'garanti', 'akbank', 'isbankasi', 'vakifbank', 'halkbank', 'yapikredi',
    'whatsapp', 'telegram', 'discord', 'spotify', 'youtube', 'tiktok', 'steam', 'epicgames',

    // Popular Email Services (high-value phishing targets)
    'gmail', 'googlemail', 'outlook', 'hotmail', 'live', 'msn',
    'yahoo', 'yahoomail', 'ymail',
    'icloud', 'appleid', 'me.com',
    'proton', 'protonmail',
    'tutanota', 'tuta',
    'yandex', 'yandexmail',
    'zoho', 'zohomail',
    'fastmail',
    'office365', 'exchange',

    // Common phishing / email keywords
    'support', 'admin', 'login', 'security', 'update', 'account', 'billing', 'service', 'info',
    'mail', 'webmail', 'secure', 'verify', 'auth', 'payment', 'invoice', 'helpdesk', 'system',
    'noreply', 'no-reply', 'customer', 'team', 'office', 'portal', 'client', 'server', 'wallet'
];

// Helper to determine if a matched word is a generic keyword or a brand
function isGenericKeyword(word) {
    const genericKeywords = [
        'support', 'admin', 'login', 'security', 'update', 'account', 'billing', 'service', 'info',
        'mail', 'webmail', 'secure', 'verify', 'auth', 'payment', 'invoice', 'helpdesk', 'system',
        'noreply', 'no-reply', 'customer', 'team', 'office', 'portal', 'client', 'server', 'wallet'
    ];
    return genericKeywords.includes(word.toLowerCase());
}

// Regional characters — typically from standard local keyboards, not phishing attempts
const regionalCharacters = {
    // Shared / Multi-Region
    'ö': { country: 'Turkey, Germany, Sweden etc.', alphabet: 'Extended Latin' },
    'ü': { country: 'Turkey, Germany etc.', alphabet: 'Extended Latin' },
    'ç': { country: 'Turkey, France, Portugal etc.', alphabet: 'Extended Latin' },
    'ä': { country: 'Germany, Sweden, Finland etc.', alphabet: 'Extended Latin' },
    'á': { country: 'Spain, Portugal, Iceland etc.', alphabet: 'Extended Latin' },
    'é': { country: 'France, Spain, Italy etc.', alphabet: 'Extended Latin' },
    'í': { country: 'Spain, Ireland, Iceland etc.', alphabet: 'Extended Latin' },
    'ó': { country: 'Spain, Poland, Iceland etc.', alphabet: 'Extended Latin' },
    'ú': { country: 'Spain, Ireland, Iceland etc.', alphabet: 'Extended Latin' },
    'à': { country: 'France, Italy, Catalonia etc.', alphabet: 'Extended Latin' },
    'è': { country: 'France, Italy, Catalonia etc.', alphabet: 'Extended Latin' },
    'ì': { country: 'Italy etc.', alphabet: 'Extended Latin' },
    'ò': { country: 'Italy, Catalonia etc.', alphabet: 'Extended Latin' },
    'ù': { country: 'France, Italy etc.', alphabet: 'Extended Latin' },

    // Turkish
    'ı': { country: 'Turkey', alphabet: 'Turkish Alphabet' },
    'ğ': { country: 'Turkey', alphabet: 'Turkish Alphabet' },
    'ş': { country: 'Turkey', alphabet: 'Turkish Alphabet' },
    'İ': { country: 'Turkey', alphabet: 'Turkish Alphabet' },
    'Ğ': { country: 'Turkey', alphabet: 'Turkish Alphabet' },
    'Ş': { country: 'Turkey', alphabet: 'Turkish Alphabet' },
    'Ö': { country: 'Turkey, Germany etc.', alphabet: 'Extended Latin' },
    'Ü': { country: 'Turkey, Germany etc.', alphabet: 'Extended Latin' },
    'Ç': { country: 'Turkey, France etc.', alphabet: 'Extended Latin' },

    // German
    'ß': { country: 'Germany', alphabet: 'German Alphabet' },
    'Ä': { country: 'Germany, Sweden etc.', alphabet: 'Extended Latin' },

    // Spanish
    'ñ': { country: 'Spain, Latin America', alphabet: 'Spanish Alphabet' },
    'Ñ': { country: 'Spain, Latin America', alphabet: 'Spanish Alphabet' },

    // French
    'ê': { country: 'France', alphabet: 'French Alphabet' },
    'ë': { country: 'France', alphabet: 'French Alphabet' },
    'â': { country: 'France', alphabet: 'French Alphabet' },
    'î': { country: 'France', alphabet: 'French Alphabet' },
    'ï': { country: 'France', alphabet: 'French Alphabet' },
    'ô': { country: 'France', alphabet: 'French Alphabet' },
    'œ': { country: 'France', alphabet: 'French Alphabet' },
    'û': { country: 'France', alphabet: 'French Alphabet' },
    'ÿ': { country: 'France', alphabet: 'French Alphabet' },

    // Portuguese
    'ã': { country: 'Portugal, Brazil', alphabet: 'Portuguese Alphabet' },
    'õ': { country: 'Portugal, Brazil', alphabet: 'Portuguese Alphabet' },

    // Nordic (Swedish, Danish, Norwegian)
    'å': { country: 'Scandinavia', alphabet: 'Nordic Alphabet' },
    'æ': { country: 'Scandinavia', alphabet: 'Nordic Alphabet' },
    'ø': { country: 'Scandinavia', alphabet: 'Nordic Alphabet' },
    'Å': { country: 'Scandinavia', alphabet: 'Nordic Alphabet' },
    'Æ': { country: 'Scandinavia', alphabet: 'Nordic Alphabet' },
    'Ø': { country: 'Scandinavia', alphabet: 'Nordic Alphabet' },

    // Polish
    'ą': { country: 'Poland', alphabet: 'Polish Alphabet' },
    'ć': { country: 'Poland', alphabet: 'Polish Alphabet' },
    'ę': { country: 'Poland', alphabet: 'Polish Alphabet' },
    'ł': { country: 'Poland', alphabet: 'Polish Alphabet' },
    'ń': { country: 'Poland', alphabet: 'Polish Alphabet' },
    'ś': { country: 'Poland', alphabet: 'Polish Alphabet' },
    'ź': { country: 'Poland', alphabet: 'Polish Alphabet' },
    'ż': { country: 'Poland', alphabet: 'Polish Alphabet' }
};

function getUnicodeHex(char) {
    if (!char) return '';
    return 'U+' + char.codePointAt(0).toString(16).toUpperCase().padStart(4, '0');
}

function getScript(char) {
    if (!char) return 'Unknown';
    const code = char.codePointAt(0);
    if (code >= 0x0000 && code <= 0x007F) {
        if (!/[a-zA-Z0-9]/.test(char)) return 'Symbol';
        return 'Latin';
    }
    if (code >= 0x0080 && code <= 0x02AF) return 'Latin Ext';
    if (code >= 0x0370 && code <= 0x03FF) return 'Greek';
    if (code >= 0x0400 && code <= 0x04FF) return 'Cyrillic';
    return 'Other';
}

// Mixed-script detection: also returns which script families were found
function detectScripts(text) {
    const foundScripts = new Set();
    let cleanedText = text.replace(/[@.\-\/\s]/g, '');
    // Strip regional characters — they are legitimate Extended Latin
    for (const char of Object.keys(regionalCharacters)) {
        cleanedText = cleanedText.split(char).join('');
    }
    for (const char of cleanedText) {
        const s = getScript(char);
        if (s !== 'Symbol' && s !== 'Unknown') foundScripts.add(s);
    }
    return foundScripts;
}

function hasMixedScript(text) {
    const scripts = detectScripts(text);
    const hasLatin = scripts.has('Latin') || scripts.has('Latin Ext');
    const hasNonLatin = [...scripts].some(s => s !== 'Latin' && s !== 'Latin Ext');
    return { mixed: hasLatin && hasNonLatin, scripts };
}

const charVariations = {
    'a': '[aа@4]',
    'b': '[b]',
    'c': '[cс]',
    'd': '[d]',
    'e': '[eе3]',
    'f': '[f]',
    'g': '[gq]',
    'h': '[h]',
    'i': '[iIl1ı!]',
    'j': '[j]',
    'k': '[k]',
    'l': '[lI1!i]',
    'm': '[mм]',
    'n': '[n]',
    'o': '[o0о]',
    'p': '[pр]',
    'q': '[qg]',
    'r': '[r]',
    's': '[s5$]',
    't': '[t]',
    'u': '[uу]',
    'v': '[v]',
    'w': '[w]',
    'x': '[xх]',
    'y': '[yу]',
    'z': '[z]'
};

function buildKeywordRegex(word) {
    // ReDoS koruğu: çok uzun kelimeler için regex oluşturma
    if (!word || word.length > 40) return /(?!)/; // hiçbir şeyle eşleşmeyen regex
    let pattern = '';
    for (let i = 0; i < word.length; i++) {
        let char = word[i].toLowerCase();
        if (charVariations[char]) {
            // + yerine {1,6} kullan: ReDoS engellemek için backtracking sınırlı
            pattern += charVariations[char] + '{1,6}';
        } else {
            pattern += escapeHtml(char).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '{1,6}';
        }
        if (i < word.length - 1) {
            // Harfler arasına en fazla 3 karakter gelebilir (sonsuz yerine)
            pattern += '[^a-zA-Z0-9]{0,3}';
        }
    }
    return new RegExp(pattern, 'i');
}

// Damerau-Levenshtein distance (measures insertions, deletions, substitutions and transpositions)
function getDamerauLevenshteinDistance(source, target) {
    if (!source) return target ? target.length : 0;
    if (!target) return source.length;

    const sourceLength = source.length;
    const targetLength = target.length;
    const matrix = Array(sourceLength + 1).fill(null).map(() => Array(targetLength + 1).fill(null));

    for (let i = 0; i <= sourceLength; i++) {
        matrix[i][0] = i;
    }
    for (let j = 0; j <= targetLength; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= sourceLength; i++) {
        for (let j = 1; j <= targetLength; j++) {
            const cost = source[i - 1] === target[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1, // deletion
                matrix[i][j - 1] + 1, // insertion
                matrix[i - 1][j - 1] + cost // substitution
            );

            // Transposition (Yanlış tuşa basma / harf yer değiştirme)
            if (i > 1 && j > 1 && source[i - 1] === target[j - 2] && source[i - 2] === target[j - 1]) {
                matrix[i][j] = Math.min(
                    matrix[i][j],
                    matrix[i - 2][j - 2] + cost
                );
            }
        }
    }

    return matrix[sourceLength][targetLength];
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Güvenlik: Sadece izin verilen tab değerlerini kabul et (ID injection engellemek için)
        const requestedTab = btn.dataset.tab;
        if (!ALLOWED_TABS.has(requestedTab)) return;

        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        searchAreas.forEach(c => c.classList.remove('active'));
        currentMode = requestedTab;
        document.getElementById(`tab-${currentMode}`).classList.add('active');

        const infoPanels = document.getElementById('info-panels');
        if (infoPanels) {
            infoPanels.setAttribute('data-active-tab', currentMode);
        }

        analyze();
    });
});

function updateLayout(hasContent) {
    if (hasContent && currentMode !== 'url') {
        heroSection.classList.add('compact');
        resultsContainer.classList.remove('hidden');
    } else {
        heroSection.classList.remove('compact');
        resultsContainer.classList.add('hidden');
    }
}

function analyze() {
    cardsContainer.innerHTML = '';
    reportPanel.innerHTML = '';
    mixedScriptBanner.classList.add('hidden');
    brandBanner.classList.add('hidden');
    typoBanner.classList.add('hidden');

    if (currentMode === 'single') {
        if (!singleInput.value.trim()) {
            updateLayout(false);
            return;
        }
        updateLayout(true);
        analyzeSingle();
    } else if (currentMode === 'compare') {
        if (!targetInput.value.trim() && !testInput.value.trim()) {
            updateLayout(false);
            return;
        }
        updateLayout(true);
        analyzeCompare();
    }
}

function analyzeSingle() {
    let rawText = singleInput.value.trim();
    if (!rawText) return;

    // DoS guard: truncate excessively long inputs
    if (rawText.length > MAX_INPUT_LENGTH) {
        rawText = rawText.slice(0, MAX_INPUT_LENGTH);
    }

    let text = rawText;
    let reports = [];

    // Punycode decode (xn-- encoded internationalized domains)
    let isPunycode = false;
    if (text.toLowerCase().includes('xn--') && typeof punycode !== 'undefined') {
        try {
            text = punycode.toUnicode(text);
            isPunycode = true;
            // XSS: rawText is user input — must be escaped before rendering
            reports.push({ type: 'warning', icon: '🕵️', text: `<strong>Punycode Detected:</strong> Encoded domain was decoded (Original: <code>${escapeHtml(rawText)}</code>).` });
        } catch (e) {
            // Do not expose error details to the user (information disclosure prevention)
            console.error('Punycode decode error');
        }
    }

    // Unicode NFD normalization — separates base letters from diacritics for deeper analysis
    let normalizedForAnalysis = text;
    try {
        if (text.normalize) {
            normalizedForAnalysis = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }
    } catch (e) { }

    // Split text into words for typosquatting checks
    let wordsInText = text.split(/[@.\-\s_]/).filter(w => w.length > 0);
    if (wordsInText.length === 0) wordsInText = [text];


    let impersonatedWord = null;
    let hiddenBrandWord = null;
    let typosquattingWord = null;

    for (let word of targetKeywords) {
        const regexPattern = buildKeywordRegex(word);

        // If the full text matches our pattern (possible homograph attack or hidden brand)
        if (regexPattern.test(text)) {
            // Strip common prefixes/TLDs to isolate the domain root for exact-match check
            let cleanDomain = text.toLowerCase()
                .replace(/^https?:\/\//, '') // remove http(s)://
                .split('/')[0]               // remove path
                .replace(/^www\./, '');      // remove www.

            // ── Email address handling ──────────────────────────────────────
            // For "user@gmail.com" we want to evaluate only the domain portion.
            // Without this, cleanDomain becomes "user@gmail" which never equals
            // the keyword "gmail", causing a false brand-concealment alert.
            if (cleanDomain.includes('@')) {
                cleanDomain = cleanDomain.split('@').pop(); // take everything after the last @
            }


            // Keep only the part before the first dot
            cleanDomain = cleanDomain.split('.')[0];

            const exactMatch = (text === word) || (cleanDomain === word.toLowerCase());

            // Check if the literal word is present (unobfuscated substring)
            const isLiteralSubstring = text.toLowerCase().includes(word.toLowerCase());

            // Check if this keyword match is entirely within a larger legitimate keyword.
            // e.g. "mail" is inside "gmail". If the text contains "gmail", we should
            // ignore the "mail" match to prevent false positives.
            let isPartOfLegitKeyword = false;
            for (let legit of targetKeywords) {
                if (legit.length > word.length && legit.toLowerCase().includes(word.toLowerCase())) {
                    if (text.toLowerCase().includes(legit.toLowerCase())) {
                        isPartOfLegitKeyword = true;
                        break;
                    }
                }
            }

            if (isPartOfLegitKeyword) {
                continue; // Skip this word, it's a safe substring of a larger legitimate brand
            }

            if (!isLiteralSubstring) {
                // The regex matched, but the literal string is nowhere to be found.
                // This means the word is obfuscated (e.g. homograph, repeated letters, symbol substitution)
                impersonatedWord = word;
                break;
            } else if (!exactMatch) {
                // The literal string IS present, but it's not an exact match of the domain root.
                // e.g. 'applelogin.com' -> 'apple' is present literally, but domain is 'applelogin'
                hiddenBrandWord = word;
                break;
            }
        }

        // If not a homograph or hidden brand, check for typosquatting
        if (!impersonatedWord && !hiddenBrandWord) {
            for (let part of wordsInText) {
                // Reduced minimum length to 3 so we can catch typos for 'gmx', 'aol', etc.
                if (part.length >= 3) {
                    // Skip if this word segment IS itself a legitimate brand/keyword.
                    // e.g. "gmail" is distance-1 from "ymail" but gmail is a real brand —
                    // flagging it as a ymail typosquat would be a false positive.
                    const isLegitKeyword = targetKeywords.some(k => k.toLowerCase() === part.toLowerCase());
                    if (isLegitKeyword) continue;

                    const distance = getDamerauLevenshteinDistance(part.toLowerCase(), word.toLowerCase());
                    if (distance === 1) {
                        typosquattingWord = word;
                        break;
                    }

                }
            }
        }

        if (typosquattingWord) break;
    }

    if (impersonatedWord) {
        brandBanner.classList.remove('hidden');
        const isGeneric = isGenericKeyword(impersonatedWord);
        brandTitle.innerHTML = `🚨 ${isGeneric ? 'KEYWORD' : 'BRAND'} IMPERSONATION DETECTED`;
        // XSS: targetKeywords come from a static list, but escape anyway (defense-in-depth)
        brandText.innerHTML = `This address may be attempting to impersonate <span class="brand-highlight">${escapeHtml(impersonatedWord)}</span>. It could contain visually similar spoofed characters (homograph) or repeated letters.`;
        reports.push({ type: 'danger', icon: '🛡️', text: `<strong>Critical Violation:</strong> A popular ${isGeneric ? 'keyword' : 'brand'} may be impersonated (${escapeHtml(impersonatedWord)}).` });
    } else if (hiddenBrandWord) {
        brandBanner.classList.remove('hidden');
        const isGeneric = isGenericKeyword(hiddenBrandWord);
        brandTitle.innerHTML = `🚨 ${isGeneric ? 'KEYWORD' : 'BRAND'} CONCEALMENT DETECTED`;
        brandText.innerHTML = `This address contains <span class="brand-highlight">${escapeHtml(hiddenBrandWord)}</span>. It may be embedded among other words or characters to evade detection.`;
        reports.push({ type: 'warning', icon: '🛡️', text: `<strong>${isGeneric ? 'Keyword' : 'Brand'} Concealment:</strong> A popular ${isGeneric ? 'keyword' : 'brand'} (${escapeHtml(hiddenBrandWord)}) may be hidden within this address.` });
    } else if (typosquattingWord) {
        typoBanner.classList.remove('hidden');
        typoText.innerHTML = `This address may be imitating <span class="brand-highlight">${escapeHtml(typosquattingWord)}</span> via a typosquatting technique. Please verify carefully.`;
        reports.push({ type: 'warning', icon: '⌨️', text: `<strong>Typosquatting:</strong> This address closely resembles '${escapeHtml(typosquattingWord)}' — could be a deliberate misspelling.` });
    }

    // ── Mixed-Script Analysis ──────────────────────────────────────────────
    const mixedResult = hasMixedScript(text);
    if (mixedResult.mixed) {
        // Render script names as colored inline badges inside the banner
        const scriptNames = {
            'Latin': '<span class="script-badge-inline script-latin">Latin</span>',
            'Latin Ext': '<span class="script-badge-inline script-latin-ext">Latin Ext</span>',
            'Cyrillic': '<span class="script-badge-inline script-cyrillic">Cyrillic</span>',
            'Greek': '<span class="script-badge-inline script-greek">Greek</span>',
            'Other': '<span class="script-badge-inline script-other">Other</span>'
        };
        const badgeList = [...mixedResult.scripts]
            .map(s => scriptNames[s] || `<span class="script-badge-inline script-other">${escapeHtml(s)}</span>`)
            .join(' + ');

        // Update the banner <p> with detected script names
        const bannerP = mixedScriptBanner.querySelector('p');
        if (bannerP) {
            bannerP.innerHTML = `Detected scripts: ${badgeList} — Multiple different scripts appear to be combined, which is a strong phishing indicator.`;
        }
        mixedScriptBanner.classList.remove('hidden');
        reports.push({ type: 'danger', icon: '⚠️', text: `<strong>Mixed-Script (Phishing):</strong> ${badgeList} — Multiple scripts may be combined to deceive.` });
    }

    // ── PHASE 1: Calculate the Dominant Distribution of the Input ─────────
    let scriptCounts = {};   // { 'Latin': 5, 'Cyrillic': 1, ... }
    let caseCounts = { upper: 0, lower: 0 };
    let totalLetters = 0;

    const charArray = Array.from(text);
    for (let i = 0; i < charArray.length; i++) {
        const char = charArray[i];
        if (/[@.\-\s_\/]/.test(char)) continue;
        const s = getScript(char);
        if (s !== 'Symbol') {
            scriptCounts[s] = (scriptCounts[s] || 0) + 1;
            totalLetters++;
        }
        if (/[a-zA-Z]/.test(char)) {
            if (char === char.toUpperCase()) caseCounts.upper++;
            else caseCounts.lower++;
        }
    }

    // Determine the dominant script
    let dominantScript = 'Latin';
    let maxScriptCount = 0;
    for (const [s, count] of Object.entries(scriptCounts)) {
        if (count > maxScriptCount) { maxScriptCount = count; dominantScript = s; }
    }

    // Determine dominant casing (if equal, treat as 'mixed' — no case anomaly possible)
    const dominantCase = caseCounts.upper > caseCounts.lower ? 'upper'
        : caseCounts.lower > caseCounts.upper ? 'lower'
            : 'mixed';

    // Latin Ext: flag as anomaly only if the count is <= 15% of total AND dominant is Latin
    function isScriptAnomaly(char, script) {
        if (script === 'Symbol') return false;
        if (script === 'Latin Ext') {
            // If it's a known regional character, we don't treat it as a script anomaly
            // to avoid flagging letters like "ö" as threats when typed in Latin contexts.
            if (regionalCharacters[char]) return false;

            return dominantScript === 'Latin'
                && (scriptCounts['Latin Ext'] || 0) <= Math.ceil(totalLetters * 0.15);
        }
        return script !== dominantScript;
    }

    // Case anomaly:
    // "URLSCANER" → dominant upper → lowercase letters are anomalous
    // "urlscaNer" → dominant lower → uppercase letters are anomalous
    // When dominantCase is "mixed", no character is anomalous
    function isCaseAnomaly(char) {
        if (!/^[a-zA-Z]$/.test(char)) return false;
        if (dominantCase === 'mixed') return false;
        const isUpper = char === char.toUpperCase();
        return (dominantCase === 'lower' && isUpper) ||
            (dominantCase === 'upper' && !isUpper);
    }

    // ── PHASE 2: Evaluate Each Character with the Contextual Anomaly Engine ─
    let hasRegional = false;

    for (let i = 0; i < charArray.length; i++) {
        const char = charArray[i];
        const script = getScript(char);
        const hex = getUnicodeHex(char);

        let status = 'safe';
        let badgeText = 'CLEAN';
        let cardClass = 'card-safe';
        let tooltip = '';

        if (/[@.\-\/]/.test(char)) {
            createCardSingle(char, hex, 'Symbol', status, 'SYMBOL', cardClass, '', i * 0.03);
            continue;
        }

        const scriptDeviation = isScriptAnomaly(char, script);
        const caseDeviation = isCaseAnomaly(char);

        // ── Rule 1: Homograph (Script spoofing) ───────────────────────────
        if (typeof confusablesMap !== 'undefined' && confusablesMap[char] && !/^[a-zA-Z0-9]$/.test(char)) {
            if (scriptDeviation) {
                status = 'confusable'; badgeText = 'THREAT'; cardClass = 'card-confusable';
                tooltip = `WARNING: "${char}" (${script}) deviates from the dominant script "${dominantScript}". May be spoofing the Latin "${confusablesMap[char]}" character.`;
                const repText = `<strong>Homograph Attack:</strong> "${char}" belongs to the ${script} script and deviates from the dominant distribution (${dominantScript}). It may be spoofing the Latin "${confusablesMap[char]}" character.`;
                if (!reports.some(r => r.text === repText)) reports.push({ type: 'danger', icon: '🚨', text: repText });
            } else {
                // Consistent with the distribution → regional or clean
                if (regionalCharacters[char]) {
                    status = 'regional'; badgeText = 'REGIONAL'; cardClass = 'card-regional';
                    const regInfo = regionalCharacters[char];
                    tooltip = `This character is commonly used in <strong>${regInfo.country}</strong> (${regInfo.alphabet}).`;
                    hasRegional = true;
                } else {
                    status = 'safe'; badgeText = 'CLEAN'; cardClass = 'card-safe';
                }
            }
        }

        // ── Rule 2: Case anomaly ─────────────────────────────────────────
        else if (caseDeviation && !scriptDeviation) {
            status = 'warning'; badgeText = 'SUSPICIOUS'; cardClass = 'card-warning';
            const expected = dominantCase === 'lower' ? 'lowercase' : 'uppercase';
            const found = char === char.toUpperCase() ? 'Uppercase' : 'Lowercase';
            tooltip = `${found} anomaly. The dominant casing of this text is ${expected}, but this character deviates.`;
            const repText = `<strong>Case Anomaly:</strong> "${char}" deviates from the overall casing distribution (dominant: ${expected}).`;
            if (!reports.some(r => r.text === repText)) reports.push({ type: 'warning', icon: '👀', text: repText });
        }

        // ── Rule 3: Leet Speak — digit adjacent to letters ────────────────
        else if (['0', '1', '3', '4', '5'].includes(char)) {
            const prevLetter = i > 0 && /[a-zA-Z]/.test(charArray[i - 1]);
            const nextLetter = i < charArray.length - 1 && /[a-zA-Z]/.test(charArray[i + 1]);
            if (prevLetter || nextLetter) {
                status = 'warning'; badgeText = 'SUSPICIOUS'; cardClass = 'card-warning';
                const leetMap = { '0': 'o', '1': 'i/l', '3': 'e', '4': 'a', '5': 's' };
                tooltip = `Possible Leet Speak: "${char}" may be substituting the letter "${leetMap[char]}".`;
                const repText = `<strong>Leet Speak:</strong> "${char}" is used between letters and may be substituting "${leetMap[char]}".`;
                if (!reports.some(r => r.text === repText)) reports.push({ type: 'warning', icon: '🔢', text: repText });
            }
        }

        // ── Rule 4: Regional character (informational, not a threat) ────────
        else if (regionalCharacters[char]) {
            status = 'regional'; badgeText = 'REGIONAL'; cardClass = 'card-regional';
            const regInfo = regionalCharacters[char];
            tooltip = `This character is commonly used in <strong>${regInfo.country}</strong> (${regInfo.alphabet}).`;
            hasRegional = true;
        }

        createCardSingle(char, hex, script, status, badgeText, cardClass, tooltip, i * 0.03, scriptDeviation);
    }

    if (hasRegional) {
        reports.push({ type: 'info', icon: '🌍', text: `<strong>Info:</strong> Regional script characters were found. They are generally harmless but may warrant caution in international domain contexts.` });
    }

    renderReports(reports);

}


function createCardSingle(char, hex, script, status, badgeText, cardClass, tooltip, delay, scriptDeviation = false) {
    const card = document.createElement('div');
    card.className = `char-card ${cardClass}`;
    card.style.animationDelay = `${delay}s`;

    if (tooltip) {
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'card-tooltip';
        tooltipEl.innerHTML = tooltip;
        card.appendChild(tooltipEl);
    }

    const displayChar = char === ' ' ? '_' : (char || '');
    const scriptClass = `script-${script.toLowerCase().replace(' ', '-')}`;

    const displayEl = document.createElement('div');
    displayEl.className = 'char-display';

    const charLarge = document.createElement('div');
    charLarge.className = 'char-large';
    charLarge.textContent = displayChar;

    const charUnicode = document.createElement('div');
    charUnicode.className = 'char-unicode';
    charUnicode.textContent = hex;

    const charScript = document.createElement('div');
    // scriptDeviation: alfabe genel dagılımdan sapiyorsa ek vurgu sınıfı ekle
    charScript.className = `char-script ${scriptClass}${scriptDeviation ? ' script-anomaly' : ''}`;
    charScript.textContent = script;

    displayEl.appendChild(charLarge);
    displayEl.appendChild(charUnicode);
    displayEl.appendChild(charScript);

    const badge = document.createElement('div');
    badge.className = 'status-badge';
    badge.textContent = badgeText;

    card.appendChild(displayEl);
    card.appendChild(badge);
    cardsContainer.appendChild(card);
}

function analyzeCompare() {
    let target = targetInput.value.trim();
    let testRaw = testInput.value.trim();

    // DoS guard
    if (target.length > MAX_INPUT_LENGTH) target = target.slice(0, MAX_INPUT_LENGTH);
    if (testRaw.length > MAX_INPUT_LENGTH) testRaw = testRaw.slice(0, MAX_INPUT_LENGTH);

    let reports = [];

    let test = testRaw;
    if (test.toLowerCase().includes('xn--') && typeof punycode !== 'undefined') {
        try {
            test = punycode.toUnicode(test);
            reports.push({ type: 'warning', icon: '🕵️', text: `<strong>Punycode Detected:</strong> Suspicious address was decoded (Original: <code>${escapeHtml(testRaw)}</code>).` });
        } catch (e) {
            console.error('Punycode decode error');
        }
    }

    const mixedResult2 = hasMixedScript(test);
    if (mixedResult2.mixed) {
        const scriptNames = {
            'Latin': '<span class="script-badge-inline script-latin">Latin</span>',
            'Latin Ext': '<span class="script-badge-inline script-latin-ext">Latin Ext</span>',
            'Cyrillic': '<span class="script-badge-inline script-cyrillic">Cyrillic</span>',
            'Greek': '<span class="script-badge-inline script-greek">Greek</span>',
            'Other': '<span class="script-badge-inline script-other">Other</span>'
        };
        const badgeList = [...mixedResult2.scripts]
            .map(s => scriptNames[s] || `<span class="script-badge-inline script-other">${escapeHtml(s)}</span>`)
            .join(' + ');
        const bannerP = mixedScriptBanner.querySelector('p');
        if (bannerP) bannerP.innerHTML = `Detected scripts: ${badgeList} — Multiple scripts may be combined to deceive.`;
        mixedScriptBanner.classList.remove('hidden');
        reports.push({ type: 'danger', icon: '⚠️', text: `<strong>Mixed-Script:</strong> ${badgeList} — The suspicious address may combine multiple scripts.` });
    }

    const targetArray = Array.from(target);
    const testArray = Array.from(test);

    const maxLength = Math.max(targetArray.length, testArray.length);
    for (let i = 0; i < maxLength; i++) {
        const targetChar = targetArray[i] || '';
        const testChar = testArray[i] || '';
        const testScript = getScript(testChar);

        let badgeText = 'MATCH';
        let cardClass = 'card-match';

        if (targetChar !== testChar) {
            let isConfusable = typeof confusablesMap !== 'undefined' && (confusablesMap[testChar] === targetChar || confusablesMap[testChar] === targetChar.toLowerCase());

            if (isConfusable) {
                badgeText = 'THREAT'; cardClass = 'card-confusable';
                // XSS: wrap characters with escapeHtml
                reports.push({ type: 'danger', icon: '🚨', text: `"${escapeHtml(targetChar)}" may be spoofed by the visually similar "${escapeHtml(testChar)}" (${escapeHtml(getUnicodeHex(testChar))}).` });
            } else if (testChar === testChar.toUpperCase() && testChar !== testChar.toLowerCase() && /[a-zA-Z]/.test(testChar)) {
                badgeText = 'SUSPICIOUS'; cardClass = 'card-warning';
                reports.push({ type: 'warning', icon: '👀', text: `Unexpected uppercase letter ("${escapeHtml(testChar)}") — may indicate obfuscation.` });
            } else {
                badgeText = 'MISMATCH'; cardClass = 'card-mismatch';
                if (targetChar && testChar) reports.push({ type: 'info', icon: 'ℹ️', text: `Character at position ${i + 1} does not match.` });
            }
        }
        createCardCompare(testChar, targetChar, testScript, cardClass, badgeText, i * 0.03);
    }
    renderReports(reports);
}

function createCardCompare(testChar, targetChar, script, cardClass, badgeText, delay) {
    const card = document.createElement('div');
    card.className = `char-card ${cardClass}`;
    card.style.animationDelay = `${delay}s`;

    const scriptClass = `script-${script.toLowerCase().replace(' ', '-')}`;
    const displayEl = document.createElement('div');
    displayEl.className = 'char-display';

    const charLarge = document.createElement('div');
    charLarge.className = 'char-large';
    charLarge.textContent = testChar === ' ' ? '_' : (testChar || '-'); // ✅ XSS-safe

    const charUnicode = document.createElement('div');
    charUnicode.className = 'char-unicode';
    charUnicode.textContent = getUnicodeHex(testChar) || 'N/A';

    const charScript = document.createElement('div');
    charScript.className = `char-script ${scriptClass}`;
    charScript.textContent = script;

    displayEl.appendChild(charLarge);
    displayEl.appendChild(charUnicode);
    displayEl.appendChild(charScript);

    if (targetChar && targetChar !== testChar) {
        const targetInfo = document.createElement('div');
        targetInfo.className = 'char-target';
        targetInfo.textContent = `Target: ${targetChar}`; // ✅ XSS-safe
        const targetUni = document.createElement('span');
        targetUni.className = 'char-target-unicode';
        targetUni.textContent = getUnicodeHex(targetChar);
        targetInfo.appendChild(document.createElement('br'));
        targetInfo.appendChild(targetUni);
        displayEl.appendChild(targetInfo);
    }

    const badge = document.createElement('div');
    badge.className = 'status-badge';
    badge.textContent = badgeText;

    card.appendChild(displayEl);
    card.appendChild(badge);
    cardsContainer.appendChild(card);
}

function renderReports(reports) {
    if (reports.length === 0) {
        reportPanel.innerHTML = `<div class="report-clean"><span>✅</span> Analysis complete. No threats detected.</div>`;
    } else {
        reports.forEach(report => {
            const reportItem = document.createElement('div');
            reportItem.className = `report-item report-${report.type || 'info'}`;
            reportItem.innerHTML = `<div class="report-icon-wrap">${report.icon}</div> <div class="report-text">${report.text}</div>`;
            reportPanel.appendChild(reportItem);
        });
    }
}

// Event listeners
singleInput.addEventListener('input', analyze);
targetInput.addEventListener('input', analyze);
testInput.addEventListener('input', analyze);

// Initial state reset
singleInput.value = '';
targetInput.value = '';
testInput.value = '';
analyze();
// Tema Değiştirme
const themeBtn = document.getElementById('theme-btn');
const moonIcon = document.getElementById('moon-icon');
const sunIcon = document.getElementById('sun-icon');

// Varsayılan: Her zaman gece modu (kullanıcı değiştirmediyse)
const savedTheme = localStorage.getItem('vt-theme');
if (savedTheme === 'light') {
    // Kullanıcı daha önce açık mod seçmiş
    moonIcon.style.display = 'block';
    sunIcon.style.display = 'none';
} else {
    // Varsayılan: gece modu
    document.documentElement.setAttribute('data-theme', 'dark');
    moonIcon.style.display = 'none';
    sunIcon.style.display = 'block';
    if (!savedTheme) localStorage.setItem('vt-theme', 'dark');
}

themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('vt-theme', 'light');
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('vt-theme', 'dark');
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
    }
});

// ── How It Works Modal ───────────────────────────────────────────────────────
const hiwModal = document.getElementById('hiw-modal');
const hiwOpenBtn = document.getElementById('hiw-open-btn');
const hiwCloseBtn = document.getElementById('hiw-close-btn');

function openHiw() {
    hiwModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden'; // prevent background scroll
    hiwCloseBtn.focus();
}

function closeHiw() {
    hiwModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    hiwOpenBtn.focus();
}

hiwOpenBtn.addEventListener('click', openHiw);
hiwCloseBtn.addEventListener('click', closeHiw);

// Close when clicking the backdrop (outside the panel)
hiwModal.addEventListener('click', (e) => {
    if (e.target === hiwModal) closeHiw();
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !hiwModal.hasAttribute('hidden')) closeHiw();
});

// ── Guarantee Modal ───────────────────────────────────────────────────────
const guaranteeModal = document.getElementById('guarantee-modal');
const guaranteeOpenBtn = document.getElementById('guarantee-open-btn');
const guaranteeCloseBtn = document.getElementById('guarantee-close-btn');

function openGuarantee() {
    guaranteeModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';
    guaranteeCloseBtn.focus();
}

function closeGuarantee() {
    guaranteeModal.setAttribute('hidden', '');
    document.body.style.overflow = '';
    guaranteeOpenBtn.focus();
}

if (guaranteeOpenBtn) guaranteeOpenBtn.addEventListener('click', openGuarantee);
if (guaranteeCloseBtn) guaranteeCloseBtn.addEventListener('click', closeGuarantee);

guaranteeModal.addEventListener('click', (e) => {
    if (e.target === guaranteeModal) closeGuarantee();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !guaranteeModal.hasAttribute('hidden')) closeGuarantee();
});
