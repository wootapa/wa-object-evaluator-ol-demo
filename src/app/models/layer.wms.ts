import { WLayer, ILayerDef } from './layer';
import { Evaluator } from '@wootapa/object-evaluator-ol';
import { TileWMS } from 'ol/source';
import TileLayer from 'ol/layer/Tile';

export class WLayerWMS extends WLayer {

    constructor(def: ILayerDef) {
        super('WMS', def);
        this.olLayer = new TileLayer({
            extent: this.def.extent,
            source: new TileWMS({
                url: `${this.def.url}/wms`,
                params: {
                    'LAYERS': this.def.layerName,
                    'TILED': true,
                    'TRANSPARENT': true,
                    'VERSION': '1.1.1'
                },
                serverType: 'geoserver'
            })
        })
    }

    public applyFilter(oe: Evaluator, isEnd: boolean) {
        if (!isEnd) {
            return;
        }

        const source = this.olLayer.getSource() as TileWMS;
        const params = source.getParams();
        params.CQL_FILTER = oe.done().asOgcCql({
            geometryName: this.def.geomField,
            projection: this.def.projection,
            decimals: 10,
            useProjectionUnitForDistance: true
        });
        source.updateParams(params);
    }
}
