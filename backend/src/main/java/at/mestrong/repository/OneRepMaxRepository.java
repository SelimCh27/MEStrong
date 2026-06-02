package at.mestrong.repository;

import at.mestrong.model.OneRepMax;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OneRepMaxRepository extends JpaRepository<OneRepMax, Long> {
    List<OneRepMax> findByUserIdAndExerciseOrderByCalculatedAtAsc(Long userId, String exercise);
}