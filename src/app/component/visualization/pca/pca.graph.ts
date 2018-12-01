import { GraphConfig } from 'app/model/graph-config.model';
import { GraphData } from './../../../model/graph-data.model';
import { AbstractScatterVisualization } from './../visualization.abstract.scatter.component';
import { PcaConfigModel, PcaDataModel } from './pca.model';
import { Vector3, ArrowHelper, Vector2 } from 'three';
export class PcaGraph extends AbstractScatterVisualization {
  updateData(config: GraphConfig, data: any) {
    super.updateData(config, data);
    const pcaConfig: PcaConfigModel = config as PcaConfigModel;
    const pcaData: PcaDataModel = data as PcaDataModel;
    const pcs: Array<number> = [pcaConfig.pcx, pcaConfig.pcy, pcaConfig.pcz];
    // const dims: Array<{ x: number; y: number; z: number }> = pcs.map(dim => {

    // this.view.scene.add(
    //   new ArrowHelper(
    //     new Vector3(pcaData.pcM.x, pcaData.pcM.y, pcaData.pcM.z),
    //     new Vector3(pcaData.pc1.x, pcaData.pc1.y, pcaData.pc1.z),
    //     100,
    //     0x000000,
    //     3,
    //     3
    //   )
    // );
    // this.view.scene.add(
    //   new ArrowHelper(
    //     new Vector3(pcaData.pcM.x, pcaData.pcM.y, pcaData.pcM.z),
    //     new Vector3(pcaData.pc2.x, pcaData.pc2.y, pcaData.pc2.z),
    //     100,
    //     0x000000,
    //     3,
    //     3
    //   )
    // );
    // this.view.scene.add(
    //   new ArrowHelper(
    //     new Vector3(pcaData.pcM.x, pcaData.pcM.y, pcaData.pcM.z),
    //     new Vector3(pcaData.pc3.x, pcaData.pc3.y, pcaData.pc3.z),
    //     100,
    //     0x000000,
    //     3,
    //     3
    //   )
    // );

    // }
  }
}
