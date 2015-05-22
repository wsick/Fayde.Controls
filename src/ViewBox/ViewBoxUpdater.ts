module Fayde.Controls.viewbox {
    export interface IViewBoxUpdaterAssets extends minerva.core.IUpdaterAssets, measure.IInput, arrange.IInput, processdown.IInput {
    }

    export class ViewBoxUpdater extends minerva.core.Updater {
        assets: IViewBoxUpdaterAssets;

        init () {
            this.setMeasurePipe(minerva.singleton(measure.ViewBoxMeasurePipeDef))
                .setArrangePipe(minerva.singleton(arrange.ViewBoxArrangePipeDef))
                .setProcessDownPipe(minerva.singleton(processdown.ViewBoxProcessDownPipeDef));

            var assets = this.assets;
            assets.stretch = Media.Stretch.Uniform;
            assets.stretchDirection = StretchDirection.Both;
            assets.viewXform = mat3.identity();

            super.init();
        }
    }
}