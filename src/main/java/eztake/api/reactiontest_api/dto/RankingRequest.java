package eztake.api.reactiontest_api.dto;


import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RankingRequest {
    @NotBlank(message = "이름은 필수입니다")
    @Size(max = 10, message = "이름은 10자를 초과할 수 없습니다")
    private String name;

    @NotNull(message = "반응 시간은 필수입니다")
    @Min(value = 1, message = "반응 시간은 0보다 커야 합니다")
    private Integer reactionTime;

}