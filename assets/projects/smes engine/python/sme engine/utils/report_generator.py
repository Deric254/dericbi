from fpdf import FPDF

def generate_pdf_report(summary, output_path='exports/dericbi_report.pdf'):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.set_text_color(0, 0, 0)

    pdf.cell(200, 10, txt="DericBI SME Growth Dashboard Report", ln=True, align='C')
    pdf.ln(10)

    for key, value in summary.items():
        pdf.cell(200, 10, txt=f"{key}: {value}", ln=True)

    pdf.output(output_path)
