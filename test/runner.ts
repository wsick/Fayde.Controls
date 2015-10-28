module runner {
    var libpath = "lib/fayde.controls/dist/fayde.controls";
    var testModules = [
        ".build/tests/numericupdown",
        ".build/tests/busyindicator"
    ];

    Fayde.LoadConfigJson((config, err) => {
        if (err)
            console.warn("Error loading configuration file.", err);

        require([libpath], () => {
            require(testModules, (...modules: any[]) => {
                for (var i = 0; i < modules.length; i++) {
                    modules[i].load();
                }
                QUnit.load();
                QUnit.start();
            });
        });
    });
}