package com.gomo.Student.Tracker.service;



import com.gomo.Student.Tracker.model.MarkSheet;
import com.gomo.Student.Tracker.repository.MarkSheetRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class MarkSheetService {

    private static final Logger logger = LoggerFactory.getLogger(MarkSheetService.class);

    private final MarkSheetRepository repo;
    private final GPAService gpaService;

    public MarkSheetService(MarkSheetRepository repo, GPAService gpaService) {
        this.repo = repo;
        this.gpaService = gpaService;
    }

    public MarkSheetResponse processAndSave(MarkSheet markSheet) {
        logger.info("📥 Processing marksheet for registerNo: {}", markSheet.getRegisterNo());

        double gpa = gpaService.calculateGPA(markSheet.getSubjects());
        markSheet.setGpa(gpa);
        markSheet.setId(markSheet.getRegisterNo() + "-SEM" + extractSemester(markSheet.getExamSession()));

        repo.save(markSheet);

        logger.info("✅ Saved marksheet | RegNo: {} | GPA: {}", markSheet.getRegisterNo(), gpa);
        return new MarkSheetResponse(markSheet.getSubjects(), gpa);
    }

    private int extractSemester(String sessionText) {
        // Simple text extraction for "Fourth Semester" etc.
        String lower = sessionText.toLowerCase();
        if (lower.contains("first")) return 1;
        if (lower.contains("second")) return 2;
        if (lower.contains("third")) return 3;
        if (lower.contains("fourth")) return 4;
        if (lower.contains("fifth")) return 5;
        if (lower.contains("sixth")) return 6;
        if (lower.contains("seventh")) return 7;
        if (lower.contains("eighth")) return 8;
        return 0;
    }
}
