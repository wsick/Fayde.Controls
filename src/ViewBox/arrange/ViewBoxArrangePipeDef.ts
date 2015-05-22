module Fayde.Controls.viewbox.arrange {
    export interface IInput extends minerva.core.arrange.IInput {
        stretch: Media.Stretch;
        stretchDirection: StretchDirection;
    }
    export interface IState extends minerva.core.arrange.IState {
    }
    export interface IOutput extends minerva.core.arrange.IOutput {
        stretch: Media.Stretch;
        stretchDirection: StretchDirection;
    }
    export class ViewBoxArrangePipeDef extends minerva.core.arrange.ArrangePipeDef {
        constructor () {
            super();
            this.replaceTapin('doOverride', tapins.doOverride);
        }

        createOutput () {
            var output = <IOutput>super.createOutput();
            output.stretch = Media.Stretch.Uniform;
            output.stretchDirection = StretchDirection.Both;
            return output;
        }

        prepare (input: IInput, state: IState, output: IOutput) {
            output.stretch = input.stretch;
            output.stretchDirection = input.stretchDirection;
            super.prepare(input, state, output);
        }

        flush (input: IInput, state: IState, output: IOutput) {
            super.flush(input, state, output);
            input.stretch = output.stretch;
            input.stretchDirection = output.stretchDirection;
        }
    }

    module tapins {
        export function doOverride (input: IInput, state: IState, output: IOutput, tree: minerva.core.IUpdaterTree, finalRect: Rect): boolean {
            return true;
        }
    }
}