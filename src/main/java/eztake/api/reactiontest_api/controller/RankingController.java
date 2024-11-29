package eztake.api.reactiontest_api.controller;

import eztake.api.reactiontest_api.dto.RankingRequest;
import eztake.api.reactiontest_api.entity.Ranking;
import eztake.api.reactiontest_api.service.RankingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RankingController {
    private final RankingService rankingService;

    public RankingController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    @GetMapping("/rankings")
    public List<Ranking> getRankings() {
        return rankingService.getTopRankings();
    }

    @PostMapping("/rankings")
    public ResponseEntity<Ranking> createRanking(@Valid @RequestBody RankingRequest request) {
        Ranking savedRanking = rankingService.saveRanking(request);
        return ResponseEntity.ok(savedRanking);
    }
}