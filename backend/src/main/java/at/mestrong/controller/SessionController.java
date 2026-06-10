package at.mestrong.controller;

import at.mestrong.model.TrainingSession;
import at.mestrong.model.User;
import at.mestrong.service.SessionService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.Map;

@RestController
@RequestMapping("/api/session")
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping
    public ResponseEntity<?> startSession(@RequestBody Map<String, Long> payload, Authentication auth) {
        User user = (User) auth.getPrincipal();
        Long planDayId = payload.get("planDayId");
        TrainingSession session = sessionService.startSession(user, planDayId);
        return ResponseEntity.status(201).body(Map.of("sessionId", session.getId(), "startedAt", session.getStartedAt()));
    }

    @PostMapping("/{sessionId}/set")
    public ResponseEntity<?> addSet(@PathVariable Long sessionId, @RequestBody Map<String, Object> payload, Authentication auth) {
        User user = (User) auth.getPrincipal();
        String exercise = (String) payload.get("exercise");
        BigDecimal weight = new BigDecimal(payload.get("weight").toString());
        int reps = (Integer) payload.get("reps");

        Map<String, Object> result = sessionService.addSet(sessionId, exercise, weight, reps, user);
        return ResponseEntity.status(201).body(result);
    }

    @PutMapping("/{sessionId}/complete")
    public ResponseEntity<?> completeSession(@PathVariable Long sessionId) {
        TrainingSession session = sessionService.completeSession(sessionId);
        return ResponseEntity.ok(Map.of(
                "completedAt", session.getCompletedAt()
        ));
    }
}