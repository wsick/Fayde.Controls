module runner {
    var libpath = "lib/Fayde.Controls/dist/Fayde.Controls";
    var testModules = [
        ".build/tests/numericupdown"
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