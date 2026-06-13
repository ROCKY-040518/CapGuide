package com.example.capguide.domain; // <- 이 부분이 수정되었습니다.

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "project_plan")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProjectPlan extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String summary;

    @Column(name = "tech_stacks", columnDefinition = "TEXT")
    private String techStacks;

    @Builder
    public ProjectPlan(String title, String summary, String techStacks) {
        this.title = title;
        this.summary = summary;
        this.techStacks = techStacks;
    }

    public void setUser(User user) {
        this.user = user;
        if (!user.getProjectPlans().contains(this)) {
            user.getProjectPlans().add(this);
        }
    }
}