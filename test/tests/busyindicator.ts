import BusyIndicator = Fayde.Controls.BusyIndicator;

export function load() {
    QUnit.module("BusyIndicator");

    QUnit.test("Set all", (assert) => {
        var bi = new BusyIndicator();
        bi.IsBusy = true;
        bi.BusyContent = "I am a content";
        ok(true);
    });
}