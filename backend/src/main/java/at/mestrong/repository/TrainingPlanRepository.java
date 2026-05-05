package at.mestrong.repository;

import at.mestrong.model.TrainingPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TrainingPlanRepository extends JpaRepository<TrainingPlan, Long> {
    TrainingPlan findByUserId(Long userId);
}