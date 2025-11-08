package com.gomo.Student.Tracker.service;

import com.gomo.Student.Tracker.model.Subject;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GPACalculation {

    /*
            GPA=∑(Credit Hours)∑(Credit Points)​
     */
    public double calculateGPA(List<Subject> subjects) {
        double totalCreditPoints = 0;
        double totalCredits = 0;

        for (Subject s : subjects) {
            totalCreditPoints += s.getCreditPoint();
            totalCredits += s.getCreditHours();
        }

        return totalCredits == 0 ? 0 : Math.round((totalCreditPoints / totalCredits) * 100.0) / 100.0;
    }

}
