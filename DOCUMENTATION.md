# KisanVoice Documentation

Welcome to the documentation for **KisanVoice**, a highly intuitive, voice-first agricultural intelligence platform designed specifically for farmers in Kashmir.

This document explains the application's features, the technologies powering it, and how specialized AI services (Apify, Exa, and Groq) are used in easy-to-understand terms.

---

## 🌟 What is KisanVoice?

KisanVoice is designed to reduce the digital divide. Instead of typing complex searches to find crop prices or weather updates, a farmer simply **taps a microphone and speaks** in their native language (like Kashmiri or Hindi). The application listens, understands the query, scours the internet for real-time data, and responds with a simple, structured, and easy-to-read result card (along with translations).

---

## ✨ Key Features

1. **Voice-First Chat Interface:**
   - Farmers can ask questions using their voice ("What are the apple prices in Srinagar today?").
   - The app immediately transcribes the voice into text and processes the command.
   
2. **Real-Time Market Prices:**
   - Retrieves live mandi (market) prices for commodities like Apples, Walnuts, and Saffron.
   - Shows price trends, confidence scores, and specific market details.

3. **Morning Briefing (Intel Tab):**
   - A personalized daily digest tailored to the farmer's location and specific crops.
   - Consolidates live updates on weather, agricultural news, pesticide alerts, and government subsidies into one easy reading view.

4. **NH44 Highway Alerts:**
   - Crucial for Kashmiri farmers: The app automatically checks the status of the Srinagar-Jammu National Highway (NH44).
   - If the highway is closed, the app explicitly advises the farmer to hold off on harvesting perishable goods.

5. **Multi-lingual Support:**
   - All summaries and crucial information are provided in English, simple Hindi (Devanagari), and Kashmiri (Nastaliq script) so that farmers of all literacy types can understand. 

---

## 🛠️ Technologies Used

### Frontend (What the user sees)
* **Next.js & React:** The modern framework used to build the website structure and handle routing.
* **Tailwind CSS:** Used for the "Neon Alchemist" design system—creating the beautiful, glassmorphic, and high-contrast deep forest UI.
* **Lucide React:** Provides the clean, modern icons used throughout the app.

### Backend & Database (Where data is stored and managed)
* **Convex:** The real-time database and backend function runner. It stores user queries, syncs chat history instantly to the screen, and securely executes our AI logic.
* **Clerk:** Handles user authentication (login/signup) seamlessly.

---

## 🧠 How We Use AI (The Magic Behind the Scenes)

We use three powerful AI partners to make KisanVoice work. Here is how they function in simple terms:

### 1. Groq (The "Ears" and "Brain")
* **What it does:** Extremely fast Artificial Intelligence processing.
* **How we use it:**
    * **Whisper (Audio Transcription):** When a farmer speaks into the app, Groq's Whisper model acts as the "ears." It listens to the audio file and instantly types out exactly what the farmer said in text.
    * **Llama 3 (The Brain & Translator):** Once we have the search results from the web, Groq takes all that messy information and acts as the "brain." It structures the data neatly (Price, Change, Advice) and translates the summaries into Kashmiri and Hindi.

### 2. Exa (The "Super Web Researcher")
* **What it does:** A search engine designed specifically for AI. Think of it as a super-smart librarian.
* **How we use it:**
    * When the farmer asks for the price of Saffron, Exa searches the web specifically for reliable agricultural news, mandi prices, and government portals. 
    * We also use Exa to secretly run background searches for the **Morning Briefing**—checking 5 different streams at once: Weather, NH44 Highway Status, Government Subsidies, Pest Warnings, and Market Sentiment over the whole internet.

### 3. Apify (The "Data Harvester" - *Supplemental Use*)
* **What it does:** Web scraping platform that can extract data from specific websites that don't have easy APIs.
* **How we use it:**
    * While Exa handles broad internet searches, Apify can be commanded to perform targeted extractions (scraping) from specific government Mandi price boards or local news sites that hide their data behind complex tables, turning that website data into clean text for our AI brain (Groq) to read.

---

## 🚀 The Typical Flow (In Easy Terms)

1. **Speak:** The farmer taps the microphone and asks, *"What is the apple rate in Sopore?"*
2. **Listen (Groq):** Groq turns that voice recording into the text: "What is the apple rate in Sopore?"
3. **Fetch (Exa & Apify):** The app tells Exa to search the web for "Apple Sopore Mandi rate today". At the same time, it searches for "NH44 Highway status".
4. **Think & Translate (Groq):** Exa returns a bunch of messy articles. Groq reads them all, finds the exact price, notes that the highway is open, and translates the summary into Kashmiri.
5. **Show:** The frontend displays the beautiful `MiniResultCard` on the screen for the farmer to see.
