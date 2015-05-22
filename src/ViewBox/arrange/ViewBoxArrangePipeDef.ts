module Fayde.Controls.viewbox.arrange {
    export interface IInput extends minerva.core.arrange.IInput {
        stretch: Media.Stretch;
        stretchDirection: StretchDirection;
        viewXform: number[];
    }
    export interface IState extends minerva.core.arrange.IState {
    }
    export interface IOutput extends minerva.core.arrange.IOutput {
        viewXform: number[];
    }
    export class ViewBoxArrangePipeDef extends minerva.core.arrange.ArrangePipeDef {
        constructor () {
            super();
            this.replaceTapin('doOverride', tapins.doOverride);
        }

        prepare (input: IInput, state: IState, output: IOutput) {
            mat3.copyTo(input.viewXform, output.viewXform);
            super.prepare(input, state, output);
        }

        flush (input: IInput, state: IState, output: IOutput) {
            super.flush(input, state, output);
            mat3.copyTo(output.viewXform, input.viewXform);
        }
    }

    module tapins {
        export function doOverride (input: IInput, state: IState, output: IOutput, tree: minerva.core.UpdaterTree, finalRect: Rect): boolean {
            var child = tree.subtree;
            if (!child)
                return true;

            var cr = state.childRect;
            cr.x = cr.y = 0;
            var childSize = child.assets.desiredSize; 
            Size.copyTo(childSize, cr);

            var scale = helpers.computeScaleFactor(state.finalSize, childSize, input.stretch, input.stretchDirection);
            mat3.identity(output.viewXform);
            mat3.scale(output.viewXform, scale.width, scale.height);
            if (!mat3.equal(input.viewXform, output.viewXform))
                output.dirtyFlags |= minerva.DirtyFlags.Transform;

            child.arrange(cr);

            cr.width = scale.width * childSize.width;
            cr.height = scale.height * childSize.height;

            Size.copyTo(cr, state.arrangedSize);

            return true;
        }
    }
}