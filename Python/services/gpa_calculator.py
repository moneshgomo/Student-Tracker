def calculate_gpa(subjects):
    if not subjects:
        return 0.0
    total_credits = sum(sub["credit_hours"] for sub in subjects)
    total_points = sum(sub["credit_hours"] * sub["grade_point"] for sub in subjects)
    return round(total_points / total_credits, 2)
