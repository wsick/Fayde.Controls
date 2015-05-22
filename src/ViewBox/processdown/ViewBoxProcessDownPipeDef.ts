module Fayde.Controls.viewbox.processdown {
    export interface IInput extends minerva.core.processdown.IInput {
        viewXform: number[];
    }
    export interface IState extends minerva.core.processdown.IState {
    }
    export interface IOutput extends minerva.core.processdown.IOutput {
        viewXform: number[];
    }
    export class ViewBoxProcessDownPipeDef extends minerva.core.processdown.ProcessDownPipeDef {
        constructor () {
            super();
        }

        createOutput () {
            var output = <IOutput>super.createOutput();
            output.viewXform = mat3.identity();
            return output;
        }

        prepare (input: IInput, state: IState, output: IOutput, vpinput: IInput, tree: minerva.core.IUpdaterTree) {
            mat3.copyTo(input.viewXform, output.viewXform);
            super.prepare(input, state, output, vpinput, tree);
        }

        flush (input: IInput, state: IState, output: IOutput, vpinput: IInput, tree: minerva.core.IUpdaterTree) {
            super.flush(input, state, output, vpinput, tree);
            mat3.copyTo(output.viewXform, input.viewXform);
        }
    }

    module tapins {

    }
}