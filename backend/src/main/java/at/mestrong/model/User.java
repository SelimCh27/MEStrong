package at.mestrong.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(nullable = false, length = 50)
    private String goal;

    @Column(name = "training_days", nullable = false)
    private int trainingDays;

    @Column
    private LocalDateTime creation;

    public Long getId(){return this.id;}
    public void setId(Long id){this.id = id;}

    public String getEmail(){return this.email;}
    public void setEmail(String email){this.email = email;}

    public String getPasswordHash(){return this.passwordHash;}
    public void setPasswordHash(String passwordHash){this.passwordHash = passwordHash;}

    public String getGoal(){return this.goal;}
    public void setGoal(String goal){this.goal = goal;}

    public int getTrainingDays(){return this.trainingDays;}
    public void setTrainingDays(int trainingDays){this.trainingDays = trainingDays;}

    public LocalDateTime getCreation(){return this.creation;}
    public void setCreation(LocalDateTime creation){this.creation = creation;}
}