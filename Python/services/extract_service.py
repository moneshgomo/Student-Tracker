import pdfplumber
import re
import tempfile
from .gpa_calculator import calculate_gpa

def extract_marksheet(file):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        file.save(tmp.name)
        with pdfplumber.open(tmp.name) as pdf:
            full_text = "\n".join(page.extract_text() or "" for page in pdf.pages)
            subjects = extract_subjects(pdf)
    
    # Extract meta info using regex
    register_no = re.search(r"\b\d{2}[A-Z]{2}\d{4}\b", full_text)
    name = re.search(r"Name\s*:?([A-Z\s]+)", full_text)
    dept = re.search(r"B\.Tech\s*\((.*?)\)", full_text)
    result_date = re.search(r"(\d{2}/\d{2}/\d{4})", full_text)

    # Calculate GPA
    gpa = calculate_gpa(subjects)

    return {
        "_id": f"{register_no.group(0)}-SEM{extract_semester(full_text)}" if register_no else None,
        "registerNo": register_no.group(0) if register_no else "Unknown",
        "studentName": name.group(1).strip() if name else "Unknown",
        "department": dept.group(1).strip() if dept else "Unknown",
        "resultDate": result_date.group(1) if result_date else "Unknown",
        "subjects": subjects,
        "gpa": gpa
    }

def extract_subjects(pdf):
    subjects = []
    for page in pdf.pages:
        tables = page.extract_tables()
        for table in tables:
            for row in table:
                if row and len(row) >= 7 and row[0].isdigit():
                    try:
                        subjects.append({
                            "subjectName": row[1].strip(),
                            "type": row[2].replace(".", "").strip(),
                            "credit_hours": float(row[3]),
                            "grade_point": float(row[4]),
                            "credit_point": float(row[5]),
                            "grade": row[6].strip()
                        })
                    except:
                        pass
    return subjects

def extract_semester(text):
    text = text.lower()
    if "first" in text: return 1
    if "second" in text: return 2
    if "third" in text: return 3
    if "fourth" in text: return 4
    if "fifth" in text: return 5
    if "sixth" in text: return 6
    if "seventh" in text: return 7
    if "eighth" in text: return 8
    return 0
