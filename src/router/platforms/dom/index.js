// these are instrumentations
import "./history";
import "./scroller";

// these are reactions and initialization, which must be imported after the first batch
// because they use methods instrumented by the first batch
import "./url";
import "./storage";
