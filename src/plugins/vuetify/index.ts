import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import "vuetify/styles";

import defaults from "./defaults";
import { icons } from "./icons";
import { theme } from "./themes";

export const vuetify = createVuetify({
  components,
  defaults,
  icons,
  theme
});
