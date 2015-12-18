module Fayde.Controls.flowlayout {
    export interface IFlowLayoutUpdaterAssets extends minerva.controls.panel.IPanelUpdaterAssets, measure.IInput, arrange.IInput {
    }

    export class FlowLayoutUpdater extends minerva.controls.panel.PanelUpdater {
        assets: IFlowLayoutUpdaterAssets;

        init() {
            this.setMeasurePipe(minerva.singleton(measure.FlowLayoutMeasurePipeDef))
                .setArrangePipe(minerva.singleton(arrange.FlowLayoutArrangePipeDef));

            var assets = this.assets;
            assets.orientation = Orientation.Horizontal;
            assets.itemWidth = NaN;
            assets.itemHeight = NaN;

            super.init();
        }
    }
}