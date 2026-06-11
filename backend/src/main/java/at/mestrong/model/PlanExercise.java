package at.mestrong.model;

import jakarta.persistence.*;

@Entity
@Table(name = "plan_exercises")
public class PlanExercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "day_id", nullable = false)
    private PlanDay planDay;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false)
    private int sets;

    @Column(nullable = false)
    private int reps;

    @Column(name = "exercises_type", length = 50)
    private String exercisesType;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public PlanDay getPlanDay() { return planDay; }
    public void setPlanDay(PlanDay planDay) { this.planDay = planDay; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getSets() { return sets; }
    public void setSets(int sets) { this.sets = sets; }

    public int getReps() { return reps; }
    public void setReps(int reps) { this.reps = reps; }

    public String getExercisesType() { return exercisesType; }
    public void setExercisesType(String exercisesType) { this.exercisesType = exercisesType; }
}