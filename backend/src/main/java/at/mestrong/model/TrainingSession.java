package at.mestrong.model;

import jakarta.persistence.*;
import java.time.ZonedDateTime;

@Entity
@Table(name = "training_sessions")
public class TrainingSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "plan_day_id")
    private PlanDay planDay;

    @Column(name = "start_time", nullable = false)
    private ZonedDateTime startedAt = ZonedDateTime.now();

    @Column(name = "end_time")
    private ZonedDateTime completedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public PlanDay getPlanDay() { return planDay; }
    public void setPlanDay(PlanDay planDay) { this.planDay = planDay; }

    public ZonedDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(ZonedDateTime startedAt) { this.startedAt = startedAt; }

    public ZonedDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(ZonedDateTime completedAt) { this.completedAt = completedAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
