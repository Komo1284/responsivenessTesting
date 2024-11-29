package eztake.api.reactiontest_api.service;

import eztake.api.reactiontest_api.dto.RankingRequest;
import eztake.api.reactiontest_api.entity.Ranking;
import eztake.api.reactiontest_api.repository.RankingRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class RankingService {
    private final RankingRepository rankingRepository;

    public RankingService(RankingRepository rankingRepository) {
        this.rankingRepository = rankingRepository;
    }

    public List<Ranking> getTopRankings() {
        return rankingRepository.findTop10ByOrderByReactionTimeAsc();
    }

    public Ranking saveRanking(RankingRequest request) {
        Ranking ranking = new Ranking();
        ranking.setName(request.getName());
        ranking.setReactionTime(request.getReactionTime());
        return rankingRepository.save(ranking);
    }
}