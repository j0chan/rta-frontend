import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RecommendationsService } from '../shared/services/recommendations.service';
import { StoresService } from '../shared/services/stores.service';
import { ReadStore } from '../shared/model/stores/read-store.interface';
import { forkJoin } from 'rxjs';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recommended-stores',
  templateUrl: './recommended-stores.page.html',
  styleUrls: ['./recommended-stores.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class RecommendedStoresPage implements OnInit {
  recommendedStores: ReadStore[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  userNickname: string | null = null;

  constructor(
    private recommendationsService: RecommendationsService,
    private storesService: StoresService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userNickname = this.authService.getLogginedUserName();
    this.getRecommendedStores();
  }

  getRecommendedStores() {
    this.recommendationsService.getRecommendations().subscribe({
      next: (response) => {
        const recommendedStoreIds = response.recommended_store_ids;
        if (recommendedStoreIds.length > 0) {
          const storeRequests = recommendedStoreIds.map(id => this.storesService.getStoreById(id));
          forkJoin(storeRequests).subscribe({
            next: (storeResponses) => {
              this.recommendedStores = storeResponses.map(res => res.data).filter((store): store is ReadStore => store !== undefined);
              this.isLoading = false;
            },
            error: (error) => {
              this.errorMessage = '추천 상점 정보를 가져오는 데 실패했습니다.';
              this.isLoading = false;
              console.error('Error fetching store details:', error);
            }
          });
        } else {
          this.errorMessage = '추천 상점이 없습니다.';
          this.isLoading = false;
        }
      },
      error: (error) => {
        this.errorMessage = '추천 ID를 가져오는 데 실패했습니다.';
        this.isLoading = false;
        console.error('Error fetching recommended IDs:', error);
      }
    });
  }

  goToStoreDetails(storeId: number) {
    this.router.navigate(['/stores', storeId]);
  }
}