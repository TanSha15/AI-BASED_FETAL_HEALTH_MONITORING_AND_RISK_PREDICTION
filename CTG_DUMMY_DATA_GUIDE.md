# Cardiotocography (CTG) Test Data & Assessment Guide

This document provides calibrated test datasets for all three clinical diagnostic categories (**Normal**, **Suspect**, and **Pathological**) based on the Kaggle Cardiotocography (CTG) dataset and FIGO guidelines.

You can input these values in the **New CTG Exam** form (`/new-assessment`) or click the corresponding quick-preset buttons (**Cat I Normal**, **Cat II Suspect**, **Cat III Path**) to auto-fill them, submit the assessment, and download the clinical PDF report.

---

## Quick Reference Summary Table

| Parameter / Feature | UI Label | Unit | Category I: Normal | Category II: Suspect | Category III: Pathological |
| :--- | :--- | :--- | :---: | :---: | :---: |
| `baseline value` | **Baseline FHR** | bpm | `132.0` | `142.0` | `120.0` |
| `accelerations` | **Accelerations** | /sec | `0.006` | `0.001` | `0.000` |
| `fetal_movement` | **Fetal Movements** | /sec | `0.000` | `0.000` | `0.000` |
| `uterine_contractions` | **Uterine Contractions** | /sec | `0.006` | `0.001` | `0.001` |
| `light_decelerations` | **Light Decelerations** | /sec | `0.003` | `0.000` | `0.002` |
| `severe_decelerations` | **Severe Decelerations** | /sec | `0.000` | `0.000` | `0.000` |
| `prolongued_decelerations` | **Prolonged Decelerations**| /sec | `0.000` | `0.000` | `0.005` |
| `abnormal_short_term_variability` | **Abnormal STV (%)** | % | `17.0` | `65.0` | `73.0` |
| `mean_value_of_short_term_variability` | **Mean STV** | bpm | `2.1` | `0.5` | `0.5` |
| `percentage_of_time_with_abnormal_long_term_variability` | **Abnormal LTV (%)** | % | `0.0` | `24.0` | `43.0` |
| `mean_value_of_long_term_variability` | **Mean LTV** | bpm | `10.4` | `7.3` | `4.0` |
| `histogram_width` | **Histogram Width** | bpm | `130.0` | `27.0` | `64.0` |
| `histogram_min` | **Histogram Min** | bpm | `68.0` | `130.0` | `62.0` |
| `histogram_max` | **Histogram Max** | bpm | `198.0` | `157.0` | `126.0` |
| `histogram_number_of_peaks` | **Histogram Peaks** | count | `6.0` | `1.0` | `2.0` |
| `histogram_number_of_zeroes` | **Histogram Zeroes** | count | `1.0` | `0.0` | `0.0` |
| `histogram_mode` | **Histogram Mode** | bpm | `141.0` | `144.0` | `105.0` |
| `histogram_mean` | **Histogram Mean** | bpm | `136.0` | `143.0` | `99.0` |
| `histogram_median` | **Histogram Median** | bpm | `140.0` | `145.0` | `104.0` |
| `histogram_variance` | **Histogram Variance** | index | `12.0` | `1.0` | `10.0` |
| `histogram_tendency` | **Histogram Tendency** | index | `0.0` | `0.0` | `0.0` |

---

## Detailed Data Breakdown by Category

### 1. Category I: Normal (Low Risk)
- **Clinical Impression**: Reassuring fetal status, physiological autonomic nervous system reactivity, healthy baseline variability, and normal contraction response.
- **Expected Classification**: `Normal` (Confidence: > 95%)

