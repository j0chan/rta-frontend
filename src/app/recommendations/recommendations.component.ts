import { Component, OnInit } from '@angular/core';
import { RecommendationsService } from './recommendations.service';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  recommendedStoreIds: number[] = [];
  errorMessage: string = '';

  constructor(private recommendationsService: RecommendationsService) { }

  ngOnInit(): void {
    this.getRecommendations();
  }

  getRecommendations(): void {
    this.recommendationsService.getRecommendations().subscribe({
      next: (response) => {
        this.recommendedStoreIds = response.recommended_store_ids;
        console.log('추천된 상점 ID:', this.recommendedStoreIds);
      },
      error: (error) => {
        this.errorMessage = '추천 데이터를 가져오는 데 실패했습니다.';
        console.error('Error fetching recommendations:', error);
      }
    });
  }
}
