import Person = require('./Person');

class MainViewModel extends Fayde.MVVM.ViewModelBase {
    States: { Name: string }[] = [
        {Name: "Florida"},
        {Name: "Georgia"},
        {Name: "South Carolina"},
        {Name: "Alabama"},
        {Name: "Tennessee"},
    ];
    TreeData = [{
        Name: "Root",
        Children: [
            {
                Name: "Level 2 - 1",
                Children: [
                    {Name: "Level 3 - 1"},
                    {Name: "Level 3 - 2"}
                ]
            }
        ]
    }];

    private _list = new Fayde.Collections.ObservableCollection<string>();

    get List () {
        return this._list;
    }

    Person = new Person();

    constructor () {
        super();
        for (var i = 0; i < 200; i++)
            this._list.Add("Test Item " + i);
    }
    
    /* BUSY INDICATOR TEST */
    BusyValue = 0.0;
    LoadSomething(){
        this.BusyValue = 0.0;
        var interval = setInterval(()=>{
            this.BusyValue +=1.0; 
            if(this.BusyValue >=100){
                clearInterval(interval);
            }
            
        },25);
    }
    
    private static ctor = (() => {
        Fayde.MVVM.NotifyProperties(MainViewModel, ["BusyValue"]);
    })();

}
export = MainViewModel; 