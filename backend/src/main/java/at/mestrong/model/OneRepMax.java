package at.mestrong.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.ZonedDateTime;

@Entity
@Table(name = "orm")
public class OneRepMax {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "exercise_id", nullable = false)
    private ExerciseSet exerciseSet;

    @Column(nullable = false, length = 100)
    private String exercise;

    @Column(name = "calculated_orm", nullable = false, precision = 6, scale = 2)
    private BigDecimal calculatedOrm;

    @Column(name = "creation", nullable = false)
    private ZonedDateTime calculatedAt = ZonedDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public ExerciseSet getExerciseSet() { return exerciseSet; }
    public void setExerciseSet(ExerciseSet exerciseSet) { this.exerciseSet = exerciseSet; }

    public String getExercise() { return exercise; }
    public void setExercise(String exercise) { this.exercise = exercise; }

    public BigDecimal getCalculatedOrm() { return calculatedOrm; }
    public void setCalculatedOrm(BigDecimal calculatedOrm) { this.calculatedOrm = calculatedOrm; }

    public ZonedDateTime getCalculatedAt() { return calculatedAt; }
    public void setCalculatedAt(ZonedDateTime calculatedAt) { this.calculatedAt = calculatedAt; }
}