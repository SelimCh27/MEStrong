package at.mestrong.repository;

import at.mestrong.model.ExerciseSet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ExerciseSetRepository extends JpaRepository<ExerciseSet, Long> {

    List<ExerciseSet> findByTrainingSessionIdOrderByCreatedAtAsc(Long sessionId);

    @Query("SELECT s.completedAt, AVG(es.weight) FROM ExerciseSet es"
            + " JOIN es.trainingSession s"
            + " WHERE s.user.id = :userId AND es.exercise = :exercise"
            + " AND s.completedAt IS NOT NULL"
            + " GROUP BY s.id, s.completedAt"
            + " ORDER BY s.completedAt ASC")
    List<Object[]> findAvgWeightPerSession(@Param("userId") Long userId, @Param("exercise") String exercise);
}