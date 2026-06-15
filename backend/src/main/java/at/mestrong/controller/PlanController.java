package at.mestrong.controller;

import at.mestrong.model.*;
import at.mestrong.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/api/plan")
public class PlanController {

    private final TrainingPlanRepository trainingPlanRepository;
    private final PlanDayRepository planDayRepository;
    private final PlanExerciseRepository planExerciseRepository;

    public PlanController(TrainingPlanRepository trainingPlanRepository,
                          PlanDayRepository planDayRepository,
                          PlanExerciseRepository planExerciseRepository) {
        this.trainingPlanRepository = trainingPlanRepository;
        this.planDayRepository = planDayRepository;
        this.planExerciseRepository = planExerciseRepository;
    }

    // 1. REPARIERT: Holt die Daten per @RequestParam aus der URL (?goal=...&days=...)
    @PostMapping("/generate")
    @Transactional
    public ResponseEntity<?> generatePlan(@RequestParam String goal, @RequestParam int days, Authentication auth) {
        return saveAndReturnPlan(goal, days, auth);
    }

    // 2. REPARIERT: Falls das Frontend hier einen JSON-Body schickt, fangen wir das flexibel ab
    @PostMapping("/save")
    @Transactional
    public ResponseEntity<?> savePlan(@RequestBody Map<String, Object> payload, Authentication auth) {
        String goal = (String) payload.get("goal");
        int days = Integer.parseInt(payload.get("days").toString());
        return saveAndReturnPlan(goal, days, auth);
    }

    @GetMapping("/my")
    public ResponseEntity<?> getMyPlan(Authentication auth) {
        User user = (User) auth.getPrincipal();
        TrainingPlan plan = trainingPlanRepository.findByUser_Id(user.getId());

        if (plan == null) {
            return ResponseEntity.ok(Map.of("weeks", new ArrayList<>()));
        }

        return ResponseEntity.ok(buildPlanResponse(plan));
    }

    // Core-Logik zum Speichern und Generieren
    private ResponseEntity<?> saveAndReturnPlan(String goal, int daysCount, Authentication auth) {
        User user = (User) auth.getPrincipal();

        String split = "FULLBODY";
        if (daysCount == 3 || daysCount == 4) {
            split = "UPPER_LOWER";
        } else if (daysCount >= 5) {
            split = "PPL";
        }

        // Alten Plan kaskadierend aus der DB löschen
        TrainingPlan existingPlan = trainingPlanRepository.findByUser_Id(user.getId());
        if (existingPlan != null) {
            List<PlanDay> oldDays = planDayRepository.findByTrainingPlan_IdOrderByDayOrderAsc(existingPlan.getId());
            for (PlanDay oldDay : oldDays) {
                List<PlanExercise> oldExercises = planExerciseRepository.findByPlanDay_Id(oldDay.getId());
                planExerciseRepository.deleteAll(oldExercises);
            }
            planDayRepository.deleteAll(oldDays);
            trainingPlanRepository.delete(existingPlan);
        }

        // Neuen echten Plan speichern
        TrainingPlan plan = new TrainingPlan();
        plan.setUser(user);
        plan.setGoal(goal);
        plan.setDays(daysCount);
        plan.setSplit(split);
        plan.setCreation(LocalDate.now());
        trainingPlanRepository.save(plan);

        String[] dayNames = {"Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"};

        for (int i = 0; i < Math.min(daysCount, 7); i++) {
            PlanDay day = new PlanDay();
            day.setTrainingPlan(plan);
            day.setDayName(dayNames[i]);
            day.setDayOrder(i + 1);

            if (split.equals("FULLBODY")) {
                day.setFocus("Ganzkörper " + (i % 2 == 0 ? "A" : "B"));
            } else if (split.equals("UPPER_LOWER")) {
                day.setFocus(i % 2 == 0 ? "Oberkörper" : "Unterkörper");
            } else {
                String[] ppl = {"Push", "Pull", "Legs"};
                day.setFocus(ppl[i % 3]);
            }

            planDayRepository.save(day);

            List<PlanExercise> exercises = createExercisesForDay(day);
            planExerciseRepository.saveAll(exercises);
        }

        return ResponseEntity.ok(buildPlanResponse(plan));
    }

    private Map<String, Object> buildPlanResponse(TrainingPlan plan) {
        List<PlanDay> dbDays = planDayRepository.findByTrainingPlan_IdOrderByDayOrderAsc(plan.getId());
        List<Map<String, Object>> weeksJson = new ArrayList<>();

        for (PlanDay dbDay : dbDays) {
            List<PlanExercise> dbExercises = planExerciseRepository.findByPlanDay_Id(dbDay.getId());
            List<Map<String, Object>> exercisesJson = new ArrayList<>();

            for (PlanExercise ex : dbExercises) {
                exercisesJson.add(Map.of(
                        "name", ex.getName(),
                        "sets", ex.getSets(),
                        "reps", String.valueOf(ex.getReps()),
                        "type", ex.getExercisesType() != null ? ex.getExercisesType() : "COMPOUND"
                ));
            }

            weeksJson.add(Map.of(
                    "dayId", dbDay.getId(),
                    "day", dbDay.getDayName(),
                    "focus", dbDay.getFocus(),
                    "exercises", exercisesJson
            ));
        }

        return Map.of(
                "goal", plan.getGoal(),
                "days", plan.getDays(),
                "splitType", plan.getSplit(),
                "weeks", weeksJson
        );
    }

    private List<PlanExercise> createExercisesForDay(PlanDay day) {
        List<PlanExercise> list = new ArrayList<>();
        if (day.getFocus().contains("Ganzkörper") || day.getFocus().contains("Oberkörper") || day.getFocus().equals("Push")) {
            list.add(createExercise(day, "Bankdrücken", 4, 10, "COMPOUND"));
            list.add(createExercise(day, "Schulterdrücken", 3, 12, "COMPOUND"));
        }
        if (day.getFocus().contains("Ganzkörper") || day.getFocus().contains("Oberkörper") || day.getFocus().equals("Pull")) {
            list.add(createExercise(day, "Klimmzüge", 3, 8, "COMPOUND"));
            list.add(createExercise(day, "Rudern", 3, 12, "COMPOUND"));
        }
        if (day.getFocus().contains("Ganzkörper") || day.getFocus().contains("Unterkörper") || day.getFocus().equals("Legs")) {
            list.add(createExercise(day, "Kniebeugen", 4, 8, "COMPOUND"));
        }
        if (list.isEmpty()) {
            list.add(createExercise(day, "Liegestütze", 3, 15, "COMPOUND"));
        }
        return list;
    }

    private PlanExercise createExercise(PlanDay day, String name, int sets, int reps, String type) {
        PlanExercise ex = new PlanExercise();
        ex.setPlanDay(day);
        ex.setName(name);
        ex.setSets(sets);
        ex.setReps(reps);
        ex.setExercisesType(type);
        return ex;
    }
}