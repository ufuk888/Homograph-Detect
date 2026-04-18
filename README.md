# 🛡️ HomographDetect 

**HomographDetect** is an advanced security analysis tool designed to detect **Homograph (Visual Spoofing) attacks**, **Typosquatting**, and **Brand Impersonation** attempts frequently used by cyber attackers.

By analyzing the "DNA" (Unicode code points) of a domain name or email address, this tool instantly reveals fraudulent characters and techniques that are indistinguishable to the naked eye.

## 🔗 Live Demo
Visit the live application hosted on GitHub Pages to try it out instantly:  
**[👉 HomographDetect Live Demo](https://ufuk888.github.io/Homograph-Detect/)**

---

## 🚀 Key Features

-   **🔬 Unicode DNA Analysis:** Inspects every character at the atomic level to determine which script family (Latin, Cyrillic, Greek, etc.) it belongs to.
-   **🕵️ Punycode Decoding:** Automatically decodes `xn--` encoded domain names and analyzes the actual characters.
-   **⚠️ Mixed-Script Detection:** Flags the use of different scripts (e.g., a mix of Latin and Cyrillic) within the same word as a strong phishing indicator.
-   **🛡️ Brand & Keyword Protection:** Protects over 50 popular brands (Apple, Google, Binance, etc.) and critical keywords (admin, login, secure) using advanced regex and fuzzy logic.
-   **⌨️ Typosquatting Analysis:** Uses the **Damerau-Levenshtein** algorithm to detect impersonations made through character transpositions, deletions, or insertions.
-   **🔢 Leet Speak Detection:** Catches sneaky tactics where numbers are used instead of letters (e.g., `gma1l.com`).
-   **⚖️ Contextual Anomaly Engine:** Determines the dominant character set and casing in the input, flagging "foreign" characters that deviate from this pattern.
-   **🔒 100% Client-Side (Privacy-First):** All analysis happens in your browser. No data is sent to any server, ensuring your privacy.

---

## 🛠️ How It Works?

1.  **Input:** Paste the domain name, email address, or keyword you want to analyze into the search box.
2.  **X-Ray Analysis:** The engine breaks the text into individual characters and reads the Unicode code point (DNA) of each one.
3.  **Anomaly Detection:** The system determines the "Dominant Script". If most of the text is Latin but a Cyrillic character is hidden within, it is flagged as a **THREAT**.
4.  **Brand Comparison:** The input is compared against variations of known brands (similar characters, repeated letters).
5.  **Reporting:** You receive a detailed, color-coded security report with warnings at Safe (Green), Suspicious (Yellow), and Threat (Red) levels.

---
# 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---
