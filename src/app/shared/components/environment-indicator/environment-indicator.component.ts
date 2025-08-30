import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '../../../core/services/projects.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-environment-indicator',
  templateUrl: './environment-indicator.component.html',
  styleUrls: ['./environment-indicator.component.scss']
})
export class EnvironmentIndicatorComponent implements OnInit {
  isLocalEnvironment = false;
  isProductionEnvironment = false;
  isRealTimeSyncEnabled = false;
  isCacheEnabled = false;
  isAdminFeaturesEnabled = false;
  showIndicator = false;

  constructor(private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.updateEnvironmentInfo();
  }

  private updateEnvironmentInfo(): void {
    this.isLocalEnvironment = this.projectsService.isLocalEnvironment();
    this.isProductionEnvironment = this.projectsService.isProductionEnvironment();
    this.isRealTimeSyncEnabled = this.projectsService.isRealTimeSyncEnabled();
    this.isCacheEnabled = this.projectsService.isCacheEnabled();
    this.isAdminFeaturesEnabled = this.projectsService.isAdminFeaturesEnabled();

    // Mostrar indicador apenas se estiver em modo de desenvolvimento
    this.showIndicator = environment.firebase.showDevIndicators && this.isLocalEnvironment;
  }

  getEnvironmentIcon(): string {
    if (this.isLocalEnvironment) {
      return '🛠️';
    } else if (this.isProductionEnvironment) {
      return '🚀';
    }
    return '❓';
  }

  getEnvironmentText(): string {
    if (this.isLocalEnvironment) {
      return 'Development Mode';
    } else if (this.isProductionEnvironment) {
      return 'Production Mode';
    }
    return 'Unknown Mode';
  }

  getSyncStatusIcon(): string {
    return this.isRealTimeSyncEnabled ? '🔄' : '💾';
  }

  getSyncStatusText(): string {
    return this.isRealTimeSyncEnabled ? 'Real-time Sync' : 'Cached Mode';
  }

  getCacheStatusIcon(): string {
    return this.isCacheEnabled ? '⚡' : '📡';
  }

  getCacheStatusText(): string {
    return this.isCacheEnabled ? 'Cache Enabled' : 'Direct Connection';
  }

  getAdminStatusIcon(): string {
    return this.isAdminFeaturesEnabled ? '⚙️' : '👁️';
  }

  getAdminStatusText(): string {
    return this.isAdminFeaturesEnabled ? 'Admin Enabled' : 'Read Only';
  }
}
