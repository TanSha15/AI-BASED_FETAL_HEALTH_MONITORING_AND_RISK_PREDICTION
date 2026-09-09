import os
import io
from pathlib import Path
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from app.config import settings
from app.utils.ctg_constants import FEATURE_METADATA

class PDFReportService:
    def __init__(self):
        self.reports_dir = Path(settings.REPORTS_DIR)
        self.reports_dir.mkdir(parents=True, exist_ok=True)

    def generate_assessment_report(self, assessment: dict, patient: dict = None) -> bytes:
        """
        Generate a comprehensive, beautifully styled PDF clinical report for an assessment.
        Returns raw PDF bytes.
        """
        buffer = io.BytesIO()
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=36,
            leftMargin=36,
            topMargin=36,
            bottomMargin=36
        )

        styles = getSampleStyleSheet()
        
        # Custom Typography Styles
        title_style = ParagraphStyle(
            "DocTitle",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=18,
            leading=22,
            textColor=colors.HexColor("#0F172A")
        )
        subtitle_style = ParagraphStyle(
            "DocSubTitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=10,
            leading=13,
            textColor=colors.HexColor("#64748B")
        )
        section_style = ParagraphStyle(
            "SectionHeading",
            parent=styles["Normal"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#1E293B"),
            spaceBefore=10,
            spaceAfter=6
        )
        body_style = ParagraphStyle(
            "BodyText",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=9,
            leading=13,
            textColor=colors.HexColor("#334155")
        )
        disclaimer_style = ParagraphStyle(
            "Disclaimer",
            parent=styles["Normal"],
            fontName="Helvetica-Oblique",
            fontSize=8,
            leading=11,
            textColor=colors.HexColor("#64748B")
        )

        elements = []

        # 1. Header Banner
        header_data = [
            [
                Paragraph("<b>FETAL HEALTH MONITORING SYSTEM</b><br/><font size=8 color='#64748B'>AI-Assisted Cardiotocography Risk Evaluation</font>", title_style),
                Paragraph(f"<b>Report Date:</b> {datetime.now().strftime('%b %d, %Y %H:%M')}<br/><b>Assessment ID:</b> {str(assessment.get('id', 'N/A'))[:8]}", subtitle_style)
            ]
        ]
        header_table = Table(header_data, colWidths=[340, 200])
        header_table.setStyle(TableStyle([
            ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ("ALIGN", (1, 0), (1, 0), "RIGHT"),
        ]))
        elements.append(header_table)
        elements.append(Spacer(1, 8))
        elements.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#0284C7"), spaceAfter=12))

        # 2. Patient Demographics Table
        patient_name = patient.get("name", "Unknown Patient") if patient else assessment.get("patient_name", "Anonymous")
        patient_age = f"{patient.get('age', 'N/A')} yrs" if patient else f"{assessment.get('patient_age', 'N/A')} yrs"
        gestational_age = f"{patient.get('pregnancy_week', 'N/A')} weeks" if patient else f"{assessment.get('patient_pregnancy_week', 'N/A')} weeks"
        contact = patient.get("contact", "N/A") if patient else "N/A"

        patient_grid = [
            [
                Paragraph("<b>Patient Name:</b>", body_style), Paragraph(str(patient_name), body_style),
                Paragraph("<b>Age:</b>", body_style), Paragraph(str(patient_age), body_style)
            ],
            [
                Paragraph("<b>Gestational Age:</b>", body_style), Paragraph(str(gestational_age), body_style),
                Paragraph("<b>Contact:</b>", body_style), Paragraph(str(contact), body_style)
            ]
        ]
        p_table = Table(patient_grid, colWidths=[100, 170, 100, 170])
        p_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        elements.append(p_table)
        elements.append(Spacer(1, 12))

        # 3. Prediction & Classification Results Banner
        pred_label = assessment.get("prediction_label", "Unknown")
        confidence_pct = round(assessment.get("confidence", 0.0) * 100, 1)
        risk_level = assessment.get("risk_level", "Unknown Risk")
        
        badge_bg = colors.HexColor("#DCFCE7")  # green
        badge_border = colors.HexColor("#16A34A")
        badge_text_color = "#15803D"
        if pred_label == "Suspect":
            badge_bg = colors.HexColor("#FEF3C7")  # amber
            badge_border = colors.HexColor("#D97706")
            badge_text_color = "#B45309"
        elif pred_label == "Pathological":
            badge_bg = colors.HexColor("#FEE2E2")  # red
            badge_border = colors.HexColor("#DC2626")
            badge_text_color = "#B91C1C"

        probs = assessment.get("probabilities", {})
        prob_str = f"Normal: {round(probs.get('Normal', 0)*100, 1)}% | Suspect: {round(probs.get('Suspect', 0)*100, 1)}% | Pathological: {round(probs.get('Pathological', 0)*100, 1)}%"

        summary_data = [
            [
                Paragraph(f"<font size=14 color='{badge_text_color}'><b>CLASSIFICATION: {pred_label.upper()}</b></font><br/>"
                          f"<b>Risk Status:</b> {risk_level} &nbsp;|&nbsp; <b>Model Confidence:</b> {confidence_pct}%<br/>"
                          f"<font size=8 color='#475569'>Probability Distribution: {prob_str}</font>", body_style)
            ]
        ]
        summary_table = Table(summary_data, colWidths=[540])
        summary_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, -1), badge_bg),
            ("BOX", (0, 0), (-1, -1), 1.5, badge_border),
            ("TOPPADDING", (0, 0), (-1, -1), 8),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ]))
        elements.append(summary_table)
        elements.append(Spacer(1, 10))

        # 4. Top Contributing Factors Table
        elements.append(Paragraph("<b>Top Contributing CTG Physiological Indicators</b>", section_style))
        top_factors = assessment.get("top_contributing_factors", [])[:5]
        
        factor_rows = [
            [Paragraph("<b>Parameter</b>", body_style), Paragraph("<b>Recorded Value</b>", body_style), Paragraph("<b>Unit</b>", body_style), Paragraph("<b>Model Importance</b>", body_style)]
        ]
        for f in top_factors:
            factor_rows.append([
                Paragraph(f.get("label", f.get("feature", "")), body_style),
                Paragraph(str(f.get("value", "")), body_style),
                Paragraph(str(f.get("unit", "-")), body_style),
                Paragraph(f"{f.get('percentage', 0)}%", body_style)
            ])
        
        factor_table = Table(factor_rows, colWidths=[200, 110, 90, 140])
        factor_table.setStyle(TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#F1F5F9")),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#E2E8F0")),
            ("TOPPADDING", (0, 0), (-1, -1), 4),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
        ]))
        elements.append(factor_table)
        elements.append(Spacer(1, 10))

        # 5. Generative AI Clinical Explanation
        explanation = assessment.get("explanation", "")
        if explanation:
            elements.append(Paragraph("<b>Generative AI Clinical Narrative & Findings</b>", section_style))
            exp_flowables = []
            for line in explanation.split("\n"):
                line_str = line.strip()
                if not line_str:
                    continue
                if line_str.startswith("### "):
                    text = f"<b>{line_str[4:]}</b>"
                    exp_flowables.append(Paragraph(text, section_style))
                elif line_str.startswith("#### "):
                    text = f"<b>{line_str[5:]}</b>"
                    exp_flowables.append(Paragraph(text, body_style))
                elif line_str.startswith("• ") or line_str.startswith("- ") or line_str.startswith("* "):
                    parts = line_str[2:].split("**")
                    formatted = "".join([f"<b>{part}</b>" if i % 2 == 1 else part for i, part in enumerate(parts)])
                    exp_flowables.append(Paragraph(f"&bull; {formatted}", body_style))
                elif line_str.startswith("---") or line_str.startswith("*Disclaimer:"):
                    clean = line_str.replace("*", "").replace("---", "").strip()
                    if clean:
                        exp_flowables.append(Paragraph(clean, disclaimer_style))
                else:
                    parts = line_str.split("**")
                    formatted = "".join([f"<b>{part}</b>" if i % 2 == 1 else part for i, part in enumerate(parts)])
                    exp_flowables.append(Paragraph(formatted, body_style))
            
            exp_box = Table([[exp_flowables]], colWidths=[540])
            exp_box.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#94A3B8")),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
            ]))
            elements.append(exp_box)
            elements.append(Spacer(1, 10))

        # 6. Full CTG Parameter Measurement Summary
        elements.append(Paragraph("<b>Complete 21-Parameter CTG Data Log</b>", section_style))
        input_data = assessment.get("input_data", {})
        
        data_rows = []
        keys = list(input_data.keys())
        for i in range(0, len(keys), 2):
            k1 = keys[i]
            v1 = input_data[k1]
            label1 = FEATURE_METADATA.get(k1, {}).get("label", k1)
            
            if i + 1 < len(keys):
                k2 = keys[i + 1]
                v2 = input_data[k2]
                label2 = FEATURE_METADATA.get(k2, {}).get("label", k2)
            else:
                label2, v2 = "", ""
                
            data_rows.append([
                Paragraph(f"{label1}:", body_style), Paragraph(str(v1), body_style),
                Paragraph(f"{label2}:" if label2 else "", body_style), Paragraph(str(v2) if v2 != "" else "", body_style)
            ])
            
        data_table = Table(data_rows, colWidths=[170, 100, 170, 100])
        data_table.setStyle(TableStyle([
            ("BOX", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
            ("INNERGRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#F1F5F9")),
            ("TOPPADDING", (0, 0), (-1, -1), 2),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 2),
        ]))
        elements.append(data_table)
        elements.append(Spacer(1, 12))

        # 7. Medical Disclaimer
        disclaimer_text = (
            "<b>ACADEMIC & CLINICAL DECISION SUPPORT NOTICE:</b> This system utilizes machine learning algorithms "
            "trained on cardiotocography benchmark datasets and generative AI for educational, research, and assistive purposes. "
            "Predictions and interpretations do not constitute a definitive medical diagnosis. All clinical decisions, diagnostic verifications, "
            "and interventions must be conducted by qualified medical professionals."
        )
        elements.append(Paragraph(disclaimer_text, disclaimer_style))

        # Build document
        doc.build(elements)
        pdf_bytes = buffer.getvalue()
        buffer.close()

        # Save copy to reports folder
        filename = f"report_assessment_{assessment.get('id', 'temp')}.pdf"
        file_path = self.reports_dir / filename
        try:
            with open(file_path, "wb") as f:
                f.write(pdf_bytes)
        except Exception as e:
            print(f"[PDFReportService] Warning: Could not save PDF to {file_path}: {e}")

        return pdf_bytes

pdf_service = PDFReportService()
