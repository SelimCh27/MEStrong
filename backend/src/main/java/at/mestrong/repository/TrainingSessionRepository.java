package at.mestrong.repository;

import at.mestrong.model.TrainingSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrainingSessionRepository extends JpaRepository<TrainingSession, Long> {
    List<TrainingSession> findTop10ByUser_IdAndCompletedAtIsNotNullOrderByCompletedAtDesc(Long userId);
}