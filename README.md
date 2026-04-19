# ­şøí´©Å HomographDetect 

**Homograph (Visual Deception) Phishing Attacks** are a deceptive phishing method where cyber attackers direct users to fake domains or e-mails by using **visually identical characters from different alphabets** (for example, the "a" in the Latin alphabet and the "º░" in the Cyrillic alphabet).

**HomographDetect** is an anomaly detection engine designed to proactively block these threats. By analyzing what is essentially the "DNA" (Unicode code points) of a domain name or an email address, it instantly **deciphers fake characters and hidden manipulation techniques that are indistinguishable to the naked eye.**

It primarily focuses on intercepting the Homograph attacks frequently utilized by cyber attackers with high precision. In addition to this core function, it also detects attempts like Typosquatting and Brand Impersonation as an extra layer of security.

## ­şöù Live Demo
Visit the live application hosted on GitHub Pages to try it out instantly:  
**[­şæë HomographDetect Live Demo](https://ufuk888.github.io/Homograph-Detect/)**

---

## ­şÜÇ Key Features

-   **­şö¼ Unicode DNA Analysis:** Inspects every character at the atomic level to determine which script family (Latin, Cyrillic, Greek, etc.) it belongs to.
-   **­şòÁ´©Å Punycode Decoding:** Automatically decodes `xn--` encoded domain names and analyzes the actual characters.
-   **ÔÜá´©Å Mixed-Script Detection:** Flags the use of different scripts (e.g., a mix of Latin and Cyrillic) within the same word as a strong phishing indicator.
-   **­şøí´©Å Brand & Keyword Protection:** Protects over 50 popular brands (Apple, Google, Binance, etc.) and critical keywords (admin, login, secure) using advanced regex and fuzzy logic.
-   **Ôî¿´©Å Typosquatting Analysis:** Uses the **Damerau-Levenshtein** algorithm to detect impersonations made through character transpositions, deletions, or insertions.
-   **­şöó Leet Speak Detection:** Catches sneaky tactics where numbers are used instead of letters (e.g., `gma1l.com`).
-   **ÔÜû´©Å Contextual Anomaly Engine:** Determines the dominant character set and casing in the input, flagging "foreign" characters that deviate from this pattern.
-   **­şöÆ 100% Client-Side (Privacy-First):** All analysis happens in your browser. No data is sent to any server, ensuring your privacy.

---

## ­şøá´©Å How It Works?

1.  **Input:** Paste the domain name, email address, or keyword you want to analyze into the search box.
2.  **X-Ray Analysis:** The engine breaks the text into individual characters and reads the Unicode code point (DNA) of each one.
3.  **Anomaly Detection:** The system determines the "Dominant Script". If most of the text is Latin but a Cyrillic character is hidden within, it is flagged as a **THREAT**.
4.  **Brand Comparison:** The input is compared against variations of known brands (similar characters, repeated letters).
5.  **Reporting:** You receive a detailed, color-coded security report with warnings at Safe (Green), Suspicious (Yellow), and Threat (Red) levels.

---
# ­şôä License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
