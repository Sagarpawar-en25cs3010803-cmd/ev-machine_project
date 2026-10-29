# 🎥 Project Demonstration & Video Walkthrough Script

## Project: Electric Vehicle Market Performance & Insights
**Target Duration**: 4 to 5 Minutes  
**Recommended Recording Tool**: OBS Studio, Loom, or Windows Game Bar (`Win + G`)

---

### Segment 1: Introduction & Problem Context (0:00 - 0:40)
- **Visual Action**: Display the **Executive Dashboard** with live KPI cards and animated charts.
- **Presenter Narration**:
> *"Hello everyone! Today, I am proud to present our end-to-end data analytics and business intelligence solution: **Electric Vehicle Market Performance & Insights**.*
>
> *The global electric vehicle industry is expanding at an exponential pace across passenger cars, commercial buses, and urban transport. However, automotive executives and policymakers often struggle with fragmented telemetry. Our system bridges this gap by evaluating over 650 vehicle models across 26 global manufacturers from 2020 through 2026.*
>
> *We specifically engineered this system around three real-world stakeholders: Emily Johnson, an EV Strategy Director; David Chen, an Automotive BI Manager; and Dr. Sarah Williams, a Sustainable Mobility Analyst."*

---

### Segment 2: Database Architecture & SQL Analytics (0:40 - 1:20)
- **Visual Action**: Click on the **SQL Query Engine** tab in the top navigation bar. Show the query selector and click **Execute SQL** on Query 1 and Query 4.
- **Presenter Narration**:
> *"Let's examine the data foundation. All information is managed in a relational SQLite database with 21 attributes and 5 B-tree indexes for high-speed indexing.*
>
> *Here in our live SQL Query Console, we can execute analytical queries directly against the dataset. Query 1 aggregates annual sales and computes market share percentages per manufacturer.*
>
> *Notice Query 4: it utilizes an advanced SQL window function using `ROW_NUMBER() OVER (PARTITION BY category)` to isolate the top-performing model in each vehicle segment with sub-2-millisecond latency. You can also export any query result directly to CSV with one click."*

---

### Segment 3: Executive Dashboard & Multi-Dimensional Slicing (1:20 - 2:10)
- **Visual Action**: Navigate to the **Executive Dashboard** tab. Demonstrate the interactive KPI cards, then use the **Vehicle Category** and **Battery Technology** filters.
- **Presenter Narration**:
> *"Moving to our Executive Dashboard, we track 6 core strategic KPIs: global sales volume, average driving range, leading battery chemistry, and annual CO₂ abatement.*
>
> *Our interactive filter engine enables instant slicing and dicing. For example, when I filter for SUV models equipped with LFP batteries, all 7 visualizations update seamlessly with zero latency.*
>
> *Notice our learning curve chart: between 2020 and 2026, average driving range increased from 375 km to over 540 km, while the average cost per kilometer fell by more than 38%, achieving price parity with internal combustion engines."*

---

### Segment 4: Tableau-Style Interactive Data Story (2:10 - 3:00)
- **Visual Action**: Switch to the **Data Story (6 Scenes)** tab. Click through Scene 1, Scene 2, and Scene 4. Click the **Presenter Script** button to show the embedded talking points.
- **Presenter Narration**:
> *"To communicate data narratives effectively, we built a 6-scene interactive story modeled after Tableau Story Points.*
>
> *Scene 1 illustrates the market explosion from 2020 to 2026. In Scene 2, we contrast battery chemistries: notice how LFP has become the volume leader due to thermal safety and cost efficiency, while Solid-State represents the next frontier.*
>
> *Scene 4 highlights global manufacturing geopolitics, revealing how Asia-Pacific produces over 52% of tracked volume, while North America and Europe lead in premium SUVs and performance trucks."*

---

### Segment 5: Persona Scenarios: Emily, David, and Dr. Sarah (3:00 - 3:45)
- **Visual Action**: Navigate to **Persona Scenarios**. Click on **Emily Johnson**, then **David Chen**, then **Dr. Sarah Williams**.
- **Presenter Narration**:
> *"Our platform provides tailored executive portals for our three personas:*
>
> *For **Emily Johnson**, we provide segment range benchmarking and portfolio optimization recommendations to target high-margin C-SUVs.*
>
> *For **David Chen**, we evaluate manufacturer dominance rankings and country-of-origin advantages to guide automotive clients entering new geographic markets.*
>
> *For **Dr. Sarah Williams**, our sustainability engine calculates lifecycle emissions reduction, discovering that municipal electric buses provide over 10 times higher CO₂ abatement per vehicle than private cars."*

---

### Segment 6: Performance Testing, Benchmarking & Deployment (3:45 - 4:25)
- **Visual Action**: Navigate to the **Performance Testing** tab. Click **Run Stress Test (500x Passes)**. Then click **Dataset & Export** to showcase the full repository.
- **Presenter Narration**:
> *"Finally, we rigorously benchmarked the system across the 4 core performance criteria: data rendered to DB (13,650 cells), filter utilization with latency under 1.5ms, 6 mathematical calculated fields, and 7 visualizations operating at a smooth 60 FPS.*
>
> *Our 500-iteration stress test completes with Grade A+ performance. The platform is fully version-controlled on GitHub and deployed with 1-click cloud hosting on Vercel, with a companion Flask Python backend for academic review.*
>
> *Thank you very much for your time!"*

