import "babel-polyfill";

import {binder, fwa} from "./libs/binder";
import { constants } from "./modules/module";
import {practice} from "./modules/practice";



binder({
    bounds: {
        "html": practice
    },
    runTests: false
});
