module Fayde.Controls.viewbox.measure {
    export interface IInput extends minerva.core.measure.IInput {
        stretch: Media.Stretch;
        stretchDirection: StretchDirection;
    }
    export interface IState extends minerva.core.measure.IState {
    }
    export interface IOutput extends minerva.core.measure.IOutput {
    }
    export class ViewBoxMeasurePipeDef extends minerva.core.measure.MeasurePipeDef {
        constructor () {
            super();
            this.replaceTapin('doOverride', tapins.doOverride);
        }
    }

    module tapins {
        export function doOverride (input: IInput, state: IState, output: IOutput, tree: minerva.core.UpdaterTree, availableSize: Size): boolean {
            var ds = output.desiredSize;
            ds.width = ds.height = 0;

            var child = tree.subtree;
            if (!child)
                return true;
            child.measure(new Size(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY));

            var childSize = child.assets.desiredSize;
            var scalefac = helpers.computeScaleFactor(state.availableSize, childSize, input.stretch, input.stretchDirection);
            ds.width = scalefac.width * childSize.width;
            ds.height = scalefac.height * childSize.height;

            return true;
        }
    }
}