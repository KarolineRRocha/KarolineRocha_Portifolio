import { Pipe, PipeTransform } from '@angular/core';
import { AssetPathService } from '../../services/asset-path.service';

@Pipe({
  name: 'assetPath'
})
export class AssetPathPipe implements PipeTransform {

  constructor(private assetPathService: AssetPathService) {}

  transform(path: string): string {
    return this.assetPathService.getAssetPath(path);
  }
}
