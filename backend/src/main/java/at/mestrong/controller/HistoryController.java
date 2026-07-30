package at.mestrong.controller;

import at.mestrong.model.ExerciseSet;
import at.mestrong.model.PlanDay;
import at.mestrong.model.TrainingSession;
import at.mestrong.model.User;
import at.mestrong.repository.ExerciseSetRepository;
import at.mestrong.repository.TrainingSessionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/history")
public class HistoryController {

    private final TrainingSessionRepository sessionRepository;
    private final ExerciseSetRepository exerciseSetRepository;

    public HistoryController(TrainingSessionRepository sessionRepository,
                             ExerciseSetRepository exerciseSetRepository) {
        this.sessionRepository = sessionRepository;
        this.exerciseSetRepository = exerciseSetRepository;
    }

    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getHistory(Authentication auth) {
        User user = (User) auth.getPrincipal();
        List<TrainingSession> sessions =
                sessionRepository.findTop10ByUser_IdAndCompletedAtIsNotNullOrderByCompletedAtDesc(user.getId());

        List<Map<String, Object>> result = new ArrayList<>();
        for (TrainingSession session : sessions) {
            List<ExerciseSet> sets = exerciseSetRepository.findByTrainingSession_IdOrderByCreatedAtAsc(session.getId());
            Set<String> exercises = new LinkedHashSet<>();
            for (ExerciseSet set : sets) {
                exercises.add(set.getExercise());
            }

            int duration = 1;
            if (session.getStartedAt() != null && session.getCompletedAt() != null) {
                duration = (int) ChronoUnit.MINUTES.between(session.getStartedAt(), session.getCompletedAt());
                if (duration < 1) {
                    duration = 1;
                }
            }

            String dayName = "";
            String dayFocus = "";
            PlanDay planDay = session.getPlanDay();
            if (planDay != null) {
                dayName = planDay.getDayName() != null ? planDay.getDayName() : "";
                dayFocus = planDay.getFocus() != null ? planDay.getFocus() : "";
            }

            result.add(Map.of(
                    "sessionId", session.getId(),
                    "completedAt", session.getCompletedAt().toInstant().toString(),
                    "totalSets", sets.size(),
                    "duration", duration,
                    "exercises", List.copyOf(exercises),
                    "dayName", dayName,
                    "dayFocus", dayFocus
            ));
        }

        return ResponseEntity.ok(result);
    }
}
