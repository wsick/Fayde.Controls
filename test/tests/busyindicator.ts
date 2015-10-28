import BusyIndicator = Fayde.Controls.BusyIndicator;

export function load () {
    QUnit.module("BusyIndicator");

    QUnit.test("Set all", (assert) => {
        var bi = new BusyIndicator();
        bi.IsBusy = true;
        bi.IsIndeterminate = false;
        bi.Value = 1;
		bi.MaxValue = 100;
		bi.MinValue = 0;
		bi.BusyContent = "I am a content";
        ok(true);
    });
}