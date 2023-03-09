import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";

import defaults from "./defaults";
import { icons } from "./icons";
import { theme } from "./themes";

export const vuetify = createVuetify({
  components,
  directives,
  defaults,
  icons,
  theme
});
