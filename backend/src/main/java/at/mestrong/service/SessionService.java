package at.mestrong.service;

import at.mestrong.model.*;
import at.mestrong.repository.*;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.ZonedDateTime;
import java.util.Map;

@Service
public class SessionService {

    private final TrainingSessionRepository sessionRepo;
    private final ExerciseSetRepository setRepo;
    private final OneRepMaxRepository ormRepo;
    private final PlanDayRepository planDayRepo;

    public SessionService(TrainingSessionRepository sessionRepo, ExerciseSetRepository setRepo,
                          OneRepMaxRepository ormRepo, PlanDayRepository planDayRepo) {
        this.sessionRepo = sessionRepo;
        this.setRepo = setRepo;
        this.ormRepo = ormRepo;
        this.planDayRepo = planDayRepo;
    }

    public TrainingSession startSession(User user, Long planDayId) {
        TrainingSession session = new TrainingSession();
        session.setUser(user);
        session.setStartedAt(ZonedDateTime.now());

        if (planDayId != null) {
            planDayRepo.findById(planDayId).ifPresent(session::setPlanDay);
        }
        return sessionRepo.save(session);
    }

    public Map<String, Object> addSet(Long sessionId, String exerciseName, BigDecimal weight, int reps, User user) {
        TrainingSession session = sessionRepo.findById(sessionId).orElseThrow();
        if (!session.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Session does not belong to user");
        }

        ExerciseSet set = new ExerciseSet();
        set.setTrainingSession(session);
        set.setExercise(exerciseName);
        set.setWeight(weight);
        set.setReps(reps);
        set.setSetNumber((int) setRepo.countByTrainingSession_Id(sessionId) + 1);
        set = setRepo.save(set);

        // 1RM Calculation (Epley Formula)
        BigDecimal repsDec = BigDecimal.valueOf(reps);
        BigDecimal factor = BigDecimal.ONE.add(repsDec.divide(BigDecimal.valueOf(30), 4, RoundingMode.HALF_UP));
        BigDecimal calculatedOrm = weight.multiply(factor).setScale(2, RoundingMode.HALF_UP);

        OneRepMax orm = new OneRepMax();
        orm.setUser(user);
        orm.setExerciseSet(set);
        orm.setExercise(exerciseName);
        orm.setCalculatedOrm(calculatedOrm);
        ormRepo.save(orm);

        return Map.of("setId", set.getId(), "orm", calculatedOrm);
    }

    public TrainingSession completeSession(Long sessionId, User user) {
        TrainingSession session = sessionRepo.findById(sessionId).orElseThrow();
        if (!session.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("Session does not belong to user");
        }
        session.setCompletedAt(ZonedDateTime.now());
        return sessionRepo.save(session);
    }
}