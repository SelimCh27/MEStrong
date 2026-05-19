package at.mestrong.model;

import jakarta.persistence.*;

@Entity
@Table(name = "plan_days")
public class PlanDay{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "plan_id", nullable = false)
    private TrainingPlan trainingPlan;

    @Column(name = "day_name", nullable = false, length = 100)
    private String dayName;

    @Column(length = 100)
    private String focus;

    @Column(name = "day_order", nullable = false)
    private int dayOrder;

    public Long getId(){return id;}
    public void setId(Long id){this.id = id;}

    public TrainingPlan getTrainingPlan(){return trainingPlan;}
    public void setTrainingPlan(TrainingPlan trainingPlan){this.trainingPlan = trainingPlan;}

    public String getDayName(){return dayName;}
    public void setDayName(String dayName){this.dayName = dayName;}

    public String getFocus(){return focus;}
    public void setFocus(String focus){this.focus = focus;}

    public int getDayOrder(){return dayOrder;}
    public void setDayOrder(int dayOrder){this.dayOrder = dayOrder;}
}