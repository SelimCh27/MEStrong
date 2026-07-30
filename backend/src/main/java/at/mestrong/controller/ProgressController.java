package at.mestrong.controller;

import at.mestrong.model.OneRepMax;
import at.mestrong.model.User;
import at.mestrong.repository.ExerciseSetRepository;
import at.mestrong.repository.OneRepMaxRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api")
public class ProgressController {

    private final ExerciseSetRepository exerciseSetRepository;
    private final OneRepMaxRepository oneRepMaxRepository;

    public ProgressController(ExerciseSetRepository exerciseSetRepository,
                              OneRepMaxRepository oneRepMaxRepository) {
        this.exerciseSetRepository = exerciseSetRepository;
        this.oneRepMaxRepository = oneRepMaxRepository;
    }

    @GetMapping("/progress/{exercise}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getProgress(@PathVariable String exercise, Authentication auth) {
        User user = (User) auth.getPrincipal();
        List<Object[]> rows = exerciseSetRepository.findAvgWeightPerSession(user.getId(), exercise);
        List<Map<String, Object>> result = new ArrayList<>();

        for (Object[] row : rows) {
            ZonedDateTime completedAt = (ZonedDateTime) row[0];
            double avgWeight = ((Number) row[1]).doubleValue();
            Map<String, Object> point = new HashMap<>();
            point.put("date", completedAt.toInstant().toString());
            point.put("avgWeight", round(avgWeight));
            result.add(point);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/1rm/{exercise}")
    @Transactional(readOnly = true)
    public ResponseEntity<List<Map<String, Object>>> getOneRepMax(@PathVariable String exercise, Authentication auth) {
        User user = (User) auth.getPrincipal();
        List<OneRepMax> records = oneRepMaxRepository.findByUser_IdAndExerciseOrderByCalculatedAtAsc(user.getId(), exercise);
        List<Map<String, Object>> result = new ArrayList<>();

        for (OneRepMax record : records) {
            Map<String, Object> point = new HashMap<>();
            point.put("date", record.getCalculatedAt().toInstant().toString());
            point.put("orm", record.getCalculatedOrm());
            if (record.getExerciseSet() != null) {
                point.put("weight", record.getExerciseSet().getWeight());
                point.put("reps", record.getExerciseSet().getReps());
            }
            result.add(point);
        }

        return ResponseEntity.ok(result);
    }

    private double round(double value) {
        return BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP).doubleValue();
    }
}
