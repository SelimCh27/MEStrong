package at.mestrong.repository;

import at.mestrong.model.PlanDay;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PlanDayRepository extends JpaRepository<PlanDay, Long> {
    List<PlanDay> findByTrainingPlanIdOrderByDayOrderAsc(Long planId);
}