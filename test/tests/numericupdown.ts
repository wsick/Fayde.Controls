import NumericUpDown = Fayde.Controls.NumericUpDown;

export function load () {
    QUnit.module("NumericUpDown");

    QUnit.test("Set all", (assert) => {
        var nud = new NumericUpDown();
        nud.DecimalPlaces = 0;
        nud.Increment = 1;
        nud.Value = 50;
        nud.Minimum = 1;

        ok(true);
    });
}