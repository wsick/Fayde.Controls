module Fayde.Controls.viewbox.processdown {
    export interface IInput extends minerva.core.processdown.IInput {
        viewXform: number[];
    }
    export interface IState extends minerva.core.processdown.IState {
    }
    export interface IOutput extends minerva.core.processdown.IOutput {
    }
    export class ViewBoxProcessDownPipeDef extends minerva.core.processdown.ProcessDownPipeDef {
        constructor () {
            super();
            this.addTapinAfter('calcAbsoluteXform', 'applyViewXform', tapins.applyViewXform);
        }
    }

    module tapins {
        export function applyViewXform (input: IInput, state: IState, output: IOutput, vpinput: IInput, tree: minerva.core.UpdaterTree): boolean {
            if ((input.dirtyFlags & minerva.DirtyFlags.Transform) === 0)
                return true;
            mat3.multiply(input.viewXform, output.absoluteXform, output.absoluteXform);
            return true;
        }
    }
}