#### Parameter Values to Enter:
- **Baseline FHR**: `132`
- **Accelerations**: `0.006`
- **Fetal Movements**: `0.0`
- **Uterine Contractions**: `0.006`
- **Light Decelerations**: `0.003`
- **Severe Decelerations**: `0.0`
- **Prolonged Decelerations**: `0.0`
- **Abnormal STV (%)**: `17`
- **Mean STV**: `2.1`
- **Abnormal LTV (%)**: `0`
- **Mean LTV**: `10.4`
- **Histogram Width**: `130`
- **Histogram Min**: `68`
- **Histogram Max**: `198`
- **Histogram Peaks**: `6`
- **Histogram Zeroes**: `1`
- **Histogram Mode**: `141`
- **Histogram Mean**: `136`
- **Histogram Median**: `140`
- **Histogram Variance**: `12`
- **Histogram Tendency**: `0`

---

### 2. Category II: Suspect (Moderate Risk)
- **Clinical Impression**: Features deviate from reassuring baselines. Elevated short-term variability abnormality (65%), low mean variability (0.5 bpm), compressed histogram span (27 bpm), reduced accelerations. Warrants close fetal surveillance.
- **Expected Classification**: `Suspect` (Confidence: > 85%)

#### Parameter Values to Enter:
- **Baseline FHR**: `142`
- **Accelerations**: `0.001`
- **Fetal Movements**: `0.0`
- **Uterine Contractions**: `0.001`
- **Light Decelerations**: `0.0`
- **Severe Decelerations**: `0.0`
- **Prolonged Decelerations**: `0.0`
- **Abnormal STV (%)**: `65`
- **Mean STV**: `0.5`
- **Abnormal LTV (%)**: `24`
- **Mean LTV**: `7.3`
- **Histogram Width**: `27`
- **Histogram Min**: `130`
- **Histogram Max**: `157`
- **Histogram Peaks**: `1`
- **Histogram Zeroes**: `0`
- **Histogram Mode**: `144`
- **Histogram Mean**: `143`
- **Histogram Median**: `145`
- **Histogram Variance**: `1`
- **Histogram Tendency**: `0`

---

### 3. Category III: Pathological (High Risk)
- **Clinical Impression**: High likelihood of intrapartum fetal distress or hypoxemia. Marked presence of prolonged decelerations (0.005), 73% abnormal short-term variability, 43% abnormal long-term variability, absent accelerations, low baseline heart rate mean (99 bpm). Requires immediate obstetric intervention.
- **Expected Classification**: `Pathological` (Confidence: > 90%)

#### Parameter Values to Enter:
- **Baseline FHR**: `120`
- **Accelerations**: `0.0`
- **Fetal Movements**: `0.0`
- **Uterine Contractions**: `0.001`
- **Light Decelerations**: `0.002`
- **Severe Decelerations**: `0.0`
- **Prolonged Decelerations**: `0.005`
- **Abnormal STV (%)**: `73`
- **Mean STV**: `0.5`
- **Abnormal LTV (%)**: `43`
- **Mean LTV**: `4.0`
- **Histogram Width**: `64`
- **Histogram Min**: `62`
- **Histogram Max**: `126`
- **Histogram Peaks**: `2`
- **Histogram Zeroes**: `0`
- **Histogram Mode**: `105`
- **Histogram Mean**: `99`
- **Histogram Median**: `104`
- **Histogram Variance**: `10`
- **Histogram Tendency**: `0`

---

## How to Generate the Clinical PDF Report

1. Open the web interface at [http://localhost:5173](http://localhost:5173).
2. Log in using any demo account (or click one of the pre-filled demo cards, e.g. `Dr. Sarah Jenkins, MD`).
3. Click **Start CTG Exam** in the navigation bar.
4. Select a registered patient from the dropdown list.
5. In the top right of the form:
   - Click **Cat I Normal** for Normal data.
   - Click **Cat II Suspect** for Suspect data.
   - Click **Cat III Path** for Pathological data.
   *(Or manually type in the numbers from the tables above).*
6. Click **Execute Biophysical ML Assessment**.
7. Once the Assessment Result page displays the classification probabilities and clinical explanation, click **Download Assessment Report (PDF)** to generate the complete formatted PDF.
